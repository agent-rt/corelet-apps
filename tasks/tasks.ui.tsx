<Page>
  <Tabs defaultValue="todo" position="bottom">
    <Tab value="todo" label="待办" icon="circle">
      <Card>
        <DataForm collection="items">
          <Input name="title" label="" placeholder="任务标题"/>
          <HStack gap={6}>
            <Select name="priority" placeholder="优先级">
              <Option value="high" label="高"/>
              <Option value="med" label="中"/>
              <Option value="low" label="低"/>
            </Select>
            <Input name="project" label="" placeholder="项目（可选）"/>
          </HStack>
          <Input name="due_at" label="" placeholder="截止时间（可选）：YYYY-MM-DD HH:MM"/>
          <Textarea name="notes" label="" placeholder="备注（可选）" rows={2}/>
          <HStack justify="end">
            <Button
              label="添加"
              color="primary"
              icon="plus"
              disabled={!form.title}
              onClick={() => data.create({
                collection: "items",
                data: {
                  title: form.title,
                  notes: form.notes,
                  project: form.project,
                  priority: form.priority,
                  due_at: form.due_at,
                  status: "todo",
                  created_at: now,
                },
              })}
            />
          </HStack>
        </DataForm>
      </Card>

      <DataList
        collection="items"
        query={{ where: { status: "todo" }, orderBy: [{ field: "due_at", direction: "asc" }] }}
      >
        <Empty><EmptyState title="待办空空如也" icon="check-circle"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <HStack gap={6}>
                  {item.priority && <Text muted className="text-xs uppercase">{item.priority}</Text>}
                  {item.project && <Text muted className="text-xs">#{item.project}</Text>}
                </HStack>
                <Heading level={3}>{item.title}</Heading>
                {item.notes && <Text muted className="text-xs">{item.notes}</Text>}
                {item.due_at && <Text muted className="text-xs">截止 {item.due_at | relative}</Text>}
              </VStack>
              <HStack gap={4}>
                <Button
                  label="开始"
                  icon="play"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "doing" },
                  })}
                />
                <Button
                  label="完成"
                  icon="check"
                  color="primary"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "done", completed_at: now },
                  })}
                />
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="doing" label="进行中" icon="play-circle">
      <DataList
        collection="items"
        query={{ where: { status: "doing" }, orderBy: [{ field: "due_at", direction: "asc" }] }}
      >
        <Empty><EmptyState title="没有进行中的任务" icon="coffee"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <HStack gap={6}>
                  {item.priority && <Text muted className="text-xs uppercase">{item.priority}</Text>}
                  {item.project && <Text muted className="text-xs">#{item.project}</Text>}
                </HStack>
                <Heading level={3}>{item.title}</Heading>
                {item.due_at && <Text muted className="text-xs">截止 {item.due_at | relative}</Text>}
              </VStack>
              <HStack gap={4}>
                <Button
                  label="暂停"
                  icon="pause"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "todo" },
                  })}
                />
                <Button
                  label="完成"
                  icon="check"
                  color="primary"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "done", completed_at: now },
                  })}
                />
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>

    <Tab value="done" label="完成" icon="check-circle">
      <DataList
        collection="items"
        query={{ where: { status: "done" }, orderBy: [{ field: "completed_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title="还没完成的任务" icon="trophy"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>✓ {item.title}</Text>
                {item.completed_at && <Text muted className="text-xs">{item.completed_at | relative} 完成</Text>}
              </VStack>
              <HStack gap={4}>
                <Button
                  label="撤销"
                  icon="arrow-counter-clockwise"
                  onClick={() => data.update({
                    collection: "items", id: item.id, patch: { status: "todo", completed_at: "" },
                  })}
                />
                <Button
                  label="删除"
                  icon="trash"
                  color="danger"
                  onClick={() => data.delete({ collection: "items", id: item.id })}
                />
              </HStack>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </Tab>
  </Tabs>
</Page>
