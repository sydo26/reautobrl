module.exports = {
    apps : [{
      name: "reautobrl",
      script: "yarn",
      args: "start",
      env_production: {
        NODE_ENV: "production",
        PORT: '3000'
      }
    }]
}