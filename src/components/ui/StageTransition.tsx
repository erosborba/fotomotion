'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'

interface StageTransitionProps {
  stage: string
  title: string
  description: string
  icon: 'loading' | 'success' | 'error' | 'processing'
}

export default function StageTransition({ stage, title, description, icon }: StageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [stage])

  const icons = {
    loading: Loader2,
    success: CheckCircle,
    error: AlertCircle,
    processing: Sparkles
  }

  const Icon = icons[icon]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={icon === 'loading' ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Icon className={`w-16 h-16 mx-auto ${
            icon === 'success' ? 'text-green-500' :
            icon === 'error' ? 'text-red-500' :
            'text-blue-600'
          }`} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600"
        >
          {description}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
} 