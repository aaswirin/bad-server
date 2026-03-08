import { Buffer } from 'buffer';

export type typesFile = 
    'image/png' | 
    'image/jpeg' | 
    'image/jpg' | 
    'image/gif' | 
    'image/svg+xml';

const imageSig: Record<typesFile, number[]> = {
    'image/png': [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    'image/jpeg': [0xff, 0xd8, 0xff],
    'image/jpg': [0xff, 0xd8, 0xff],
    'image/gif': [0x47, 0x49, 0x46, 0x38],
    'image/svg+xml': [0x3c, 0x3f, 0x78, 0x6d, 0x6c],
};

export const checkMetaData = (
    buff: Buffer | null | undefined,
    mimeType: string
): boolean => {
    
    if (!buff || buff.length === 0) return false;

    const lowerMimeType = mimeType.toLowerCase() as typesFile;
    if (!(lowerMimeType in imageSig)) return true;

    const signature = imageSig[lowerMimeType];
    if (!signature || signature.length === 0) return true;

    const bytesToCompare = Math.min(signature.length, buff.length);
    return Array.from({ length: bytesToCompare }, (_, i) => i).every(i => buff[i] === signature[i]);
};
