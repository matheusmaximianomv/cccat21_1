import AccountRepository from "./AccountRepository";

interface Input {
  accountId: string;
  assetId: string;
  quantity: number;
}

export default class Withdraw {
  constructor(private readonly AccountRepository: AccountRepository) {}

  public async execute(input: Input): Promise<void> {
    const accountAsset = await this.AccountRepository.getAccountAsset(
      input.accountId,
      input.assetId
    );

    accountAsset.withdraw(input.quantity);

    await this.AccountRepository.updateAccountAsset(accountAsset);
  }
}
