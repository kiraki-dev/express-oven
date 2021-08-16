import { ExpressOvenConfig } from '../../src/create-express-oven-routes';

export const exampleConfig = {
  defaultConfigs: {
    save: false,
  },
  apis: {
    '/api/users': {
      post: {
        operation: 'create',
        dataJsonPath: 'data/users.json',
        uidField: {
          name: 'uid',
          type: 'string',
        },
      },
    },
    '/api/posts': {
      post: {
        operation: 'create',
        dataJsonPath: 'data/posts.json',
        uidField: {
          name: 'uid',
          type: 'string',
        },
      },
    },
    '/api/hotels': {
      get: {
        operation: 'read',
        dataJsonPath: 'data/hotels.json',
        readOne: false,
      },
    },
  },
} as const;
