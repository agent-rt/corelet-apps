// sysmon scripts.js —— scheduler-driven 单次采样
//
// 旧形态：Page onEnter 起 setInterval、onLeave clearInterval。
// 新形态：manifest.jobs 声明 1Hz interval job + while:"window_open"
//        → scheduler 自动按窗口存活态调用 collectMetrics 一次一条。
// 好处：循环逻辑下沉到 runtime；Page UI 纯展示，不再持 timer 状态；
//      while:"window_open" 让 background 时停采，省 CPU。

export default {
  async collectMetrics(_, ctx) {
    const cpu = await ctx.plugins.sysinfo.cpu();
    const mem = await ctx.plugins.sysinfo.memory();
    await ctx.dispatch("data.create", {
      collection: "metrics",
      data: {
        ts: Date.now(),
        cpu_pct: cpu.used_pct,
        mem_used: mem.used_bytes,
        mem_total: mem.total_bytes,
      },
    });
  },
};
