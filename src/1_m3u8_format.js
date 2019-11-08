const fs = require("fs");
const pathLib = require("path");
const { promisify } = require("util");
let writeFile = promisify(fs.writeFile);
let cwdPath = process.cwd();

let formatM3u8 = () => {
    let str = fs.readFileSync(pathLib.join(cwdPath, "index.m3u8"), "utf-8");
    // let str = fs.readFileSync(pathLib.resolve(__dirname, "./index.m3u8"), "utf-8");
    let reg = /(http:\/\/ese5a9b8c8d0zc-pub.pub.+)/g;
    let keyReg = /(http:\/\/www.javascriptpeixun.cn.+?)",IV/g;
    let count = 0;
    let res = str.replace(reg, (...arg) => {
        count++;
        return `${count}.ts`;
    });
    return res.replace(keyReg, `key.txt",IV`);
}

let genM3u8 = (res) => {
    // let url = pathLib.resolve(__dirname, "m3u8", "index.m3u8");
    let url = pathLib.join(cwdPath, "m3u8", "index.m3u8");
    return writeFile(url, res).then(() => {
        console.log("🚀 index.m3u8 format finish!");
    }).catch(err => {
        console.log("error: " + err);
    });
}


module.exports = {
    formatM3u8,
    genM3u8
}

