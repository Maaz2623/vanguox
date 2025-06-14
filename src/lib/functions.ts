export function generateOrderId(): string {
  const now = Date.now().toString(); // 13-digit timestamp
  const last4 = now.slice(-4); // Get last 4 digits of timestamp
  const rand4 = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit random
  return last4 + rand4; // total: 8 digits
}
