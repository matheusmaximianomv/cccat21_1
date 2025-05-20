type HandlerCallback = (...values: any) => any;

interface Handler {
  event: string;
  callback: HandlerCallback;
}

export default class Mediator {
  private handlers: Handler[];

  constructor() {
    this.handlers = [];
  }

  public register(event: string, callback: HandlerCallback): void {
    this.handlers.push({ event, callback });
  }

  public async notifyAll(event: string, data: any): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.event === event) {
        await handler.callback(data);
      }
    }
  }
}