import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient= new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className='bg-slate-900 h-screen w-screen'>
        <App />
      </div>
    </QueryClientProvider>
  </React.StrictMode>,
)
