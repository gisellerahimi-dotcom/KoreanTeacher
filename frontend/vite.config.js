import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/*
a development proxy forwards request from frontend server to
backend server

When React calls fetch('/api/chat'), the request goes to Vite. 
A proxy tells Vite to forward requests starting with /api to Flask
*/

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    proxy : {
      '/api' : {
        target: 'http://127.0.0.1:5000',
      },
    },
  },
})
