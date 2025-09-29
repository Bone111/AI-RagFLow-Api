import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import envTyped from 'vite-plugin-env-typed'
import type { ConfigEnv, PluginOption } from 'vite'

export default function (configEnv: ConfigEnv): PluginOption[] {
  const { command } = configEnv

  const plugins: PluginOption[] = [
    // Vue support
    vue(),

    // Auto import APIs
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),

    // Auto import components
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'types/components.d.ts',
    }),

    // UnoCSS
    UnoCSS(),

    // SVG Icons
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
      customDomId: '__svg__icons__dom__',
    }),

    // Typed environment variables
    envTyped(),
  ]

  return plugins
}
