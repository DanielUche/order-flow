describe('withColdStart', () => {
  // Helper to load fresh copies of the module each time
  const load = async () => {
    jest.resetModules();
    return await import('./index'); // path relative to this test file
  };

  test('logs "cold start" only once per module load', async () => {
    const mod = await load();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    let calls = 0;
    const fn = mod.withColdStart(async () => { calls++; return 'ok'; });

    // First call: cold
    await fn();
    // Second call: warm
    await fn();

    // Should have executed twice
    expect(calls).toBe(2);

    // Should have logged cold start exactly once
    const logs = spy.mock.calls
      .map(args => args.join(' '))
      .filter(s => s.includes('[orderflow]') && s.includes('cold start'));

    expect(logs.length).toBe(1);

    spy.mockRestore();
  });

  test('new module load resets cold state', async () => {
    // First module load
    let mod = await load();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const fn1 = mod.withColdStart(async () => {});
    await fn1(); // triggers cold start once
    let logs1 = spy.mock.calls.map(args => args.join(' ')).filter(s => s.includes('cold start'));
    expect(logs1.length).toBe(1);
    spy.mockClear();

    // Second module load simulates a new container
    mod = await load();
    const fn2 = mod.withColdStart(async () => {});
    await fn2(); // should trigger cold start again
    let logs2 = spy.mock.calls.map(args => args.join(' ')).filter(s => s.includes('cold start'));
    expect(logs2.length).toBe(1);

    spy.mockRestore();
  });
});


