import { Request } from 'express';

export const matchEntitiesByParams = (params: Record<string, string>, paramMatch: Record<string, string>) => {
  return (entity: any) => Object.entries(params).every(([param, value]) => {
    const entityKey = paramMatch[param];
    return String(entity[entityKey]) === value;
  });
};

export const matchEntitiesByBodyFilters = (body: Request['body'], filterMatch: Record<string, string>) => {
  return (entity: any) => Object.entries(filterMatch).every(([param, value]) => {
    const entityKey = filterMatch[param];
    // todo: we need to handle isArray(value) too
    return entity[entityKey] === value;
  });
};

export const matchEntitiesByQueryFilters = (query: Request['query'], filterMatch: Record<string, string>) => {
  return (entity: any) => Object.entries(filterMatch).every(([param, value]) => {
    const entityKey = filterMatch[param];

    // todo: we need to handle isArray(value) too
    return entity[entityKey] === value;
  });
};
