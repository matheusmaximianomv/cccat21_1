import Order from "../../domain/Order";
import { Mediator } from "../../infrastructure/mediator/Mediator";
import OrderRepository from "../../infrastructure/repository/OrderRepository";

interface Input {
  marketId: string;
  accountId: string;
  side: string;
  quantity: number;
  price: number;
}

interface Output {
  orderId: string;
}

export default class PlaceOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly mediator: Mediator = new Mediator()
  ) {}

  public async execute(input: Input): Promise<Output> {
    const order = Order.create(
      input.marketId,
      input.accountId,
      input.side,
      input.quantity,
      input.price
    );

    await this.orderRepository.saverOrder(order);

    await this.mediator.notifyAll("orderPlaced", { marketId: input.marketId });

    return {
      orderId: order.orderId,
    };
  }
}
