import { ExpressAdapter, HapiAdapter } from "./infrastructure/http/HttpServer";

import { AccountRepositoryDatabase } from "./infrastructure/repository/AccountRepository";
import { OrderRepositoryDatabase } from "./infrastructure/repository/OrderRepository";

import Signup from "./application/usecases/Signup";
import GetAccount from "./application/usecases/GetAccount";
import Deposit from "./application/usecases/Deposit";
import Withdraw from "./application/usecases/Withdraw";
import PlaceOrder from "./application/usecases/PlaceOrder";
import GetOrder from "./application/usecases/GetOrder";
import AccountController from "./infrastructure/controllers/AccountController";
import OrderController from "./infrastructure/controllers/OrderController";
import { PgPromiseAdapter } from "./infrastructure/database/DatabaseConnection";
import GetDepth from "./application/usecases/GetDepth";
import { Mediator } from "./infrastructure/mediator/Mediator";

import ExecuteOrder from "./application/usecases/ExecuteOrder";
import { WSSAdapter } from "./infrastructure/websocket/WebSocketServer";
import OrderHandler from "./application/handlers/OrderHandler";
import { TradeRepositoryDatabase } from "./infrastructure/repository/TradeRepository";
import GetTrades from "./application/usecases/GetTrades";
import TradeController from "./infrastructure/controllers/TradeController";
import Book from "./domain/Book";
import BookHandler from "./application/handlers/BookHandler";

const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
const webSocketServer = new WSSAdapter(3001);

const connection = new PgPromiseAdapter();

const mediator = new Mediator();

const accountRepositoryDatabase = new AccountRepositoryDatabase(connection);
const signup = new Signup(accountRepositoryDatabase);
const deposit = new Deposit(accountRepositoryDatabase);
const withdraw = new Withdraw(accountRepositoryDatabase);
const getAccount = new GetAccount(accountRepositoryDatabase);

const tradeRepository = new TradeRepositoryDatabase(connection);
const getTrades = new GetTrades(tradeRepository);

const orderRepositoryDatabase = new OrderRepositoryDatabase(connection);
const placeOrder = new PlaceOrder(orderRepositoryDatabase, mediator);
const getOrder = new GetOrder(orderRepositoryDatabase);
const getDepth = new GetDepth(orderRepositoryDatabase);
const executeOrder = new ExecuteOrder(orderRepositoryDatabase, tradeRepository);

const book = new Book("", mediator);

AccountController.config(httpServer, signup, deposit, withdraw, getAccount);
OrderController.config(httpServer, placeOrder, getOrder, getDepth);
TradeController.config(httpServer, getTrades);

OrderHandler.config(mediator, webSocketServer, executeOrder, getDepth);
// BookHandler.config(mediator, book, webSocketServer, orderRepositoryDatabase, tradeRepository);

httpServer.listen(3000);
