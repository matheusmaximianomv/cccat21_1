import AccountRepository from "../../infrastructure/repository/AccountRepository";
import Account from "../../domain/Account";

export interface Input {
  name: string;
  email: string;
  document: string;
  password: string;
}

export interface Output {
  accountId: string;
}


export default class Signup {
  constructor(private readonly AccountRepository: AccountRepository) {}

  public async execute(input: Input): Promise<Output> {
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
