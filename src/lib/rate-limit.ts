import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15m"),
    prefix: "budget-app:login",
});

export const registerRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1h"),
    prefix: "budget-app:register",
});