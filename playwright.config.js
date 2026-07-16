// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: 'http://127.0.0.1:8654'
  },
  webServer: {
    command: 'python3 -m http.server 8654 --bind 127.0.0.1',
    url: 'http://127.0.0.1:8654/index.html',
    reuseExistingServer: true,
    timeout: 15000
  }
});
