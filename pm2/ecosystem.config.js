module.exports = {
  apps: [
    {
      name: "cap-server",
      script: "dist/main.js",
      cwd: "../server",
      autorestart: false,
      watch: false,
    }
  ]
};
