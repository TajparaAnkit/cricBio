import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// dynamically import ESM-only plugins to avoid 'require' loading issues
export default defineConfig(async () => {
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [reactPlugin()],
    base: '/cricBio/',   // 👈 EXACT repo name (case-sensitive)
  }
})