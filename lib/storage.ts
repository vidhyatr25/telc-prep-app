const PREFIX = "gla_";

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
}

export function load<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function remove(key: string): void {
  localStorage.removeItem(PREFIX + key);
}
