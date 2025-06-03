import { Output } from "../application/usecases/Signup";
import { Mediator } from "../infrastructure/mediator/Mediator";
import { groupOrders } from "./groupOrders";

import Order from "./Order";
import Trade from "./Trade";

export default class Book {
  private buys: Order[];
  private sells: Order[];

  constructor(
    private readonly marketId: string,
    private readonly mediator: Mediator
  ) {
    this.buys = [];
    this.sells = [];
  }

  public getDepth() {
    const orders = [...this.buys, ...this.sells];
    const index = groupOrders(orders, 1);
    const depth: any = {
      buys: [],
      sells: [],
    };

    for (const price in index.buy) {
      depth.buys.push({
        quantity: index.buy[price],
        price: parseFloat(price),
      });
    }

    for (const price in index.sell) {
      depth.sells.push({
        quantity: index.sell[price],
        price: parseFloat(price),
      });
    }

    return depth;
  }

  public async insert(order: Order): Promise<void> {
    if (order.side === "buy") {
      this.buys.push(order);
      this.buys.sort((a: Order, b: Order) => b.price - a.price);
    } else {
      this.sells.push(order);
      this.sells.sort((a: Order, b: Order) => a.price - b.price);
    }

    await this.execute();
  }

  private async execute(): Promise<void> {
    const highestBuy = this.buys[0];
    const lowestSell = this.sells[0];

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

    highestBuy.fill(fillQuantity, fillPrice);
    if (highestBuy.status === "closed") {
      this.buys.splice(this.buys.indexOf(highestBuy), 1);
    }

    lowestSell.fill(fillQuantity, fillPrice);
    if (lowestSell.status === "closed") {
      this.sells.splice(this.sells.indexOf(lowestSell), 1);
    }

    await this.mediator.notifyAll("orderFilled", highestBuy);
    await this.mediator.notifyAll("orderFilled", lowestSell);

    const tradeSide =
      highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()
        ? "buy"
        : "sell";

    const trade = Trade.create(
      highestBuy.marketId,
      highestBuy.orderId,
      lowestSell.orderId,
      tradeSide,
      fillQuantity,
      fillPrice
    );

    await this.mediator.notifyAll("tradeCreated", trade);
  }
}
