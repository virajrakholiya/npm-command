import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Gemin - NPM Command Manager',
    description: 'Organize and manage your frequently used npm commands by categories',
    version: '1.0.0',
    permissions: ['storage', 'sidePanel'],
    side_panel: {
      default_path: 'sidepanel.html',
    },
    action: {
      default_title: 'Open Gemin',
    },
  },
});
