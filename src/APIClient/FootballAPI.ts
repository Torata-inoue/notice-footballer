import axios from 'axios';
import {FOOTBALL_API_KEY} from '../config/api-keys.js';

class FootballAPI {
  private readonly BASE_URL: string;
  private readonly API_KEY: string;

  constructor() {
    this.BASE_URL = 'https://v3.football.api-sports.io';
    this.API_KEY = FOOTBALL_API_KEY;
  }

  /**
   * @param method
   * @param url
   * @param params
   * @param headers
   * @returns {AxiosPromise}
   */
  sendRequest(method: string, url: string, params: {}, headers = {}) {
    const cloneHeaders = {
      ...headers,
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': this.API_KEY
    }

    return axios({
      method,
      url: `${this.BASE_URL}/${url}`,
      params,
      headers: cloneHeaders,
    });
  }

  /**
   * @param fixture
   * @param team
   * @param player
   * @returns {Promise<any>}
   */
  async getLineUp(fixture: number, team: number, player: number) {
    if (!fixture) {
      throw new Error('fixtureは必須パラメータです');
    }

    const params : {
      fixture: number,
      team: number,
      player: number
    } = {fixture, team, player};
    const request = await this.sendRequest('GET', 'fixtures/lineups', params);

    if (request.status !== 200) {
      throw new Error('FootballAPIの通信に失敗しました。method: getLineUps');
    }

    return request.data.response;
  }

  /**
   * @param fixture
   * @param team
   * @returns {Promise<any>}
   */
  async getSubstEvents (fixture: number, team: number) {
    if (!fixture) {
      throw new Error('fixtureは必須項目です');
    }
    const type: string = 'subst';
    const params: {
      fixture: number,
      team: number,
      type: string
    } = {fixture, team, type};
    const request = await this.sendRequest('GET', 'fixtures/events', params);

    if (request.status !== 200) {
      throw new Error('FootballAPIの通信に失敗しました。method: getSubsEvents');
    }

    return request.data.response;
  }

  async getNSFixtures (season: number, team: number, date: string) {
    const params: {
      season: number,
      team: number,
      date: string,
      timezone: string
    } = {
      season,
      team,
      date,
      timezone: 'Asia/Tokyo'
    };
    const request = await this.sendRequest('GET', 'fixtures', params);

    if (request.status !== 200) {
      throw new Error('FootballAPIの通信に失敗しました。method: getNSFixtures');
    }

    return request.data.response;
  }
}

export default new FootballAPI();
