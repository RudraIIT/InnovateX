"use client"

import type React from "react"
import { X, Phone, Video, Calendar, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Widget() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glassmorphism background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/10 to-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm rounded-3xl overflow-hidden backdrop-blur-2xl bg-black/30 shadow-2xl border border-white/10 relative z-10">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Available now</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Need assistance?</h2>
            <p className="text-zinc-400 text-sm">Choose how you&apos;d like to connect</p>
          </div>

          {/* Call Options */}
          <div className="space-y-3">
            <CallOption icon={<Phone className="h-5 w-5" />} title="Voice Call" subtitle="Talk with an agent" />
            <CallOption icon={<Video className="h-5 w-5" />} title="Video Call" subtitle="Face-to-face chat" />
            <CallOption
              icon={<Calendar className="h-5 w-5" />}
              title="Schedule Call"
              subtitle="Book a time later"
              isLast
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-xs text-zinc-500">Powered by CallConnect</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CallOption({
  icon,
  title,
  subtitle,
  isLast = false,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  isLast?: boolean
}) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-between text-white hover:bg-white/10 rounded-2xl h-16 px-4 transition-colors duration-200 ${!isLast ? "border-b border-white/10" : ""}`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-400">
          {icon}
        </div>
        <div className="text-left">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-zinc-400">{subtitle}</div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-zinc-600" />
    </Button>
  )
}
