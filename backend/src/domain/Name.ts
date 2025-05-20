export default class Name {
  private _value: string;

  constructor(name: string) {
    if (!name || !name.match(/[a-zA-Z] [a-zA-Z]+/)) {
      throw new Error("Invalid name");
    }

    this._value = name;
  }

  public getValue(): string {
    return this._value;
  }
}