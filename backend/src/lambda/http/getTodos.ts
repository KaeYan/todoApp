import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todos'
// import * as AWS from 'aws-sdk'
// const docClient = new AWS.DynamoDB.DocumentClient()
// const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event', event)
  const items = await getAllTodos()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
  // const result = await docClient.scan({
  //   TableName: todoTable
  // }).promise()

  // const items = result.Items 
}
