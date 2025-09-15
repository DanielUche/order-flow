// Silence console.log during tests (optional: keep warnings/errors)
const originalLog = console.log;
beforeAll(() => {
  console.log = (...args: any[]) => {
    // comment the next line to see logs while debugging:
    if (typeof args[0] === "string" && args[0].startsWith("[orderflow]")) return;
    // Otherwise, pass through:
    return originalLog.apply(console, args);
  };
});

afterAll(() => {
  console.log = originalLog;
});
