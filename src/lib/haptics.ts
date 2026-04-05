/**
 * Trigger a short haptic vibration for feedback.
 * Falls back silently on devices that don't support the Vibration API (e.g. iOS Safari).
 */
export function hapticBuzz(pattern: number | number[] = 50): void {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently ignore — vibration not supported
  }
}

/** Short error buzz — two quick pulses */
export function hapticError(): void {
  hapticBuzz([40, 30, 40]);
}

/** Light success tap */
export function hapticSuccess(): void {
  hapticBuzz(30);
}
