/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_MAX_FILE_KB: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
