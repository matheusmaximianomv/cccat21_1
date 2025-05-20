import crypto from "crypto";

import Name from "./Name";
import Email from "./Email";
import Document from "./Document";
import Password from "./Password";

export default class Account {
  private _name: Name;
  private _email: Email;
  private _document: Document;
  private _password: Password;

  public get name(): string {
    return this._name.getValue();
  }

  public get email(): string {
    return this._email.getValue();
  }

  public get document(): string {
    return this._document.getValue();
  }

  public get password(): string {
    return this._password.getValue();
  }

  constructor(
    public readonly accountId: any,
    name: string,
    email: string,
    document: string,
    password: string
  ) {
    this._name = new Name(name);
    this._email = new Email(email);
    this._document = new Document(document);
    this._password = new Password(password);
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
}
