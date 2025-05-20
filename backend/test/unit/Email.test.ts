import Email from "../../src/domain/Email";

test.each([
  "jonh.doe@gmail.com",
])("Deve criar um nome válido: %s", (email) => {
  expect(new Email(email)).toBeDefined();
});

test.each([
  "jonh.doe",
  "jonh.doe@",
  undefined,
  null,
])("Não deve criar um nome: %s", (email: any) => {
  expect(() => new Email(email)).toThrow(new Error("Invalid email"));
});
