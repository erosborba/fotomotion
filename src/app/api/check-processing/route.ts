import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // Verificar status no Runway
    const response = await fetch(`https://api.runway.ml/v1/generations/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Falha ao verificar status no Runway')
    }

    const data = await response.json()
    
    // Mapear status do Runway para nossos status
    const statusMap = {
      'queued': 'processing',
      'processing': 'processing',
      'completed': 'completed',
      'failed': 'error'
    } as const

    type RunwayStatus = keyof typeof statusMap

    return NextResponse.json({
      status: statusMap[data.status as RunwayStatus] || 'error'
    })

  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    )
  }
} 