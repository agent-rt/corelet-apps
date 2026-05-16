<Page>
  <Section>
    <Heading level={2}>调度器</Heading>
    <Text muted>所有 miniapp 的周期触发。toggle 关掉 = 跳过这一项。</Text>
  </Section>
  <DataList
    collection="schedules"
    query={{ orderBy: [{ field: "app_id", direction: "asc" }] }}
  >
    <Empty>
      <EmptyState
        title="还没有调度"
        description="先 `corelet scheduler install` 装 launchd plist，scheduler 会在下次 tick 自动发现已装的 background 脚本"
        icon="clock"
      />
    </Empty>
    <Item>
      <Card>
        <VStack gap={6}>
          <HStack justify="between" gap={6}>
            <Heading level={3}>{item.app_id}</Heading>
            {item.enabled
              ? <Badge content="启用" color="success"/>
              : <Badge content="停用" color="default"/>}
          </HStack>
          <Text muted>
            每 {item.interval_seconds} 秒 · 下次 {item.next_run_at | relative} · 上次 {item.last_run_at | relative} · {item.last_status}
          </Text>
          <HStack justify="end" gap={8}>
            <Button
              label="启用"
              icon="toggle-right"
              pressed={item.enabled}
              onClick={() => data.update({
                collection: "schedules",
                id: item.id,
                patch: { enabled: !item.enabled },
              })}
            />
            <Button
              label="Run Now"
              icon="play"
              onClick={() => data.update({
                collection: "schedules",
                id: item.id,
                patch: { next_run_at: "1970-01-01T00:00:00Z" },
              })}
            />
          </HStack>
        </VStack>
      </Card>
    </Item>
  </DataList>
</Page>
