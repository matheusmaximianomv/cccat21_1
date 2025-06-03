import AccountRepository from "../../infrastructure/repository/AccountRepository";

interface Input {
  accountId: string;
  assetId: string;
  quantity: number;
}

export default class Withdraw {
  constructor(private readonly accountRepository: AccountRepository) {}

  public async execute(input: Input): Promise<void> {
    const account = await this.accountRepository.getAccountById(
      input.accountId
    );
    account.withdraw(input.assetId, input.quantity);
    await this.accountRepository.updateAccount(account);
  }
}
