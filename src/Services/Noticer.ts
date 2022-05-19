import FootballAPI from '../APIClient/FootballAPI.js';
import {KUBO} from '../config/players.js';
import LineAPI from '../APIClient/LineAPI.js';
import DynamoDBAPI from '../APIClient/DynamoDBAPI.js';
import dayjs from 'dayjs';
import 'dayjs/locale/ja.js';

const MATCH_IS_NOT = 0;      // その日は試合なし
const MATCH_NOT_STARTED = 1; // まだ通知していない
const MATCH_BENCH = 2;       // substsを使う
const MATCH_NOTICED = 3;     // 通知済

class Noticer {
  private FootballAPI;
  private LineAPI;
  private DynamoDB;

  constructor() {
    this.FootballAPI = FootballAPI;
    this.LineAPI = LineAPI;
    this.DynamoDB = DynamoDBAPI;
    dayjs.locale('ja');
  }

  async run () {
    const player = await this.DynamoDB.find(KUBO.dynamo_id);

    // 試合が終わった場合（fixture_date+120分くらいの場合はstatusを変更）
    if (dayjs().isAfter(player.fixture_date.add(2, 'h'))) {
      player.status = MATCH_IS_NOT;
      this.DynamoDB.update(player);
      return;
    }

    // 試合なし、通知ずみの場合はreturn
    if (player.status === MATCH_IS_NOT || player.status === MATCH_NOTICED) {
      return;
    }

    // 試合開始済みの場合はスタメンかどうか確認
    if (player.status === MATCH_NOT_STARTED && dayjs().isAfter(player.fixture_date)) {
      if (await this.isStart(player.fixture_id)) {
        const text = "Hola!\n久保建英が先発だよ、見てね！";
        await this.LineAPI.postMessage(text);
        player.status = MATCH_NOTICED;

      } else {
        // スタメンにいない場合はstatusをベンチに変更
        player.status = MATCH_BENCH;
      }
      this.DynamoDB.update(player);
      return;
    }

    if (await this.isSubst(player.fixture_id)) {
      const text = "Hola!\n久保建英が途中出場だよ、応援よろしく！";
      await this.LineAPI.postMessage(text);
      player.status = MATCH_NOTICED;
      this.DynamoDB.update(player);
    }
  }

  async isStart (fixture_id: number) {
    const lineup = await this.FootballAPI.getLineUp(fixture_id, KUBO.team_id, KUBO.player_id);

    if (!lineup || !lineup[0].startXI) {
      return false;
    }

    return lineup[0].startXI[0].player.id === KUBO.player_id;
  }

  async isSubst (fixture_id: number) {
    const substs = await this.FootballAPI.getSubstEvents(fixture_id, KUBO.team_id);

    return substs.some((val: any) => val.assist.id === KUBO.player_id);
  }
}

export default new Noticer();
