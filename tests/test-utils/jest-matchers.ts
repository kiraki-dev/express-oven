import Expect = jest.Expect;

type ExceptFirstItem<T> = T extends readonly [infer I, ...(infer Rest)] ? Rest : never;
type ExceptFirstArg<T> = (
  T extends (...args: any[]) => any
    ? (...args: ExceptFirstItem<Parameters<T>>) => ReturnType<T>
    : never
);

type ExpectExtended<T> = {
  [K in keyof T]: ExceptFirstArg<T[K]>;
}

const expectExtensions = {
  toBeNumber: (received: any) => {
    const isPassing = typeof received === 'number';
    const message = isPassing ? `expected ${received} not to be number` : `expected ${received} to be number`;

    return { pass: isPassing, message: () => message };
  },
  toBeString: (received: any) => {
    const isPassing = typeof received === 'string';
    const message = isPassing ? `expected ${received} not to be string` : `expected ${received} to be string`;

    return { pass: isPassing, message: () => message };
  },
} as const;

expect.extend(expectExtensions);

export const jestMatchers = expect as unknown as Expect & ExpectExtended<typeof expectExtensions>;
