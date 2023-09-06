/**
 * Based on @svgr/plugin-svgo
 * Copyright 2017 Smooth Code
 */

import type { State } from '@svgr-rs/core'
import type SvgoInstance from 'svgo'
import type { Config } from './type'

/**
 * @todo Load svgo config from config file
 */
export const getSvgoConfig = (config: Config): any => {
  if (config.svgoConfig) {
    return config.svgoConfig
  }
  return {}
}

export const svgo = async (code: string, config: Config, state: State) => {
  if (!config.svgo) {
    return code
  }
  let svgoInstance: typeof SvgoInstance
  if (config.svgoImplementation) {
    svgoInstance = config.svgoImplementation
  } else {
    svgoInstance = await import('svgo')
  }
  const svgoConfig = getSvgoConfig(config)
  const result = await svgoInstance.optimize(code, { ...svgoConfig, path: state.filePath })

  // @ts-expect-error -- ignore
  if (result.modernError) {
    // @ts-expect-error -- ignore
    throw result.modernError
  }

  return result.data
}
