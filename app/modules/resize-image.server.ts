import sharp from "sharp"

export function resizeImage(input: Buffer, width: number, height: number) {
  return sharp(input).resize(width, height).png().toBuffer()
}
