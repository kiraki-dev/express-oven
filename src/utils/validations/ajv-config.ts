import Ajv from 'ajv';

import * as ExpressOvenConfigSchema from '../../schemas/express-oven-config.schema.json';
import * as DefaultConfigSchema from '../../schemas/default-config.schema.json';
import * as CreateOperationSchema from '../../schemas/create-entity-operation-config.schema.json';
import * as ReadOneOperationSchema from '../../schemas/read-one-entity-operation-config.schema.json';
import * as ReadListOperationSchema from '../../schemas/read-entity-list-operation-config.schema.json';
import * as UpdateOperationSchema from '../../schemas/update-entity-operation-config.schema.json';
import * as UidFieldSchema from '../../schemas/uid-field-config.schema.json';

export const ajv = new Ajv({
  allErrors: true,
});

ajv.addSchema(ExpressOvenConfigSchema, 'express-oven-config.schema.json');
ajv.addSchema(DefaultConfigSchema, 'default-config.schema.json');
ajv.addSchema(CreateOperationSchema, 'create-entity-operation-config.schema.json');
ajv.addSchema(ReadOneOperationSchema, 'read-one-entity-operation-config.schema.json');
ajv.addSchema(ReadListOperationSchema, 'read-entity-list-operation-config.schema.json');
ajv.addSchema(UpdateOperationSchema, 'update-entity-operation-config.schema.json');
ajv.addSchema(UidFieldSchema, 'uid-field-config.schema.json');
