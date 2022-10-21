import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
//import AWSXRay from "aws-xray-sdk-core";
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'

// import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk')
 const XIAWS = AWSXRay.captureAWS(AWS)
  
// const logger = createLogger('TodosAccess')

// // TODO: Implement the dataLayer logic 

 import { TodoItem } from '../models/TodoItem'

const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX

const docClient: DocumentClient = createDynamoDBClient()
 
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await  docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo
  }

  /*export async function ghetAllTodosByUserId(userId: string): Promise<TodoItem> {
    const result = await docClient.query({
      TableName : todosTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId' : userId
      },
      ExpressionAttributeValues:{
        ':userId' : userId
      }
    }).promise()
    
    const items = result.Items
  
    return items as TodoItem[]
  }*/
  
 

  export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
 
    const result = await docClient
        .query({
            TableName: todosTable,
            KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues:{
              ':userId' : userId
          }
        })
        .promise();

        const items = result.Items
  
        return items as TodoItem[]
}







export async function getTodoById(todoId: string): Promise<TodoItem> {
 
  const result = await docClient
      .query({
          TableName: todosTable,
          IndexName: index,
          KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues:{
            ':todoId' : todoId
        }
      })
      .promise();

      const items = result.Items
      if (items.length !== 0){
        return result.Items[0] as TodoItem
      } 
 }

 export async function UpdateTodo(todo: TodoItem): Promise<TodoItem> {
 
  const result = await docClient
      .update({
          TableName: todosTable,
          Key:{
            userId : todo.userId,
            todo : todo.todoId
          },
           UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues:{
            ':attachmentUrl' : todo.attachmentUrl
        }
      })
      .promise();

     return result.Attributes as TodoItem
 }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XIAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XIAWS.DynamoDB.DocumentClient()
  }
  