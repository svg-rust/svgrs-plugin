import type { Config as SvgrsConfig } from '@svgr-rs/core'

export interface Config extends SvgrsConfig {
  /**
   * @description Extended config options for @svgr-rs/core, load custom svgo implementation
   */
  svgoImplementation?: any
  // svgoConfig is hidden in @svgr-rs/core
  svgoConfig?: any
}
