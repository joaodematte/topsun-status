const BIRTH_DATE_MAX_DIGITS = 8;
const BIRTH_DATE_DAY_END = 2;
const BIRTH_DATE_MONTH_END = 4;

export function getDigits(value: string, maxLength: number): string {
  let digits = "";

  for (const character of value) {
    if (character >= "0" && character <= "9") {
      digits += character;
    }

    if (digits.length === maxLength) {
      return digits;
    }
  }

  return digits;
}

export function formatBirthDate(value: string): string {
  const digits = getDigits(value, BIRTH_DATE_MAX_DIGITS);
  const day = digits.slice(0, BIRTH_DATE_DAY_END);
  const month = digits.slice(BIRTH_DATE_DAY_END, BIRTH_DATE_MONTH_END);
  const year = digits.slice(BIRTH_DATE_MONTH_END);

  if (year) {
    return `${day}/${month}/${year}`;
  }

  if (month) {
    return `${day}/${month}`;
  }

  return day;
}

export function parseBirthDateForRequest(value: string): string {
  const digits = getDigits(value, BIRTH_DATE_MAX_DIGITS);
  const day = digits.slice(0, BIRTH_DATE_DAY_END);
  const month = digits.slice(BIRTH_DATE_DAY_END, BIRTH_DATE_MONTH_END);
  const year = digits.slice(BIRTH_DATE_MONTH_END);

  return `${year}-${month}-${day}`;
}

export function isCompleteBirthDate(value: string): boolean {
  return (
    getDigits(value, BIRTH_DATE_MAX_DIGITS).length === BIRTH_DATE_MAX_DIGITS
  );
}
