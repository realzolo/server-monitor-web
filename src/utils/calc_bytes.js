// 字节计算
export function bytesToSize(bytes, precision, si) {
    let ret, megabyte, gigabyte, terabyte;
    si = typeof si !== "undefined" ? si : 0;
    if (si !== 0) {
        megabyte = 1000 * 1000;
        gigabyte = megabyte * 1000;
        terabyte = gigabyte * 1000;
    } else {
        megabyte = 1024 * 1024;
        gigabyte = megabyte * 1024;
        terabyte = gigabyte * 1024;
    }

    if ((bytes >= megabyte) && (bytes < gigabyte)) {
        ret = (bytes / megabyte).toFixed(precision) + " M";
    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        ret = (bytes / gigabyte).toFixed(precision) + " G";
    } else if (bytes >= terabyte) {
        ret = (bytes / terabyte).toFixed(precision) + " T";
    } else {
        return bytes + " B";
    }
    return ret + "B";
}