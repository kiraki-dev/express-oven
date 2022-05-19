import { AndQuery, OrQuery } from "../queries/query";
import { IdType } from "./misc";

export type GetQuery = (req: Request) => AndQuery | OrQuery;
export type GetEntityId = (req: Request) => IdType;

export interface CreateRouteHandlerOptions {
    getQuery?: GetQuery;
    getEntityId?: GetEntityId;
}