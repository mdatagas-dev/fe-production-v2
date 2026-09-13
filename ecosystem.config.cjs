module.exports = {
  apps: [
    {
      name: "fe-scanning-ac",
      cwd: __dirname,
      script: "npm",
      args: "start",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      time: true,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
