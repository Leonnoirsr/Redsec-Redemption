import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  const url = process.env.REDIS_URL;
  
  if (!url) {
    throw new Error('REDIS_URL environment variable is not set');
  }

  redisClient = createClient({
    url: url,
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  
  await redisClient.connect();
  
  return redisClient;
}

