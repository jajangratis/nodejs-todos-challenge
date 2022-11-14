module.exports = {
    apps : [{
      name: "munuh",
      script: "./app.js",
      exec_mode: "cluster",
      watch: true,
      ignore_watch: ['node_modules'],
      instances: "4"
    }]
};