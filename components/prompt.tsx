'use client'

import * as React from "react"
import { useState } from "react"
import { FileCode, GalleryVerticalEnd, LoaderIcon, MessageSquare, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Textarea } from "./ui/textarea"
import { UserButton, useUser } from "@clerk/nextjs"
import { FileUploader } from "./file-upload"
import { Navbar } from "./navbar"
import { Templates } from "./templates"
import { useRouter } from "next/navigation"

export function Prompt() {
  const { user, isSignedIn } = useUser()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  // Handle form submission
  const handleGenerate = async () => {
    if (!isSignedIn || !user?.id) {
      console.error("User not signed in")
      return
    }

    try {
      console.log('Sending prompt:', prompt, user.id)
      setLoading(true)

      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          prompt: prompt,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send prompt')
      }

      const data = await response.json()
      console.log('Response from API:', data)
      setPrompt("")
      router.push('/editor')
      setLoading(false)
    } catch (error) {
      console.error('Error sending prompt:', error)
    }
  }

  if (!isSignedIn) {
    return <div>Please sign in to continue</div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">InnovateX</span>
                    <span className="text-xs text-muted-foreground">Low-Code Website Builder</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button>
                      <MessageSquare className="size-4" />
                      <span>New Chat</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileCode className="size-4" />
                    <span>Projects</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 py-3 flex flex-row items-center gap-4 bg-background m-4 rounded-xl">
            <UserButton />
            <div className="text-sm font-medium">
              {user?.firstName + " " + user?.lastName}
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <main className="flex-1 overflow-hidden px-4">
          <div className="block md:hidden">
            <Navbar />
          </div>
          <div className="container flex max-w-5xl flex-col items-center justify-center gap-8 py-12 md:py-24">
            <h1 className="text-center text-4xl font-bold tracking-tight md:text-6xl">
              What can I help you {' '}
              <span className="leading-7 bg-gradient-to-l from-indigo-400 from-10% via-sky-400 via-30% to-emerald-300 to-90% bg-clip-text text-transparent">
                Innovate?
              </span>
            </h1>
            <div className="w-full max-w-2xl">
              <Textarea
                className="h-28 rounded-lg px-4 py-4 text-sm text-left align-top leading-normal placeholder:text-left"
                placeholder="Ask InnovateX to build anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex flex-col w-full items-center mt-4 gap-6"> 
                <FileUploader />
                <Button className="w-full" onClick={handleGenerate}>
                  <LoaderIcon className={`w-6 h-6 animate-spin ${loading ? 'block' : 'hidden'}`} />
                  Generate
                </Button>
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold tracking-tight md:text-6xl leading-7 bg-gradient-to-l from-indigo-400 from-10% via-sky-400 via-30% to-emerald-300 to-90% bg-clip-text text-transparent pt-8">
                Templates
              </div>
              <div className="text-lg font-medium text-gray-500 mb-8 mt-4">
                Use our templates to get started quickly
              </div>
              <Templates />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}