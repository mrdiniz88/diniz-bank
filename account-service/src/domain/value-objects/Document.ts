import BadRequest from "../../utils/errors/BadRequest";

export default class Document {
  readonly type: string;

  constructor(readonly value: string) {
    const documentCleaned = value.replace(/[^\d]/g, "");

    this.value = documentCleaned;

    if (this.isCPF()) {
      this.type = "CPF";

      return;
    }

    if (this.isCNPJ()) {
      this.type = "CNPJ";

      return;
    }

    throw new BadRequest("Invalid document");
  }

  getFormatedDocument() {
    if (this.value.length === 11) {
      return `${this.value.slice(0, 3)}.${this.value.slice(
        3,
        6
      )}.${this.value.slice(6, 9)}-${this.value.slice(9)}`;
    }

    if (this.value.length === 14) {
      return `${this.value.slice(0, 2)}.${this.value.slice(
        2,
        5
      )}.${this.value.slice(5, 8)}/${this.value.slice(
        8,
        12
      )}-${this.value.slice(12)}`;
    }

    throw new BadRequest("Invalid document");
  }

  private isCPF() {
    if (this.value.length !== 11) {
      return false;
    }

    if (this.value === "12345678909") return false;

    for (let i = 0; i <= 9; i++) {
      const sequencia = i.toString().repeat(9);
      if (this.value.includes(sequencia)) {
        return false;
      }
    }

    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(this.value.substring(i - 1, i), 10) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(this.value.substring(9, 10), 10)) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(this.value.substring(i - 1, i), 10) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(this.value.substring(10, 11), 10)) {
      return false;
    }

    return true;
  }

  private isCNPJ() {
    if (this.value.length !== 14) {
      return false;
    }

    let numbers = this.value.substring(0, 12);
    const digits = this.value.substring(12);

    let sum = 0;
    let pos = 5;

    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers[i], 10) * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result !== parseInt(digits[0], 10)) {
      return false;
    }

    numbers += result;
    sum = 0;
    pos = 6;

    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers[i], 10) * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result !== parseInt(digits[1], 10)) {
      return false;
    }

    return true;
  }
}
