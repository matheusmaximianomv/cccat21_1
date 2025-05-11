import AccountDAO from "./AccountDAO";

export default class Withdraw {
  constructor(private readonly accountDAO: AccountDAO) {}

  public async execute(input: any): Promise<void> {
    const [accountAssetsData] = await this.accountDAO.getAccountAsset(
      input.accountId,
      input.assetId
    );

    const currentQuantity = parseFloat(accountAssetsData.quantity);
    if (!accountAssetsData || currentQuantity < input.quantity) {
      throw new Error("Insufficient funds");
    }

    const quantity = currentQuantity - input.quantity;
    await this.accountDAO.updateAccountAsset(quantity, input.accountId, input.assetId);
  }
}
