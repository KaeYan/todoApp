import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
// import * as AWS from 'aws-sdk'
// const docClient = new AWS.DynamoDB.DocumentClient()
// const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  await deleteTodo(todoId, userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
  // await docClient.delete({
  //   TableName: todoTable,
  //   Key: {
  //     todoId: todoId
  //   }
  // }).promise()
  
}
