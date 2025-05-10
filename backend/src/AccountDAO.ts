import pgp from "pg-promise";

export default interface AccountDAO {
  saveAccount: (account: any) => Promise<void>;
  getAccountById: (accountId: any) => Promise<any>;
  getAccountAssets: (accountId: any) => Promise<any>;
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

  public async getAccountById(accountId: any): Promise<void> {
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

  public async getAccountAssets(accountId: any): Promise<void> {
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

  public async getAccountAssets(accountId: any): Promise<any> {
    return [];
  }
}
