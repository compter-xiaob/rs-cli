# 学习搭个脚手架

## 脚手架概念

随着前端工程化概念的普及，为了避免构建相似项目结构的项目时，重复性的CV操作,**[前端脚手架]**这种通过选项快速搭建项目代码框架和基础配置的工具应运而生。



## 分析脚手架功能

比如 vue-cli ,它的功能有

1.全局命令

2.交互式选项构建项目

3.生成对应项目文件



## 第三方库介绍

### 1. 初始化项目

**Step 1：**创建 `demo` 文件夹，执行 `npm init -y` 初始化仓库，生成 `package.json` 文件

```json
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",//将其设置为ES模块
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```



` ps:` 这一步最好把demo改成你想要的名字

后面`npm link` 后会把demo注册为全局命令,这时候你想要再更改全局命令先要

用以下命令移除这个包

```js
npm unlink -g demo
```



**Step 2：**在 `demo` 下创建 `bin` 文件夹，并在里面创建 `node` 入口文件 `index`

```js
#! /usr/bin/env node

// 为了方便测试
console.log("hello demo");

```



**Step 3：**编辑 `index` 文件，并将其配置到 `package.json` 中的 `bin` 字段

```json
"bin": {
    "demo": "./index.js"
  },
```



` ps:` 为什么需要在文件头部添加 **#! /usr/bin/env node**？

- `#!` 符号的名称叫 `Shebang`，用于指定脚本的解释程序
- 开发 `npm` 包时，需要在入口文件指定该指令，否则会抛出 `No such file or directory` 错误



**Step 4：**`npm link` 到全局

在 `demo` 文件目录下运行 `npm link` 将项目链接到本地环境，就可以临时实现 `demo` 指令全局调用。(`--force` 参数可以强制覆盖原有指令)



**Step 5：**运行 `demo` 命令，命令行成功打印出 `hello demo`。 `demo` 项目配置成功。



### 2. commander —— 命令行指令配置

第三方库 `commander` 来实现脚手架命令的配置。更多详细信息可以参考[commander 中文文档](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftj%2Fcommander.js%2Fblob%2Fmaster%2FReadme_zh-CN.md)

```js
npm install commander
```



**Step 1: 安装 `commander` 依赖，并导入 `demo` 项目中**

并在`index.js`中添加

```js
import { program } from 'commander';

// 解析用户执行时输入的参数
// process.argv 是 nodejs 提供的属性
// npm run server --port 3000
// 后面的 --port 3000 就是用户输入的参数
program.parse(process.argv);

```



`commander` 自身附带了 `--help` 指令，导入成功后，在命令行执行 `demo --help`，可以打印出基本的帮助提示。

` ps:` 具体来说，`process.argv` 是一个包含命令行参数的数组。`process.argv[0]` 存储了 Node.js 可执行文件的路径，而 `process.argv[1]` 存储了正在执行的 JavaScript 文件的路径。剩余的元素 `process.argv[2]`、`process.argv[3]`、以及之后的元素包含了命令行传递的参数。

`program.parse(process.argv)` 用于将 `process.argv` 数组传递给 CLI 框架的解析器进行解析。这样，CLI 框架就可以根据传递的参数执行相应的命令或操作。



**Step 2: version 方法可以配置版本信息提示**

**Step 3: name 和 usage 方法分别配置 cli 名称和 --help 第一行提示**

```js
program
    .name("demo")
    .usage(`<command> [option]`)
    .version(`1.0.0`);
```



### 3. chalk —— 命令行美化工具

[chalk](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fchalk%2Fchalk) 可以美化我们在命令行中输出内容的样式，例如实现多种颜色，花里胡哨的命令行提示等。

**Step 1: 首先先安装 chalk 依赖并引入**

```js
npm install chalk //npm install chalk@4.0.0
```



**Step 2: 就可以开始输出各种花里胡哨的命令行提示**

```js
//index.js
import chalk from 'chalk';
console.log(`hello ${chalk.blue("world")}`);
console.log(chalk.blue.bgRed.bold("Hello world!"));
console.log(
  chalk.green(
    "I am a green line " +
      chalk.blue.underline.bold("with a blue substring") +
      " that becomes green again!"
  )
);

```



` ps:` 安装版本过高报错可能是因为有些库可能仍然使用 CommonJS 模块规范，无法直接与 ES 模块一起使用。

### 4. inquirer —— 命令行交互工具

交互式功能就是由 `inquirer` 实现的。

```js
npm install inquirer
```



[inquirer](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FSBoudrias%2FInquirer.js) 支持 `Confirm` 确认，`List` 单选，`Checkbox` 多选等多种交互方式。

这里我们来模拟实现 `vue` 的多选功能:

```js
import inquirer from 'inquirer';

inquirer.prompt([
  {
    name: "vue",
    // 多选交互功能
    // 单选将这里修改为 list 即可
    type: "checkbox",
    message: "Check the features needed for your project:",
    choices: [
      {
        name: "Babel",
        checked: true,
      },
      {
        name: "TypeScript",
      },
      {
        name: "Progressive Web App (PWA) Support",
      },
      {
        name: "Router",
      },
    ],
  },
]).then((data) => {
  console.log(data);
});
```



### 5. ora —— 命令行 loading 效果

`ora` 使用非常简单，可以直接看下面的案例。更多使用: [ora 文档](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsindresorhus%2Fora)

```js
npm install ora
```



利用 `ora` 来实现一个简单的命令行 `loading` 效果。

```js
import ora from 'ora';
// 定义一个loading
const spinner = ora('Loading...').start();
setTimeout(() => {
  spinner.succeed('Finished loading.');
}, 2000);

```



### 6. fs-extra —— 更友好的文件操作

[fs-extra](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjprichardson%2Fnode-fs-extra) 模块是系统 `fs` 模块的扩展，提供了更多便利的 `API`，并继承了 `fs` 模块的 `API`。比 `fs` 使用起来更加友好。

```js
npm install fs-extra
```



后面开始构建Cli时边用边介绍

### 7. download-git-repo

[download-git-repo](https://link.juejin.cn/?target=https%3A%2F%2Fgitlab.com%2Fflippidippi%2Fdownload-git-repo) 可以从 `git` 中下载并提取一个 `git repository`。

```js
npm install download-git-repo
```

`download-git-repo` 仓库提供 的 `download` 函数接收四个参数(下面代码是 download-git-repo 源码中截取的):

```js
/**
 * download-git-repo 源码
 * Download `repo` to `dest` and callback `fn(err)`.
 *
 * @param {String} repo 仓库地址
 * @param {String} dest 仓库下载后存放路径
 * @param {Object} opts 配置参数
 * @param {Function} fn 回调函数
 */

function download(repo, dest, opts, fn) {}

```



### 8. figlet—— 生成基于 ASCII 的艺术字

```js
npm install figlet
```

[figlet](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpatorjk%2Ffiglet.js) 模块可以将 `text` 文本转化成生成基于 `ASCII` 的艺术字。具体效果不好解释，直接来看效果。

```js
// enter 入口文件
import figlet from 'figlet';
console.log(
  "\r\n" +
    figlet.textSync("demo", {
      font: "Ghost",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
);

```



## 构建`Cli`

### 配置版号

`commander` 提供了 `version` 方法，`.version()` 方法可以设置版本，其默认选项为 `-V` 和 `--version`，设置了版本后，命令行会输出当前的版本号。

```js
// package.json 中存取了项目的版本号 version 但获取有个报错没有解决
//所以采用最简单的方式直接设置变量
const version ="1.0.0"
program
    .version(`rs-cli ${version}`)

```



### 配置首行提示

`commander` 还提供了 `.usage` 和 `.name` 方法，通过这两个选项可以修改帮助提示的首行文字。利用这两个方法修改一下 `--help` 的首行提示。

```js
// name 是配置脚手架名称
// usage 是配置命令格式
program.name("rs-cli").usage(`<command> [option]`);
```



### 配置 create 命令

> `commander` 提供了 `command` 方法， `command` 方法的第一参数为命令名称，命令参数跟随在名称后面(必选参数使用 `<>` 表示，可选参数使用 `[]` 表示)

配置 `create` 命令，该命令负责创建项目。同时在这里我们添加 `--force` 参数，默认覆盖当前项目。(**关于存在同名目录的情况，后文有详细处理**)

> `option` 方法可以定义选项，同时可以附加选项的简介。每个选项可以定义一个短选项名称（-后面接单个字符）和一个长选项名称（--后面接一个或多个单词），使用逗号、空格或|分隔。



`index.js` 

```js
program
  .command("create <project-name>") // 增加创建指令
  .description("create a new project") // 添加描述信息
  .option("-f, --force", "overwrite target directory if it exists") // 强制覆盖
  .action((projectName, cmd) => {
    // 处理用户输入create 指令附加的参数
    console.log(projectName, cmd);
  });
//记得添加在    .parse(process.argv);上方不然打印不出来

```



通过 `--help` 查看到 `create [options] <project-name>`

接下来配置`create.js` 

```js
export default async function createProject(projectName, options) {
    console.log(projectName, options);
}
```



简单测试一下 `rs-cli create aaa` 

#### 存在同名目录

创建 `create` 命令时我们配置了 `--force` 参数，意为强制覆盖。那我们我们在创建一个项目目录时，就会出现三种情况:

- 创建项目时使用 `--force` 参数，不管是否有同名目录，直接创建
- 未使用 `--force` 参数，且当前工作目录中不存在同名目录，直接创建
- 未使用 `--force` 参数，且当前工作目录中存在同名项目，需要给用户提供选择，由用户决定是取消还是覆盖

实现逻辑:

1. 通过 `process.cwd` 获取当前工作目录，然后拼接项目名得到项目目录

2. 检查是否存在同名目录

3. 存在同名目录

   - 用户创建项目时使用了 `--force` 参数，直接删除同名目录
   - 未使用 `--force` 参数，给用户提供交互选择框，由用户决定

4. 不存在同名目录，继续创建项目

   

`create.js` 

```js
import path from "path";
import Inquirer from "inquirer";
import fs from "fs-extra";
import ora from "ora";

export default async function createProject(projectName, options) {
  // 获取当前工作目录
  const cwd = process.cwd();
  // console.log(cwd);//输出 D:\workspace\自己搭个脚手架\rs-cli
  // 拼接得到项目目录
  const rootDir = path.join(cwd, projectName);
  const publicDir = path.join(rootDir, "public");
  const srcDir = path.join(rootDir, "src");
  // console.log(rootDir);
  // 定义一个loading

  // 判断目录是否存在
  if (fs.existsSync(rootDir)) {
    // 判断是否使用 --force 参数
    if (options.force) {
      // 删除重名目录(remove是个异步方法)
      await fs.remove(rootDir);
    } else {
      let { isOverwrite } = await Inquirer.prompt([
        // 返回值为promise
        {
          name: "isOverwrite", // 与返回值对应
          type: "list", // list 类型
          message: "Target directory exists, Please choose an action",
          choices: [
            { name: "Overwrite", value: true },
            { name: "Cancel", value: false },
          ],
        },
      ]);
      // 选择 Cancel
      if (!isOverwrite) {
        console.log("Cancel");
        return;
      } else {
        // 选择 Overwirte ，先删除掉原有重名目录
        console.log("\r\nRemoving");
        await fs.remove(rootDir);
      }
    }
  }
  // 创建项目文件夹
  fs.mkdirSync(rootDir);
}
```



#### 创建项目文件结构

像` vue-cli` 会自动帮你创建好整个项目的目录结构

```js
const publicDir = path.join(rootDir, "public");
const srcDir = path.join(rootDir, "src");

fs.mkdirSync(rootDir);
fs.mkdirSync(publicDir);
fs.mkdirSync(srcDir);

```



所以根据需要来创建对应目录比如`src `,`public `等  

#### 交互式选择依赖

用上文提到的inquirer第三方工具来创建我们想要的交互式选择依赖

① 先创建一个数组来储存问题

```js
const promptQuestions = [
    {
      type: "list",
      name: "framework",
      message: "请选择你想使用的框架：",
      choices: ["React", "Vue"],
    },
    {
      type: "list",
      name: "language",
      message: "请选择您想使用的编程语言：",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "list",
      name: "cssLanguage",
      message: "请选择您想使用的CSS语言：",
      choices: ["Sass", "Less", "CSS-in-JS", "Tailwind CSS"],
    },
  ];
```



② 把依赖`push`到数组里面

```js
import Inquirer from "inquirer";

Inquirer.prompt(promptQuestions).then((answers) => {
    const framework = answers.framework;
    const language = answers.language;
    const cssLanguage = answers.cssLanguage;
    const reactJsContent = "";
    const vuejsContent = "";
    const vueAppContent = ""; //这部分是偷懒的可以在远程github仓库里储存你的template模板文件然后使用 download-git-repo来下载到你的本地项目上

    // 根据选择的框架生成依赖项
    // 根据选择的语言生成依赖项和main文件
    let dependencies = [];
    if (framework === "React") {
      dependencies = ["react", "react-dom"];
      if (language === "JavaScript") {
        fs.writeFileSync(`${srcDir}/main.js`, reactJsContent);
      } else if (language === "TypeScript") {
        fs.writeFileSync(`${srcDir}/main.ts`, reactJsContent);
        dependencies.push("typescript");
      }
    } else if (framework === "Vue") {
      dependencies = ["vue"];
      fs.writeFileSync(`${srcDir}/app.vue`, vueAppContent);
      if (language === "JavaScript") {
        fs.writeFileSync(`${srcDir}/main.js`, vuejsContent);
      } else if (language === "TypeScript") {
        fs.writeFileSync(`${srcDir}/main.ts`, vuejsContent);
        dependencies.push("typescript");
      }
    }
    //添加css依赖
    switch (cssLanguage) {
      case "Sass":
        dependencies.push("sass");
        break;
      case "Less":
        dependencies.push("less");
        break;
      case "CSS-in-JS":
        dependencies.push("styled-components");
        // 或者 dependencies.push('emotion');
        break;
      case "Tailwind CSS":
        dependencies.push("tailwindcss");
        break;
      default:
        break;
    }
```



③ 添加到`package.json`中

```js
// 生成 package.json 对象
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      description: "My package",
      scripts: {
        test: 'echo "No test specified"',
        start: "node index.js",
      },
      dependencies: dependencies.reduce(
        (acc, dep) => ({ ...acc, [dep]: "latest" }),
        {}
      ),
      keywords: [],
      author: "",
      license: "ISC",
    };

    // 将 package.json 写入文件
    fs.writeFileSync(
      `${rootDir}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );
  });
```



这样子就完成创建项目的依赖配置问题了 ^ ^

### 配置 config 命令

脚手架中 `config` 命令也是经常使用的，因此我们再添加个 `config` 命令，同时也熟练一下 `commander` 的使用。

```js
program
  .command("config [value]") // config 命令
  .description("inspect and modify the config")
  .option("-g, --get <key>", "get value by key")
  .option("-s, --set <key> <value>", "set option[key] is value")
  .option("-d, --delete <key>", "delete option by key")
  .action((value, keys) => {
    // value 可以取到 [value] 值，keys会获取到命令参数
    console.log(value, keys);
  });

```



### 优化 --help 提示

模仿vue--help的高亮提示

> `commander` 可以自动通过 `on` 方法来监听指令执行。

```js
// 监听 --help 指令
program.on("--help", () => {
  console.log();
  console.log(
    " Run rs-cli <command> --help for detailed usage of given command."
  );
  console.log();
});

```



### 给 --help 提示上色

利用 `chalk` 将 `rs-cli <command> --help` 高亮一下。

```js
// 使用 cyan 颜色（在 chalk 库中，cyan 是一种用于终端文本着色的颜色样式。它表示一种蓝绿色的青色）
program.on("--help", function () {
  console.log();
  console.log(
    `Run ${chalk.cyan(
      "rs-cli <command> --help"
    )} for detailed usage of given command.`
  );
  console.log();
});

```







## 问题汇总



### ①将demo作为全局命令后无法更改

**分析原因：**起因是一开始取名的时候没更改，后面要更改的时候发现npm link 并无法起到作用将新的名字在全局命令目录下创建对应的.cmd文件导致新名字无法作为全局命令运行。



#### 解决方法（windows）：

手动在全局命令目录(一般是C:\Users\<username>\AppData\Roaming\npm\下添加3个文件

`rs-cli` 

```bash
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  exec "$basedir/node"  "$basedir/node_modules\rs-cli\bin\index.js" "$@"//将此处修改为对于路径即可
else 
  exec node  "$basedir/node_modules\rs-cli\bin\index.js" "$@"//将此处修改为对于路径即可
fi

```



`rs-cli.cmd`

```cmd
@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\node.exe" (
  SET "_prog=%dp0%\node.exe"
) ELSE (
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\node_modules\rs-cli\bin\index.js" %*   
//将此处修改为对于路径即可
```



`rs-cli.ps1`

```powershell
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "$basedir/node$exe"  "$basedir/node_modules\rs-cli\bin\index.js" $args//将此处修改为对于路径即可
  } else {
    & "$basedir/node$exe"  "$basedir/node_modules\rs-cli\bin\index.js" $args//将此处修改为对于路径即可
  }
  $ret=$LASTEXITCODE
} else {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "node$exe"  "$basedir/node_modules\rs-cli\bin\index.js" $args//将此处修改为对于路径即可
  } else {
    & "node$exe"  "$basedir/node_modules\rs-cli\bin\index.js" $args//将此处修改为对于路径即可
  }
  $ret=$LASTEXITCODE
}
exit $ret

```



这样就可以在npm link 成功但没有注册全局命令在终端上使用该全局命令



### ②选择Vue框架后进行全家桶选择配置的时候，无法添加到package.json

上代码！！`create.js`

```js
const promptQuestions = [
    {
      type: "list",
      name: "framework",
      message: "请选择你想使用的框架：",
      choices: ["React", "Vue"],
    },
    {
      type: "list",
      name: "language",
      message: "请选择您想使用的编程语言：",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "list",
      name: "cssLanguage",
      message: "请选择您想使用的CSS语言：",
      choices: ["Sass", "Less", "CSS-in-JS", "Tailwind CSS"],
    },
  ];

  Inquirer.prompt(promptQuestions).then((answers) => {
    const framework = answers.framework;
    const language = answers.language;
    const cssLanguage = answers.cssLanguage;
    const reactJsContent = "";
    const vuejsContent = "";
    const vueAppContent = "";
    // 根据选择的框架生成依赖项
    // 根据选择的语言生成依赖项和main文件
    let dependencies = [];
    if (framework === "React") {
      dependencies = ["react", "react-dom"];
      if (language === "JavaScript") {
        fs.writeFileSync(`${srcDir}/main.js`, reactJsContent);
      } else if (language === "TypeScript") {
        fs.writeFileSync(`${srcDir}/main.ts`, reactJsContent);
        dependencies.push("typescript");
      }
    } else if (framework === "Vue") {
      dependencies = ["vue"];
      fs.writeFileSync(`${srcDir}/app.vue`, vueAppContent);
      if (language === "JavaScript") {
        fs.writeFileSync(`${srcDir}/main.js`, vuejsContent);
      } else if (language === "TypeScript") {
        fs.writeFileSync(`${srcDir}/main.ts`, vuejsContent);
        dependencies.push("typescript");
      }
    }

    if (framework === "Vue") {
      Inquirer.prompt([
        {
          type: "list",
          name: "router",
          message: "是否安装Vue Router：",
          choices: ["Yes", "No"],
        },
        {
          type: "list",
          name: "store",
          message: "请选择您想使用的仓库：",
          choices: ["VueX", "Pinia"],
        },
      ]).then((innerAnswers) => {
        if (innerAnswers.router == "Yes") {
          dependencies.push("vue-router");
        }
        if (innerAnswers.store == "VueX") {
          dependencies.push("vuex");
        } else {
          dependencies.push("pinia");
        }
      });
    }
    //添加css依赖
    switch (cssLanguage) {
      case "Sass":
        dependencies.push("sass");
        break;
      case "Less":
        dependencies.push("less");
        break;
      case "CSS-in-JS":
        dependencies.push("styled-components");
        // 或者 dependencies.push('emotion');
        break;
      case "Tailwind CSS":
        dependencies.push("tailwindcss");
        break;
      default:
        break;
    }
    // 生成 package.json 对象
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      description: "My package",
      scripts: {
        test: 'echo "No test specified"',
        start: "node index.js",
      },
      dependencies: dependencies.reduce(
        (acc, dep) => ({ ...acc, [dep]: "latest" }),
        {}
      ),
      keywords: [],
      author: "",
      license: "ISC",
    };
    // 将 package.json 写入文件
    fs.writeFileSync(
      `${rootDir}/package.json`,
      JSON.stringify(packageJson, null, 2)
    ); 
  });
```



**分析原因：**打印过数组确实有`push`进去而且`package.json`确实有生成且有3个依赖分别是`promptQuestions`中的依赖。那问题就很明确了就是文件`package.json`并没有在全部依赖都`push`进数组后生成,仅仅只是在完成了最外层`Inquirer.prompt`这层回调后就生成了,并没有等待内部的`Inquier.prompt` `push`依赖。因为`Inquirer.prompt`返回` promise` 对象是异步操作而`fs.writeFileSync`这个是同步操作导致了` package.json` 先生成了



#### 解决方法（windows）：

方法1.其实反正都选`Vue`框架了，那我直接在选`Vue`框架的时候直接把`vue-router`和`vuex` push进去不就好了。 `pinia`这个选项可以直接放在最外层的`Inquirer.prompt`来判断是否要舍弃`vux`使用`pinia`然后在`indexOf`找到`vuex ``splice`移除它在添加`pinia`就行了



方法2.解决二者之间的先后顺序，先把写入` package.json`封装成一个异步方法

```js
async function writePackageJson(dependencies, projectName) {
  const cwd = process.cwd();
  const rootDir = path.join(cwd, projectName);
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    description: "My package",
    scripts: {
      test: 'echo "No test specified"',
      start: "node index.js",
    },
    dependencies: dependencies.reduce(
      (acc, dep) => ({ ...acc, [dep]: "latest" }),
      {}
    ),
    keywords: [],
    author: "",
    license: "ISC",
  };

  await fs.promises.writeFile(
    `${rootDir}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );
}
```



然后在判断是否是` vue` 框架的时候异步调用这个方法即可全部依赖都写入` package.json` 

```js
if (framework === "Vue") {
      Inquirer.prompt([
        {
          type: "list",
          name: "router",
          message: "是否安装Vue Router：",
          choices: ["Yes", "No"],
        },
        {
          type: "list",
          name: "store",
          message: "请选择您想使用的仓库：",
          choices: ["VueX", "Pinia"],
        },
      ]).then(async (innerAnswers) => {
        if (innerAnswers.router == "Yes") {
          dependencies.push("vue-router");
        }
        if (innerAnswers.store == "VueX") {
          dependencies.push("vuex");
        } else {
          dependencies.push("pinia");
        }
        await writePackageJson(dependencies, projectName);
      });
    } else {
      writePackageJson(dependencies, projectName);
    }
```



### ③还没选择完就生成了文件夹



## 时间线

`rs-cli` `1.0.0` 摆烂版本 于2023.9.27完成共耗时1天

**版本详情：**只是简单的做了一个问答式添加依赖的脚手架,并未添加远程下载功能后续有空再做了



## 参考文献：

文章大部分都是从这copy的，更详细的内容可以点击这个连接查看原文[【前端架构必备】手摸手带你搭建一个属于自己的脚手架](https://juejin.cn/post/7077717940941881358)
