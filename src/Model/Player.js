import dayjs from 'dayjs';
import 'dayjs/locale/ja.js';

class Player {
  constructor({status, date, player_id, fixture_id}) {
    dayjs.locale('ja');
    this.status = parseInt(status.N);
    this.fixture_date = dayjs(date.S);
    this.player_id = parseInt(player_id.N);
    this.fixture_id = parseInt(fixture_id.N);
  }

  getFixtureDate (format = 'YYYY-MM-DDTHH:mm:ss[Z]') {
    return this.fixture_date.format(format);
  }

  getExpressionAttributeValues (status_key, date_key, fixture_id_key) {
    return {
      [status_key]: { N: String(this.status) },
      [date_key]: { S: this.getFixtureDate() },
      [fixture_id_key]: { N: String(this.fixture_id) }
    }
  }
}

export default Player;
