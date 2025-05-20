export default class Email {
  private _value: string;

  constructor(email: string) {
    if (!email || !email.match(/^(.+)\@(.+)$/)) {
      throw new Error("Invalid email");
    }

    this._value = email;
  }

  public getValue(): string {
    return this._value;
  }
}