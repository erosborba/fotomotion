// src/app/api/test-config/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    aws: {
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      hasRegion: !!process.env.AWS_REGION,
      hasBucket: !!process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME
    },
    nodeEnv: process.env.NODE_ENV
  })
}