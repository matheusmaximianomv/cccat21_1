import OrderRepository from "./OrderRepository";

export default class GetOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(orderId: any): Promise<any> {
    const orderData = await this.orderRepository.getOrderById(orderId);
    const order = {
      orderId: orderData.orderId,
      marketId: orderData.marketId,
      accountId: orderData.accountId,
      side: orderData.side,
      quantity: orderData.quantity,
      price: orderData.price,
      status: orderData.status,
      timestamp: orderData.timestamp,
    };

    return order;
  }
}
