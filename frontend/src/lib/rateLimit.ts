const failedAttemptsMap = new Map<string, number[]>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_FAILED_ATTEMPTS = 5;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let attempts = failedAttemptsMap.get(key) || [];
  
  // Clean up attempts older than 1 minute
  attempts = attempts.filter(timestamp => now - timestamp < WINDOW_MS);
  failedAttemptsMap.set(key, attempts);
  
  if (attempts.length >= MAX_FAILED_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }
  
  return { allowed: true, remaining: MAX_FAILED_ATTEMPTS - attempts.length };
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const attempts = failedAttemptsMap.get(key) || [];
  attempts.push(now);
  failedAttemptsMap.set(key, attempts);
}
