const Wechat = require('./wechat/wechat');
const config = require('./config');

const wechatApi = new Wechat(config.wechat);


exports.reply = async (body, message, next)=>{

  if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){

      if(message.EventKey){
        body.content = `您扫二维码进来的：${message.EventKey} ${message.ticket}`;
      }
      body.content  = `您订阅了公众号`;
    }
    else if(message.Event === 'unsubscribe'){
        body.content = `无情取关`;
    }
    else if(message.Event === 'LOCATION'){
      body.content = `你上报的位置是：${message.Latitude}/${message.Longitude}-${message.Precision}`
    }
    else if(message.Event === 'CLCIK'){
      body.content = `您点击了菜单的：${message,EventKey}`;
    }
    else if(message.Event === 'SCAN'){
      body.content = `看到你扫了一下哦`;
    }
    else if(message.Event === 'VIEW'){
      body.content = `您点击了菜单中的链接：${message.EventKey}`;
    }
  }
  else if(message.MsgType === 'text'){
    var content = message.Content;
    var reply = `你说的：${content}太复杂了`;

    if(content === '1'){
      reply = `你输入了${content}`
    }
    else if(content === '2'){
      reply = `你输入了${content}`
    }
    else if(content === '3'){
      reply = `你输入了${content}`
    }
    else if(content === '4'){
      reply = [{
        title: '技术改变节世界',
        description: '只是个描述而已',
        picUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533019133638&di=f3220ebd48fb79456edd0e6cb1d2bddc&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fa5c27d1ed21b0ef4d40b5485d1c451da80cb3e0e.jpg',
        url: 'https://baidu.com/',
      },{
        title: '技术改变节世界',
        description: '只是个描述而已',
        picUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533019133638&di=f3220ebd48fb79456edd0e6cb1d2bddc&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fa5c27d1ed21b0ef4d40b5485d1c451da80cb3e0e.jpg',
        url: 'https://nodejs.org/',
      }]
    }
    else if(content === '5'){
      let data = await wechatApi.uploadMaterial('image', __dirname + '/2.jpeg');

      reply = {
        type : 'image',
        mediaId : data.media_id
      }
    }
    else if(content === '6'){
      let data = await wechatApi.uploadMaterial('video', __dirname + '/movie.mp4');

      reply = {
        type : 'video',
        title:'回复视频内容',
        description:'发个视频玩玩',
        mediaId : data.media_id
      }
    }
    else if(content === '7'){
      let data = await wechatApi.uploadMaterial('image', __dirname + '/2.jpeg');

      reply = {
        type : 'music',
        title:'回复音乐内容',
        description:'放松一下',
        musicUrl:'http://www.ytmp3.cn/down/50387.mp3',
        thumbMediaId:data.media_id
      }
    }
    body.content = reply;
  }

  await next;

}
