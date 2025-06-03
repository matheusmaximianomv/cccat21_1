import AccountRepository from "../../infrastructure/repository/AccountRepository";

interface Output {
  accountId: string;
  name: string;
  email: string;
  document: string;
  password: string;
  assets: { assetId: string; quantity: number }[];
}

export default class GetAccount {
  constructor(private readonly AccountRepository: AccountRepository) {}

  public async execute(accountId: any): Promise<Output> {
    const account = await this.AccountRepository.getAccountById(accountId);
    const output: Output = {
      accountId: account.accountId,
      name: account.name,
      email: account.email,
      document: account.document,
      password: account.password,
      assets: [],
    };

    for (const asset of account.getAssets()) {
      output.assets.push({
        assetId: asset.assetId,
        quantity: asset.quantity,
      });
    }

    return output;
  }
}
