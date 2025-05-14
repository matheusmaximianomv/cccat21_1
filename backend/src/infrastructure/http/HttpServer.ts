import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Server } from 'http';

export default interface HttpServer {
  route(method: string, url: string, callback: Function): Promise<any>;
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

  public async route(method: keyof Express, url: string, callback: Function): Promise<any> {
    this.app[method](url, async (request: Request, response: Response) => {
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
