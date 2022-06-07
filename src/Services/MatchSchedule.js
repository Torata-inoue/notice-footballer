import FootballAPI from '../APIClient/FootballAPI.js';
import dayjs from 'dayjs';
import {KUBO} from '../config/players.js';

class MatchSchedule {
  constructor() {
    this.FootballAPI = FootballAPI;
  }

  register () {
    this.getSchedules();
  }

  async getSchedules () {
    // const date = dayjs().format('YYYY-MM-DD');
    const date = dayjs('2022-05-16').format('YYYY-MM-DD');
    const params = {
      season: 2021,
      team: KUBO.team_id,
      date
    };
    const schedules = await this.FootballAPI.getNSFixtures(params);
    console.log(schedules);
  };
}

export default new MatchSchedule();
