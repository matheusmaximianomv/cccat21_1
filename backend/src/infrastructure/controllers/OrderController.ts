import HttpServer from "../http/HttpServer";
import GetOrder from "../../application/usecases/GetOrder";
import PlaceOrder from "../../application/usecases/PlaceOrder";
import GetDepth from "../../application/usecases/GetDepth";

export default class OrderController {
  static config(
    httpServer: HttpServer,
    placeOrder: PlaceOrder,
    getOrder: GetOrder,
    getDepth: GetDepth,
  ) {
    httpServer.route("post", "/place_order", async (_params: any, body: any) => {
      const input = body;
      const output = await placeOrder.execute(input);
      return output;
    });
    
    httpServer.route("get", "/orders/:{orderId}", async (params: any, _body: any) => {
      const orderId = params.orderId;
      const output = await getOrder.execute(orderId);
      return output;
    });

    httpServer.route("get", "/depth/:{marketId}", async (params: any, _body: any) => {
      const marketId = params.marketId;
      const output = await getDepth.execute(marketId, 0);
      return output;
    });
  }
}
