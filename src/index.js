const program = require('commander');

const { version } = require('./util/config');


program
    .command('create') // 命令的名称
    .alias('cr') // 命令的别名
    .description('create a program') // 命令的描述
    .action(() => {
        require('./create')(...process.argv.slice(3));
    });

program
    .command('begin') // 命令的名称
    .alias('bg') // 命令的别名
    .description('begin generator mp4') // 命令的描述
    .action(() => {
        require('./begin')(...process.argv.slice(3));
    });




// 执行sam-cli时，没有输入参数，显示的description帮助信息
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// 获取版本号 sam-cli -V
program
    .version(version)
    .parse(process.argv);