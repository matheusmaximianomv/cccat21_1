import HttpServer from "../http/HttpServer";
import GetOrder from "../../application/GetOrder";
import PlaceOrder from "../../application/PlaceOrder";

export default class OrderController {
  static config(
    httpServer: HttpServer,
    placeOrder: PlaceOrder,
    getOrder: GetOrder,
  ) {
    httpServer.route("post", "/place_order", async (_params: any, body: any) => {
      const input = body;
      const output = await placeOrder.execute(input);
      return output;
    });
    
    httpServer.route("get", "/orders/:orderId", async (params: any, _body: any) => {
      const orderId = params.orderId;
      const output = await getOrder.execute(orderId);
      return output;
    });
  }
}
