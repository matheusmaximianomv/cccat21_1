import Order from "./Order";
import OrderRepository from "./OrderRepository";

interface Input {
  marketId: string;
  accountId: string;
  side: string;
  quantity: number;
  price: number;
}

export default class PlaceOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(input: Input): Promise<any> {
    const order = Order.create(
      input.marketId,
      input.accountId,
      input.side,
      input.quantity,
      input.price
    );

    await this.orderRepository.saverOrder(order);

    return {
      orderId: order.orderId,
    };
  }
}
