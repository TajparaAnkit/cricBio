import { defineConfig } from 'vite'
import path from 'path'

// dynamically import ESM-only plugins to avoid 'require' loading issues
export default defineConfig(async () => {
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [reactPlugin()],
    resolve: {
      alias: {
        'components': path.resolve(__dirname, 'src/components'),
        'main': path.resolve(__dirname, 'src/main'),
      },
    },
  }
})