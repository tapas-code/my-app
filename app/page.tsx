'use client'

import { Calendar } from "@/components/calendar"



export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100 p-4 md:p-8 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500 mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500 mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500 mix-blend-multiply filter blur-[128px] animate-blob"></div>
        </div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 text-center">Sleek Calendar</h1>
        <Calendar />
      </div>

      <style jsx>{`
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  :global(.animate-blob) {
    animation: blob 7s infinite;
  }
  :global(.animation-delay-2000) {
    animation-delay: 2s;
  }
  :global(.animation-delay-4000) {
    animation-delay: 4s;
  }
`}</style>
    </div>
  )
}

