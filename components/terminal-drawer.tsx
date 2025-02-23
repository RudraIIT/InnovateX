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
import { Terminal } from "lucide-react"
import { TerminalComponent } from "./terminal"

export function TerminalDrawer({setWriteOnTerminal}: any) {


  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm"><Terminal className="h-4 w-4"/></Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Shell</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
            <TerminalComponent setWriteOnTerminal={setWriteOnTerminal} />
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
