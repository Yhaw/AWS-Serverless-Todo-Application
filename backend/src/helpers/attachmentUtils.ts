/* import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic */
import * as AWS from 'aws-sdk'
import * as dotenv from 'dotenv';

dotenv.config();
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.s3({
     
    signatureVersion: 'v4'
})

const bucketname = process.env.ATTACHMENT_S3_BUCKET

export function getUploadUrl(imageid: string){
    return s3.getSignedUrl('putObject',
    {
        Bucket: bucketname,
        Key: imageid,
        Expires: 300
    }
    )
}