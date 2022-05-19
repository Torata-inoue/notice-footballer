import * as line from '@line/bot-sdk';
import {LINE_ACCESS_TOKEN} from '../config/api-keys.js';
import {Client, ClientConfig, MessageAPIResponseBase} from "@line/bot-sdk";

class LineAPI {
  private client: Client;

  constructor() {
    const config: ClientConfig = {
      channelAccessToken: LINE_ACCESS_TOKEN,
    };
    this.client = new line.Client(config);
  }

  postMessage (text: string) {
    return this.client.broadcast({
      type: "text",
      text
    }).then(this.successHandler)
      .catch(e => e.message)
  }

  successHandler (res: MessageAPIResponseBase) {
    return res;
  }
}

export default new LineAPI();
