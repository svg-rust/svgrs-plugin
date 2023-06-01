import fs from 'node:fs/promises'

import { createFilter } from '@rollup/pluginutils'
import { transform } from '@svgr-rs/core'
import { transformWithEsbuild } from 'vite'

import type { Config, State } from '@svgr-rs/core'
import type { ESBuildOptions, Plugin } from 'vite'

interface SvgrsOptions extends Config {
  include?: string[]
  exclude?: string[]
}

const postfixRE = /[?#].*$/s
function cleanUrl(url: string): string {
  return url.replace(postfixRE, '')
}

export const svgrs = ({
  namedExport = 'ReactComponent',
  exportType = 'named',
  jsxRuntime = 'automatic',
  icon = true,
  include = ['**/*.svg'],
  exclude = [],
  ...config
}: SvgrsOptions = {}): Plugin => {
  const filter = createFilter(include, exclude)
  const esbuildOptions: ESBuildOptions = {}
  const jsxRuntimeMap: Record<NonNullable<SvgrsOptions['jsxRuntime']>, ESBuildOptions['jsx']> = {
    automatic: 'automatic',
    classic: 'transform',
    'classic-preact': 'transform',
  }
  return {
    name: 'svgrs-plugin/vite',
    options() {
      esbuildOptions.jsx = jsxRuntimeMap[jsxRuntime]
      // https://esbuild.github.io/content-types/#using-jsx-without-react
      esbuildOptions.jsxFactory = jsxRuntime === 'classic-preact'
        ? 'h'
        : undefined
      esbuildOptions.jsxFragment = jsxRuntime === 'classic-preact'
        ? 'Fragment'
        : undefined
    },
    async transform(code, id) {
      if (filter(cleanUrl(id))) {
        const raw = await fs.readFile(cleanUrl(id), 'utf-8')
        const state: State = {
          componentName: namedExport,
          filePath: id,
        }
        if (exportType === 'named') {
          // NOTE: state.caller will force make svgrs use 'named' export type
          state.caller = {
            previousExport: code,
            name: 'svgrs-plugin/vite',
          }
        }
        const svgrsCode = await transform(
          raw,
          { namedExport, exportType, jsxRuntime, icon, ...config },
          state,
        )
        const result = await transformWithEsbuild(svgrsCode, id, {
          loader: 'jsx',
          ...esbuildOptions,
        })
        return {
          code: result.code,
          map: result.map,
        }
      }
      return code
    },
  }
}
