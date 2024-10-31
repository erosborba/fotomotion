'use client'

import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ProcessingStatusProps {
  status: 'processing' | 'success' | 'error'
  title: string
  description: string
}

export default function ProcessingStatus({ status, title, description }: ProcessingStatusProps) {
  const statusConfig = {
    processing: {
      icon: Loader2,
      iconClass: 'text-blue-600 animate-spin',
    },
    success: {
      icon: CheckCircle,
      iconClass: 'text-green-500',
    },
    error: {
      icon: AlertCircle,
      iconClass: 'text-red-500',
    },
  }

  const StatusIcon = statusConfig[status].icon

  return (
    <div className="text-center space-y-4">
      <StatusIcon className={`w-16 h-16 mx-auto ${statusConfig[status].iconClass}`} />
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 