import pgp from "pg-promise";
import Order from "./Order";

export default interface OrderRepository {
  saverOrder: (order: Order) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order>;
}

export class OrderRepositoryDatabase implements OrderRepository {
  public async saverOrder(order: Order) {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    await connection.query(
      "insert into ccca.order (order_id, market_id, account_id, side, quantity, price, status, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        order.orderId,
        order.marketId,
        order.accountId,
        order.side,
        order.quantity,
        order.price,
        order.status,
        order.timestamp,
      ]
    );

    await connection.$pool.end();
  }

  public async getOrderById(orderId: string): Promise<Order> {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    const [orderData] = await connection.query(
      "select * from ccca.order where order_id = $1",
      [orderId]
    );

    await connection.$pool.end();

    return new Order(
      orderData.order_id,
      orderData.market_id,
      orderData.account_id,
      orderData.side,
      parseFloat(orderData.quantity),
      parseFloat(orderData.price),
      orderData.status,
      orderData.timestamp
    );
  }
}
