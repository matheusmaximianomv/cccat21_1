import crypto from "crypto";

import OrderDAO from "./OrderDAO";

export default class PlaceOrder {
  constructor(private readonly orderDAO: OrderDAO) {}

  public async execute(input: any): Promise<any> {
    const order = {
      orderId: crypto.randomUUID(),
      marketId: input.marketId,
      accountId: input.accountId,
      side: input.side,
      quantity: input.quantity,
      price: input.price,
      status: "open",
      timestamp: new Date(),
    };
  
    await this.orderDAO.saverOrder(order);
  
    return {
      orderId: order.orderId,
    };
  }
} 