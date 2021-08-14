import { ExpressOvenConfig } from '../../src/create-express-oven-routes';

export const exampleConfig: ExpressOvenConfig = {
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
        }
      }
    }
  }
}
