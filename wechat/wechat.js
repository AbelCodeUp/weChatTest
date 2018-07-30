
const Promise = require('bluebird');
const util = require('./util');
var request = Promise.promisify(require('request'));

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
  accessToken: prefix + 'token?grant_type=client_credential'
}

class Wechat {
  constructor(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.getAccessToken()
      .then(data=>{
         try {
           data = JSON.parse(data);
         }
         catch(e){
            return this.updateAccessToken(data);
         }
         if(this.isValidAccessToken(data)){
           // Promise.resolve(data);

           this.access_token = data.access_token;
           this.expires_in = data.expires_in;

           this.saveAccessToken(data);
         }
         else{
           return this.updateAccessToken(data);
         }
      })
  }
  isValidAccessToken (data){
    if( !data || !data.access_token || !data.expires_in ){
      return false;
    }

    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());

    if( now < expires_in ){
      return true;
    }else{
      return false;
    }
  }
  updateAccessToken(data){
    var appID = this.appID;
    var appSecret = this.appSecret;

    var url = api.accessToken + '&appid='+ appID +'&secret=' + appSecret;

    return new Promise((resolve, reject)=>{
      request({
        url:url,
        json:true
      }).then(res=>{
        let data = res.body
        var now = (new Date().getTime());
        var expires_in = now + (data.expires_in - 10) * 1000;

        data.expires_in = expires_in;

        resolve(data);

      })
    })
  }

  reply(Body,ctx,message){
    let msg = message;
    let content = Body;

    let xml = util.tpl(content, msg);

    console.log(xml);

    ctx.status = 200;
    ctx.type = 'application/xml';
    ctx.body = xml;

  }

}
module.exports = Wechat;
