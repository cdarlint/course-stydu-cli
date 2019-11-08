let fs = require("fs");
let pathLib = require("path");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile)

let cwdPath = process.cwd();
let { key: keyOri } = require(pathLib.join(cwdPath, "./0_info.js"));//require是同步的

// let keyOri = "24cfe925a11af64188b2";    
//自己的[50, 52, 99, 102, 101, 57, 50, 53, 97, 49, 97, 102, 52, 49, 56, 98]
//爬取的[50, 52, 99, 102, 101, 57, 50, 53, 97, 49, 97, 102, 52, 49, 56, 98];


// let keyOri = "e25015b6q4p6c84r6y31";
//自己的[101, 50, 53, 48, 49, 53, 98, 54, 49, 100, 99, 56, 52, 102, 57, 49]
//爬取的[101, 50, 53, 48, 49, 53, 98, 54, 49, 100, 99, 56, 52, 102, 57, 49]

let sortDvByOrder = (str) => {
    let ruleArg = str.split("-");
    return ruleArg.map(i => keyOri[i].charCodeAt());
}

let genKeyAry = () => {
    const a_CODE = 97;
    let keyRelAry;

    var algorithmCharCode = keyOri[0].charCodeAt();
    var algorithmChar = String.fromCharCode(algorithmCharCode).toLowerCase();
    var algorithmCharStart = parseInt(algorithmChar, 36) % 7;
    var firstAlgorithmCharCode = keyOri[algorithmCharStart].charCodeAt();
    var firstAlgorithmChar = String.fromCharCode(firstAlgorithmCharCode);
    var secondAlgorithmCharCode = keyOri[algorithmCharStart + 1].charCodeAt();
    var secondAlgorithmChar = String.fromCharCode(secondAlgorithmCharCode);
    var algorithmNum = parseInt("" + firstAlgorithmChar + secondAlgorithmChar, 36) % 3;
    // console.log(algorithmCharCode);
    // console.log(algorithmChar);
    // console.log(algorithmCharStart);
    // console.log(firstAlgorithmCharCode);
    // console.log(firstAlgorithmChar);
    // console.log(secondAlgorithmCharCode);
    // console.log(secondAlgorithmChar);
    // console.log(algorithmNum);
    if (algorithmNum === 2) {

        let c9 = keyOri[8].charCodeAt(),  //97
            c9t = keyOri[9].charCodeAt(), //49
            c10 = keyOri[10].charCodeAt(),    //112
            c10t = keyOri[11].charCodeAt(),   //54
            c14 = keyOri[15].charCodeAt(),    //114
            c14t = keyOri[16].charCodeAt(),   //54
            c15 = keyOri[17].charCodeAt(),    //121
            c15t = keyOri[18].charCodeAt();   //51
        let c9r = c9 - a_CODE + (parseInt(String.fromCharCode(c9t), 10) + 1) * 26 - a_CODE;//49
        let c10r = c10 - a_CODE + (parseInt(String.fromCharCode(c10t), 10) + 1) * 26 - a_CODE;//100
        let c14r = c14 - a_CODE + (parseInt(String.fromCharCode(c14t), 10) + 1) * 26 - a_CODE;//102
        let c15r = c15 - a_CODE + (parseInt(String.fromCharCode(c15t), 10) + 2) * 26 - a_CODE;//57

        keyRelAry = [keyOri[0].charCodeAt(), keyOri[1].charCodeAt(), keyOri[2].charCodeAt(), keyOri[3].charCodeAt(), keyOri[4].charCodeAt(), keyOri[5].charCodeAt(), keyOri[6].charCodeAt(), keyOri[7].charCodeAt(), c9r, c10r, keyOri[12].charCodeAt(), keyOri[13].charCodeAt(), keyOri[14].charCodeAt(), c14r, c15r, keyOri[19].charCodeAt()]
    } else if (algorithmNum === 1) {
        keyRelAry = sortDvByOrder('0-1-2-3-4-5-6-7-18-16-15-13-12-11-10-8');
    } else if (algorithmNum === 0) {
        keyRelAry = sortDvByOrder('0-1-2-3-4-5-6-7-8-10-11-12-14-15-16-18');
    } else {
        return;
    }
    console.log("🚀 keyRelAry: ", keyRelAry);

    return keyRelAry;
}

let genKey = (keyAry) => {
    let buf = new Buffer.from(keyAry);

    // let url = pathLib.resolve(__dirname, "m3u8", "key.txt");
    let url = pathLib.join(cwdPath, "m3u8", "key.txt");
    return writeFile(url, buf).then(() => {
        console.log("🚀 key.txt generator finish!");
    }).catch(err => {
        console.log("error: " + err);
    });
}


module.exports = {
    genKeyAry,
    genKey
}


