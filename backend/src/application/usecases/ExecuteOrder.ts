import Order from "../../domain/Order";
import Trade from "../../domain/Trade";
import OrderRepository from "../../infrastructure/repository/OrderRepository";
import TradeRepository from "../../infrastructure/repository/TradeRepository";

interface Input {
  marketId: string;
}

export default class ExecuteOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly tradeRepository: TradeRepository
  ) {}

  private getHighestBuy(orders: Order[]) {
    const buys = orders
      .filter((order: Order) => order.side === "buy")
      .sort((a: Order, b: Order) => a.price - b.price);

    return buys[buys.length - 1];
  }

  private getLowestSell(orders: Order[]) {
    const sells = orders
      .filter((order: Order) => order.side === "sell")
      .sort((a: Order, b: Order) => a.price - b.price);

    return sells[0];
  }

  public async execute(input: Input): Promise<void> {
    while (true) {
      const orders = await this.orderRepository.getOrdersByMarketIdAndStatus(
        input.marketId,
        "open"
      );

      const highestBuy = this.getHighestBuy(orders);
      const lowestSell = this.getLowestSell(orders);

      if (!highestBuy || !lowestSell) {
        return;
      }

      if (highestBuy.price < lowestSell.price) {
        return;
      }

      const fillQuantity = Math.min(highestBuy.quantity, lowestSell.quantity);
      const fillPrice =
        highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()
          ? lowestSell.price
          : highestBuy.price;

      const tradeSide =
        highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()
          ? "buy"
          : "sell";

      highestBuy.fill(fillQuantity, fillPrice);
      lowestSell.fill(fillQuantity, fillPrice);

      await this.orderRepository.updateOrder(highestBuy);
      await this.orderRepository.updateOrder(lowestSell);

      const trade = Trade.create(
        input.marketId,
        highestBuy.orderId,
        lowestSell.orderId,
        tradeSide,
        fillQuantity,
        fillPrice
      );
      await this.tradeRepository.saveTrade(trade);
    }
  }
}
