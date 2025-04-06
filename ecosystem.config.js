module.exports = {
  apps: [
    {
      name: 'sso-be',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      exp_backoff_restart_delay: 100,
      log_file: 'logs/pm2',
      // log_type: 'json',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
