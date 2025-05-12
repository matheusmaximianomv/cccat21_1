import Account from "../../src/domain/Account";

test("Deve criar uma conta", () => {
  const account = Account.create(
    "John Doe",
    "john.doe@gmailcom",
    "97456321558",
    "asdQWE123"
  );
  expect(account).toBeDefined();
});

test("Não deve criar uma conta com nome inválido", () => {
  expect(() =>
    Account.create("jonh", "john.doe@gmailcom", "97456321558", "asdQWE123")
  ).toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta com email inválido", async () => {
  expect(() =>
    Account.create("Jonh Doe", "john", "97456321558", "asdQWE123")
  ).toThrow(new Error("Invalid email"));
});

test.each(["111", "abc", "7897897897"])(
  "Não deve criar uma conta com cpf inválido",
  async (document: string) => {
    expect(() =>
      Account.create("Jonh Doe", "john.doe@gmailcom", document, "asdQWE123")
    ).toThrow(new Error("Invalid document"));
  }
);

test("Não deve criar uma conta com senha inválida", async () => {
  expect(() =>
    Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE")
  ).toThrow(new Error("Invalid password"));
});
