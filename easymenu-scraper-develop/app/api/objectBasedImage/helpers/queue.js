import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const redisConnection = new Redis({
  host: "redis-15657.c72.eu-west-1-2.ec2.redns.redis-cloud.com",
  port: "15657",
  password: "rVsBrZ8esL9Dh6i4RsXm8WG5qCucE61t",
  maxRetriesPerRequest: null,
});

const imageQueue = new Queue("imageQueue", { connection: redisConnection });

// Initialize OpenAI and R2 client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

// Worker logic to process jobs
new Worker(
  "imageQueue",
  async (job) => {
    try {
      const { name, description } = job.data;
      if (!name || !description) {
        throw new Error(`Invalid job data: name or description is missing`);
      }

      const prompt = `Generate an image for ${name}: ${description}`;
      const aiResponse = await openai.images.generate({
        prompt,
        n: 1,
        size: "256x256",
        response_format: "b64_json",
      });

      const imageBase64 = aiResponse.data[0].b64_json;
      const buffer = Buffer.from(imageBase64, "base64");
      const bucketName = process.env.R2_BUCKET_NAME;
      const fileName = `${name.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}-${Date.now()}.png`;

      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: "image/png",
          ACL: "public-read",
        })
      );

      console.log(`Image uploaded successfully: ${fileName}`);
    } catch (err) {
      console.error(`Error processing job ${job.id}:`, err);
      throw err; // Rethrow to mark the job as failed
    }
  },
  { connection: redisConnection }
);

export { imageQueue };
