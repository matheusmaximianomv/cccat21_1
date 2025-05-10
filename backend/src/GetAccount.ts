import AccountDAO from "./AccountDAO";

export default class Signup {
  constructor(private readonly accountDAO: AccountDAO) {}

  public async execute(accountId: any): Promise<any> {
    const accountData = await this.accountDAO.getAccountById(accountId);
    const accountAssetsData = await this.accountDAO.getAccountAssets(accountId);

    console.log('accountData ->', accountData);
    console.log('accountAssetsData ->', accountAssetsData);

    accountData.assets = [];
    for (const accountAssetData of accountAssetsData) {
      accountData.assets.push({
        assetId: accountAssetData.asset_id,
        quantity: parseFloat(accountAssetData.quantity),
      });
    }

    return accountData;
  }
}
