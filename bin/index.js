#! /usr/bin/env node
import { program } from "commander";
import createProject from "../lib/create.js";
import chalk from "chalk";
import figlet from "figlet";

//获取版本号
const version = "1.0.0";

//添加config指令
program
  .command("config [value]")
  .description("inspect and modify the config")
  .option("-g, --get <key>", "get value by key")
  .option("-s, --set <key> <value>", "set option[key] is value")
  .option("-d, --delete <key>", "delete option by key")
  .action((value, keys) => {
    // value 可以取到 [value] 值，keys会获取到命令参数
    console.log(value, keys);
  });

// 添加create指令
program
  .command("create <project-name>")
  .description("create a new project") // 添加描述信息
  .option("-f, --force", "overwrite target directory if it exists") // 强制覆盖
  .action((projectName, cmd) => {
    createProject(projectName, cmd);
  });

//在最后一行添加高亮提示
// 使用 cyan 颜色（在 chalk 库中，它表示一种蓝绿色的青色）
program.on("--help", () => {
  //艺术字例子
  console.log(
    "\r\n" +
      figlet.textSync("rs-cli", {
        font: "Standard",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
  );
  console.log();
  console.log(
    `Run ${chalk.cyan(
      "rs-cli <command> --help"
    )} for detailed usage of given command.`
  );
  console.log();
});

//添加首行提示
program
  .name("rs-cli")
  .usage(`<command> [option]`)
  .version(`rs-cli ${version}`)
  .parse(process.argv);

// inquirer.prompt([
//   {
//     name: "vue",
//     // 多选交互功能
//     // 单选将这里修改为 list 即可
//     type: "checkbox",rs
//     message: "Check the features needed for your project:",
//     choices: [
//       {
//         name: "Babel",
//         checked: true,
//       },
//       {
//         name: "TypeScript",
//       },
//       {
//         name: "Progressive Web App (PWA) Support",
//       },
//       {
//         name: "Router",
//       },
//     ],
//   },
// ]).then((data) => {
//   console.log(data);
// });

// 定义一个loading
// const spinner = ora('Loading...').start();
// setTimeout(() => {
//   spinner.succeed('Finished loading.');
// }, 2000);

// export function download(repo, dest, opts, fn) {}

// chalk例子
// console.log(`hello ${chalk.blue("world")}`);
// console.log(chalk.blue.bgRed.bold("Hello world!"));
// console.log(
//   chalk.green(
//     "I am a green line " +
//       chalk.blue.underline.bold("with a blue substring") +
//       " that becomes green again!"
//   )
// );
