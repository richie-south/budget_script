export class ParseError extends Error {
  public code: number
  public line: number
  public position: number

  constructor(
    message: string,
    line: number,
    position: number,
    code: number = 400,
  ) {
    super(`Line ${line} position ${position}: ${message}`)
    this.name = 'ParseError'

    this.code = code
    this.line = line
    this.position = position
    Object.setPrototypeOf(this, ParseError.prototype)
  }
}
