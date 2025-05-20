export default class Password {
  private _value: string;

  constructor(password: string) {
    if (!password || !this.isValidPassword(password)) {
      throw new Error("Invalid password");
    }

    this._value = password;
  }

  private isValidPassword (password: string) {
    if (password.length < 8) return false;
    if (!password.match(/\d+/)) return false;
    if (!password.match(/[a-z]+/)) return false;
    if (!password.match(/[A-Z]+/)) return false;
    return true;
}

  public getValue(): string {
    return this._value;
  }
}
