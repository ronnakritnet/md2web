export function debounce<T extends (...args: unknown[]) => void | Promise<void>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    const later = async () => {
      clearTimeout(timeout);
      await func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}
