module.exports = {
  apps: [
    {
      name: "cap-server",
      script: "dist/apps/server/main.js",
      cwd: "{{ cap_server_abs_dir }}",
      autorestart: false,
      watch: false,
    },
    {
      name: "cap-reporter",
      script: "dist/apps/reporter/main.js",
      cwd: "{{ cap_server_abs_dir }}",
      autorestart: false,
      watch: false,
    },
  ],
};
