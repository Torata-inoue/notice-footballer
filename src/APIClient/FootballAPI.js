import axios from 'axios';
import {FOOTBALL_API_KEY} from '../config/api-key.js';

class FootballAPI {
  constructor() {
    this.BASE_URL = 'https://v3.football.api-sports.io';
    this.API_KEY = FOOTBALL_API_KEY;
    this.http = axios;
  }

  /**
   * @param method
   * @param url
   * @param params
   * @param headers
   * @returns {AxiosPromise}
   */
  sendRequest(method, url, params, headers = {}) {
    const cloneHeaders = {
      ...headers,
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': this.API_KEY
    }

    return this.http({
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
  async getLineUp({fixture, team, player}) {
    if (!fixture) {
      throw new Error('fixtureは必須パラメータです');
    }

    const params = {fixture, team, player};
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
  async getSubstEvents ({fixture, team}) {
    if (!fixture) {
      throw new Error('fixtureは必須項目です');
    }
    const type = 'subst';
    const params = {fixture, team, type};
    const request = await this.sendRequest('GET', 'fixtures/events', params);
    
    if (request.status !== 200) {
      throw new Error('FootballAPIの通信に失敗しました。method: getSubsEvents');
    }

    return request.data.response;
  }

  async getNSFixtures ({season, team, date}) {
    const params = {
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
