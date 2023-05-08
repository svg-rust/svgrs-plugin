/**
 * Based on @svgr/wepack
 * Copyright 2017 Smooth Code
 */

import fs from 'node:fs/promises'
import path from 'node:path'

import { transform } from '@svgr-rs/core'

import type { Config, State } from '@svgr-rs/core'
import type { LoaderContext } from 'webpack'

async function svgrsLoader(this: LoaderContext<Config>, source: string) {
  this.cacheable && this.cacheable()
  const callback = this.async()

  const options = this.getOptions()

  const previousExport = (() => {
    if (source.startsWith('export ')) {
      return source
    }
    const exportMatches = source.match(/^module.exports\s*=\s*(.*)/)
    return exportMatches ? `export default ${exportMatches[1]}` : null
  })()

  const state: State = {
    caller: {
      name: 'svgrs-plugin/webpack',
      previousExport,
    },
    componentName: options.namedExport ?? 'ReactComponent',
    filePath: path.normalize(this.resourcePath),
  }

  if (!previousExport) {
    const code = await transform(source, options, state)
    callback(null, code)
  } else {
    const content = await fs.readFile(this.resourcePath, 'utf-8')
    const code = await transform(content, options, state)
    callback(null, code)
  }
}

export default svgrsLoader
