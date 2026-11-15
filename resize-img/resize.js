import sharp from "sharp";

export const resize = (buffer, size) =>
  sharp(buffer)
    .rotate() // respect EXIF orientation (phone photos)
    .resize(size, size, { fit: "inside", withoutEnlargement: true })
    .toBuffer();