const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attemptsByIp = new Map();

export const changePasswordLimiter = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  let entry = attemptsByIp.get(key);

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
    return res.status(429).json({ message: "Too many attempts. Please try again later." });
  }

  entry.count += 1;
  attemptsByIp.set(key, entry);
  if (attemptsByIp.size > 10000) {
    for (const [ip, item] of attemptsByIp) {
      if (now >= item.resetAt) attemptsByIp.delete(ip);
    }
  }
  next();
};
