import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import Player, {playerRecordType} from '../Model/Player.js';

class DynamoDBAPI {
  private ddbClient;
  private readonly table_name: string;

  constructor() {
    const region = 'ap-northeast-1';
    this.ddbClient = new DynamoDBClient({region});
    this.table_name = "player";
  }

  async create (player_id: number, date: string, status: number, fixture_id: number) {
    const Item: playerRecordType = {
      player_id: { N: String(player_id) },
      status: { N: String(status) },
      date: { S: date },
      fixture_id: { N: String(fixture_id) }
    };
    const params = {
      TableName: this.table_name,
      Item,
    };

    try {
      return await this.ddbClient.send(new PutItemCommand(params));
    } catch (err) {
      console.log(err);
    }
  }

  async find (player_id: string) {
    const params = {
      TableName: this.table_name,
      Key: {
        player_id: { N: player_id },
      },
    };

    const data: any = await this.ddbClient.send(new GetItemCommand(params));
    return new Player(data.Item);
  }

  update (player: Player) {
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
