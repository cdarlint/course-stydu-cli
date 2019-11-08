const request = require("request");
const fs = require("fs");
const pathLib = require("path");
const chalk = require('chalk');           // console.log加颜色
let cwdPath = process.cwd();
let str = fs.readFileSync(pathLib.join(cwdPath, "./index.m3u8"), "utf-8");
let { courseTitle } = require(pathLib.join(cwdPath, "./0_info.js"));


let reg = /(http:\/\/ese5a9b8c8d0zc-pub.pub.+\?)/g;
// http://ese5a9b8c8d0zc-pub.pub.qiqiuyun.net/59880/9bfa2d2336f04f9c83625f97cef7426f/lnidfqfiEJkG_5TF-shd_seg_0_ehls_0ee3ab?schoolId=59880&fileGlobalId=9bfa2d2336f04f9c83625f97cef7426f&userId=1941&userName=xiao
// http://ese5a9b8c8d0zc-pub.pub.qiqiuyun.net/59880/9bfa2d2336f04f9c83625f97cef7426f/lnidfqfiEJkG_5TF-shd_seg_0_ehls_0ee3ab

let videoUrlList = str.match(reg);
let count = 0;

let downFile = () => {
    if (count === videoUrlList.length) {
        console.log("🚀 all ts down finish!");
        console.log("📦 total: " + count);
        console.log(chalk.green(`cd m3u8 && ffmpeg -allowed_extensions ALL -protocol_whitelist "tls,file,https,http,crypto,tcp" -i "index.m3u8" -c copy ../${courseTitle}.mp4`));
        return
    }
   
    /**测试
        fs.writeFile(pathLib.join(cwdPath, "m3u8", "1.txt"), "hello world", (err) => {
            if (err) {
                return console.log(err);
            }
        })
        count++;
        console.log(count);
        downFile();
     */
    let url = videoUrlList[count++];
    let writeStrem = fs.createWriteStream(pathLib.join(cwdPath, "m3u8", count + ".ts"));
    request(url).pipe(writeStrem).on("close", (e) => {
        if (e) {
            console.log("error" + e + count);
            return
        }
        console.log(count + " download finish!");
        downFile();
    });
}

// downFile();
console.log(videoUrlList, videoUrlList.length);

module.exports = {
    downFile
}
