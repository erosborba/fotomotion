// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { UploadService } from '@/services/UploadService'

export async function POST(request: Request) {
  console.log('🟦 Iniciando requisição de upload')
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    console.log('🟦 Dados do arquivo:', {
      exists: !!file,
      type: file?.type,
      size: file?.size,
      name: file?.name
    })

    if (!file) {
      console.log('🔴 Nenhum arquivo recebido')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Converter File para Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log('🟦 Buffer criado, tamanho:', buffer.length)

    // Verificar variáveis de ambiente
    console.log('🟦 Verificando configurações:', {
      hasAWSKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasAWSSecret: !!process.env.AWS_SECRET_ACCESS_KEY,
      hasAWSRegion: !!process.env.AWS_REGION,
      hasAWSBucket: !!process.env.AWS_BUCKET_NAME,
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION
    })

    const result = await UploadService.handleUpload(file)
    console.log('🟩 Upload finalizado com sucesso:', result)
    
    return NextResponse.json(result)

  } catch (error) {
    console.log('🔴 Erro no upload:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload file',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    )
  }
}