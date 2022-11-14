const redis = require('redis')
require('dotenv').config({path:process.env.OLDPWD+'/.env'})
require('dotenv').config()
let client = redis.createClient('6379', '172.18.0.2');
client.select((process.env.REDIS_INDEX), (x) => { return x });
const asyncRedis = require("async-redis");
const asyncRedisClient = asyncRedis.decorate(client);
asyncRedisClient.select((process.env.REDIS_INDEX), (x) => { return x });

module.exports=asyncRedisClient