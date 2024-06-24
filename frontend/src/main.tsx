import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner.tsx'

const queryClient= new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
      <div className='bg-slate-900 min-h-screen w-screen'>
        <App />
        <Toaster richColors duration={3000}/>
      </div>
    </QueryClientProvider>
)
