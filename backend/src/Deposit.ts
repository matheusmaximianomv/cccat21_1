import AccountAsset from "./AccountAsset";
import AccountRepository from "./AccountRepository";

interface Input {
  accountId: string;
  assetId: string;
  quantity: number;
}

export default class Deposit {
  constructor(private readonly AccountRepository: AccountRepository) {}

  public async execute(input: Input): Promise<void> {
    await this.AccountRepository.saveAccountAsset(
      new AccountAsset(input.accountId, input.assetId, input.quantity)
    );
  }
}
