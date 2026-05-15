<Page>
  <Tabs defaultValue="review" position="bottom">
    <Tab value="review" label="复习" icon="cards-three">
      <DataList
        collection="cards"
        query={{ where: { level: 0 }, orderBy: [{ field: "created_at", direction: "asc" }] }}
      >
        <Empty><EmptyState title="今天没有要复习的卡" description="先到 添加 tab 录入" icon="check-circle"/></Empty>
        <Item>
          <Card>
            <VStack gap={6}>
              <Heading level={1} className="text-3xl text-center">{item.front}</Heading>
              {item.reading && <Text muted className="text-center text-sm">{item.reading}</Text>}
              <Divider/>
              <Text className="text-center whitespace-pre-wrap">{item.back}</Text>
              <HStack justify="between" gap={8}>
                <Button label="再来一遍" icon="arrow-counter-clockwise"
                  onClick={() => data.update({
                    collection: "cards", id: item.id, patch: { level: 0 },
                  })}/>
                <Button label="记得" color="primary" icon="check"
                  onClick={() => data.update({
                    collection: "cards", id: item.id, patch: { level: 1, next_review: now },
                  })}/>
              </HStack>
            </VStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="all" label="全部" icon="list">
      <DataList
        collection="cards"
        query={{ orderBy: [{ field: "level", direction: "asc" }], limit: 200 }}
      >
        <Empty><EmptyState title="还没有任何卡" icon="cards"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <HStack gap={6}>
                  <Heading level={3}>{item.front}</Heading>
                  {item.reading && <Text muted className="text-xs">{item.reading}</Text>}
                </HStack>
                <Text muted className="text-xs whitespace-pre-wrap">{item.back}</Text>
                <Text muted className="text-xs">level {item.level}</Text>
              </VStack>
              <HStack gap={4}>
                <Button label="重置" icon="arrow-counter-clockwise"
                  onClick={() => data.update({
                    collection: "cards", id: item.id, patch: { level: 0 },
                  })}/>
                <Button label="删除" icon="trash" color="danger"
                  onClick={() => data.delete({ collection: "cards", id: item.id })}/>
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="add" label="添加" icon="plus">
      <Card>
        <DataForm collection="cards">
          <Input name="front" label="" placeholder="正面（汉字 / 假名）"/>
          <Input name="reading" label="" placeholder="读法（可选）"/>
          <Textarea name="back" label="" placeholder="背面（释义 / 例句）" rows={3}/>
          <HStack justify="end">
            <Button
              label="添加"
              color="primary"
              icon="plus"
              disabled={!form.front}
              onClick={() => data.create({
                collection: "cards",
                data: {
                  front: form.front,
                  reading: form.reading,
                  back: form.back,
                  level: 0,
                  created_at: now,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>
    </Tab>
  </Tabs>
</Page>
