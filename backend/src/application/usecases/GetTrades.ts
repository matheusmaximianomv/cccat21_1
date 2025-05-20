import Trade from "../../domain/Trade";
import TradeRepository from "../../infrastructure/repository/TradeRepository";

export default class GetTrades {
  constructor(private readonly tradeRepository: TradeRepository) {}

  public async execute(marketId: string): Promise<Trade[]> {
    const trades = await this.tradeRepository.getTradesByMarketId(marketId)
    return trades;
  }
}
