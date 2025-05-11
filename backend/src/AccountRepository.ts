import pgp from "pg-promise";
import Account from "./Account";
import AccountAsset from "./AccountAsset";

export default interface AccountRepository {
  saveAccount: (account: Account) => Promise<void>;
  getAccountById: (accountId: string) => Promise<Account>;
  getAccountAssets: (accountId: string) => Promise<AccountAsset[]>;
  getAccountAsset: (
    accountId: string,
    assetId: string
  ) => Promise<AccountAsset>;
  updateAccountAsset: (accountAsset: AccountAsset) => Promise<void>;
  saveAccountAsset: (accountAsset: AccountAsset) => Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  public async saveAccount(account: Account) {
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

    await connection.$pool.end();
  }

  public async getAccountById(accountId: string): Promise<Account> {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    const [accountData] = await connection.query(
      "select * from ccca.account where account_id = $1",
      [accountId]
    );

    await connection.$pool.end();

    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.document,
      accountData.password
    );
  }

  public async getAccountAssets(accountId: string): Promise<AccountAsset[]> {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    const accountAssetsData = await connection.query(
      "select * from ccca.account_asset where account_id = $1",
      [accountId]
    );

    await connection.$pool.end();

    const accountAssets: AccountAsset[] = [];
    for (const accountAssetData of accountAssetsData) {
      accountAssets.push(
        new AccountAsset(
          accountAssetData.account_id,
          accountAssetData.asset_id,
          parseFloat(accountAssetData.quantity)
        )
      );
    }

    return accountAssets;
  }

  public async getAccountAsset(
    accountId: string,
    assetId: string
  ): Promise<AccountAsset> {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    const [accountAssetData] = await connection.query(
      "select * from ccca.account_asset where account_id = $1 and asset_id = $2",
      [accountId, assetId]
    );

    await connection.$pool.end();

    if (!accountAssetData) {
      throw new Error("Asset not found");
    }

    return new AccountAsset(
      accountAssetData.account_id,
      accountAssetData.asset_id,
      parseFloat(accountAssetData.quantity)
    );
  }

  public async updateAccountAsset(accountAsset: AccountAsset): Promise<void> {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    await connection.query(
      "update ccca.account_asset set quantity = $1 where account_id = $2 and asset_id = $3",
      [accountAsset.getQuantity(), accountAsset.accountId, accountAsset.assetId]
    );

    await connection.$pool.end();
  }

  public async saveAccountAsset(accountAsset: AccountAsset): Promise<void> {
    const connection = pgp()(
      process.env.BRANAS_DB_CONNECTION ||
        "postgres://postgres:123456@localhost:5432/app"
    );

    await connection.query(
      "insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
      [accountAsset.accountId, accountAsset.assetId, accountAsset.getQuantity()]
    );

    await connection.$pool.end();
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  private accounts: Account[] = [];

  public async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  public async getAccountById(accountId: string): Promise<Account> {
    return this.accounts.find(
      (account: Account) => account.accountId === accountId
    ) as Account;
  }

  public async getAccountAssets(_accountId: string): Promise<AccountAsset[]> {
    return [];
  }

  public async getAccountAsset(
    _accountId: string,
    _assetId: string
  ): Promise<AccountAsset> {
    return {} as AccountAsset;
  }

  public async saveAccountAsset(_accoutAsset: AccountAsset): Promise<void> {}

  public async updateAccountAsset(_accoutAsset: AccountAsset): Promise<void> {}
}
