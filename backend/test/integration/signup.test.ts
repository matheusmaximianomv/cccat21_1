import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../../src/AccountRepository";
import Signup from "../../src/Signup";
import GetAccount from "../../src/GetAccount";
import sinon from "sinon";
import Account from "../../src/Account";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  // const AccountRepository = new AccountRepositoryMemory();
  const AccountRepository = new AccountRepositoryDatabase();
  signup = new Signup(AccountRepository);
  getAccount = new GetAccount(AccountRepository);
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

test("Não deve criar uma conta com email inválido", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe",
    document: "97456321558",
    password: "asdQWE123",
  };

  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    "Invalid email"
  );
});

test.each(["111", "abc", "7897897897"])(
  "Não deve criar uma conta com cpf inválido",
  async (document: string) => {
    const inputSignup = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      document,
      password: "asdQWE123",
    };
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(
      "Invalid document"
    );
  }
);

test("Não deve criar uma conta com senha inválida", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE",
  };

  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    "Invalid password"
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
  const getAccountAssetsStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountAssets")
    .resolves([]);
  const outputGetAccount = await getAccount.execute(accountId);

  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);

  saveAccountStub.restore();
  getAccountByIdStub.restore();
  getAccountAssetsStub.restore();
});

test("Deve criar uma conta válida com spy", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };

  const saveAccountSpy = sinon.spy(AccountRepositoryDatabase.prototype, "saveAccount");
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
    inputSignup.password
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

  AccountRepositoryMock.expects("getAccountById").once().resolves(inputSignup);
  AccountRepositoryMock.expects("getAccountAssets").once().resolves([]);
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
