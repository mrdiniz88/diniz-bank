import Document from "../../src/domain/value-objects/Document";

describe("Document tests", () => {
  it("should create a CNPJ document", () => {
    const document = new Document("49.924.610/0001-70");

    expect(document.value).toBe("49924610000170");
    expect(document.type).toBe("CNPJ");
    expect(document.getFormatedDocument()).toBe("49.924.610/0001-70");
  });

  it("should create a CPF document", () => {
    const document = new Document("453.181.430-40");

    expect(document.value).toBe("45318143040");
    expect(document.type).toBe("CPF");
    expect(document.getFormatedDocument()).toBe("453.181.430-40");
  });

  it("should not create a CPF document", () => {
    expect(() => new Document("000.000.000-00")).toThrowError(
      "Invalid document"
    );
    expect(() => new Document("123.456.789-09")).toThrowError(
      "Invalid document"
    );
    expect(() => new Document("022.000.222-01")).toThrowError(
      "Invalid document"
    );
  });

  it("should not create a CNPJ document", () => {
    expect(() => new Document("12.345.678/0001-09")).toThrowError(
      "Invalid document"
    );
    expect(() => new Document("49.924.610/0001-71")).toThrowError(
      "Invalid document"
    );
  });
});
