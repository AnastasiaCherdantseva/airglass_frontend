export interface Media {
    id: string
    storageKey: string
    originalFilename: string
    mimeType: string
    fileSize: number
    width: number | null
    height: number | null
    createdBy: string | null
    createdAt: Date
    updatedAt: Date
}
