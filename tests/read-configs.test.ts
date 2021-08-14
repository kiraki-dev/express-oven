import { DEFAULT_CONFIG_PATH } from '../src/constants';
import { readFileSync } from 'fs';
import { readConfigs } from '../src/utils/read-configs';
import Mock = jest.Mock;

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({})),
}));

describe('readConfigs()', () => {
  const readFileSyncMock = readFileSync as Mock;

  beforeEach(() => {
    readFileSyncMock.mockClear();
  });

  it(`should return configs if provided`, () => {
    const configs = {} as any;
    const result = readConfigs({ configs });

    expect(result).toBe(configs);
  });

  it(`should read from configsPath if provided`, () => {
    const configsPath = 'some-path.config.json';
    readConfigs({ configsPath });

    expect(readFileSyncMock).toBeCalledTimes(1);
    expect(readFileSyncMock.mock.calls[0][0]).toContain(configsPath);
  });

  it(`should read from "${DEFAULT_CONFIG_PATH}" when no config or configPath provided`, () => {
    readConfigs();

    expect(readFileSyncMock).toBeCalledTimes(1);
    expect(readFileSyncMock.mock.calls[0][0]).toContain(DEFAULT_CONFIG_PATH);
  });

  it(`throw an error when file not found`, () => {
    readFileSyncMock.mockImplementation(() => {
      throw new Error();
    });

    expect(() => readConfigs()).toThrowError();
  });
});
