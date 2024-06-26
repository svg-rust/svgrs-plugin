/**
 * Based on @svgr/wepack
 * Copyright 2017 Smooth Code
 */

import fs from 'node:fs/promises'
import path from 'node:path'

import { transform } from '@svgr-rs/core'

import { svgo } from '../index'

import type { Config, State } from '@svgr-rs/core'
import type { LoaderContext } from 'webpack'

/**
 * NOTE: @svgr-rs/svgo not production ready yet. Use svgo instead.
 */
async function svgrsLoader(this: LoaderContext<Config>, source: string) {
  this.cacheable && this.cacheable()
  const callback = this.async()

  const {
    namedExport = 'ReactComponent',
    exportType = 'named',
    jsxRuntime = 'classic',
    icon = true,
    ...config
  } = this.getOptions()

  const previousExport = (() => {
    if (source.startsWith('export ')) {
      return source
    }
    const exportMatches = source.match(/^module.exports\s*=\s*(.*)/)
    return exportMatches ? `export default ${exportMatches[1]}` : null
  })()
  const state: State = {
    componentName: namedExport,
    filePath: path.normalize(this.resourcePath),
  }
  if (exportType === 'named') {
    // NOTE: state.caller will force make svgrs use 'named' export type
    state.caller = {
      previousExport,
      name: 'svgrs-plugin/webpack',
    }
  }
  const options: Config = {
    namedExport,
    exportType,
    jsxRuntime,
    icon,
    ...config,
  }
  if (!previousExport) {
    let code = await svgo(source, config, state)
    code = await transform(code, options, state)
    callback(null, code)
  } else {
    const content = await fs.readFile(this.resourcePath, 'utf-8')
    let code = await svgo(content, config, state)
    code = await transform(code, options, state)
    callback(null, code)
  }
}

export default svgrsLoader
