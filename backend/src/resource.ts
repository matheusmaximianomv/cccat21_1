import pgp from "pg-promise";

function proccessConnection(action: (connection: any) => Promise<void>): any {
  const connection = pgp()(
    process.env.BRANAS_DB_CONNECTION ||
      "postgres://postgres:123456@localhost:5432/app"
  );

  return action(connection);
}

export async function saveAccount(account: any) {
  const connection = pgp()(
    process.env.BRANAS_DB_CONNECTION ||
      "postgres://postgres:123456@localhost:5432/app"
  );
  await connection.query(
    "insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
    [
      account.accountId,
      account.name,
      account.email,
      account.document,
      account.password,
    ]
  );

  connection.$pool.end();
}

export async function saveAccountAsset(
  accountId: any,
  assetId: any,
  quantity: any
) {
  const connection = pgp()(
    process.env.BRANAS_DB_CONNECTION ||
      "postgres://postgres:123456@localhost:5432/app"
  );

  await connection.query(
    "insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
    [accountId, assetId, quantity]
  );

  connection.$pool.end();
}

export async function getAccountAsset(accountId: any, assetId: any) {
  const connection = pgp()(
    process.env.BRANAS_DB_CONNECTION ||
      "postgres://postgres:123456@localhost:5432/app"
  );

  const data = await connection.query(
    "select * from ccca.account_asset where account_id = $1 and asset_id = $2",
    [accountId, assetId]
  );

  connection.$pool.end();

  return data;
}

export async function updateAccountAsset(
  quantity: any,
  accountId: any,
  assetId: any
) {
  const connection = pgp()(
    process.env.BRANAS_DB_CONNECTION ||
      "postgres://postgres:123456@localhost:5432/app"
  );

  await connection.query(
    "update ccca.account_asset set quantity = $1 where account_id = $2 and asset_id = $3",
    [quantity, accountId, assetId]
  );

  connection.$pool.end();
}

export async function saverOrder(order: any) {
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

export async function getOrderById(orderId: any) {
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

export async function getAccountById(accountId: any) {
  const connection = pgp()(
    process.env.BRANAS_DB_CONNECTION ||
      "postgres://postgres:123456@localhost:5432/app"
  );

  const [accountData] = await connection.query(
    "select * from ccca.account where account_id = $1",
    [accountId]
  );

  connection.$pool.end();

  return accountData;
}

export async function getAccountAssets(accountId: any) {
  const connection = pgp()(
    process.env.BRANAS_DB_CONNECTION ||
      "postgres://postgres:123456@localhost:5432/app"
  );

  const data = await connection.query(
    "select * from ccca.account_asset where account_id = $1",
    [accountId]
  );

  connection.$pool.end();

  return data;
}
