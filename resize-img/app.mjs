import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { resize } from "./resize.js";

const s3 = new S3Client();

const thumbnailSize = 200;
const destBucket = process.env.DestinationBucket

export const handler = async ({ bucket, key }) => {
  try {
    // get original
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    // resize operations
    const src = Buffer.from(await response.Body.transformToByteArray());
    const resized = await resize(src, thumbnailSize);
    const newKey = `thumb-${key}`;

    // upload to destination
    const putCmd = await s3.send(new PutObjectCommand({
        Bucket: destBucket,
        Key: newKey,
        Body: resized,
        ContentType: response.ContentType
    }));
    return {
      resizedObj: `${destBucket}/${newKey}`
    }
  } catch (caught) {
    return caught;
  }
};
  