const APPID = "wx25406e152b09ab3d"  // 本小程序的appid
let ENV_DEV = "dev"
let ENV_IDC = "idc"

let PROTOCOL = "https:"
let DEV_HOST = "dev.xinhulu.com"
let IDC_HOST = "www.xiaoyusan.com"
let DEV_CDN = PROTOCOL+"//"+DEV_HOST+"/static/"
let IDC_CDN = PROTOCOL+"//sslstatic.xiaoyusan.com/"

let ENV = ENV_IDC
let HOST = ENV === ENV_IDC ? IDC_HOST : DEV_HOST
let CDN = ENV === ENV_IDC ? IDC_CDN : DEV_CDN

let MODE = ENV === ENV_IDC ? 'trial' : 'develop';

export {
    PROTOCOL as protocol, 
    HOST as host,
    CDN as cdn,
    MODE as mode,
    APPID as appId
}