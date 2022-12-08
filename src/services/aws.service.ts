import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AWSService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file) {
    const { originalname } = file;
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(originalname),
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-west-2',
      },
    };
    try {
      const s3Response = await this.s3.upload(params).promise();
      console.log(s3Response);
    } catch (e) {
      console.log(e);
    }
  }
}
