import type { Options } from 'tsup'

import { defineConfig } from 'tsup'

const config: Options = {
  clean: true,
  minify: true,
  treeshake: true,
  dts: true,
  format: ['esm'],
  outDir: 'dist',
  target: ['es2019'],
  tsconfig: 'tsconfig.json',
}

export { config }
export default defineConfig({ ...config })
