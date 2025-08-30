#!/usr/bin/env node

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// R2 配置
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('请设置 R2 环境变量：');
  console.error('R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// 要上传的文件列表
const filesToUpload = [
  'public/Lucid_Origin_A_stylish_digital_wardrobe_concept_scene_showcasi_2.jpg',
  'public/wardrobe-background.jpg',
  'public/placeholder.jpg',
  'public/placeholder-logo.png',
  'public/placeholder-user.jpg',
  'public/example-images/black-oxfords.jpg',
  'public/example-images/black-pants.jpg',
  'public/example-images/blue-jeans.jpg',
  'public/example-images/blue-shirt.jpg',
  'public/example-images/white-sneakers.jpg',
  'public/example-images/white-tshirt.jpg',
];

async function uploadFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const key = filePath.replace('public/', '');
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: getContentType(filePath),
    });

    await s3Client.send(command);
    console.log(`✅ 上传成功: ${key}`);
  } catch (error) {
    console.error(`❌ 上传失败: ${filePath}`, error.message);
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

async function uploadAllFiles() {
  console.log('🚀 开始上传文件到 R2...');
  
  for (const filePath of filesToUpload) {
    if (fs.existsSync(filePath)) {
      await uploadFile(filePath);
    } else {
      console.warn(`⚠️  文件不存在: ${filePath}`);
    }
  }
  
  console.log('🎉 上传完成！');
}

uploadAllFiles().catch(console.error);
