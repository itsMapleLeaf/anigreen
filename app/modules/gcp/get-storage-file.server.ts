import { Storage } from "@google-cloud/storage"

export function getStorageFile(path: string) {
  const storage = new Storage()
  return storage.bucket("anigreen-resized-images").file(path)
}
