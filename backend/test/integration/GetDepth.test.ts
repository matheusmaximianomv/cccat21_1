import GetDepth from "../../src/application/usecases/GetDepth";
import PlaceOrder from "../../src/application/usecases/PlaceOrder";
import Signup from "../../src/application/usecases/Signup";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infrastructure/database/DatabaseConnection";
import AccountRepository, {
  AccountRepositoryDatabase,
} from "../../src/infrastructure/repository/AccountRepository";
import OrderRepository, {
  OrderRepositoryDatabase,
} from "../../src/infrastructure/repository/OrderRepository";

let connection: DatabaseConnection;

let accountRepository: AccountRepository;
let orderRepository: OrderRepository;

let signup: Signup;
let placeOrder: PlaceOrder;
let getDepth: GetDepth;

const marketId = "BTC/USD";

beforeEach(async () => {
  connection = new PgPromiseAdapter();

  accountRepository = new AccountRepositoryDatabase(connection);
  orderRepository = new OrderRepositoryDatabase(connection);

  signup = new Signup(accountRepository);
  placeOrder = new PlaceOrder(orderRepository);
  getDepth = new GetDepth(orderRepository);

  await orderRepository.deleteAll();
});

afterEach(async () => {
  await connection.close();
});

test("Deve retornar o depth após a realização de ordens de compra e venda sem precisão", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await signup.execute(inputSignup);

  const inputPlaceOrder1 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  await placeOrder.execute(inputPlaceOrder1);

  const inputPlaceOrder2 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94500,
  };
  await placeOrder.execute(inputPlaceOrder2);

  const inputPlaceOrder3 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94600,
  };
  await placeOrder.execute(inputPlaceOrder3);

  const outputGetDepth = await getDepth.execute(marketId, 0);

  expect(outputGetDepth.sells).toHaveLength(3)
  expect(outputGetDepth.sells[0].quantity).toBe(1);
  expect(outputGetDepth.sells[0].price).toBe(94000);
  expect(outputGetDepth.sells[1].quantity).toBe(1);
  expect(outputGetDepth.sells[1].price).toBe(94500);
  expect(outputGetDepth.sells[2].quantity).toBe(1);
  expect(outputGetDepth.sells[2].price).toBe(94600);
  expect(outputGetDepth.buys).toHaveLength(0);
});

test("Deve retornar o depth após a realização de ordens de compra e venda sem precisão mas com valores iguais", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await signup.execute(inputSignup);

  const inputPlaceOrder1 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  await placeOrder.execute(inputPlaceOrder1);

  const inputPlaceOrder2 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  await placeOrder.execute(inputPlaceOrder2);

  const inputPlaceOrder3 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  await placeOrder.execute(inputPlaceOrder3);

  const outputGetDepth = await getDepth.execute(marketId, 0);

  expect(outputGetDepth.sells).toHaveLength(1);
  expect(outputGetDepth.sells[0].quantity).toBe(3);
  expect(outputGetDepth.sells[0].price).toBe(94000);
  expect(outputGetDepth.buys).toHaveLength(0);
});

test("Deve retornar o depth após a realização de ordens de compra e venda com 3 casas de precisão", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await signup.execute(inputSignup);

  const inputPlaceOrder1 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94000,
  };
  await placeOrder.execute(inputPlaceOrder1);

  const inputPlaceOrder2 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94500,
  };
  await placeOrder.execute(inputPlaceOrder2);

  const inputPlaceOrder3 = {
    marketId: marketId,
    accountId: outputSignup.accountId,
    side: "sell",
    quantity: 1,
    price: 94600,
  };
  await placeOrder.execute(inputPlaceOrder3);

  const outputGetDepth = await getDepth.execute(marketId, 3);

  expect(outputGetDepth.sells).toHaveLength(1);
  expect(outputGetDepth.sells[0].quantity).toBe(3);
  expect(outputGetDepth.sells[0].price).toBe(94000);
  expect(outputGetDepth.buys).toHaveLength(0);
});
