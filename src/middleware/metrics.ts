import { Request, Response, NextFunction } from "express";
import { apiConfig } from "../config.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  // Increment the fileserver hits metric
  apiConfig.fileserverHits += 1;
  next();
}