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
    const orders = await this.orderRepository.getOrdersByMarketIdAndStatus(
      input.marketId,
      "open"
    );

    const highestBuy = this.getHighestBuy(orders);
    const lowestSell = this.getLowestSell(orders);
    if (highestBuy && lowestSell && highestBuy.price >= lowestSell.price) {
      const fillQuantity = Math.min(highestBuy.quantity, lowestSell.quantity);
      const fillPrice =
        highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()
          ? lowestSell.price
          : highestBuy.price;

      const tradeSide =
        highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()
          ? "buy"
          : "sell";

      highestBuy.fillQuantity = fillQuantity;
      lowestSell.fillQuantity = fillQuantity;

      highestBuy.fillPrice = fillPrice;
      lowestSell.fillPrice = fillPrice;

      if (highestBuy.quantity === highestBuy.fillQuantity) {
        highestBuy.status = "closed";
      }

      if (lowestSell.quantity === lowestSell.fillQuantity) {
        lowestSell.status = "closed";
      }

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
