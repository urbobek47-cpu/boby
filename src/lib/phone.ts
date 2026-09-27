/**
 * Sensible Israeli phone number validation & normalization.
 * Accepts formats:
 * - 0501234567 / 050-1234567 / 050 123 4567
 * - +972501234567 / 972501234567
 * - Landlines: 021234567 / 03-1234567 / 041234567 / 081234567 / 091234567 / 0771234567
 */

export function cleanPhoneInput(raw: string): string {
  if (!raw) return "";
  let digits = raw.trim().replace(/[^\d+]/g, "");
  if (digits.startsWith("+972")) {
    digits = "0" + digits.slice(4);
  } else if (digits.startsWith("972")) {
    digits = "0" + digits.slice(3);
  }
  return digits.replace(/\D/g, "");
}

export function isValidIsraeliPhone(raw: string): boolean {
  if (!raw || !raw.trim()) return false;
  const digits = cleanPhoneInput(raw);

  // Israeli mobile: starts with 05 (050, 051, 052, 053, 054, 055, 058, etc.), exactly 10 digits
  if (/^05\d{8}$/.test(digits)) return true;

  // Israeli landlines / VOIP: starts with 02, 03, 04, 07, 08, 09, 9 to 10 digits
  if (/^0[234789]\d{7,8}$/.test(digits)) return true;

  return false;
}

export function normalizeIsraeliPhone(raw: string): string {
  if (!raw || !raw.trim()) return "";
  const digits = cleanPhoneInput(raw);
  if (!digits) return raw.trim();

  // Mobile format: 05X-XXXXXXX (050-1234567)
  if (digits.length === 10 && digits.startsWith("05")) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  // Landline 9 digits: 0X-XXXXXXX (03-1234567)
  if (digits.length === 9 && /^0[23489]/.test(digits)) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }

  // Landline / VOIP 10 digits (077-XXXXXXX)
  if (digits.length === 10 && digits.startsWith("07")) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return digits;
}
