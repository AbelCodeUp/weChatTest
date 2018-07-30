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
  await next;

}
