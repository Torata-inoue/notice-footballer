import FootballAPI from '../APIClient/FootballAPI.js';
import {KUBO} from '../config/players.js';
import dayjs from 'dayjs';

class Noticer {
  constructor() {
    this.FootballAPI = FootballAPI;
  }

  notice () {
    console.log(dayjs('2022-05-15').format('YYYY-MM-DD'));
  }

  async isStart () {
    const lineup = await this.FootballAPI.getLineUp({
      fixture: '721083',
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
