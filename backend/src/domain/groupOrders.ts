import Order from "./Order";

export function groupOrders(orders: Order[], precision: number) {
  const index: any = {
    buy: {},
    sell: {},
  };

  for (const order of orders) {
    let price = order.price;

    if (precision > 0) {
      price -= price % 10 ** precision;
    }

    index[order.side][price] = index[order.side][price] || 0;
    index[order.side][price] += order.quantity;
  }

  return index;
}
