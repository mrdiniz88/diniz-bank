import Password from "../../src/domain/value-objects/Password";

test("should create a password", () => {
  const password = Password.create("12345678", "salt");
  expect(password.value).not.toBe("12345678");
  expect(password.salt).toBe("salt");
});

test("should validate a password", () => {
  const password = Password.create("12345678", "salt");

  expect(password.validate("12345678")).toBe(true);
});
