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
      cwd: "./ui",
      script: "yarn",
      args: "serve",
    },
    {
      name: "group-ui",
      cwd: "./group-sign-up-ui",
      script: "yarn",
      args: "serve",
    },
  ],
};
