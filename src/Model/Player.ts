import dayjs from 'dayjs';
import 'dayjs/locale/ja.js';

export type playerRecordType = {
  status: {N: string},
  date: {S: string},
  player_id: {N: string},
  fixture_id: {N: string}
}

class Player {

  public status: number;
  public fixture_date: dayjs.Dayjs;
  public player_id: number;
  public fixture_id: number;

  constructor({status, date, player_id, fixture_id}: playerRecordType) {
    dayjs.locale('ja');
    this.status = parseInt(status.N);
    this.fixture_date = dayjs(date.S);
    this.player_id = parseInt(player_id.N);
    this.fixture_id = parseInt(fixture_id.N);
  }

  getFixtureDate (format: string = 'YYYY-MM-DDTHH:mm:ss[Z]') {
    return this.fixture_date.format(format);
  }

  getExpressionAttributeValues (status_key: string, date_key: string, fixture_id_key: string) {
    return {
      [status_key]: { N: String(this.status) },
      [date_key]: { S: this.getFixtureDate() },
      [fixture_id_key]: { N: String(this.fixture_id) }
    }
  }
}

export default Player;
