export const getAppTitle = (prefix?: string) =>
  [prefix, "anigreen"].filter(Boolean).join(" | ")
