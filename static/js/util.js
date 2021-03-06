window.isEmpty = obj => {
    return obj === null || obj === undefined || obj === '';
};

window.isArrEmpty = arr => {
    return !isEmpty(arr) && arr.length === 0;
};

window.clone = function(obj) {
    let newObj = obj instanceof Array ? [] : {};
    for (let prop in obj) {
        newObj[prop] = obj[prop];
    }
    return newObj;
};

window.deepClone = function(obj) {
    let newObj = obj instanceof Array ? [] : {};
    for (let prop in obj) {
        let value = obj[prop];
        newObj[prop] = typeof value === 'object' ? deepClone(value) : value;
    }
    return newObj;
};

window.execute = (func, ... args) => {
    if (func !== undefined && typeof func === 'function') {
        switch(args.length) {
            case 0: func(); break;
            case 1: func(args[0]); break;
            case 2: func(args[0], args[1]); break;
            case 3: func(args[0], args[1], args[2]); break;
            case 4: func(args[0], args[1], args[2], args[3]); break;
            default: func(args); break;
        }
    }
};

let ONE_KB = 1024;
let ONE_MB = ONE_KB * 1024;
let ONE_GB = ONE_MB * 1024;
let ONE_TB = ONE_GB * 1024;
let ONE_PB = ONE_TB * 1024;

window.sizeFormat = size => {
    if (size < ONE_KB) {
        return size.toFixed(0) + " B";
    } else if (size < ONE_MB) {
        return (size / ONE_KB).toFixed(2) + " KB";
    } else if (size < ONE_GB) {
        return (size / ONE_MB).toFixed(2) + " MB";
    } else if (size < ONE_TB) {
        return (size / ONE_GB).toFixed(2) + " GB";
    } else if (size < ONE_PB) {
        return (size / ONE_TB).toFixed(2) + " TB";
    } else {
        return (size / ONE_PB).toFixed(2) + " PB";
    }
};

let seq = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
];

window.randomIntRange = (min, max) => {
    return parseInt(Math.random() * (max - min) + min, 10);
};

window.randomInt = n => {
    return randomIntRange(0, n);
};

window.randomSeq = count => {
    let str = '';
    for (let i = 0; i < count; ++i) {
        str += seq[randomInt(62)];
    }
    return str;
};

window.randomLowerAndNum = count => {
    let str = '';
    for (let i = 0; i < count; ++i) {
        str += seq[randomInt(36)];
    }
    return str;
};

window.randomMTSecret = () => {
    let str = '';
    for (let i = 0; i < 32; ++i) {
        let index = randomInt(16);
        if (index <= 9) {
            str += index;
        } else {
            str += seq[index - 10];
        }
    }
    return str;
};

window.randomUUID = () => {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

window.propIgnoreCase = (obj, prop) => {
    for (let name in obj) {
        if (name.toLowerCase() === prop.toLowerCase()) {
            return obj[name];
        }
    }
    return undefined;
};

window.base64 = str => {
    return Base64.encode(str);
};

window.safeBase64 = str => {
    return base64(str)
        .replace(/\+/g, '-')
        .replace(/=/g, '')
        .replace(/\//g, '_');
};

window.docCookies = {
    getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        let sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        let aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

window.deepSearch = (obj, key) => {
    if (obj instanceof Array) {
        for (let i = 0; i < obj.length; ++i) {
            if (deepSearch(obj[i], key)) {
                return true;
            }
        }
    } else if (obj instanceof Object) {
        for (let name in obj) {
            if (deepSearch(obj[name], key)) {
                return true;
            }
        }
    } else {
        return obj.toString().indexOf(key) >= 0;
    }
    return false;
};

window.getDate = (datetime=Date.now()) => {
    let date = new Date(datetime);
    let year = date.getFullYear();
    let month = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    let day =date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    return  year + '-' + month + '-' + day;
};

window.getDateFromStr = (str) => {
    let date_arr = str.split('-');
    let date = new Date();
    date.setFullYear(Number(date_arr[0]));
    date.setMonth(Number(date_arr[1]) - 1);
    date.setDate(Number(date_arr[2]));
    return date;
};

window.genVmessLink = (server, inbound, customer) => {
    inbound = Inbound.fromJson(inbound)
    let network = inbound.stream.network;
    let type = 'none';
    let host = '';
    let path = '';
    if (network === 'tcp') {
        let tcp = inbound.stream.tcp;
        type = tcp.type;
        if (type === 'http') {
            let request = tcp.request;
            path = request.path.join(',');
            let index = request.headers.findIndex(header => header.name.toLowerCase() === 'host');
            if (index >= 0) {
                host = request.headers[index].value;
            }
        }
    } else if (network === 'kcp') {
        let kcp = inbound.stream.kcp;
        type = kcp.type;
    } else if (network === 'ws') {
        let ws = inbound.stream.ws;
        path = ws.path;
        let index = ws.headers.findIndex(header => header.name.toLowerCase() === 'host');
        if (index >= 0) {
            host = ws.headers[index].value;
        }
    } else if (network === 'http') {
        network = 'h2';
        path = inbound.stream.http.path;
        host = inbound.stream.http.host.join(',');
    } else if (network === 'quic') {
        type = inbound.stream.quic.type;
        host = inbound.stream.quic.security;
        path = inbound.stream.quic.key;
    }
    let obj = {
        v: '2',
        ps: server.remark + '-' + inbound.port,
        add: server.address,
        port: inbound.port,
        id: customer.uuid,
        aid: customer.alterId,
        net: network,
        type: type,
        host: host,
        path: path,
        tls: inbound.stream.security,
    };
    return 'vmess://' + Inbound.base64(JSON.stringify(obj, null, 2));
}
