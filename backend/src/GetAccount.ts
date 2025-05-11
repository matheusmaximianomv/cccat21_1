import AccountRepository from "./AccountRepository";

interface Output {
  accountId: string;
  name: string;
  email: string;
  document: string;
  password: string;
  assets: { assetId: string; quantity: number }[];
}

export default class Signup {
  constructor(private readonly AccountRepository: AccountRepository) {}

  public async execute(accountId: any): Promise<Output> {
    const account = await this.AccountRepository.getAccountById(accountId);
    const accountAssetsData = await this.AccountRepository.getAccountAssets(accountId);
    const output: Output = {
      accountId: account.accountId,
      name: account.name,
      email: account.email,
      document: account.document,
      password: account.password,
      assets: [],
    };

    for (const accountAssetData of accountAssetsData) {
      output.assets.push({
        assetId: accountAssetData.assetId,
        quantity: accountAssetData.getQuantity(),
      });
    }

    return output;
  }
}
