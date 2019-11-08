+ course-cli create <projectName>
+ cd projectName
+ write 0_info.js and index.m3u8
+ course-cli begin

+ `cd m3u8 && ffmpeg -allowed_extensions ALL -protocol_whitelist "tls,file,https,http,crypto,tcp" -i "index.m3u8" -c copy ../projectName.mp4`，