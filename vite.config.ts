import { defineConfig } from 'vite'

export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default

  return {
    plugins: [react()],
    base: '/cricBio/', // 🔴 MUST match repo name exactly (case-sensitive)
  }
})