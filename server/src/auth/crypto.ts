import { compare, hash } from "bcrypt";
import { UserRole } from "../user/entities";

const SALT_ROUNDS = 10;

export function hashPassword(plainTextPassword: string) {
  return hash(plainTextPassword, SALT_ROUNDS);
}

export function validatePassword(
  plainTextPassword: string,
  encryptedPassword: string
) {
  return compare(plainTextPassword, encryptedPassword);
}
