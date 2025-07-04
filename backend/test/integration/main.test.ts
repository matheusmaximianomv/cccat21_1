import axios from "axios";
import WebSocket from "ws";

axios.defaults.validateStatus = () => true;

let ws: WebSocket;
let messages: any[] = [];

beforeAll(async () => {
  messages = [];
  ws = new WebSocket("ws://localhost:3001");
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    messages.push(message);
  });
});

beforeEach(() => {
  messages = [];
});

afterAll(async () => {
  ws.close();
});

test("Deve criar uma conta válida", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;

  expect(outputSignup.accountId).toBeDefined();

  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
});

test("Não deve criar uma conta com email inválido", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.error).toBe("Invalid email");
});

test("Deve fazer um depósito", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 10,
  };
  await axios.post("http://localhost:3000/deposit", inputDeposit);
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.assets).toHaveLength(1);
  expect(outputGetAccount.assets[0].assetId).toBe("BTC");
  expect(outputGetAccount.assets[0].quantity).toBe(10);
});

test("Deve fazer um saque", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 10,
  };
  await axios.post("http://localhost:3000/deposit", inputDeposit);
  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 5,
  };
  await axios.post("http://localhost:3000/withdraw", inputWithdraw);
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.assets).toHaveLength(1);
  expect(outputGetAccount.assets[0].assetId).toBe("BTC");
  expect(outputGetAccount.assets[0].quantity).toBe(5);
});

test("Não deve fazer um saque sem fundos", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 5,
  };
  await axios.post("http://localhost:3000/deposit", inputDeposit);
  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 10,
  };
  const responseWithdraw = await axios.post(
    "http://localhost:3000/withdraw",
    inputWithdraw
  );
  const putputWithdraw = responseWithdraw.data;
  expect(putputWithdraw.error).toBe("Insufficient funds");
});

test("Deve criar uma ordem de venda", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const inputPlaceOrder = {
    marketId: "BTC/USD",
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  const responsePlaceOrder = await axios.post(
    "http://localhost:3000/place_order",
    inputPlaceOrder
  );
  const outputPlaceOrder = responsePlaceOrder.data;
  expect(outputPlaceOrder.orderId).toBeDefined();
  const responseGetOrder = await axios.get(
    `http://localhost:3000/orders/${outputPlaceOrder.orderId}`
  );
  const outputGetOrder = responseGetOrder.data;
  expect(outputGetOrder.marketId).toBe(inputPlaceOrder.marketId);
  expect(outputGetOrder.side).toBe(inputPlaceOrder.side);
  expect(outputGetOrder.quantity).toBe(inputPlaceOrder.quantity);
  expect(outputGetOrder.price).toBe(inputPlaceOrder.price);
  expect(outputGetOrder.status).toBe("open");
  expect(outputGetOrder.timestamp).toBeDefined();
});

test("Deve criar ordens de compra e venda e executá-las", async () => {
  const marketId = `BTC/USD${Math.random()}`;

  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;

  const inputPlaceOrder1 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  const responsePlaceOrder1 = await axios.post(
    "http://localhost:3000/place_order",
    inputPlaceOrder1
  );
  const outputPlaceOrder1 = responsePlaceOrder1.data;

  const inputPlaceOrder2 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "buy",
    quantity: 1,
    price: 94500,
  };
  const responsePlaceOrder2 = await axios.post(
    "http://localhost:3000/place_order",
    inputPlaceOrder2
  );
  const outputPlaceOrder2 = responsePlaceOrder2.data;

  const responseGetOrder = await axios.get(
    `http://localhost:3000/orders/${outputPlaceOrder1.orderId}`
  );
  const outputGetOrder = responseGetOrder.data;
  expect(outputGetOrder.status).toBe("closed");
  expect(outputGetOrder.fillQuantity).toBe(1);
  expect(outputGetOrder.fillPrice).toBe(94000);

  const responseGetOrder2 = await axios.get(
    `http://localhost:3000/orders/${outputPlaceOrder2.orderId}`
  );
  const outputGetOrder2 = responseGetOrder2.data;
  expect(outputGetOrder2.status).toBe("closed");
  expect(outputGetOrder2.fillQuantity).toBe(1);
  expect(outputGetOrder2.fillPrice).toBe(94000);

  const responseGetDepth = await axios.get(
    `http://localhost:3000/depth/${encodeURIComponent(marketId)}`
  );
  const outputGetDepth = responseGetDepth.data;

  expect(outputGetDepth.sells).toHaveLength(0);
  expect(outputGetDepth.buys).toHaveLength(0);

  expect(messages.at(0).buys).toHaveLength(0);
  expect(messages.at(0).sells).toHaveLength(1);
  expect(messages.at(1).buys).toHaveLength(0);
  expect(messages.at(1).sells).toHaveLength(0);

  const responseGetTrades = await axios.get(
    `http://localhost:3000/markets/${encodeURIComponent(marketId)}/trades`
  );
  const outputGetTrades = responseGetTrades.data;
  expect(outputGetTrades).toHaveLength(1);
});

test("Deve criar várias ordens de compra e venda e executá-las", async () => {
  const marketId = `BTC/USD${Math.random()}`;

  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;

  const inputPlaceOrder1 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  await axios.post("http://localhost:3000/place_order", inputPlaceOrder1);

  const inputPlaceOrder2 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94500,
  };
  await axios.post("http://localhost:3000/place_order", inputPlaceOrder2);

  const inputPlaceOrder3 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "buy",
    quantity: 2,
    price: 94500,
  };
  await axios.post("http://localhost:3000/place_order", inputPlaceOrder3);

  const responseGetDepth = await axios.get(
    `http://localhost:3000/depth/${encodeURIComponent(marketId)}`
  );
  const outputGetDepth = responseGetDepth.data;

  expect(outputGetDepth.sells).toHaveLength(0);
  expect(outputGetDepth.buys).toHaveLength(0);
});

test("Deve criar ordens de compra e venda com preços diferentes e executá-las", async () => {
  const marketId = `BTC/USD${Math.random()}`;

  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;

  const inputPlaceOrder1 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  const responsePlaceOrder1 = await axios.post(
    "http://localhost:3000/place_order",
    inputPlaceOrder1
  );
  const outputPlaceOrder1 = responsePlaceOrder1.data;

  const inputPlaceOrder2 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "buy",
    quantity: 1,
    price: 94500,
  };
  const responsePlaceOrder2 = await axios.post(
    "http://localhost:3000/place_order",
    inputPlaceOrder2
  );
  const outputPlaceOrder2 = responsePlaceOrder2.data;

  const responseGetOrder = await axios.get(
    `http://localhost:3000/orders/${outputPlaceOrder1.orderId}`
  );
  const outputGetOrder = responseGetOrder.data;
  expect(outputGetOrder.status).toBe("closed");
  expect(outputGetOrder.fillQuantity).toBe(1);
  expect(outputGetOrder.fillPrice).toBe(94000);

  const responseGetOrder2 = await axios.get(
    `http://localhost:3000/orders/${outputPlaceOrder2.orderId}`
  );
  const outputGetOrder2 = responseGetOrder2.data;
  expect(outputGetOrder2.status).toBe("closed");
  expect(outputGetOrder2.fillQuantity).toBe(1);
  expect(outputGetOrder2.fillPrice).toBe(94000);

  const responseGetDepth = await axios.get(
    `http://localhost:3000/depth/${encodeURIComponent(marketId)}`
  );
  const outputGetDepth = responseGetDepth.data;

  expect(outputGetDepth.sells).toHaveLength(0);
  expect(outputGetDepth.buys).toHaveLength(0);

  expect(messages.at(0).buys).toHaveLength(0);
  expect(messages.at(0).sells).toHaveLength(1);
  expect(messages.at(1).buys).toHaveLength(0);
  expect(messages.at(1).sells).toHaveLength(0);

  const responseGetTrades = await axios.get(
    `http://localhost:3000/markets/${encodeURIComponent(marketId)}/trades`
  );
  const outputGetTrades = responseGetTrades.data;
  expect(outputGetTrades).toHaveLength(1);
});

test("Deve criar várias ordens de compra e venda e executá-las na média", async () => {
  const marketId = `BTC/USD${Math.random()}`;

  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;

  const inputPlaceOrder1 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94500,
  };
  await axios.post("http://localhost:3000/place_order", inputPlaceOrder1);

  const inputPlaceOrder2 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  await axios.post("http://localhost:3000/place_order", inputPlaceOrder2);

  const inputPlaceOrder3 = {
    marketId,
    accountId: outputSignup.accountId,
    side: "buy",
    quantity: 2,
    price: 94500,
  };
  const replacePlaceOrder3 = await axios.post(
    "http://localhost:3000/place_order",
    inputPlaceOrder3
  );
  const outputPlaceOrder3 = replacePlaceOrder3.data;

  const responseGetOrder3 = await axios.get(
    `http://localhost:3000/orders/${outputPlaceOrder3.orderId}`
  );
  const outputGetOrder3 = responseGetOrder3.data;

  expect(outputGetOrder3.fillPrice).toBe(94250);
});
