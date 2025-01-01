import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter 'q' is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const aiResponse = await openai.images.generate({
      prompt: query,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    });

    const imageBase64 = aiResponse.data[0].b64_json;

    const buffer = Buffer.from(imageBase64, "base64");
    const bucketName = process.env.R2_BUCKET_NAME;
    const fileName = `${query.replace(/[^a-zA-Z0-9]/g, "_")}-${Date.now()}.png`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    return new Response(JSON.stringify({ image: publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({
        error: "An error occurred while generating the image",
        details: err,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
