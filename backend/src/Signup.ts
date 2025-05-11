import AccountRepository from "./AccountRepository";
import Account from "./Account";

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
