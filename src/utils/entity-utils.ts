import { Request } from 'express';
import { Optional } from '../typing-utils/typings';
import { IGNORE_KEY } from '../constants';

const alwaysTrueFn = (item: any) => true;

export const matchEntitiesByParams = (params: Record<string, string>, paramMatch: Optional<Record<string, string>>) => {
  return paramMatch ? (entity: any) => Object.entries(params).every(([param, value]) => {
    const entityKey = paramMatch[param] ?? param;

    return entityKey === IGNORE_KEY || String(entity[entityKey]) === value;
  }) : alwaysTrueFn;
};

export const matchEntitiesByBodyFilters = (body: Request['body'], filterMatch: Optional<Record<string, string>>) => {
  return filterMatch ? (entity: any) => Object.entries(body).every(([param, value]) => {
    const entityKey = filterMatch[param];

    // todo: we need to handle isArray(value) too
    return entityKey === IGNORE_KEY || entity[entityKey] === value;
  }) : alwaysTrueFn;
};

export const matchEntitiesByQueryFilters = (query: Request['query'], filterMatch: Optional<Record<string, string>>) => {
  return filterMatch ? (entity: any) => Object.entries(query).every(([param, value]) => {
    const entityKey = filterMatch[param];

    // todo: we need to handle isArray(value) too
    return entityKey === IGNORE_KEY || entity[entityKey] === value;
  }) : alwaysTrueFn;
};


