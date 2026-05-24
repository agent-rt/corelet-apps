// 2fa scripts —— TOTP (RFC 6238) compute + otpauth:// URI add.
//
// State shape:
//   codes:    { [accountId]: { code: "123456", remaining: 17 } }
//   add_uri:  staging input from UI (the otpauth URI text field)
//   add_err:  last add error message (cleared on success)

const APP_ID = "totp";

// ─── base64 ↔ bytes ────────────────────────────────────────────────────────

const B64C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function bytesToB64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
    const v = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    s += B64C[(v >> 18) & 63] + B64C[(v >> 12) & 63];
    s += i + 1 < bytes.length ? B64C[(v >> 6) & 63] : "=";
    s += i + 2 < bytes.length ? B64C[v & 63] : "=";
  }
  return s;
}

function b64ToBytes(s) {
  const rev = new Int8Array(256).fill(-1);
  for (let i = 0; i < 64; i++) rev[B64C.charCodeAt(i)] = i;
  const out = [];
  let bits = 0, n = 0;
  for (const ch of s) {
    if (ch === "=" || ch === "\n" || ch === " ") continue;
    const v = rev[ch.charCodeAt(0)];
    if (v < 0) continue;
    bits = (bits << 6) | v; n += 6;
    if (n >= 8) { n -= 8; out.push((bits >> n) & 0xff); }
  }
  return Uint8Array.from(out);
}

// ─── base32 (RFC 4648) — TOTP secrets are base32 ────────────────────────────

function b32ToBytes(s) {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const norm = s.replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  const out = [];
  let bits = 0, n = 0;
  for (const ch of norm) {
    const v = alpha.indexOf(ch);
    if (v < 0) throw new Error("invalid base32 char: " + ch);
    bits = (bits << 5) | v; n += 5;
    if (n >= 8) { n -= 8; out.push((bits >> n) & 0xff); }
  }
  return Uint8Array.from(out);
}

// ─── otpauth URI parse ──────────────────────────────────────────────────────

function parseOtpauth(uri) {
  // otpauth://totp/Issuer:account?secret=BASE32&issuer=Issuer&algorithm=SHA1&digits=6&period=30
  const m = uri.match(/^otpauth:\/\/totp\/([^?]+)\?(.+)$/i);
  if (!m) throw new Error("not an otpauth://totp URI");
  const label = decodeURIComponent(m[1]);
  const params = {};
  for (const pair of m[2].split("&")) {
    const [k, v] = pair.split("=");
    params[k.toLowerCase()] = decodeURIComponent(v || "");
  }
  if (!params.secret) throw new Error("missing secret");

  // Label may be "Issuer:account" or just "account"
  let issuer = params.issuer || "";
  let account = label;
  const colon = label.indexOf(":");
  if (colon > 0) {
    if (!issuer) issuer = label.slice(0, colon);
    account = label.slice(colon + 1);
  }
  return {
    issuer: issuer.trim(),
    account: account.trim(),
    secret_b32: params.secret.toUpperCase(),
    algo: (params.algorithm || "SHA1").toUpperCase(),
    digits: parseInt(params.digits || "6", 10),
    period: parseInt(params.period || "30", 10),
  };
}

// ─── TOTP core ──────────────────────────────────────────────────────────────

async function totp(account, nowSec, plugins) {
  const secret = b32ToBytes(account.secret_b32);
  const period = account.period || 30;
  const digits = account.digits || 6;
  const counter = Math.floor(nowSec / period);

  // 8-byte big-endian counter
  const cb = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) { cb[i] = c & 0xff; c = Math.floor(c / 256); }

  const algo = (account.algo || "SHA1").toLowerCase();
  const algoMap = { sha1: "sha1", sha256: "sha256", sha512: "sha512" };
  const algoName = algoMap[algo] || "sha1";

  const { mac_b64 } = await plugins.crypto.hmac({
    algo: algoName,
    key_b64: bytesToB64(secret),
    data_b64: bytesToB64(cb),
  });
  const mac = b64ToBytes(mac_b64);

  // RFC 4226 dynamic truncation
  const offset = mac[mac.length - 1] & 0x0f;
  const bin =
    ((mac[offset] & 0x7f) << 24) |
    ((mac[offset + 1] & 0xff) << 16) |
    ((mac[offset + 2] & 0xff) << 8) |
    (mac[offset + 3] & 0xff);
  const code = (bin % Math.pow(10, digits)).toString().padStart(digits, "0");
  const remaining = period - (nowSec % period);
  return { code, remaining, period };
}

// ─── handlers ───────────────────────────────────────────────────────────────

export default {
  // Tick @ 1Hz while window visible: write current code + remaining back into
  // each account row. UI binds to `item.current_code` / `item.remaining`.
  async tick(_, ctx) {
    const list = aglet.data.list(APP_ID, "accounts", { limit: 200 });
    const nowSec = Math.floor(Date.now() / 1000);
    for (const row of list.items) {
      let patch;
      try {
        const t = await totp(row.data, nowSec, ctx.plugins);
        patch = { current_code: t.code, remaining: t.remaining };
      } catch (e) {
        patch = { current_code: "------", remaining: 0 };
      }
      aglet.data.update(APP_ID, "accounts", row.id, patch);
    }
  },

  // From UI: parse otpauth URI in state.add_uri, store into accounts collection.
  async addFromUri(_, ctx) {
    const uri = (ctx.state.add_uri || "").trim();
    if (!uri) return ctx.setState({ add_err: "paste an otpauth://totp/... URI first" });
    try {
      const parsed = parseOtpauth(uri);
      // Sanity-check secret decodes
      b32ToBytes(parsed.secret_b32);
      await ctx.dispatch("data.create", {
        collection: "accounts",
        data: { ...parsed, created_at: new Date().toISOString() },
      });
      ctx.setState({ add_uri: "", add_err: "" });
    } catch (e) {
      ctx.setState({ add_err: String(e.message || e) });
    }
  },

  // Delete an account by id.
  async remove({ id }, ctx) {
    await ctx.dispatch("data.delete", { collection: "accounts", id });
  },
};
