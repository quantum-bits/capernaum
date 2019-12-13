module.exports = {
  apps: [
    {
      name: "cap-server",
      script: "dist/main.js",
      cwd: "{{ cap_server_dir }}",
      autorestart: false,
      watch: false,
    }
  ]
};
