# svgrs-plugin

[![npm](https://img.shields.io/npm/v/@svgr-rs/svgrs-plugin)](https://github.com/svg-rust/svgrs-plugin) [![GitHub](https://img.shields.io/npm/l/@svgr-rs/svgrs-plugin)](https://github.com/svg-rust/svgrs-plugin)

Use [svgr-rs](https://github.com/svg-rust/svgr-rs) with vite and webpack.

## install

```console
pnpm i @svgr-rs/svgrs-plugin -D
```

## options

> [!NOTE]  
Common options, both work with `vite` and `webpack`. Check more supported options from [svg-rust/svgr-rs](https://github.com/svg-rust/svgr-rs). 

**Extra options for plugins:**

`svgoImplementation`

> [!NOTE]  
Use different version `svgo` to optimize svg. Only work when `options.svgo` is enabled.

- type check below example code for details

```ts
import Svgo from 'svgo'

function getInfo(state: { filePath?: string }) {
  return state.filePath
    ? {
        input: 'file',
        path: state.filePath,
      }
    : {
        input: 'string',
      }
}

export const svgo = () => {
  let svgo: any
  return {
    async optimize(code: string, { path, ...config }: any) {
      if (!svgo) {
        svgo = new Svgo(config)
      }
      return svgo.optimize(code, getInfo({ filePath: path }))
    },
  }
}

// example for webpack config
{
  loader: require.resolve('@svgr-rs/svgrs-plugin/webpack'),
  options: {
    ref: true,
    exportType: 'default',
    jsxRuntime: 'automatic',
    icon: false,
    svgo: true,
    svgoImplementation: svgo(),
    svgoConfig: {
      plugins: [
        { prefixIds: true },
        { removeDimensions: false },
        { removeViewBox: true },
      ],
    },
  },
},
```


`svgoConfig`

- type check `svgo` config for more details


## usage

### `vite`

```ts
import path from 'node:path'

import react from '@vitejs/plugin-react'
import { svgrs } from '@svgr-rs/svgrs-plugin/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgrs({
      exportType: 'named',
      namedExport: 'ReactComponent',
    })
  ],
})
```

#### `options`

Check supported options from [svg-rust/svgr-rs](https://github.com/svg-rust/svgr-rs). 

**Extra options for vite:**

`include`

- type `string[]`
- default `['**/*.svg']`

`exclude`

- type `string[]`
- default `[]`

### `webpack`

Add the following `module rule` to your `webpack.config`

```ts
{
  test: /\.svg$/i,
  issuer: /\.[jt]sx?$/,
  resourceQuery: /react/,
  use: [
    {
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx',
        target: 'es2015',
      },
    },
    {
      loader: '@svgr-rs/svgrs-plugin/webpack',
      options: {
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    },
  ],
}
```

Check supported options from [svg-rust/svgr-rs](https://github.com/svg-rust/svgr-rs). 

## development

- **Setup** - `pnpm i`
- **Build** - `pnpm build`

# 
<div align='right'>

*built with ❤️ by 😼*

</div>

