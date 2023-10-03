/**
 * @method 获取客户端IP地址
 * @param {string} req 传入请求HttpRequest
 * 客户请求的IP地址存在于request对象当中
 * express框架可以直接通过 req.ip 获取
 */
function getClientIp(req) {
    try {
        return req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            '';
    } catch (e) {
        return '';
    }
}

// IPV4转IPV6
function ipv6ToV4(ip) {
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
    return ip
}

function getArea(ip) {
    try {
        const IP2Region = require('ip2region').default;
        // 创建一个IP2Region实例
        const query = new IP2Region();
        const ipAddress = query.search(ip);
        let str=''
        if(ipAddress.country!=''){
            str=str+ipAddress.country+'-'
        }
        if(ipAddress.province!=''){
            str=str+ipAddress.province+'-'
        }
        if(ipAddress.city!=''){
            str=str+ipAddress.city+'-'
        }
        if(ipAddress.isp!=''){
            str=str+ipAddress.isp
        }
        return str
    } catch (e) {
        return { country: '', province: '', city: '', isp: '' };
    }
}

module.exports = {
    getClientIp,
    ipv6ToV4,
    getArea
}