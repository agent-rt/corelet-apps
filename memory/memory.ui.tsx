<Page title="Memory">
  <Accordion defaultOpen={["pinned", "preference"]}>
    <AccordionItem value="pinned" header="📌 已固定" icon="push-pin">
      <DataList
        collection="memories"
        query={{ where: { pinned: true }, orderBy: [{ field: "created_at", direction: "desc" }] }}
      >
        <Empty><EmptyState title="还没有固定的记忆" icon="push-pin"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <HStack gap={6}>
                  <Badge content={item.kind} color="primary"/>
                  <Text muted>{item.project} · {item.agent}</Text>
                </HStack>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label="取消固定" icon="push-pin-slash"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: false } })}/>
                <MenuItem separator/>
                <MenuItem label="忘记" icon="trash" danger
                  onClick={() => app.confirm({
                    title: "永久忘记这条记忆？",
                    description: "无法恢复。",
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="preference" header="🧭 preference — 协作偏好" icon="user-circle-gear">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "preference" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title="还没有 preference 记忆"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label="固定" icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label="忘记" icon="trash" danger
                  onClick={() => app.confirm({
                    title: "永久忘记这条记忆？",
                    description: "无法恢复。",
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="fact" header="📌 fact — 项目事实" icon="info">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "fact" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title="还没有 fact 记忆"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label="固定" icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label="忘记" icon="trash" danger
                  onClick={() => app.confirm({
                    title: "永久忘记这条记忆？",
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="decision" header="✓ decision — 决定" icon="check-circle">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "decision" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title="还没有 decision 记忆"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label="固定" icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label="忘记" icon="trash" danger
                  onClick={() => app.confirm({
                    title: "永久忘记这条记忆？",
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>

    <AccordionItem value="note" header="📝 note — 其它" icon="note">
      <DataList
        collection="memories"
        query={{ where: { pinned: false, kind: "note" }, orderBy: [{ field: "created_at", direction: "desc" }] }}
        paginate={{ pageSize: 10 }}
      >
        <Empty><EmptyState title="还没有 note 记忆"/></Empty>
        <Item>
          <Card>
            <HStack justify="between" gap={8}>
              <VStack gap={4}>
                <Text muted>{item.project} · {item.agent}</Text>
                <Text>{item.text}</Text>
                {item.tags && <Text muted>#{item.tags}</Text>}
              </VStack>
              <Menu trigger={<Button label="" leftIcon="dots-three-vertical" size="sm"/>}>
                <MenuItem label="固定" icon="push-pin"
                  onClick={() => data.update({ collection: "memories", id: item.id, patch: { pinned: true } })}/>
                <MenuItem separator/>
                <MenuItem label="忘记" icon="trash" danger
                  onClick={() => app.confirm({
                    title: "永久忘记这条记忆？",
                    color: "danger",
                    onConfirm: () => data.delete({ collection: "memories", id: item.id }),
                  })}/>
              </Menu>
            </HStack>
          </Card>
        </Item>
      </DataList>
    </AccordionItem>
  </Accordion>
</Page>
