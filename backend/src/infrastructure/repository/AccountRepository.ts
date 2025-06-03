import Account from "../../domain/Account";
import Asset from "../../domain/Asset";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface AccountRepository {
  saveAccount: (account: Account) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;
  getAccountById: (accountId: string) => Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  public async saveAccount(account: Account) {
    await this.connection.query(
      "insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
      [
        account.accountId,
        account.name,
        account.email,
        account.document,
        account.password,
      ]
    );
  }

  public async updateAccount(account: Account) {
    await this.connection.query(
      "delete from ccca.account_asset where account_id = $1",
      [account.accountId]
    );

    for (const asset of account.getAssets()) {
      await this.connection.query(
        "insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
        [asset.accountId, asset.assetId, asset.quantity]
      );
    }
  }

  public async getAccountById(accountId: string): Promise<Account> {
    const [accountData] = await this.connection.query(
      "select * from ccca.account where account_id = $1",
      [accountId]
    );

    const assetsData = await this.connection.query(
      "select * from ccca.account_asset where account_id = $1",
      [accountId]
    );

    const assets: Asset[] = [];
    for (const assetData of assetsData) {
      assets.push(
        new Asset(
          assetData.account_id,
          assetData.asset_id,
          parseFloat(assetData.quantity)
        )
      );
    }

    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.document,
      accountData.password,
      assets
    );
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  private accounts: Account[] = [];

  public async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  public async updateAccount(_account: Account): Promise<void> {}

  public async getAccountById(accountId: string): Promise<Account> {
    return this.accounts.find(
      (account: Account) => account.accountId === accountId
    ) as Account;
  }
}
