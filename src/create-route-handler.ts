import { Request, Response } from "express";
import { setContext } from "./context-handler";

export const createRouteHandler = (operation: any) => {
  return async (req: Request, res: Response) => {
    setContext({ req, res });
    await operation();
  };
};
