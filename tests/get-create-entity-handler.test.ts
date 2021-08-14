import { getCreateEntityHandler } from '../dist/operations/get-create-entity.handler';
import { DataAdapterStorage } from '../dist/utils/create-data-adapter-storage';
import { getMockDataAdapterStorage } from './test-utils/mock-data-adapter-storage';
import { exampleConfig } from './test-utils/example-config';

describe('getCreateEntityHandler()', () => {
  let mockAdapterStorage: DataAdapterStorage;
  const config = exampleConfig.apis['/api/users'].post!;

  beforeEach(() => {
    mockAdapterStorage = getMockDataAdapterStorage();
  })

  it(`should check for valid configs`, () => {
    expect(() => getCreateEntityHandler({ ...config, uidField: null }, mockAdapterStorage)).toThrowError();
  });

  it(`should handle `, () => {
    const createEntityHandler = getCreateEntityHandler(config, mockAdapterStorage);

    // todo: we need to create mock req and res for this.
    // your test goes here
  });

  it(`should call createRouterForApiMethod() for each route`, () => {
    // your test goes here
  });

  it(`should return router with provided routes`, () => {
    // your test goes here
  });
});
