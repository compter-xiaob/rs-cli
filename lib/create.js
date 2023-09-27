import path from "path";
import Inquirer from "inquirer";
import fs from "fs-extra";
import ora from "ora";

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

export default async function createProject(projectName, options) {
  // 获取当前工作目录
  const cwd = process.cwd();
  const rootDir = path.join(cwd, projectName);
  const publicDir = path.join(rootDir, "public");
  const srcDir = path.join(rootDir, "src");
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
  //接下来生成想要的依赖项
  //将选择的问题
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
  });
    // 创建项目文件夹
    fs.mkdirSync(rootDir);
    fs.mkdirSync(publicDir);
    fs.mkdirSync(srcDir);
}
