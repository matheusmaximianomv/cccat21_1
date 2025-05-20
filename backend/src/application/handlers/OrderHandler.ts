import Mediator from "../../infrastructure/mediator/Mediator";
import WebSocketServer from "../../infrastructure/websocket/WebSocketServer";
import ExecuteOrder from "../usecases/ExecuteOrder";
import GetDepth from "../usecases/GetDepth";

export default class OrderHandler {
  static config(
    mediator: Mediator,
    webSocketServer: WebSocketServer,
    executeOrder: ExecuteOrder,
    getDepth: GetDepth
  ) {
    mediator.register("orderPlaced", async (data: any) => {
      await executeOrder.execute({ marketId: data.marketId });
      const depth = await getDepth.execute(data.marketId, 0);
      webSocketServer.broadcast(depth);
    });
  }
}
