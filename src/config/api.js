const isPro = Object.is(process.env.NODE_ENV, 'production'); // 生产环境
let API = "/webapi";
let FILE = "/apis";
let WXIMG = "/wximg"; // 代理微信图像
let wxoauth_origin = '';

switch(location.host){
    case "xxx":
        wxoauth_origin = 'xxx';
        break;
    case "xxx":
        wxoauth_origin = 'xxx';
        break;
    default:
        wxoauth_origin = 'xxx'; 
}

const Api = {
    isPro: isPro,
    api: API,
    file: FILE,
    wximg: WXIMG,
    wxoauth: `${wxoauth_origin}/wxoauth/wxoauth`
}
export default Api;