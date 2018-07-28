'use strict'

const Koa = require('koa');
const sha1 = require('sha1');
const wechat = require('./wechat/g');
const util = require('./libs/until');
const path = require('path');
var wechat_file = path.join(__dirname, './config/wechat.txt');

let config = {
  wechat:{
    appID:'wx0df753849c2f6a0e',
    appSecret:'9102d551a7aa9ef3da02ad4c31d38034',
    token:'bianxiaokai',
    getAccessToken:function(){
      return util.readFileAsync(wechat_file);
    },
    saveAccessToken:function(data){
      data = JSON.stringify(data);
      return util.writeFileAsync(wechat_file,data);
    }
  }
}

let app = new Koa();
app.use(wechat(config.wechat))

app.listen(1234);
console.log('Listening: 1234');
