import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import swc from 'unplugin-swc'

export default defineConfig({
  plugins: [tsconfigPaths(), swc.vite()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    dir: 'src',
  },
})