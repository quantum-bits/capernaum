import { Help, Option, Command, OptionValues } from "commander";
import chalk from "chalk";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("cli");

interface Argument {
  name: string;
}

interface CommandPlus extends Command {
  options: Option[];
  commands: CommandPlus[];
  _args: Argument[];
}

function hierarchyHelper(
  commands: CommandPlus[],
  options: OptionValues,
  tabWidth = 0
) {
  const tab = (n: number) => " ".repeat(n);

  function sortByName(commands: CommandPlus[]) {
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

    const opts = command.options.map((option) => option.flags);
    if (opts.length) {
      segments.push(chalk.yellow(opts.join(" ")));
    }

    const args = command._args.map((arg) => arg.name);
    if (args.length) {
      segments.push(chalk.red(args.join(" ")));
    }

    if (options.verbose) {
      segments.push(chalk.dim(command.description()));
    }

    if (tabWidth === 0) {
      console.log();
    }
    console.log(tab(tabWidth) + segments.join(" "));
    debug("width %d segments %O", commandFieldWidth, segments);

    hierarchyHelper(
      command.commands,
      options,
      tabWidth + commandFieldWidth + 1
    );
  }
}

export function showHierarchy(options: OptionValues, program) {
  {
    const help = new Help();
    const commands = help.visibleCommands(program) as CommandPlus[];
    hierarchyHelper(commands, options);
  }
}
