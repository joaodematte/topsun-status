// oxlint-disable require-unicode-regexp prefer-named-capture-group no-plusplus
const CPF_MAX_DIGITS = 11;
const CPF_FIRST_GROUP_END = 3;
const CPF_SECOND_GROUP_END = 6;
const CPF_THIRD_GROUP_END = 9;

export function formatCpf(cpf: string): string {
  const digits = cpf.replaceAll(/[^\d]+/g, "").slice(0, CPF_MAX_DIGITS);
  const firstGroup = digits.slice(0, CPF_FIRST_GROUP_END);
  const secondGroup = digits.slice(CPF_FIRST_GROUP_END, CPF_SECOND_GROUP_END);
  const thirdGroup = digits.slice(CPF_SECOND_GROUP_END, CPF_THIRD_GROUP_END);
  const verifierDigits = digits.slice(CPF_THIRD_GROUP_END);

  if (verifierDigits) {
    return `${firstGroup}.${secondGroup}.${thirdGroup}-${verifierDigits}`;
  }

  if (thirdGroup) {
    return `${firstGroup}.${secondGroup}.${thirdGroup}`;
  }

  if (secondGroup) {
    return `${firstGroup}.${secondGroup}`;
  }

  return firstGroup;
}

export function validateCpf(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanedCpf = cpf.replaceAll(/[^\d]+/g, "");

  // Verifica se tem 11 dígitos ou se é uma sequência repetida (ex: 111.111.111-11)
  if (cleanedCpf.length !== 11 || !!/(\d)\1{10}/.test(cleanedCpf)) {
    return false;
  }

  // Validação do 1º dígito
  let soma = 0;
  for (let i = 1; i <= 9; i++) {
    soma += Number.parseInt(cleanedCpf.slice(i - 1, i), 10) * (11 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== Number.parseInt(cleanedCpf.slice(9, 10), 10)) {
    return false;
  }

  // Validação do 2º dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += Number.parseInt(cleanedCpf.slice(i - 1, i), 10) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== Number.parseInt(cleanedCpf.slice(10, 11), 10)) {
    return false;
  }

  return true;
}
