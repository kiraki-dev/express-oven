export const createMockRequest = <T>(body: T | null = null) => {
  return {
    body: body,
  };
};

export const createMockResponse = () => {
  return {
    send: jest.fn(),
  };
};

export const mockNext = () => {};
