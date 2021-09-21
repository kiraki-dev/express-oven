import { Request } from 'express';
import { Optional } from '../typing-utils/typings';
import { IGNORE_KEY } from '../constants';

export const matchEntitiesByParams = (params: Record<string, string>, paramMatch: Optional<Record<string, string>>) => {
  return (entity: any) => paramMatch ? Object.entries(params).every(([param, value]) => {
    const entityKey = paramMatch[param] ?? param;

    return entityKey === IGNORE_KEY || String(entity[entityKey]) === value;
  }) : true;
};

export const matchEntitiesByBodyFilters = (body: Request['body'], bodyMatch: Optional<Record<string, string>>) => {
  return (entity: any) => bodyMatch ?  Object.entries(bodyMatch).every(([bodyKey, entityKey]) => {

    // todo: we need to handle isArray(value) too
    return entityKey === IGNORE_KEY || entity[entityKey] === body[bodyKey];
  }) : true;
};

export const matchEntitiesByQueryFilters = (query: Request['query'], queryMatch: Optional<Record<string, string>>) => {
  return (entity: any) => queryMatch ? Object.entries(queryMatch).every(([queryKey, entityKey]) => {

    // todo: we need to handle isArray(value) too
    return entityKey === IGNORE_KEY || entity[entityKey] === query[queryKey];
  }) : true;
};
