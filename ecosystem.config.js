module.exports = {
  apps: [
    {
      name: "server",
      cwd: "./server",
      script: "yarn",
      args: "server:dev",
    },
    {
      name: "reporter",
      cwd: "./server",
      script: "yarn",
      args: "reporter:dev",
    },
    {
      name: "admin-ui",
      cwd: "./ui-admin",
      script: "yarn",
      args: "serve",
    },
    {
      name: "group-ui",
      cwd: "./ui-group",
      script: "yarn",
      args: "serve",
    },
  ],
};
