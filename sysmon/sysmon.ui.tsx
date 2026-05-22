<Page title="System Monitor">
  <VStack gap={12}>
    <Heading level={2}>实时指标</Heading>
    <DataList collection="metrics">
      <Item>
        <Card>
          <HStack gap={16}>
            <Text>CPU {{op:"bind_item", field:"cpu_pct"}}%</Text>
            <Text>Mem {{op:"bind_item", field:"mem_used"}} / {{op:"bind_item", field:"mem_total"}}</Text>
          </HStack>
        </Card>
      </Item>
    </DataList>
  </VStack>
</Page>
