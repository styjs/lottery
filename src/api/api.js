import {wxRequest} from '@/utils/wxRequest';

// let env = "-test" //-dev 或者 -test
const apiMail = 'https://www.xiaoyusan.com'

/**
 * 获取后台接口
 * @param {[type]} params [description]
 * @return {[type]}       [description]
 */

//微信的jscode换取sessionKey
const wxJsCode2Session = (params) => wxRequest(params, apiMall + "/user/loginV24WeApp");
// const user2session = (params) => wxRequest(params, apiMall + "/user/loginV24WeApp");

//获得某个活动的基本配置(活动名称、简介、规则文本、奖品列表)
const activityInfo = (params) => wxRequest(params, apiMail + '/PrizeDraw/activityInfo');
//查用户的可抽奖资格次数
const userQualificationso = (params) => wxRequest(params, apiMail + '/PrizeDraw/userQualificationso');
//查询抽奖活动最新流水和参与用户数
const newAndTotal = (params) => wxRequest(params, apiMail + '/PrizeDraw/newAndTotal');
//抽奖（返回中奖结果）
const draw = (params) => wxRequest(params, apiMail + '/PrizeDraw/draw');
//查询用户已中奖的记录列表
const userPrize = (params) => wxRequest(params, apiMail + '/PrizeDraw/userPrize');
//实物奖品提交联系信息兑奖
const contact = (params) => wxRequest(params, apiMail + '/PrizeDraw/contact');

export default {
    wxJsCode2Session,
    // user2session,
    activityInfo,
    userQualificationso,
    newAndTotal,
    draw,
    userPrize,
    contact
}