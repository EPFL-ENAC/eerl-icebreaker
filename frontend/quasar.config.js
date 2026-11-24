// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app';

export default defineConfig((ctx) => {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['i18n', 'api', 'settings', 'maps'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'

      defineEnv: {
        API_URL: ctx.dev ? 'http://localhost:8000' : process.env.API_URL,
        API_PATH: ctx.dev ? '' : process.env.API_PATH,
        AUTH_CLIENT_ID: ctx.dev ? 'local-ui' : process.env.AUTH_CLIENT_ID,
      },

      // Needed to have relative assets in the index.html
      // https://github.com/quasarframework/quasar/issues/8513#issuecomment-1127654470
      extendViteConf(viteConf) {
        viteConf.base = '';
        // silence deprecation warnings from quasar-ui-qmarkdown
        const po = (viteConf.css ??= {}).preprocessorOptions ??= {};
        for (const lang of ['sass', 'scss']) {
          po[lang] = { ...po[lang], silenceDeprecations: ['color-functions'] };
        }
      },

      vitePlugins: [
        [
          'unplugin-auto-import/vite',
          {
            imports: ['vue', 'vue-router', 'vue-i18n', 'pinia'],
            dts: 'src/auto-imports.d.ts',
            dirs: ['src/composables', 'src/models', 'src/stores'],
            vueTemplate: true,
            eslintrc: {
              enabled: true, // Default `false`
              filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
              globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
          },
        ],
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
            // you need to set `runtimeOnly: false`
            runtimeOnly: false,

            // you need to set i18n resource including paths !
            include: [ctx.appPaths.resolve.app('src/i18n')],
          },
        ],
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      open: false, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {},

      // Quasar plugins
      plugins: ['Notify', 'LocalStorage', 'LoadingBar', 'Cookies', 'AppFullscreen'],
    },

    // https://v2.quasar.dev/options/animations
    animations: [],
  };
});
