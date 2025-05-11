import express, { Request, Response } from "express";
import cors from "cors";
import { AccountRepositoryDatabase } from "./AccountRepository";
import { OrderRepositoryDatabase } from "./OrderRepository";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import PlaceOrder from "./PlaceOrder";
import GetOrder from "./getOrder";

const app = express();
app.use(express.json());
app.use(cors({}));

const accountRepositoryDatabase = new AccountRepositoryDatabase();
const signup = new Signup(accountRepositoryDatabase);
const deposit = new Deposit(accountRepositoryDatabase);
const withdraw = new Withdraw(accountRepositoryDatabase);
const getAccount = new GetAccount(accountRepositoryDatabase);

const orderRepositoryDatabase = new OrderRepositoryDatabase();
const placeOrder = new PlaceOrder(orderRepositoryDatabase);
const getOrder = new GetOrder(orderRepositoryDatabase);

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const output = await signup.execute(input);
    res.status(201).json(output);
  } catch (e: any) {
    res.status(422).json({ error: e.message });
  }
});

app.post("/deposit", async (req: Request, res: Response) => {
  try {
    const input = req.body;
    await deposit.execute(input);
    res.end();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/withdraw", async (req: Request, res: Response) => {
  try {
    const input = req.body;
    await withdraw.execute(input);
    res.end();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/place_order", async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const output = await placeOrder.execute(input);
    res.json(output);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/orders/:orderId", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const output = await getOrder.execute(orderId);
    res.json(output);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId;
    const output = await getAccount.execute(accountId);
    res.json(output);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000);
