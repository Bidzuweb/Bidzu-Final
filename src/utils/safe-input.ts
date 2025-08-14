export const safeInputValue = (value: unknown, fallback: string = ""): string => {
  if (value === null || value === undefined) {
    return fallback
  }
  return String(value)
}
