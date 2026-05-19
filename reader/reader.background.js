// Reader ingest（JS 版，aglet ingest reader 跑）。
//
// 工作流：扫 queue 表，对每行 url：
//   1. mdctl <url> → markdown（失败：删 queue 行，不入 articles）
//   2. llmctl 总结 (≤80 字)
//   3. mdctl 输出第一行（# title）作 title 兜底；缺则用 domain+path
//   4. data.create articles + data.delete queue
//
// 幂等：queue 行是一次性触发，处理完即删；articles 不 dedup（同 url 多次抓
// 各成新行，便于看抓取历史）。

const APP_ID = (typeof input === "object" && input && input.app_id) || "reader";

function domainOf(u) {
  if (!u) return "";
  const m = /^https?:\/\/([^\/]+)/.exec(u);
  return m ? m[1].replace(/^www\./, "") : "";
}

function titleOf(md, url) {
  if (md) {
    const m = /^#\s+(.+)$/m.exec(md);
    if (m) return m[1].trim().slice(0, 200);
  }
  return domainOf(url) || url;
}

function runCmd(cmd, args, stdinText) {
  try {
    const r = child_process.spawnSync(cmd, args, stdinText != null ? { input: stdinText } : {});
    if (r.status === 0) return r.stdout.trim();
  } catch (_e) {}
  return null;
}

const SUMMARY_SYSTEM = "用 1-2 句中文（≤80 字）总结这篇文章的核心要点：写明结论/争议/适用场景，不要复述标题。仅输出中文一段，不加引号 / 前后缀。";

const pending = aglet.data.list(APP_ID, "queue", {
  orderBy: [{ field: "created_at", direction: "asc" }],
  limit: 50,
});

let fetched = 0;
let added = 0;
let failed = 0;

for (const row of pending.items) {
  const url = row.data.url;
  if (!url) {
    aglet.data.delete(APP_ID, "queue", row.id);
    continue;
  }
  fetched++;
  const md = runCmd("mdctl", [url]);
  if (!md || md.length < 20) {
    // mdctl 失败 / 内容太短 → 不入库，删 queue 行
    aglet.data.delete(APP_ID, "queue", row.id);
    failed++;
    continue;
  }
  const summary = runCmd("llmctl", ["--provider", "local", "--system", SUMMARY_SYSTEM, "--buffer"], md) || "";
  aglet.data.create(APP_ID, "articles", {
    url: url,
    title: titleOf(md, url),
    domain: domainOf(url),
    summary: summary,
    content: md,
    fetched_at: Date.now(),
  });
  aglet.data.delete(APP_ID, "queue", row.id);
  added++;
}

output = { fetched, added, failed };
