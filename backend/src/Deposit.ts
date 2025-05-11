import AccountDAO from "./AccountDAO";

export default class Deposit {
  constructor(private readonly accountDAO: AccountDAO) {}

  public async execute(input: any): Promise<void> {
    await this.accountDAO.saveAccountAsset(input.accountId, input.assetId, input.quantity)
  }
}