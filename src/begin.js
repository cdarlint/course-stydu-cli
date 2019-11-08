// create.js
const { formatM3u8, genM3u8 } = require("./1_m3u8_format");
const { genKeyAry, genKey } = require("./2_key_gen");
const { downFile } = require("./3_down_ts")

module.exports = () => {
    genM3u8(formatM3u8())
        .then(() => {
            return genKey(genKeyAry())
        })
        .then(() => {
            downFile()
        });
}


