import { Request } from 'express';
import { Optional } from '../typing-utils/typings';
import { IGNORE_KEY } from '../constants';
import { getPropDeep } from './object-utils';

export const matchEntitiesByParams = (params: Record<string, string>, paramMatch: Optional<Record<string, string>>) => {
  return (entity: any) => paramMatch ? Object.entries(params).every(([param, value]) => {
    const entityKeyPath = paramMatch[param] ?? param;
    if (entityKeyPath === IGNORE_KEY) {
      return true;
    }
    const entityValue = getPropDeep(entity, entityKeyPath);

    return String(entityValue) === value;
  }) : true;
};

export const matchEntitiesByBodyFilters = (body: Request['body'], bodyMatch: Optional<Record<string, string>>) => {
  return (entity: any) => bodyMatch ? Object.entries(bodyMatch).every(([bodyKeyPath, entityKeyPath]) => {
    if (entityKeyPath === IGNORE_KEY) {
      return true;
    }
    const entityValue = getPropDeep(entity, entityKeyPath);
    const value = getPropDeep(body, bodyKeyPath);

    // todo: we need to handle isArray(value) too
    return entityValue === value;
  }) : true;
};

export const matchEntitiesByQueryFilters = (query: Request['query'], queryMatch: Optional<Record<string, string>>) => {
  return (entity: any) => queryMatch ? Object.entries(queryMatch).every(([queryKey, entityKeyPath]) => {
    if (entityKeyPath === IGNORE_KEY) {
      return true;
    }
    const entityValue = getPropDeep(entity, entityKeyPath);

    // todo: we need to handle isArray(value) too
    return entityValue === query[queryKey];
  }) : true;
};
