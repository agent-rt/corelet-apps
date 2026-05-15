<Page className="p-4">
  <VStack gap={8}>
    <DataForm collection="scratch">
      <Textarea
        name="input"
        label=""
        placeholder="粘贴 JSON 到这里"
        rows={8}
        className="font-mono text-xs"
      />
      <HStack gap={6} justify="end">
        <Button label="格式化" color="primary" icon="brackets-curly"
          onClick={() => scripts.format({input: form.input})}/>
        <Button label="压缩" icon="arrows-in-line-horizontal"
          onClick={() => scripts.minify({input: form.input})}/>
        <Button label="校验" icon="check"
          onClick={() => scripts.validate({input: form.input})}/>
        <Button label="清空" icon="x"
          onClick={() => scripts.clear()}/>
      </HStack>
    </DataForm>

    {state.info && (
      <Text muted className="text-xs font-mono">{state.info}</Text>
    )}

    {state.error && (
      <Card className="border border-red-500/40 bg-red-500/5">
        <Text className="text-red-500 text-sm font-mono">{state.error}</Text>
      </Card>
    )}

    {state.output && (
      <Section title="输出">
        <Card>
          <Text className="font-mono text-xs whitespace-pre-wrap">{state.output}</Text>
        </Card>
      </Section>
    )}
  </VStack>
</Page>
