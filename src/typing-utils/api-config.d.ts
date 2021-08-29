import { OperationConfig, PartialOperationConfig } from './operations';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type ApiConfig = Record<string, Partial<Record<HttpMethod, OperationConfig>>>;
export type PartialApiConfig = Record<string, Partial<Record<HttpMethod, PartialOperationConfig>>>;
