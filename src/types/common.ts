
export interface Error {
  type: string,
  colno?: number,
  lineno?: number,
  message?: string,
  reason?: object,
  tagName?: string,
  src?: string
}