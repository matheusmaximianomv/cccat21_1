import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Server } from "http";

import Hapi, {
  Request as HapiRequest,
  ResponseToolkit,
  RouteDefMethods,
} from "@hapi/hapi";

export default interface HttpServer {
  route(method: any, url: string, callback: Function): Promise<any>;
  listen(port: number): void;
  close(): void;
}

export class ExpressAdapter implements HttpServer {
  private app: Express;
  private server?: Server;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  public async route(
    method: keyof Express,
    url: string,
    callback: Function
  ): Promise<any> {
    this.app[method](url.replace(/\{|\}/g, ""), async (request: Request, response: Response) => {
      try {
        const output = await callback(request.params, request.body);
        response.status(200).json(output);
      } catch (error: any) {
        return response.status(422).json({
          error: error.message,
        });
      }
    });
  }

  public listen(port: number): void {
    this.server = this.app.listen(port);
  }

  public close(): void {
    if (this.server) {
      this.server.close();
    }
  }
}

export class HapiAdapter implements HttpServer {
  private server: Hapi.Server;

  constructor() {
    this.server = Hapi.server({});
  }

  public async route(
    method: RouteDefMethods | RouteDefMethods[] | "*",
    url: string,
    callback: Function
  ): Promise<any> {
    this.server.route({
      method,
      path: url.replace(/\:/g, ""),
      async handler(request: HapiRequest, reply: ResponseToolkit) {
        try {
          const output = await callback(request.params, request.payload);
          return output;
        } catch (error: any) {
          return reply.response({ error: error.message }).code(422);
        }
      },
    });
  }

  public listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  }

  public close(): void {
    this.server.stop();
  }
}
