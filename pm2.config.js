module.exports = {
  apps: [
    {
      name: 'big2',
      script: './index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
