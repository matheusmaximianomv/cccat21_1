import {
  AccountRepositoryDatabase,
  AccountRepositoryMemory,
} from "../../src/infrastructure/repository/AccountRepository";
import Signup from "../../src/application/usecases/Signup";
import GetAccount from "../../src/application/usecases/GetAccount";
import sinon from "sinon";
import Account from "../../src/domain/Account";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infrastructure/database/DatabaseConnection";

let connection: DatabaseConnection;

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  // const AccountRepository = new AccountRepositoryMemory();
  connection = new PgPromiseAdapter();
  const AccountRepository = new AccountRepositoryDatabase(connection);

  signup = new Signup(AccountRepository);
  getAccount = new GetAccount(AccountRepository);
});

afterEach(async () => {
  await connection.close();
});

test("Deve criar uma conta válida", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const { accountId } = await signup.execute(inputSignup);

  expect(accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
});

test("Não deve criar uma conta com nome inválido", async () => {
  const inputSignup = {
    name: "John",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    "Invalid name"
  );
});

test("Deve criar uma conta válida com stub", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const saveAccountStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "saveAccount")
    .resolves();
  const { accountId } = await signup.execute(inputSignup);

  expect(accountId).toBeDefined();

  const getAccountByIdStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountById")
    .resolves(
      Account.create(
        inputSignup.name,
        inputSignup.email,
        inputSignup.document,
        inputSignup.password
      )
    );
  const outputGetAccount = await getAccount.execute(accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);

  saveAccountStub.restore();
  getAccountByIdStub.restore();
});

test("Deve criar uma conta válida com spy", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const saveAccountSpy = sinon.spy(
    AccountRepositoryDatabase.prototype,
    "saveAccount"
  );
  const outputSignup = await signup.execute(inputSignup);

  expect(outputSignup.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);

  expect(saveAccountSpy.calledOnce).toBe(true);

  const account = new Account(
    outputSignup.accountId,
    inputSignup.name,
    inputSignup.email,
    inputSignup.document,
    inputSignup.password,
    []
  );
  expect(saveAccountSpy.calledWith(account)).toBe(true);

  saveAccountSpy.restore();
});

test("Deve criar uma conta válida com mock", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const AccountRepositoryMock = sinon.mock(AccountRepositoryDatabase.prototype);
  AccountRepositoryMock.expects("saveAccount").once().resolves();

  const { accountId } = await signup.execute(inputSignup);

  expect(accountId).toBeDefined();

  AccountRepositoryMock.expects("getAccountById")
    .once()
    .resolves(
      new Account(
        "",
        inputSignup.name,
        inputSignup.email,
        inputSignup.document,
        inputSignup.password,
        []
      )
    );
  const outputGetAccount = await getAccount.execute(accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);

  AccountRepositoryMock.verify();
  AccountRepositoryMock.restore();
});

test("Deve criar uma conta válida com fake", async () => {
  const AccountRepository = new AccountRepositoryMemory();
  signup = new Signup(AccountRepository);
  getAccount = new GetAccount(AccountRepository);

  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const { accountId } = await signup.execute(inputSignup);

  expect(accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
});
