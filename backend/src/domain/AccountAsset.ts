export default class AccountAsset {
  constructor(
    public readonly accountId: string,
    public readonly assetId: string,
    private quantity: number
  ) {
    if (this.quantity <= 0) {
      throw new Error("Insufficient funds");
    }
  }

  public withdraw(quantity: number) {
    if (this.quantity < quantity) {
      throw new Error("Insufficient funds");
    }

    this.quantity -= quantity;
  }

  public getQuantity(): number {
    return this.quantity;
  }
}
