/**
 * Generate a stable unique ID using crypto.randomUUID()
 * Falls back to a simple random string if crypto.randomUUID is not available
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}