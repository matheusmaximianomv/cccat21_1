import pgp from "pg-promise";

export default interface OrderDAO {
  saverOrder: (order: any) => Promise<void>;
  getOrderById: (orderId: any) => Promise<any>;
}

export class OrderDAODatabase implements OrderDAO {
  public async saverOrder(order: any) {
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

    connection.$pool.end();
  }

  public async getOrderById(orderId: any) {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    const [orderData] = await connection.query(
      "select * from ccca.order where order_id = $1",
      [orderId]
    );

    connection.$pool.end();

    return orderData;
  }
}
