import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 10;

export function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export function validatePassword(password: string, encryptedPassword: string) {
  return compare(password, encryptedPassword);
}
