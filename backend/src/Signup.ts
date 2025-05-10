import crypto from "crypto";

import AccountDAO from "./AccountDAO";
import { validateCpf } from "./validateCpf";
import { isValidPassword } from "./validatePassword";

export default class Signup {
  constructor(private readonly accountDAO: AccountDAO) {}

  private isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  private isValidEmail(email: string) {
    return email.match(/^(.+)\@(.+)$/);
  }

  public async execute(input: any): Promise<any> {
    if (!this.isValidName(input.name)) {
      throw new Error("Invalid name");
    }

    if (!this.isValidEmail(input.email)) {
      throw new Error("Invalid email");
    }

    if (!validateCpf(input.document)) {
      throw new Error("Invalid document");
    }

    if (!isValidPassword(input.password)) {
      throw new Error("Invalid password");
    }

    const accountId = crypto.randomUUID();
    const account = {
      accountId,
      name: input.name,
      email: input.email,
      document: input.document,
      password: input.password,
    };

    await this.accountDAO.saveAccount(account);

    return { accountId };
  }
}
