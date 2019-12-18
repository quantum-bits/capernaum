import commander from "commander";
import { hashPassword } from "../auth/crypto";

const program = new commander.Command();

program.version("0.0.1");

program
  .command("hash-password <password>")
  .description("hash a password")
  .action((password: string) => {
    hashPassword(password).then(hash => console.log(hash));
  });

program.parse(process.argv);
