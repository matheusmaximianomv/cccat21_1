import crypto from "crypto";

import Name from "./Name";
import Email from "./Email";
import Document from "./Document";
import Password from "./Password";
import Asset from "./Asset";

export default class Account {
  private _name: Name;
  private _email: Email;
  private _document: Document;
  private _password: Password;

  private assets: Asset[];

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
    password: string,
    assets: Asset[]
  ) {
    this._name = new Name(name);
    this._email = new Email(email);
    this._document = new Document(document);
    this._password = new Password(password);
    this.assets = assets;
  }

  public static create(
    name: string,
    email: string,
    document: string,
    password: string
  ): Account {
    const accountId = crypto.randomUUID();
    const assets: Asset[] = [];
    return new Account(accountId, name, email, document, password, assets);
  }

  public getAssets(): Asset[] {
    return this.assets;
  }

  public getBalance(assetId: string) {
    const asset = this.assets.find((asset) => asset.assetId === assetId);

    if (!asset) {
      return 0;
    }

    return asset.quantity;
  }

  public deposit(assetId: string, quantity: number) {
    if (quantity < 0) {
      throw new Error("Invalid quantity");
    }

    const asset = this.assets.find((asset) => asset.assetId === assetId);
    if (asset) {
      asset.quantity += quantity;
    } else {
      this.assets.push(new Asset(this.accountId, assetId, quantity));
    }
  }

  public withdraw(assetId: string, quantity: number) {
    if (quantity < 0) {
      throw new Error("Invalid quantity");
    }

    const asset = this.assets.find((asset) => asset.assetId === assetId);
    if (!asset || asset.quantity < quantity) {
      throw new Error("Insufficient funds");
    }
    asset.quantity -= quantity;
  }
}
