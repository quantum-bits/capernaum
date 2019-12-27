module.exports = {
  apps: [
    {
      name: "cap-server",
      script: "dist/main.js",
      cwd: "{{ cap_server_abs_dir }}",
      autorestart: false,
      watch: false,
    }
  ]
};
