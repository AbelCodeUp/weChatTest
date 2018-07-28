const sha1 = require('sha1');
const Wechat = require('./wechat');
const getRawBody = require('raw-body');
const util = require('./util');

module.exports = function(opts) {
  var wechat = new Wechat(opts);
  return async ( ctx, next ) => {
    var token = opts.token;
    var signature = ctx.query.signature;
    var nonce = ctx.query.nonce;
    var timestamp = ctx.query.timestamp;
    var echostr = ctx.query.echostr;
    var str = [token, timestamp, nonce].sort().join('');
    var sha = sha1(str);
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr + '';
      } else {
        ctx.body = 'wrong';
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        ctx.body = 'wrong';
        return false;
      }

      var data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charest
      })

      var content = await util.parseXMLAsync(data);
      var message = util.formatMessage(content.xml);
      console.log(message);

      var now = new Date().getTime();
      if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
          var xmlString = 'success';
          // var xmlString = ;
          // console.log(xmlString);
          ctx.type = 'application/xml';
          ctx.body = xmlString
          return;
        }
      }else{
        var xmlString = 'success';
        // console.log(xmlString);
        ctx.type = 'application/xml';
        ctx.body = xmlString
        return;
      }

    }

  }
};
