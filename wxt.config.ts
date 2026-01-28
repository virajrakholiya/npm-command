import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'DevCommand - NPM Manager',
    description: 'Organize and manage your frequently used npm commands by folders',
    version: '1.0.0',
    permissions: ['storage', 'sidePanel'],
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      128: 'icon/128.png',
    },
    side_panel: {
      default_path: 'sidepanel.html',
    },
    action: {
      default_title: 'Open DevCommand',
      default_icon: 'icon/48.png',
    },
  },
});
