<Page>
  <Tabs defaultValue="now" position="bottom">
    <Tab value="now" label="翻译" icon="translate">
      <DataForm collection="scratch">
        <HStack gap={6}>
          <Select name="target" placeholder="目标语言">
            <Option value="zh" label="中文"/>
            <Option value="en" label="English"/>
            <Option value="ja" label="日本語"/>
            <Option value="ko" label="한국어"/>
            <Option value="fr" label="Français"/>
            <Option value="de" label="Deutsch"/>
          </Select>
        </HStack>
        <Textarea name="input" label="" rows={6}
          placeholder="粘贴要翻译的文字" className="text-sm"/>
        <HStack justify="end" gap={6}>
          <Button label="清空结果" icon="x"
            onClick={() => scripts.clear()}/>
          <Button label="翻译" color="primary" icon="translate"
            disabled={!form.input}
            onClick={() => scripts.translate({input: form.input, target: form.target})}/>
        </HStack>
      </DataForm>

      {state.loading && (
        <Text muted className="text-xs">翻译中…</Text>
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
        query={{ orderBy: [{ field: "created_at", direction: "desc" }], limit: 100 }}
      >
        <Empty><EmptyState title="还没有翻译记录" icon="clock"/></Empty>
        <Item>
          <Card>
            <VStack gap={4}>
              <HStack gap={6}>
                <Text muted className="text-xs uppercase">→ {item.target}</Text>
                {item.created_at && <Text muted className="text-xs">{item.created_at | relative}</Text>}
              </HStack>
              <Text muted className="text-xs whitespace-pre-wrap">{item.input}</Text>
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
