export default class Asset {
  constructor(
    public readonly accountId: string,
    public readonly assetId: string,
    public quantity: number
  ) {}
}
