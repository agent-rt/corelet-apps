<style>
html, body { overscroll-behavior: none; }
</style>

<script>
// 倒计时实现：setInterval tick 在 scripts.start 内启 + 在 module 顶层管理；
// 每次 tick 调用最近一次 ctx 捕获的 setStateAt，跨 dispatch 复用稳定的 stateApi。

let interval = null;
let latestSetStateAt = null;
let latestSetState = null;

function clearTimer() {
  if (interval) { clearInterval(interval); interval = null; }
}

function tick() {
  if (!latestSetStateAt) return;
  // 读不到当前 remaining；用 closure-cached 的减 1。state 在 store 中由 set 更新。
  // 简化：让脚本只调一次 setStateAt（不读），下个 tick 由 React 重渲后再下发新值。
  // 为正确性，用 module 级 secondsLeft 计数：
  secondsLeft--;
  latestSetStateAt("/state/remaining", secondsLeft);
  if (secondsLeft <= 0) {
    clearTimer();
    if (latestSetState) latestSetState({ running: false });
  }
}

let secondsLeft = 0;

export default {
  // 数字按钮：直接设秒数预设
  preset({ s }, ctx) {
    latestSetStateAt = ctx.setStateAt;
    latestSetState = ctx.setState;
    clearTimer();
    secondsLeft = s;
    ctx.setState({ seconds: s, remaining: s, running: false });
  },

  toggle(_args, ctx) {
    latestSetStateAt = ctx.setStateAt;
    latestSetState = ctx.setState;
    const s = ctx.scope.state;
    if (s.running) {
      // pause
      clearTimer();
      ctx.setState({ running: false });
      return;
    }
    // 启动：若剩余为 0，从 preset 重置
    if (!secondsLeft || secondsLeft <= 0) {
      secondsLeft = Number(s.seconds) || 60;
      ctx.setState({ remaining: secondsLeft, running: true });
    } else {
      ctx.setState({ running: true });
    }
    clearTimer();
    interval = setInterval(tick, 1000);
  },

  reset(_args, ctx) {
    latestSetStateAt = ctx.setStateAt;
    latestSetState = ctx.setState;
    clearTimer();
    const preset = Number(ctx.scope.state.seconds) || 60;
    secondsLeft = preset;
    ctx.setState({ remaining: preset, running: false });
  },
};
</script>

<Page className="min-h-screen p-6 flex flex-col items-center justify-center select-none [&_button:focus]:outline-none [&_button:focus-visible]:outline-none">
  <Heading level={1} content={state.remaining}
    className="text-7xl font-light tabular-nums mb-2"/>
  <Text content={state.running ? "Running" : "Paused"}
    className="text-sm opacity-50 mb-8"/>

  <HStack gap={3} className="mb-8">
    <Button label="30s" className="h-10 w-14 rounded-full bg-zinc-700 text-white text-sm font-medium hover:brightness-110"
      onClick={() => scripts.preset({s: 30})}/>
    <Button label="1m" className="h-10 w-14 rounded-full bg-zinc-700 text-white text-sm font-medium hover:brightness-110"
      onClick={() => scripts.preset({s: 60})}/>
    <Button label="5m" className="h-10 w-14 rounded-full bg-zinc-700 text-white text-sm font-medium hover:brightness-110"
      onClick={() => scripts.preset({s: 300})}/>
    <Button label="10m" className="h-10 w-14 rounded-full bg-zinc-700 text-white text-sm font-medium hover:brightness-110"
      onClick={() => scripts.preset({s: 600})}/>
  </HStack>

  <HStack gap={4}>
    {state.running ?
      <Button label="Pause"
        className="h-14 w-24 rounded-full bg-orange-500 text-white text-lg font-medium hover:brightness-110"
        onClick={() => scripts.toggle()}/>
      :
      <Button label="Start"
        className="h-14 w-24 rounded-full bg-orange-500 text-white text-lg font-medium hover:brightness-110"
        onClick={() => scripts.toggle()}/>
    }
    <Button label="Reset"
      className="h-14 w-24 rounded-full bg-zinc-300 text-zinc-900 text-lg font-medium hover:brightness-105"
      onClick={() => scripts.reset()}/>
  </HStack>
</Page>
