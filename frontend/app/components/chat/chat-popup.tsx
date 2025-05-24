"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type ChatPopupProps = {
  isOpen: boolean
  onClose: () => void
  seller: {
    id: string
    name: string
    avatar?: string
  }
  item: {
    id: string | number
    title: string
    type: string
  }
}

export function ChatPopup({ isOpen, onClose, seller, item }: ChatPopupProps) {
  const [messages, setMessages] = useState([
    { id: 1, text: `You're now chatting about "${item.title}"`, sender: "system", timestamp: new Date() }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    }])
    setNewMessage("")
    setIsSending(true)
    
    // Simulate response (your friend will replace with socket.io)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: getRandomResponse(item.type),
        sender: "seller",
        timestamp: new Date()
      }])
      setIsSending(false)
    }, 1000)
  }

  // Generate random response
  const getRandomResponse = (type: string) => {
    const responses = type === "service"
      ? ["I'm available this week, when works for you?", 
         "Thanks for your interest in my service!", 
         "Do you have any specific questions?"]
      : ["Yes, it's still available!", 
         "I can meet on campus tomorrow if that works?", 
         "Would you like more pictures of the item?"]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null
  
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg border overflow-hidden flex flex-col z-50">
      {/* Header */}
      <div className="p-3 border-b bg-muted/40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium text-sm">{seller.name}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
              {item.title}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === "user" ? "justify-end" : 
              message.sender === "system" ? "justify-center" : "justify-start"}`}
          >
          
            
            <div 
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                message.sender === "system" 
                  ? "bg-muted text-muted-foreground text-xs"
                  : message.sender === "user" 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-secondary"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === "user" 
                  ? "text-primary-foreground/70" 
                  : "text-muted-foreground"
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
            
            {message.sender === "user"}
          </div>
        ))}
        
        {isSending && (
          <div className="flex justify-start">
          
            <div className="px-3 py-2 rounded-lg bg-secondary">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-2 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!newMessage.trim() || isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}