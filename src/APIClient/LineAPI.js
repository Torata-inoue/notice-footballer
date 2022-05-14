import * as line from '@line/bot-sdk';
import {LINE_ACCESS_TOKEN, LINE_CHANNEL_SECRET} from '../config/api-key.js';

class LineAPI {
  constructor() {
    const config = {
      channelAccessToken: LINE_ACCESS_TOKEN,
      // channelSecret: LINE_CHANNEL_SECRET
    };
    this.client = new line.Client(config);
  }

  postMessage (text) {
    this.client.broadcast({
      type: "text",
      text
    }).then(this.successHandler)
    .catch(e => console.log(e))
  }

  successHandler () {

  }
}

export default new LineAPI();
