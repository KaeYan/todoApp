import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
// import * as AWS from 'aws-sdk'
// const docClient = new AWS.DynamoDB.DocumentClient()
// const todoTable = process.env.TODOS_TABLE
// const bucketName = process.env.TODOS_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// const s3 = new AWS.S3({
//   signatureVersion: 'v4'
// }) 

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const uploadurl = await generateUploadUrl(todoId, userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: uploadurl
    })
  }
  // const uploadurl = s3.getSignedUrl('putObject', {
  //   Bucket: bucketName,
  //   Key: todoId,
  //   Expires: urlExpiration
  // })

  // await docClient.update({
  //   TableName: todoTable,
  //   Key: {
  //     todoId: todoId
  //   },
  //   UpdateExpression: "set attachmentUrl=:au",
  //   ExpressionAttributeValues: {
  //     ":au": `https://${bucketName}.s3.amazonaws.com/${todoId}`
  //   },
  // }).promise() 
}
