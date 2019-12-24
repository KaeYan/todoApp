import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
// import * as AWS from 'aws-sdk'
// const docClient = new AWS.DynamoDB.DocumentClient()
// const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  await updateTodo(updatedTodo, todoId, userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
  // await docClient.update({
  //   TableName: todoTable,
  //   Key: {
  //     todoId: todoId
  //   },
  //   UpdateExpression: "set dueDate=:dd, done=:d, #namee=:n",
  //   ExpressionAttributeValues: {
  //     ":dd": updatedTodo.dueDate,
  //     ":d": updatedTodo.done,
  //     ":n": updatedTodo.name,
  //   },
  //   ExpressionAttributeNames: {
  //     "#namee": "name"
  //   },
  // }).promise() 
}