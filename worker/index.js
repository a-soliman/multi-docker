const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () =>  1000
});

// duplicate the client
const sub = redisClient.duplicate();

// the actual fib function (super slow)
const fib = idx => idx < 2 ? 1 : fib(idx -1) + fib(idx -2);

// react to any changes to redis
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

// subscribe
sub.subscribe('insert');