export default class Document {
  private _value: string;
  private readonly VALID_LENGTH = 11;

  constructor(document: string) {
    if (!document || !this.validateCpf(document)) {
      throw new Error("Invalid document");
    }

    this._value = document;
  }

  private validateCpf(document: string) {
    if (!document) return false;
    document = this.clean(document);
    if (document.length !== this.VALID_LENGTH) return false;
    if (this.allDigitsEqual(document)) return false;
    const dg1 = this.calculateDigit(document, 10);
    const dg2 = this.calculateDigit(document, 11);
    return this.extractDigit(document) == `${dg1}${dg2}`;
  }

  private clean(document: string) {
    return document.replace(/\D/g, "");
  }

  private allDigitsEqual(document: string) {
    const [firstDigit] = document;
    return [...document].every((digit) => digit === firstDigit);
  }

  private calculateDigit(document: string, factor: number) {
    let total = 0;
    for (const digit of document) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private extractDigit(document: string) {
    return document.substring(document.length - 2, document.length);
  }

  public getValue(): string {
    return this._value;
  }
}
