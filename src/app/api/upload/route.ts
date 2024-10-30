// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Converter File para Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Gerar nome único para o arquivo
    const key = `uploads/${uuidv4()}-${file.name}`

    // Upload para S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    // URL da imagem
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    // Criar registro no banco
    const image = await prisma.image.create({
      data: {
        originalUrl: imageUrl,
        status: 'WAITING_PAYMENT',
        // Nota: userId será adicionado quando implementarmos autenticação
        userId: 'temp-user-id',
      },
    })

    return NextResponse.json({ 
      imageUrl,
      imageId: image.id
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
}