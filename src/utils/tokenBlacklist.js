import redis from "../database/redis.js";

export const blackListToken = async (token, ttl = 15 * 60 * 1000) => {
  await redis.set(`bl:${token}`, "revoked", "PX", ttl);
  console.log(`Token adicionado a blackList com ttl de ${ttl}ms`);
};

export const isTokenBlackListed = async (token) => {
  const result = await redis.get(`bl:${token}`);
  return result != null;
};
