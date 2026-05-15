<Page>
  <Tabs defaultValue="add" position="bottom">
    <Tab value="add" label="记一笔" icon="plus-circle">
      <Card>
        <DataForm collection="entries">
          <Select name="kind" placeholder="收支">
            <Option value="expense" label="支出"/>
            <Option value="income" label="收入"/>
          </Select>
          <Input name="amount" type="number" label="" placeholder="金额"/>
          <Input name="category" label="" placeholder="分类（餐饮 / 工资 / 交通…）"/>
          <Input name="note" label="" placeholder="备注（可选）"/>
          <Input name="date" label="" placeholder="日期（YYYY-MM-DD，默认今天）"/>
          <HStack justify="end">
            <Button
              label="记账"
              color="primary"
              icon="check"
              disabled={!form.amount}
              onClick={() => data.create({
                collection: "entries",
                data: {
                  kind: form.kind,
                  amount: form.amount,
                  category: form.category,
                  note: form.note,
                  date: form.date,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>
    </Tab>

    <Tab value="list" label="流水" icon="list">
      <DataList
        collection="entries"
        query={{ orderBy: [{ field: "date", direction: "desc" }], limit: 100 }}
      >
        <Empty><EmptyState title="还没有任何记录" icon="wallet"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <HStack gap={6}>
                  <Text muted className="text-xs uppercase">{item.kind}</Text>
                  {item.category && <Text muted className="text-xs">#{item.category}</Text>}
                </HStack>
                <Heading level={3}>{item.amount}</Heading>
                {item.note && <Text muted className="text-xs">{item.note}</Text>}
                {item.date && <Text muted className="text-xs">{item.date}</Text>}
              </VStack>
              <Button
                label="删除"
                icon="trash"
                color="danger"
                onClick={() => data.delete({ collection: "entries", id: item.id })}
              />
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="summary" label="汇总" icon="chart-pie">
      <Card>
        <HStack justify="end">
          <Button label="刷新本月" color="primary" icon="arrow-clockwise"
            onClick={() => scripts.refresh()}/>
        </HStack>
        <VStack gap={4}>
          <Text>本月收入：{state.month_income}</Text>
          <Text>本月支出：{state.month_expense}</Text>
          <Text>结余：{state.month_income - state.month_expense}</Text>
        </VStack>
      </Card>

      {state.by_category && (
        <Card>
          <Heading level={3}>分类</Heading>
          <Text className="font-mono text-xs whitespace-pre-wrap">{state.by_category}</Text>
        </Card>
      )}
    </Tab>
  </Tabs>
</Page>
