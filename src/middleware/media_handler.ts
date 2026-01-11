import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback, Multer } from 'multer';
import path from 'path';
import { BadRequestError } from '../common/base_error';
import Config from '../config/dot_config';
import { logger } from '../utils/logger';

type DestinationCallbackType = (error: Error | null, destination: string) => void;
type FileNameCallbackType = (error: Error | null, filename: string) => void;

enum MimeType {
    IMAGE_PNG = 'image/png',
    IMAGE_JPEG = 'image/jpeg',
    IMAGE_JPG = 'image/jpg',
    IMAGE_GIF = 'image/gif',
    VIDEO_MP4 = 'video/mp4',
    AUDIO_MPEG = 'audio/mpeg',
    AUDIO_WAV = 'audio/wav',
    PDF = 'application/pdf',
    EXCEL = 'application/vnd.ms-excel',
    EXCEL_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

class MediaHandler {
    private static readonly mimeTypes: Record<string, string> = {
        [MimeType.IMAGE_PNG]: 'image',
        [MimeType.IMAGE_JPEG]: 'image',
        [MimeType.IMAGE_JPG]: 'image',
        [MimeType.IMAGE_GIF]: 'image',
        [MimeType.VIDEO_MP4]: 'video',
        [MimeType.AUDIO_MPEG]: 'audio',
        [MimeType.AUDIO_WAV]: 'audio',
        [MimeType.PDF]: 'pdf',
        [MimeType.EXCEL]: 'excel',
        [MimeType.EXCEL_XLSX]: 'excel'
    };

    static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    static getRootPath(): string {
        return Config._STATIC_PATH || '';
    }

    static async removeFile(fullPath: string): Promise<boolean> {
        if (fs.existsSync(fullPath)) {
            try {
                await fs.promises.unlink(fullPath);
                return true;
            } catch (err) {
                logger.error(`Failed to remove file at path: ${fullPath}`, err);
                return false;
            }
        }
        return false;
    }

    static fileStorage = multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, callback: DestinationCallbackType): void => {
            try {
                const route: string = path.basename(req.baseUrl);
                const rootPath: string = MediaHandler.getRootPath();
                let customPath: string = path.join(rootPath, route);

                if (file.mimetype && MediaHandler.mimeTypes[file.mimetype]) {
                    customPath = path.join(customPath, MediaHandler.mimeTypes[file.mimetype]);
                }

                if (!fs.existsSync(customPath)) {
                    fs.mkdirSync(customPath, { recursive: true });
                }
                callback(null, customPath);
            } catch (error) {
                callback(new Error('Error while setting file destination'), 'null');
            }
        },

        // filename: (req: Request, file: Express.Multer.File, callback: FileNameCallbackType): void => {
        //     try {
        //         const dateString: string = new Date().toISOString().replace(/[-T:.Z]/g, '');
        //         const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        //         const originalExtension = path.extname(file.originalname); // Extract the file extension
        //         const originalName = path.basename(file.originalname, originalExtension).replace(/\s+/g, '_'); // Remove spaces from the name
        //         const uniqueFileName = `${dateString}-${randomNumber}-${originalName}${originalExtension}`; // Append extension
        //         callback(null, uniqueFileName);
        //     } catch (error) {
        //         callback(new Error('Error while generating the file name'), 'null');
        //     }
        // }

        filename: (req: Request, file: Express.Multer.File, callback: FileNameCallbackType): void => {
            const dateString: string = new Date().toISOString().replace(/[-T:.Z]/g, '');
            const randomNumber = Math.floor(Math.random() * 9000) + 1000;
            const originalName = file.originalname.replace(/\s+/g, '_');
            const uniqueFileName = `${dateString}-${randomNumber}-${originalName}`;
            callback(null, uniqueFileName);
        }
    });

    static fileFilter(request: Request, file: Express.Multer.File, callback: FileFilterCallback): void {
        if (MediaHandler.mimeTypes[file.mimetype]) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }

    static uploadFile: Multer = multer({
        storage: MediaHandler.fileStorage,
        fileFilter: MediaHandler.fileFilter,
        limits: { fileSize: MediaHandler.MAX_FILE_SIZE }
    });

    static singleMediaHandler = (req: Request, res: Response, next: NextFunction): void => {
        MediaHandler.uploadFile.single('image')(req, res, (err: any) => {
            if (err) {
                MediaHandler.deleteUploadedFiles(req);
                return next(new BadRequestError(err.message || 'Invalid File Type'));
            }
            const rootPathLength = MediaHandler.getRootPath().length;
            if (req.file) {
                req.body.image = req.file!.path.substring(rootPathLength);
                console.log(req.body.image);
            }
            next();
        });
    };

    // static multiMediaHandler =
    //     (arrFiles: string[] = []) =>
    //     (req: Request, res: Response, next: NextFunction): void => {
    //         MediaHandler.uploadFile.fields([
    //             { name: 'pdf' },
    //             { name: 'image' },
    //             { name: 'video' },
    //             { name: 'doc' },
    //             ...arrFiles.map((name) => ({ name }))
    //         ])(req, res, (err: any) => {
    //             if (err) return next(new BadRequestError('Invalid File Type'));
    //             next();
    //         });
    //     };

    static multiMediaHandler(arrFiles: string[] = []) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const fields = arrFiles.map((name) => {
                    return { name: name };
                });

                MediaHandler.uploadFile.fields(fields)(req, res, (err) => {
                    const rootPathLength = MediaHandler.getRootPath().length;
                    if (err) return next(new BadRequestError('Invalid File Type'));

                    const files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined = req.files;

                    // Initialize imageList in req.body
                    req.body.image_list = [];

                    if (Array.isArray(files)) {
                        for (const file of files) {
                            const filePath = file.path.substring(rootPathLength);
                            req.body[file.fieldname] = filePath;
                            req.body.image_list.push(filePath);
                        }
                    }

                    if (typeof files === 'object') {
                        for (const key in files) {
                            if (Object.prototype.hasOwnProperty.call(files, key)) {
                                const fileArray = (files as { [fieldname: string]: Express.Multer.File[] })[key];
                                for (const file of fileArray) {
                                    const filePath = file.path.substring(rootPathLength);
                                    req.body[file.fieldname] = filePath;
                                    req.body.image_list.push(filePath); // Add to imageList
                                }
                            }
                        }
                    }

                    console.log('Uploaded file paths:', req.body.image_list);
                    next();
                });
            } catch (error) {
                console.error('Error uploading multimedia:', error);
                next(new BadRequestError('Error uploading multimedia files.'));
            }
        };
    }

    static multiMediaHandlerForSpaces =
        (arrFiles: string[] = []) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const tempUploadFile = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 5 } });
            tempUploadFile.fields([{ name: 'pdf' }, { name: 'image' }, { name: 'video' }, { name: 'doc' }, ...arrFiles.map((name) => ({ name }))])(
                req,
                res,
                (err: any) => {
                    MediaHandler.deleteUploadedFiles(req);
                    if (err) return next(new BadRequestError('Invalid File Type'));
                    next();
                }
            );
        };

    // private static processFiles(
    //     files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]
    // ): Express.Multer.File[] {
    //     const processedFiles: Express.Multer.File[] = [];

    //     if (Array.isArray(files)) {
    //         files.forEach((file) => {
    //             const rootPathLength = MediaHandler.getRootPath().length;
    //             file.path = file.path.substring(rootPathLength);
    //             processedFiles.push(file);
    //         });
    //     } else {
    //         for (const key in files) {
    //             if (Object.prototype.hasOwnProperty.call(files, key)) {
    //                 const fileList = files[key];
    //                 fileList.forEach((file) => {
    //                     const rootPathLength = MediaHandler.getRootPath().length;
    //                     file.path = file.path.substring(rootPathLength);
    //                     processedFiles.push(file);
    //                 });
    //             }
    //         }
    //     }

    //     return processedFiles;
    // }

    static async replaceFiles(singleFilePath: string): Promise<void> {
        const fullPath = path.join(MediaHandler.getRootPath(), singleFilePath);
        await MediaHandler.removeFile(fullPath);
    }

    static deleteUploadedFiles = (req: Request) => {
        const files = req.files;
        const file = req.file;
        if (file) MediaHandler.removeFile(file.path);
        if (files)
            if (Array.isArray(files)) {
                for (const file of files) {
                    console.log(file.path);
                    MediaHandler.removeFile(file.path);
                }
            } else if (typeof files === 'object') {
                const images = files['image'];
                const rc = files['rc'];

                const insurance = files['insurance'];
                const pollution = files['pollution'];

                const pdf = files['pdf'];
                const video = files['video'];
                if (Array.isArray(images)) {
                    for (const file of images) {
                        console.log(file.path);
                        MediaHandler.removeFile(file.path);
                    }
                }
                if (Array.isArray(rc)) {
                    for (const file of rc) {
                        console.log(file.path);
                        MediaHandler.removeFile(file.path);
                    }
                }
                if (Array.isArray(insurance)) {
                    for (const file of insurance) {
                        console.log(file.path);
                        MediaHandler.removeFile(file.path);
                    }
                }
                if (Array.isArray(pollution)) {
                    for (const file of pollution) {
                        console.log(file.path);
                        MediaHandler.removeFile(file.path);
                    }
                }
                if (Array.isArray(pdf)) {
                    for (const file of pdf) {
                        console.log(file.path);
                        MediaHandler.removeFile(file.path);
                    }
                }
                if (Array.isArray(video)) {
                    for (const file of video) {
                        console.log(file.path);
                        MediaHandler.removeFile(file.path);
                    }
                }
            }
    };
}

export default MediaHandler;
