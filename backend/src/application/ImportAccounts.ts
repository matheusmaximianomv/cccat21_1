import AccountRepository from "../infrastructure/repository/AccountRepository";
import Account from "../domain/Account";

export default class Signup {
  constructor(private readonly AccountRepository: AccountRepository) {}

  public async execute(input: any): Promise<any> {
    const accountsID = [];

    for (const inputAccount of input.accounts) {
      const account = Account.create(
        inputAccount.name,
        inputAccount.email,
        inputAccount.document,
        inputAccount.password
      );

      await this.AccountRepository.saveAccount(account);

      accountsID.push({ accountId: account.accountId });
    }

    return accountsID;
  }
}
