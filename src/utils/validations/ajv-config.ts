import Ajv from 'ajv';

import * as ExpressOvenConfigSchema from '../../schemas/express-oven-config.schema.json';
import * as DefaultConfigSchema from '../../schemas/default-config.schema.json';
import * as CreateOperationSchema from '../../schemas/create-entity-operation-config.schema.json';
import * as UidFieldSchema from '../../schemas/uid-field-config.schema.json';

export const ajv = new Ajv();

ajv.addSchema(ExpressOvenConfigSchema, 'express-oven-config.schema.json');
ajv.addSchema(DefaultConfigSchema, 'default-config.schema.json');
ajv.addSchema(CreateOperationSchema, 'create-entity-operation-config.schema.json');
ajv.addSchema(UidFieldSchema, 'uid-field-config.schema.json');
