import crypto from "crypto";

import { validateCpf } from "./validateCpf";
import { isValidPassword } from "./validatePassword";

export default class Account {
  constructor(
    public readonly accountId: any,
    public readonly name: any,
    public readonly email: any,
    public readonly document: any,
    public readonly password: any
  ) {
    if (!this.isValidName(name)) {
      throw new Error("Invalid name");
    }

    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email");
    }

    if (!validateCpf(document)) {
      throw new Error("Invalid document");
    }

    if (!isValidPassword(password)) {
      throw new Error("Invalid password");
    }
  }

  public static create(
    name: string,
    email: string,
    document: string,
    password: string
  ): Account {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, document, password);
  }

  private isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  private isValidEmail(email: string) {
    return email.match(/^(.+)\@(.+)$/);
  }
}
