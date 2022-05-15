import FootballAPI from '../APIClient/FootballAPI.js';
import {KUBO} from '../config/players.js';
import LineAPI from '../APIClient/LineAPI.js';
import DynamoDBAPI from '../APIClient/DynamoDBAPI.js';
import dayjs from 'dayjs';

const MATCH_IS_NOT = '0';      // その日は試合なし
const MATCH_NOT_STARTED = '1'; // まだ通知していない
const MATCH_BENCH = '2';       // substsを使う
const MATCH_NOTICED = '3';     // 通知済

class Noticer {
  constructor() {
    this.FootballAPI = FootballAPI;
    this.LineAPI = LineAPI;
    this.DynamoDB = DynamoDBAPI;
  }

  async run () {
    const response = await this.DynamoDB.find(KUBO.dynamo_id);
    const fixture = response.Item;
    const status = fixture.status.N;
    const fixture_date = dayjs(fixture.date.S);
    // const fixture_date = dayjs('2022-05-15T02:30:00+09:00');
    const player_id = fixture.player_id.N;
    const fixture_id = fixture.fixture_id.N;

    // 試合なし、通知ずみの場合はreturn
    if (status === MATCH_IS_NOT || status === MATCH_NOTICED) {
      return;
    }

    // 試合開始済みの場合はスタメンかどうか確認
    if (status === MATCH_NOT_STARTED && dayjs().isAfter(fixture_date)) {
      if (await this.isStart()) {
      // if (true) {
        const text = "Hola!\n久保建英が先発だよ、見てね！";
        this.LineAPI.postMessage(text)
        this.DynamoDB.update(player_id, MATCH_NOTICED, fixture_date.format(), fixture_id);
        return;
      }
      // スタメンにいない場合はstatusをベンチに変更
      this.DynamoDB.update(player_id, MATCH_BENCH, fixture_date.format(), fixture_id);
      return;
    }

    if (await this.isSubst()) {
    // if (true) {
      const text = "Hola!\n久保建英が途中出場だよ、応援よろしく！";
      this.LineAPI.postMessage(text);
      this.DynamoDB.update(player_id, MATCH_NOTICED, fixture_date.format(), fixture_id);
    }
  }

  async isStart () {
    const lineup = await this.FootballAPI.getLineUp({
      fixture: '721095',
      team: KUBO.team_id,
      player: KUBO.player_id
    });
    if (!lineup) {
      return false;
    }

    return lineup[0].startXI[0].player.id === KUBO.player_id;
  }

  async isSubst () {
    const substs = await this.FootballAPI.getSubstEvents({
      fixture: '721095',
      team: KUBO.team_id
    });

    return substs.some(val => val.assist.id === KUBO.player_id);
  }
}

export default new Noticer();
