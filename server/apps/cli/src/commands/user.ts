import { getDebugger } from "@helpers/debug-factory";
import NestContext from "@common/cli/src/nest-helpers";
import { UserService } from "@server/src/user/user.service";
import { User } from "@server/src/user/entities";
import { printTable } from "@helpers/formatting";

const debug = getDebugger("cli");

export async function listUsers() {
  const nestContext = new NestContext();
  const userService: UserService = await nestContext.get(UserService);
  const users = await userService.readAll();
  debug("USERS %O", users);
  await nestContext.close();

  const headers = ["ID", "First", "Last", "Email", "Encrypted Password"];
  const data = users.map((user: User) => [
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.password,
  ]);
  printTable(headers, data);
}

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  debug(`Create user '${firstName} ${lastName}', '${email}', '${password}'`);

  const nestContext = new NestContext();
  const userService: UserService = await nestContext.get(UserService);
  const newUser = await userService.create({
    email,
    firstName,
    lastName,
    password,
    userRoleIds: [2],
  });
  await nestContext.close();
  console.log("NEW USER %O", newUser);
}

export async function deleteUser(email: string) {
  debug(`Delete user '${email}'`);

  const nestContext = new NestContext();
  const userService: UserService = await nestContext.get(UserService);
  const result = await userService.delete(email);
  await nestContext.close();

  if (result.affected === 1) {
    console.log(`User '${email}' deleted`);
  } else {
    console.error("User not deleted");
  }
}

export async function changePassword(userId: string, newPassword: string) {
  debug(`Change password '${userId}', '${newPassword}'`);

  const nestContext = new NestContext();
  const userService: UserService = await nestContext.get(UserService);
  const message = await userService.changePassword(
    {
      userId: parseInt(userId),
      newPassword,
      currentPassword: "",
    },
    false // Skip validation
  );
  await nestContext.close();
  console.log(message);
}
