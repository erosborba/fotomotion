// src/services/uploadService.ts
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/lib/s3'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export class UploadService {
  static async uploadToS3(file: Buffer, fileName: string, mimeType: string) {
    try {
      const fileExtension = fileName.split('.').pop()
      const uniqueFileName = `${uuidv4()}.${fileExtension}`
      const key = `uploads/${uniqueFileName}`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file,
          ContentType: mimeType
        })
      )

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
      return imageUrl
    } catch (error) {
      console.error('Erro no upload S3:', error)
      throw error
    }
  }

  static async createOrGetUser() {
    try {
      // Procurar ou criar um usuário temporário
      const user = await prisma.user.upsert({
        where: {
          email: 'temp@example.com',
        },
        update: {},
        create: {
          email: 'temp@example.com',
          name: 'Temporary User'
        },
      })
      return user
    } catch (error) {
      console.error('Erro ao criar/buscar usuário:', error)
      throw error
    }
  }

  static async createImageRecord(imageUrl: string, userId: string) {
    try {
      const image = await prisma.image.create({
        data: {
          originalUrl: imageUrl,
          status: 'WAITING_PAYMENT',
          userId: userId,
        },
      })
      return image
    } catch (error) {
      console.error('Erro ao criar registro de imagem:', error)
      throw error
    }
  }

  static async handleUpload(file: File) {
    try {
      // Validações
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Criar ou obter usuário temporário
      const user = await this.createOrGetUser()

      // Converter File para Buffer
      const buffer = Buffer.from(await file.arrayBuffer())
      
      // Upload para S3
      const imageUrl = await this.uploadToS3(buffer, file.name, file.type)

      // Criar registro no banco
      const image = await this.createImageRecord(imageUrl, user.id)

      return {
        success: true,
        imageUrl,
        imageId: image.id
      }
    } catch (error) {
      console.error('Erro no handleUpload:', error)
      throw error
    }
  }
}