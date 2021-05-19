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
      name: "ui",
      cwd: "./ui",
      script: "yarn",
      args: "serve",
    },
  ],
};
