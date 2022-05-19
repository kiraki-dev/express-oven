import { Request, Response } from "express";
import { setContext } from "./context-handler";
import { CreateRouteHandlerOptions } from "./typing-utils/route-handler-options";

export const createRouteHandler = (operation: () => Promise<void>, options?: CreateRouteHandlerOptions) => {
  return async (req: Request, res: Response) => {
    setContext({ req, res, options });
    await operation();
  };
};
