import Book from "../../domain/Book";
import Order from "../../domain/Order";
import Trade from "../../domain/Trade";
import { Mediator } from "../../infrastructure/mediator/Mediator";
import OrderRepository from "../../infrastructure/repository/OrderRepository";
import TradeRepository from "../../infrastructure/repository/TradeRepository";
import WebSocketServer from "../../infrastructure/websocket/WebSocketServer";

export default class BookHandler {
  static config(
    mediator: Mediator,
    book: Book,
    websocketServer: WebSocketServer,
    orderRepository: OrderRepository,
    tradeRepository: TradeRepository
  ) {
    mediator.register("orderPlaced", async (order: Order) => {
      await book.insert(order);
      const depth = book.getDepth();
      await websocketServer.broadcast(depth);
    });

    mediator.register("orderFilled", async (order: Order) => {
      await orderRepository.updateOrder(order);
    });

    mediator.register("tradeCreated", async (trade: Trade) => {
      await tradeRepository.saveTrade(trade);
    });
  }
}
