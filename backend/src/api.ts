import express, { Request, Response } from "express";
import cors from "cors";
import { deposit, getOrder, placeOrder, withdraw } from "./application";
import { AccountDAODatabase } from "./AccountDAO";
import Signup from "./Signup";
import GetAccount from "./GetAccount";

const app = express();
app.use(express.json());
app.use(cors({}));

const accountDAODatabase = new AccountDAODatabase();
const signup = new Signup(accountDAODatabase);
const getAccount = new GetAccount(accountDAODatabase);

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
    await deposit(input);
    res.end();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/withdraw", async (req: Request, res: Response) => {
  try {
    const input = req.body;
    await withdraw(input);
    res.end();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/place_order", async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const output = await placeOrder(input);
    res.json(output);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/orders/:orderId", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const output = await getOrder(orderId);
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
