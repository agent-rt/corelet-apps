<Page>
  <Tabs defaultValue="now" position="bottom">
    <Tab value="now" label="生成" icon="sparkle">
      <DataForm collection="scratch">
        <Input name="name" label="" placeholder="商品名（必填）"/>
        <Textarea name="selling_points" label="" rows={3}
          placeholder="卖点 / 功能 / 差异点（一行一条）"/>
        <HStack gap={6}>
          <Input name="audience" label="" placeholder="目标受众"/>
          <Input name="platform" label="" placeholder="平台"/>
        </HStack>
        <Select name="tone" placeholder="语调">
          <Option value="professional" label="专业"/>
          <Option value="playful" label="活泼"/>
          <Option value="minimal" label="简洁"/>
          <Option value="story" label="故事化"/>
        </Select>
        <HStack justify="end" gap={6}>
          <Button label="清空" icon="x"
            onClick={() => scripts.clear()}/>
          <Button label="生成 3 条" color="primary" icon="sparkle"
            disabled={!form.name}
            onClick={() => scripts.generate({
              name: form.name,
              selling_points: form.selling_points,
              audience: form.audience,
              platform: form.platform,
              tone: form.tone,
            })}/>
        </HStack>
      </DataForm>

      {state.loading && (
        <Text muted className="text-xs">生成中…</Text>
      )}

      {state.error && (
        <Card className="border border-red-500/40 bg-red-500/5">
          <Text className="text-red-500 text-sm font-mono">{state.error}</Text>
        </Card>
      )}

      {state.output && (
        <Card>
          <Text className="text-sm whitespace-pre-wrap">{state.output}</Text>
        </Card>
      )}
    </Tab>

    <Tab value="history" label="历史" icon="clock-counter-clockwise">
      <DataList
        collection="history"
        query={{ orderBy: [{ field: "created_at", direction: "desc" }], limit: 50 }}
      >
        <Empty><EmptyState title="还没有生成记录" icon="clock"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <HStack gap={6} justify="between">
                <Heading level={3}>{item.name}</Heading>
                {item.tone && <Text muted className="text-xs uppercase">{item.tone}</Text>}
              </HStack>
              <HStack gap={6}>
                {item.audience && <Text muted className="text-xs">{item.audience}</Text>}
                {item.platform && <Text muted className="text-xs">#{item.platform}</Text>}
                {item.created_at && <Text muted className="text-xs">{item.created_at | relative}</Text>}
              </HStack>
              <Divider/>
              <Text className="text-sm whitespace-pre-wrap">{item.output}</Text>
              <HStack justify="end">
                <Button label="删除" icon="trash" color="danger"
                  onClick={() => data.delete({ collection: "history", id: item.id })}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
