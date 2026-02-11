const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // GitHub Pages 배포를 위한 경로 설정
  publicPath: process.env.NODE_ENV === "production" ? "/birthday-bpp/" : "/",
});
