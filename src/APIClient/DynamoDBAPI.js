import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import Player from '../Model/Player.js';

class DynamoDBAPI {
  constructor() {
    const region = 'ap-northeast-1';
    this.ddbClient = new DynamoDBClient({region});
    this.table_name = "player";
  }

  async create (player_id, date, status, fixture_id) {
    const params = {
      TableName: this.table_name,
      Item: {
        player_id: { N: player_id },
        status: { N: status },
        date: { S: date },
        fixture_id: { N: fixture_id }
      },
    };

    try {
      return await this.ddbClient.send(new PutItemCommand(params));
    } catch (err) {
      console.log(err);
    }
  }

  async find (player_id) {
    const params = {
      TableName: this.table_name,
      Key: {
        player_id: { N: player_id },
      },
    };

    const data = await this.ddbClient.send(new GetItemCommand(params));
    return new Player(data.Item);
  }

  update (player) {
    const params = {
      TableName: this.table_name,
      Key: {
        player_id: {N: String(player.player_id)},
      },
      UpdateExpression: "SET #st = :s, #dt = :d, fixture_id = :f",
      ExpressionAttributeNames: {
        '#st' : 'status',
        '#dt': 'date'
      },
      ExpressionAttributeValues: player.getExpressionAttributeValues(':s', ':d', ':f'),
      ReturnValues: "UPDATED_NEW",
    };

    return this.ddbClient.send(new UpdateItemCommand(params));
  }
}

export default new DynamoDBAPI();
