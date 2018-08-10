
const Promise = require('bluebird');
const util = require('./util');
const fs = require('fs');
var request = Promise.promisify(require('request'));

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
  accessToken: prefix + 'token?grant_type=client_credential',
  upload: prefix + 'media/upload?',
}

class Wechat {
  constructor(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();

  }

  fetchAccessToken(){
    if(this.access_token && this.expires_in){
      if(this.isValidAccessToken(this)){
        return Promise.resolve(this);
      }
    }
    this.getAccessToken()
      .then(data=>{
         try {
           data = JSON.parse(data);
         }
         catch(e){
            return this.updateAccessToken();
         }

         if(this.isValidAccessToken(data)){
           // Promise.resolve(data);
           return Promise.resolve(data);
         }
         else{
           return this.updateAccessToken();
         }
      })
      .then(data=>{
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;


        this.saveAccessToken(data);
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

  uploadMaterial(type, filepath){
    let form = {
      media:fs.createReadStream(filepath)
    };

    return new Promise((resolve, reject)=>{
      this
        .fetchAccessToken()
        .then(data=>{
          var url = `${api.upload}&access_token=${data.access_token}&type=${type}`;
          request({
            method: 'POST',
            url:url,
            formData:form,
            json:true
          }).then(res=>{
            let _data = res.body
            if(_data){
              resolve(_data);
            }else{
              throw new Error('upload material fails');
            }

          })
          .catch(err=>{
            reject(err);
          })
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
