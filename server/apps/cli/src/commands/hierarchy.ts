import { Help, Command, OptionValues } from "commander";
import chalk from "chalk";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("cli");
const help = new Help();

function hierarchyHelper(
  commands: Command[],
  cliOptions: OptionValues,
  tabWidth = 0
) {
  const tab = (n: number) => " ".repeat(n);

  function sortByName(commands: Command[]) {
    return commands.sort((a, b) => a.name().localeCompare(b.name()));
  }

  function longestLength(strings: string[]) {
    return strings.reduce((accumulator: number, current: string) => {
      const currentLength = current.length;
      return currentLength > accumulator ? currentLength : accumulator;
    }, 0);
  }

  const commandFieldWidth = longestLength(commands.map((cmd) => cmd.name()));

  for (const command of sortByName(commands)) {
    const segments = [];

    segments.push(chalk.blue(command.name().padEnd(commandFieldWidth)));

    debug("OPTIONS %O", help.visibleOptions(command));

    const opts = help
      .visibleOptions(command)
      .filter((option) => option.long !== "--help")
      .map((option) => option.flags);
    if (opts.length) {
      segments.push(chalk.yellow(opts.join(" ")));
    }

    const args = help.visibleArguments(command).map((arg) => arg.name());
    if (args.length) {
      segments.push(chalk.red(args.join(" ")));
    }

    if (cliOptions.verbose) {
      segments.push(chalk.dim(command.description()));
    }

    if (tabWidth === 0) {
      console.log();
    }
    console.log(tab(tabWidth) + segments.join(" "));
    debug("width %d segments %O", commandFieldWidth, segments);

    hierarchyHelper(
      command.commands,
      cliOptions,
      tabWidth + commandFieldWidth + 1
    );
  }
}

export function showHierarchy(options: OptionValues, program: Command) {
  {
    const commands = help.visibleCommands(program) as Command[];
    hierarchyHelper(commands, options);
  }
}
