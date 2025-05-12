import { ExpressAdapter } from "./HttpServer";

import { AccountRepositoryDatabase } from "./AccountRepository";
import { OrderRepositoryDatabase } from "./OrderRepository";

import Signup from "./Signup";
import GetAccount from "./GetAccount";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import PlaceOrder from "./PlaceOrder";
import GetOrder from "./getOrder";
import AccountController from "./AccountController";
import OrderController from "./OrderController";
import { PgPromiseAdapter } from "./DatabaseConnection";

const httpServer = new ExpressAdapter();

const connection = new PgPromiseAdapter();

const accountRepositoryDatabase = new AccountRepositoryDatabase(connection);
const signup = new Signup(accountRepositoryDatabase);
const deposit = new Deposit(accountRepositoryDatabase);
const withdraw = new Withdraw(accountRepositoryDatabase);
const getAccount = new GetAccount(accountRepositoryDatabase);

const orderRepositoryDatabase = new OrderRepositoryDatabase(connection);
const placeOrder = new PlaceOrder(orderRepositoryDatabase);
const getOrder = new GetOrder(orderRepositoryDatabase);

AccountController.config(httpServer, signup, deposit, withdraw, getAccount);
OrderController.config(httpServer, placeOrder, getOrder);

httpServer.listen(3000);
