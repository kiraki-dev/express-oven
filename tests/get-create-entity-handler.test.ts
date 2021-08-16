import { getMockDataAdapterStorage } from './test-utils/mock-data-adapter-storage';
import { exampleConfig } from './test-utils/example-config';
import { DataAdapterStorage } from '../src/utils/create-data-adapter-storage';
import { getCreateEntityHandler } from '../src/operations/get-create-entity.handler';

describe('getCreateEntityHandler()', () => {
  let mockAdapterStorage: DataAdapterStorage;
  const config = exampleConfig.apis['/api/users'].post!;

  beforeEach(() => {
    mockAdapterStorage = getMockDataAdapterStorage();
  })

  it(`should check for valid configs`, () => {
    expect(() => getCreateEntityHandler({ ...config, uidField: undefined } as any, mockAdapterStorage)).toThrowError();
  });

  it(`should handle `, () => {
    const createEntityHandler = getCreateEntityHandler(config, mockAdapterStorage);

    // todo: we need to create mock req and res for this.
    // your test goes here
  });
});
