export const haptic = {
  tap: () => (window as any)?.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light"),
  success: () => (window as any)?.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.("success"),
  warn: () => (window as any)?.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.("warning"),
  error: () => (window as any)?.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.("error")
};
