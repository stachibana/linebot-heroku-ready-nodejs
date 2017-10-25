'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
function handleEvent(event) {

  if (event.type === 'message' || event.message.type === 'text') {
    if(event.message.text === 'こんにちは') {
      client.getProfile(event.source.userId).then((profile) => {
        const array = [{
          type: 'text',
          text: 'こんにちは！' + profile.displayName + 'さん'
        },
        {
          type: 'sticker',
          packageId: '1',
          stickerId: '17'
        }];
        return client.replyMessage(event.replyToken, array);
      });

    } else {
      const array = [{
        type: 'text',
        text: '「こんにちは」と呼びかけて下さいね！'
      },
      {
        type: 'sticker',
        packageId: '1',
        stickerId: '4'
      }];
      return client.replyMessage(event.replyToken, array);
    }
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
