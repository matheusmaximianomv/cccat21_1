import { ExpressAdapter } from "./infrastructure/http/HttpServer";

import { AccountRepositoryDatabase } from "./infrastructure/repository/AccountRepository";
import { OrderRepositoryDatabase } from "./infrastructure/repository/OrderRepository";

import Signup from "./application/Signup";
import GetAccount from "./application/GetAccount";
import Deposit from "./application/Deposit";
import Withdraw from "./application/Withdraw";
import PlaceOrder from "./application/PlaceOrder";
import GetOrder from "./application/GetOrder";
import AccountController from "./infrastructure/controllers/AccountController";
import OrderController from "./infrastructure/controllers/OrderController";
import { PgPromiseAdapter } from "./infrastructure/database/DatabaseConnection";

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
