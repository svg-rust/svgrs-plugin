# svgrs-plugin

[![npm](https://img.shields.io/npm/v/svgrs-plugin)](https://github.com/JiangWeixian/svgrs-plugin) [![GitHub](https://img.shields.io/npm/l/svgrs-plugin)](https://github.com/JiangWeixian/svgrs-plugin)

Use [svgr-rs](https://github.com/svg-rust/svgr-rs) with vite and webpack.

## install

```console
pnpm i svgrs-plugin -D
```

## usage

### `vite`

```ts
import path from 'node:path'

import react from '@vitejs/plugin-react'
import { svgrs } from 'svgrs-plugin/vite'
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
      loader: 'svgrs-plugin/webpack',
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

