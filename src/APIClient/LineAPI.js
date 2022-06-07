import * as line from '@line/bot-sdk';
import {LINE_ACCESS_TOKEN} from '../config/api-key.js';

class LineAPI {
  constructor() {
    const config = {
      channelAccessToken: LINE_ACCESS_TOKEN,
    };
    this.client = new line.Client(config);
  }

  postMessage (text) {
    return this.client.broadcast({
      type: "text",
      text
    }).then(this.successHandler)
    .catch(e => e.message)
  }

  successHandler (res) {
    return res;
  }
}

export default new LineAPI();
