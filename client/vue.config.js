const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    port: process.env.VUE_APP_PORT || 3000, // Default to 3000 if not specified
  },
  transpileDependencies: true
})
