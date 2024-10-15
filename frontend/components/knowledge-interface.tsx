'use client'

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { PlusIcon, XMarkIcon, PhotoIcon, DocumentIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { quantum } from 'ldrs'

quantum.register()


interface Message {
  text: string;
  files: File[];
  isUser: boolean;
}

export function KnowledgeInterface() {
  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [messages, setMessages] = useState<Message[]>([
    { text: "Welcome! I'm an AI assistant designed to support medical professionals in the diagnostic process. I analyze symptoms, medical images, and patient records, then provide a comprehensive analysis to aid in diagnosis. Please note that I'm a tool to assist doctors and not a replacement for professional medical judgment.", files: [], isUser: false },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const files = event.target.files
    if (files) {
      setUploadedFiles(prevFiles => [...prevFiles, ...Array.from(files)])
    }
    setIsDropdownOpen(false)
  }

  const triggerFileUpload = (type: 'image' | 'document') => {
    if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.click()
    } else if (type === 'document' && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (inputValue.trim() || uploadedFiles.length > 0) {
      const userMessage = { text: inputValue, files: uploadedFiles, isUser: true }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setIsLoading(true)

      const formData = new FormData()
      formData.append('message', inputValue)

      uploadedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          formData.append('images', file)
        } else {
          formData.append('files', file)
        }
      })

      setInputValue('')
      setUploadedFiles([])

      console.log('Sending request to backend...')
      const startTime = Date.now()

      try {
        const response = await axios.post('https://localhost:8000/chat', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 1200000, // 20 minutes in milliseconds
        })

        console.log('Response received from backend')
        console.log('Response data:', response.data)
        console.log('Time taken:', (Date.now() - startTime) / 1000, 'seconds')

        const aiResponse = { text: response.data.response, files: [], isUser: false }
        setMessages(prevMessages => [...prevMessages, aiResponse])
      } catch (error) {
        console.error('Error details:', error)
        let errorMessage = "Sorry, there was an error processing your request."
        
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Error response:', error.response.data)
            console.error('Error status:', error.response.status)
            console.error('Error headers:', error.response.headers)
            errorMessage = `Server error: ${error.response.status}. ${error.response.data.message || ''}`
          } else if (error.request) {
            console.error('Error request:', error.request)
            errorMessage = "No response received from the server after 20 minutes. The process might still be running on the backend."
          } else {
            console.error('Error message:', error.message)
            errorMessage = `Error: ${error.message}`
          }
        }
        
        console.error('Time at error:', (Date.now() - startTime) / 1000, 'seconds')
        
        const errorResponse = { text: errorMessage, files: [], isUser: false }
        setMessages(prevMessages => [...prevMessages, errorResponse])
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col">
      <div className="flex-grow overflow-auto p-6 pb-24">
        <h1 className="text-3xl font-bold mb-6 text-center">MedAssist AI: Your Diagnostic Support Companion</h1>
        
        <div className="max-w-xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <span className="text-xs text-gray-400">{message.isUser ? 'You' : 'AI'}</span>
              <div className={`${message.isUser ? 'bg-[#2a2a2a] p-3 rounded-lg' : ''}`}>
                {message.isUser ? (
                  <p className="break-words">{message.text}</p>
                ) : (
                  <ReactMarkdown className="prose prose-invert max-w-none">
                    {message.text}
                  </ReactMarkdown>
                )}
              </div>
              {message.files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.files.map((file, fileIndex) => (
                    <div key={fileIndex} className="w-8 h-8 bg-gray-700 rounded-md overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-300">
                          <DocumentIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <l-quantum
                size="45"
                speed="1.75"
                color="white" 
              ></l-quantum>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1c] p-4">
        <div className="max-w-2xl mx-auto relative">
          <div className="bg-[#2a2a2a] rounded-full p-2 flex items-center relative border border-gray-600 shadow-lg">
            <div className="flex-grow flex items-center">
              <textarea
                placeholder="Ask follow-up"
                className="bg-transparent outline-none text-sm resize-none w-full px-4 py-2"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
            </div>
            <div className="flex items-center space-x-2 px-2">
              <div className="relative">
                <PlusIcon
                  className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-[#3a3a3a] ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full"
                        role="menuitem"
                        onClick={() => triggerFileUpload('image')}
                      >
                        <PhotoIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Upload Image
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full"
                        role="menuitem"
                        onClick={() => triggerFileUpload('document')}
                      >
                        <DocumentIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Upload Document
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors transform hover:scale-110"
                onClick={sendMessage}
              >
                <PaperAirplaneIcon className="w-5 h-5 transform rotate--90" />
              </button>
            </div>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="absolute left-0 bottom-full mb-2 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="w-8 h-8 bg-gray-700 rounded-md overflow-hidden relative group">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-300">
                      <DocumentIcon className="w-4 h-4" />
                    </div>
                  )}
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
        multiple
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".doc,.docx,.pdf,.txt,.mp4,.mov,.avi"
        onChange={(e) => handleFileUpload(e, 'document')}
        multiple
      />
    </div>
  )
}
