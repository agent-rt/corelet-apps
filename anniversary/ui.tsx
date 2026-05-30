<Page onEnter={() => scripts.refresh()} className="min-h-screen p-5 flex flex-col gap-4 select-none">
  <Heading level={1}>纪念日</Heading>

  <DataList collection="events" query={{ orderBy: [{ field: "days_until", direction: "asc" }], limit: 1 }}>
    <Empty><EmptyState title="还没有纪念日" icon="calendar"/></Empty>
    <Item>
      <Card className="bg-indigo-500 text-white">
        <Text className="text-xs uppercase tracking-widest opacity-80">下一个</Text>
        <HStack justify="between" className="items-end mt-1">
          <VStack gap={2}>
            <Heading level={2}>{item.title}</Heading>
            <Text className="opacity-90">{item.next_at} · {item.milestone}</Text>
          </VStack>
          <VStack gap={0} className="items-end">
            <Heading level={1} className="text-5xl tabular-nums">{item.days_until}</Heading>
            <Text className="opacity-90 text-sm">天后</Text>
          </VStack>
        </HStack>
      </Card>
    </Item>
  </DataList>

  <Card>
    <DataForm collection="events">
      <Input name="title" placeholder="标题（如 小明生日）"/>
      <HStack gap={3}>
        <DatePicker name="date" label="日期"/>
        <Select name="kind" label="类型" placeholder="类型">
          <Option value="birthday" label="生日"/>
          <Option value="anniversary" label="纪念日"/>
          <Option value="custom" label="其他"/>
        </Select>
      </HStack>
      <HStack justify="between" className="items-center">
        <Switch name="recurring" label="每年循环"/>
        <Button label="添加" color="primary" icon="plus" disabled={!form.title} onClick={() => scripts.addEvent()}/>
      </HStack>
    </DataForm>
  </Card>

  <DataList collection="events" query={{ orderBy: [{ field: "days_until", direction: "asc" }] }}>
    <Empty><EmptyState title="还没有纪念日" icon="calendar"/></Empty>
    <Item>
      <Card>
        <HStack justify="between" className="items-center">
          <VStack gap={2}>
            <Heading level={3}>{item.title}</Heading>
            <HStack gap={6} className="items-center">
              <Text muted className="text-xs">{item.next_at}</Text>
              {item.milestone && <Badge content={item.milestone} color="secondary"/>}
              {item.age_label && <Badge content={item.age_label} color="success"/>}
            </HStack>
          </VStack>
          <HStack gap={4} className="items-center">
            <VStack gap={0} className="items-end">
              <Heading level={3} className="tabular-nums">{item.days_until}</Heading>
              <Text muted className="text-xs">天后</Text>
            </VStack>
            <Button label="删除" color="danger" size="sm" onClick={() => data.delete({ collection: "events", id: item.id })}/>
          </HStack>
        </HStack>
      </Card>
    </Item>
  </DataList>
</Page>
