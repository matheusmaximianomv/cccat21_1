import OrderDAO from "./OrderDAO";

export default class GetOrder {
  constructor(private readonly orderDAO: OrderDAO) {}

  public async execute(orderId: any): Promise<any> {
    const orderData = await this.orderDAO.getOrderById(orderId);
    const order = {
      orderId: orderData.order_id,
      marketId: orderData.market_id,
      accountId: orderData.account_id,
      side: orderData.side,
      quantity: parseFloat(orderData.quantity),
      price: parseFloat(orderData.price),
      status: orderData.status,
      timestamp: orderData.timestamp,
    };

    return order;
  }
}
