"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { MessageCircle, Terminal } from "lucide-react"
import { TerminalComponent } from "./terminal"

export function TerminalDrawer({setWriteOnTerminal}: any) {


  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm"><MessageCircle className="h-4 w-4"/></Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Shell</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="h-full flex flex-col">
                <div className="border-b border-[#2A2F35] p-2 flex items-center justify-between">
                  <span className="text-2xl font-semibold bg-gradient-to-l from-indigo-400 from-10% via-sky-400 via-30% to-emerald-300 to-90% bg-clip-text text-transparent flex-1 text-center">
                    Chat
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConsole(false)}
                    className="text-gray-400 hover:text-white hover:bg-[#2A2F35] transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 p-4 flex flex-col relative h-full overflow-y-scroll">
                  <div  className="flex-1 p-4 overflow-y-scroll" ref={chatRef}>
                    {chats.length === 0 && (
                      <div className="text-center text-gray-400">
                        Describe Your website to see result
                      </div>
                    )}
                    {chats.map((chat, index) => (
                      <div key={index} className="mb-5 flex items-start justify-start">
                        <div className="bg-[#2A2F35] p-2 rounded-full inline-block">
                          {chat.type === ChatType.PROMPT ? (
                            <MessageCircle className="h-5 w-5 text-[#7982a9]" />
                          ) : (
                            <Sparkles className="h-5 w-5 text-[#238636]" />
                          )}
                        </div>
                        <div className={`ml-4 flex-grow px-5 ${chat.type === ChatType.PROMPT ? "bg-[#303030] py-2 rounded-xl" : ""}`}>
                          <span className="text-sm">{chat.message}</span>
                        </div>
                      </div>
                    ))}
                    {chats.length > 0 && chats[chats.length - 1].type === ChatType.PROMPT && (
                      <div className="bouncing-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center w-full">
                    <Input
                      placeholder="Your prompt here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="flex-1 min-w-10"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      className="ml-2"
                      onClick={() => addChat(prompt, ChatType.PROMPT)}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
