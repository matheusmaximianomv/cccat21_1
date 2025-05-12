import crypto from "crypto";

export default class Order {
  constructor(
    readonly orderId: string,
    readonly marketId: string,
    readonly accountId: string,
    readonly side: string,
    readonly quantity: number,
    readonly price: number,
    readonly status: string,
    readonly timestamp: Date
  ) {}

  public static create(
    marketId: string,
    accountId: string,
    side: string,
    quantity: number,
    price: number,
  ): Order {
    return new Order(
      crypto.randomUUID(),
      marketId,
      accountId,
      side,
      quantity,
      price,
      "open",
      new Date(),
    );
  }
}
