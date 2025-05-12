import AccountRepository from "../infrastructure/repository/AccountRepository";
import Account from "../domain/Account";

export default class Signup {
  constructor(private readonly AccountRepository: AccountRepository) {}

  public async execute(input: any): Promise<any> {
    const account = Account.create(
      input.name,
      input.email,
      input.document,
      input.password
    );

    await this.AccountRepository.saveAccount(account);

    return { accountId: account.accountId };
  }
}
