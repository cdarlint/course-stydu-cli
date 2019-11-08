// init.js
const fs = require("fs");
const fsExtra = require("fs-extra")
const { promisify } = require("util");
const pathLib = require("path");
const Inquirer = require('inquirer');     // 用户与命令行交互的工具
const chalk = require('chalk');           // console.log加颜色
const ora = require('ora');               // 用于命令行上的加载效果


// 拷贝下载的文件
let ncp = require("ncp");
ncp = promisify(ncp);

// 遍历文件夹 use一系列中间件处理文件
const MetalSmith = require('metalsmith');
let { render } = require('consolidate').ejs;
render = promisify(render); // 包装渲染方法

module.exports = async (courseTitle) => {

    const cwdPath = process.cwd();
    // 获取当前路径下的文件夹列表，判断当前命名的projecrName是否存在
    const currentFiles = fs.readdirSync(cwdPath) || [];
    const currentDict = currentFiles.filter(item => fs.lstatSync(cwdPath + `/${item}`).isDirectory());
    const hasCourseTitle = currentDict.includes(courseTitle);

    const targetPath = pathLib.join(cwdPath, courseTitle);
    const templatePath = pathLib.resolve(__dirname, "../template");

    // 如果是当前目录创建项目，给个confirm提示
    if (hasCourseTitle) {
        const { ok } = await Inquirer.prompt([
            {
                name: 'ok',
                type: 'confirm',
                message: '已存在该文件夹，是否创建'
            }
        ]);
        if (!ok) {
            return;
        } else {
            const { action } = await Inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: `目标文件夹 ${chalk.cyan(targetPath)} 已经存在，请选择:`,
                    choices: [
                        { name: 'Overwrite', value: 'overwrite' },
                        { name: 'Cancel', value: false }
                    ]
                }
            ]);
            if (!action) {
                return;
            } else if (action === 'overwrite') {
                console.log(`delete ${chalk.cyan(targetPath)}...`);
                await fsExtra.remove(targetPath);
                console.log(chalk.cyan('deleta success, download template...'));
            }
        }
    }

    // 没有ask文件说明不需要编译
    if (!fs.existsSync(pathLib.join(templatePath, 'ask.js'))) {
        await ncp(templatePath, targetPath);
        console.log('  ' + chalk.green("🚀 init finish!"));
        console.log(chalk.green(`   cd ${courseTitle}`));
        console.log(chalk.green(`   please write index.m3u8`));
        console.log(chalk.green(`   course-cli create`));
    } else {
        // eslint-disable-next-line no-undef
        await new Promise((resolve, reject) => {
            MetalSmith(__dirname)//随便给一个，反正就是要给值，给了也没有用，哈哈哈
                .source(templatePath) // 遍历下载的目录
                .destination(targetPath) // 输出渲染后的结果
                .use(async (files, metal, done) => {
                    const result = await Inquirer.prompt(require(pathLib.join(templatePath, 'ask.js'))); // 弹框询问用户
                    result["courseTitle"] = courseTitle;
                    const data = metal.metadata();
                    Object.assign(data, result); // 将询问的结果放到metadata中保证在下一个中间件中 可以获取到
                    delete files['ask.js'];
                    done();
                })
                .use((files, metal, done) => {
                    // eslint-disable-next-line no-undef
                    Reflect.ownKeys(files).forEach(async (file) => {  // 类似Object.keys 但是包括方法属性
                        let content = files[file].contents.toString(); // 获取文件中的内容
                        if (file.includes('.js') || file.includes('.json')) { // 如果是js或者 json才有可能是模板
                            if (content.includes('<%')) { // 文件中用<% 我才需要编译
                                content = await render(content, metal.metadata()); // 用数据渲染模板
                                // eslint-disable-next-line require-atomic-updates
                                files[file].contents = Buffer.from(content); // 渲染好的结果替换即可
                            }
                        }
                    });
                    done();
                })
                .build((err) => {
                    const spinner = ora('正在构建项目模板...');
                    if (!err) {
                        spinner.succeed();
                        console.log('  ' + chalk.green("🚀 init finish!"));
                        console.log(chalk.green(`   cd ${courseTitle}`));
                        console.log(chalk.green(`   please write index.m3u8`));
                        console.log(chalk.green(`   course-cli create`));
                        resolve();
                    } else {
                        spinner.fail();
                        console.log('  ' + chalk.red('🚀 init success!'));
                        reject();
                    }
                });
        });
    }
}



