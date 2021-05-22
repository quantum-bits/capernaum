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
      name: "ui-admin",
      cwd: "./ui-admin",
      script: "yarn",
      args: "serve",
    },
    {
      name: "ui-group",
      cwd: "./ui-group",
      script: "yarn",
      args: "serve",
    },
  ],
};
