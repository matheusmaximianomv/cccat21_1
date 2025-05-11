import pgp from "pg-promise";

export default interface AccountDAO {
  saveAccount: (account: any) => Promise<void>;
  getAccountById: (accountId: any) => Promise<any>;
  getAccountAssets: (accountId: any) => Promise<any>;
  saveAccountAsset: (
    accountId: any,
    assetId: any,
    quantity: any
  ) => Promise<void>;
  getAccountAsset: (accountId: any, assetId: any) => Promise<any>;
  updateAccountAsset: (
    quantity: any,
    accountId: any,
    assetId: any
  ) => Promise<any>;
}

export class AccountDAODatabase implements AccountDAO {
  public async saveAccount(account: any) {
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

  public async getAccountById(accountId: any): Promise<any> {
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

  public async getAccountAssets(accountId: any): Promise<any> {
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

  public async saveAccountAsset(
    accountId: any,
    assetId: any,
    quantity: any
  ): Promise<void> {
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

  public async getAccountAsset(accountId: any, assetId: any): Promise<any> {
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

  public async updateAccountAsset(
    quantity: any,
    accountId: any,
    assetId: any
  ): Promise<void> {
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
}

export class AccountDAOMemory implements AccountDAO {
  private accounts: any[] = [];

  public async saveAccount(account: any): Promise<void> {
    this.accounts.push(account);
  }

  public async getAccountById(accountId: any): Promise<any> {
    return this.accounts.find(
      (account: any) => account.accountId === accountId
    );
  }

  public async getAccountAssets(_accountId: any): Promise<any> {
    return [];
  }

  public async saveAccountAsset(
    _accountId: any,
    _assetId: any,
    _quantity: any
  ): Promise<void> {}

  public async getAccountAsset(accountId: any, assetId: any): Promise<any> {
    return [];
  }

  public async updateAccountAsset(
    _quantity: any,
    _accountId: any,
    _assetId: any
  ): Promise<void> {}
}
