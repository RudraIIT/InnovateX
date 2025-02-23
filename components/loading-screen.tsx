"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Loader() {
  // Individual Agent Progress
  const [progress0, setProgress0] = useState(0) // Main Agent
  const [progress1, setProgress1] = useState(0) // Database Agent
  const [progress2, setProgress2] = useState(0) // Backend Agent
  const [progress3, setProgress3] = useState(0) // Frontend Agent
  const [progress4, setProgress4] = useState(0) // Manager Agent

  // Overall Progress (Excludes Main Agent)
  const overallProgress = Math.round((progress1 + progress2 + progress3 + progress4) / 4)

  // ---------------------------
  // 1️⃣ Progress0 (Main Agent)
  // ---------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress0((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 1
      })
    }, 30) // Speed for Main Agent

    return () => clearInterval(timer)
  }, [])

  // ---------------------------------------------
  // 2️⃣ Start Other Agents After Main Completes
  // ---------------------------------------------
  useEffect(() => {
    if (progress0 === 100) {
      const timers: NodeJS.Timeout[] = []

      const updateProgress = (setter: React.Dispatch<React.SetStateAction<number>>, delay: number) => {
        let value = 0
        const timer = setInterval(() => {
          value += 1
          setter(value)
          if (value >= 100) clearInterval(timer)
        }, delay)
        timers.push(timer)
      }

      // Run Agents with different speeds
      updateProgress(setProgress1, 40) // Database Agent
      updateProgress(setProgress2, 50) // Backend Agent
      updateProgress(setProgress3, 60) // Frontend Agent
      updateProgress(setProgress4, 70) // Manager Agent

      return () => timers.forEach(clearInterval)
    }
  }, [progress0]) 

  return (
      <div className="relative w-full max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-200 backdrop-blur-xl rounded-2xl p-6 shadow-2xl w-[300px]"
        >
          <h2 className="text-xl font-semibold text-gray-600 mb-6 text-center">Generating AI Agents</h2>

          {/* Agent Progress Bars */}
          <div className="space-y-4">
            <AgentProgress label="Main Agent" progress={progress0} color="emerald" />
            <AgentProgress label="Database Agent" progress={progress1} color="blue" />
            <AgentProgress label="Backend Agent" progress={progress2} color="purple" />
            <AgentProgress label="Frontend Agent" progress={progress3} color="amber" />
            <AgentProgress label="Manager Agent" progress={progress4} color="emerald" />
          </div>

          {/* Overall Progress */}
          <div className="mt-8 space-y-2">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-900">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
          </div>

          {/* Loading Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-center text-sm text-slate-700"
          >
            {getLoadingMessage(progress0, overallProgress)}
          </motion.div>
        </motion.div>
      </div>
  )
}

interface AgentProgressProps {
  label: string
  progress: number
  color: "emerald" | "blue" | "purple" | "amber"
}

function AgentProgress({ label, progress, color }: AgentProgressProps) {
  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
  }

  return (
    <div className="group relative">
      <div className="flex justify-between text-sm text-slate-900 mb-1">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  )
}

function getLoadingMessage(progress0: number, overallProgress: number): string {
  if (progress0 < 100) return "Main agent initializing..."
  if (overallProgress < 30) return "Initializing database structures..."
  if (overallProgress < 60) return "Generating backend services..."
  if (overallProgress < 80) return "Building frontend components..."
  if (overallProgress < 100) return "Manager agent finalizing integration..."
  return "Generation complete! ✅"
}
