import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoDbAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly s3 = new AWS.S3({
            signatureVersion: 'v4'
        }),
        private readonly bucketName = process.env.TODOS_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }

    async getAllTodos(): Promise<TodoItem[]> {
        console.log('Getting all todos')

        const result = await this.docClient.scan({
            TableName: this.todosTable
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async updateTodo(todoUpdate: TodoUpdate, todoId: string): Promise<TodoUpdate> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: todoId
            },
            UpdateExpression: "set dueDate=:dd, done=:d, #namee=:n",
            ExpressionAttributeNames: {
                "#namee": "name"
            },
            ExpressionAttributeValues: {
                ":dd": todoUpdate.dueDate,
                ":d": todoUpdate.done,
                ":n": todoUpdate.name,
            },
        }).promise()

        return todoUpdate
    }

    async deleteTodo(todoId: string) {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId: todoId
            }
        }).promise()
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        const uploadurl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: todoId
            },
            UpdateExpression: "set attachmentUrl=:au",
            ExpressionAttributeValues: {
                ":au": `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
            },
        }).promise()

        return uploadurl
    }
}