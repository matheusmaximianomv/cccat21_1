import express, { Express, Request, Response } from "express";
import cors from "cors";

export default interface HttpServer {
  route(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  route(method: keyof Express, url: string, callback: Function): void {
    this.app[method](url, async (request: Request, response: Response) => {
      try {
        await callback(request.params, request.body);
      } catch (error: any) {
        response.status(422).json({
          error: error.message,
        });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}
