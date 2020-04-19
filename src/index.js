/* eslint-disable arrow-parens */
/* eslint-disable no-console */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */
/* eslint-disable semi */
const { Command, flags } = require("@oclif/command");
const fs = require("fs");
const palx = require("palx");
const chalk = require("chalk");

class PaletteSystemCommand extends Command {
  async run() {
    const { args } = this.parse(PaletteSystemCommand);
    const file = args.filename || "colors";
    const route = process.cwd() + "/" + file + ".json";
    const result = process.cwd() + "/styled-palette.json";
    console.log(
      chalk.blue.bold.inverse("Reading from: ") + chalk.blue.bold(route)
    );
    try {
      let rawdata = fs.readFileSync(route);
      let colors = JSON.parse(rawdata);
      const entries = Object.entries(colors).reduce(
        (total, a) => ({
          ...total,
          [a[0]]: a[1],
          ...palx(a[1]).gray.reduce((t, b, i) => {
            t[`${a[0]}${i}`] = b;
            return t;
          }, {}),
        }),
        {}
      );
      fs.writeFileSync(result, JSON.stringify(entries));
      console.log(
        chalk.green.bold.inverse("File created succesfully: ") +
          chalk.green.bold(result)
      );
    } catch (error) {
      console.error(chalk.red(error));
    }
  }
}

PaletteSystemCommand.description = `Creates a styled-system color palette based on a json colors file.
...
Without the cli flag, it generates a file called styled-palette.json
`;

PaletteSystemCommand.flags = {
  version: flags.version({ char: "v" }),
  help: flags.help({ char: "h" }),
  cli: flags.help({
    char: "c",
    description: "use this flag to `console.log` the output.",
  }),
};

PaletteSystemCommand.args = [
  {
    name: "filename", // name of arg to show in help and reference with args[name]
    required: true, // make the arg required with `required: true`
    description: "Filename of your palette (json format)", // help description
    default: "colors", // default value if no arg input
  },
];

module.exports = PaletteSystemCommand;
