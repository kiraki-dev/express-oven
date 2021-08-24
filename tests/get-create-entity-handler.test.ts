import { getMockDataAdapterStorage, MockDataAdapterStorage } from './test-utils/mock-data-adapter-storage';
import { DataAdapterStorage } from '../src/utils/create-data-adapter-storage';
import { getCreateEntityHandler } from '../src/operations/get-create-entity.handler';
import { genUid } from 'light-uid';
import { Request, Response } from 'express';
import { createMockRequest, createMockResponse, mockNext } from './test-utils/mock-req-and-resp';
import { jestMatchers } from './test-utils/jest-matchers';
import { exampleConfig } from './test-utils/example-config';

describe('getCreateEntityHandler()', () => {
  let mockAdapterStorage: MockDataAdapterStorage;
  let dataAdapterStorage: DataAdapterStorage;
  const config = exampleConfig.apis['/api/users'].post!;

  const mockRequest = createMockRequest({ someProp: genUid() });
  const mockResponse = createMockResponse();

  beforeEach(() => {
    mockAdapterStorage = getMockDataAdapterStorage();
    dataAdapterStorage = mockAdapterStorage as DataAdapterStorage;
  });

  it(`should create a new entity`, () => {
    const createEntityHandler = getCreateEntityHandler(config, dataAdapterStorage);

    createEntityHandler(mockRequest as unknown as Request, mockResponse as unknown as Response, mockNext);

    const newEntityMatcher = {
      ...mockRequest.body,
      [config.uidField.name]: config.uidField.type === 'string' ? jestMatchers.toBeString() : jestMatchers.toBeNumber(),
    };

    expect(mockAdapterStorage.getAdapter('any-path').addOne).toBeCalledWith(newEntityMatcher, config.save);
    expect(mockResponse.send).toBeCalledWith(newEntityMatcher);
  });
});
