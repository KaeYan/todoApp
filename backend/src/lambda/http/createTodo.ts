import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
// import * as uuid from 'uuid'
// import * as AWS from 'aws-sdk'
// const docClient = new AWS.DynamoDB.DocumentClient()
// const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing createTodo')
  const newTodoReq: CreateTodoRequest = JSON.parse(event.body)
  const item = await createTodo(newTodoReq, getUserId(event))
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
  // const todoId = uuid.v4()
  // const newItem = {
  //   todoId: todoId,
  //   ...newTodo
  // }

  // await docClient.put({
  //   TableName: todoTable,
  //   Item: newItem
  // }).promise() 
}
