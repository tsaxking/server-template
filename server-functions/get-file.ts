import { NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

/**
 * Gets a json from the jsons folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/accounts')
 * @returns {*} false if there is an error, otherwise the json
 * 
 * @example
 * ```javascript
 * const accounts = getJSON('/accounts');
 * ```
 * 
 * 
 */
export function getJSONSync(file: string): any {
    if (file.startsWith('/')) file = '.' + file;
    
    const p = path.resolve(__dirname, '../jsons', file + '.json');

    if (!fs.existsSync(p)) {
        return false;
    }

    let content = fs.readFileSync(p, 'utf8');

    // remove all /* */ comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // remove all // comments
    content = content.replace(/\/\/.*/g, '');
    
    try {
        return JSON.parse(content);
    } catch (e) {
        console.error('Error parsing JSON file: ' + file, e);
        return false;
    }
};

/**
 * Gets a json from the jsons folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/accounts')
 * @returns {Promise<any>} false if there is an error, otherwise the json
 * 
 * @example
 * ```javascript
 * const accounts = await getJSON('/accounts');
 * ```
 */
export function getJSON(file: string): Promise<any> {
    return new Promise((res, rej) => {
        if (file.startsWith('/')) file = '.' + file;
        
        const p = path.resolve(__dirname, '../jsons', file + '.json');

        if (!fs.existsSync(p)) {
            return res(false);
        }

        fs.readFile(p, 'utf8', (err, content) => {
            if (err) return rej(err);

            // remove all /* */ comments
            content = content.replace(/\/\*[\s\S]*?\*\//g, '');

            // remove all // comments
            content = content.replace(/\/\/.*/g, '');
            
            try {
                res(JSON.parse(content));
            } catch (e) {
                console.error('Error parsing JSON file: ' + file, e);
                res(false);
            }
        });
    });
}

/**
 * Saves a json to the jsons folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/accounts')
 * @param {*} data the data to save
 * @returns {boolean} whether the file was saved successfully
 * If the file is not saved successfully, it will log the error and return false
 * 
 * 
 */
export function saveJSONSync(file: string, data: any) {
    if (file.startsWith('/')) file = '.' + file;
    
    const p = path.resolve(__dirname, '../jsons', file + '.json');

    try {
        JSON.stringify(data);
    } catch (e) {
        console.error('Error stringifying JSON file: ' + file, e);
        return false;
    }

    fs.writeFileSync(p, JSON.stringify(data, null, 4), 'utf8');
    return true;
}

/**
 * Saves a json to the jsons folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/accounts')
 * @param {*} data the data to save
 * @returns {Promise<boolean>} whether the file was saved successfully
 * If the file is not saved successfully, it will log the error and return false
 * 
 * 
 */
export function saveJSON(file: string, data: any): Promise<boolean> {
    return new Promise((res, rej) => {
        if (file.startsWith('/')) file = '.' + file;
        
        const p = path.resolve(__dirname, '../jsons', file + '.json');

        try {
            JSON.stringify(data);
        } catch (e) {
            console.error('Error stringifying JSON file: ' + file, e);
            return res(false);
        }

        fs.writeFile(p, JSON.stringify(data, null, 4), 'utf8', err => {
            if (err) return rej(err);
            res(true);
        });
    });
}



/**
 * Gets an html template from the templates folder
 * 
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @returns {string|boolean} false if there is an error, otherwise the html
 */
export function getTemplateSync(file: string): string|boolean {
    if (file.startsWith('/')) file = '.' + file;
    
    const p = path.resolve(__dirname, '../templates', file + '.html');

    if (!fs.existsSync(p)) {
        return false;
    }

    const data = fs.readFileSync(p, 'utf8');
    return data;
};

/**
 * Gets an html template from the templates folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @returns {Promise<string|boolean>} false if there is an error, otherwise the html
 */
export function getTemplate(file: string): Promise<string|boolean> {
    return new Promise((res, rej) => {
        if (file.startsWith('/')) file = '.' + file;
        
        const p = path.resolve(__dirname, '../templates', file + '.html');

        if (!fs.existsSync(p)) {
            return res(false);
        }

        fs.readFile(p, 'utf8', (err, data) => {
            if (err) return rej(err);
            res(data);
        });
    });
}

/**
 * Saves an html template to the templates folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @param {string} data the data to save
 * @returns {boolean} whether the file was saved successfully
 */
export function saveTemplateSync(file: string, data: string) {
    if (file.startsWith('/')) file = '.' + file;
    
    const p = path.resolve(__dirname, '../templates', file + '.html');

    fs.writeFileSync(p, data, 'utf8');
    return true;
}

/**
 * Saves an html template to the templates folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @param {string} data the data to save
 * @returns {Promise<boolean>} whether the file was saved successfully
 */
export function saveTemplate(file: string, data: string): Promise<boolean> {
    return new Promise((res, rej) => {
        if (file.startsWith('/')) file = '.' + file;
        
        const p = path.resolve(__dirname, '../templates', file);

        fs.writeFile(p, data, 'utf8', err => {
            if (err) return rej(err);
            res(true);
        });
    });
}

/**
 * Saves a file to the uploads folder
 *
 * @export
 * @param {*} data the data to save
 * @param {string} filename the filename to save it as
 * @returns {Promise<void>}
 */
export function saveUpload(data: any, filename: string): Promise<void> {
    return new Promise((res, rej) => {
        data = Buffer.from(data, 'binary');

        fs.writeFile(path.resolve(__dirname, '../uploads', filename), data, err => {
            if (err) rej(err);
            else res();
        });
    });
}

/**
 * Description placeholder
 *
 * @typedef {File}
 */
type File = {
    filename: string;
    ext: string;
    data: any;
}

/**
 * Description placeholder
 *
 * @export
 * @param {File[]} files
 * @returns {Promise<void>}
 */
export function uploadMultipleFiles(files: File[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const promises: Promise<any>[] = [];
        files.forEach(file => {
            promises.push(saveUpload(file.data, file.filename + file.ext));
        });

        Promise.all(promises).then(() => resolve()).catch(err => reject(err));
    });
}

/**
 * Description placeholder
 *
 * @export
 * @param {string} filename
 * @returns {*}
 */
export function getUpload(filename: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '../uploads', filename), (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

/**
 * Description placeholder
 *
 * @export
 * @param {string} filename
 * @returns {Promise<void>}
 */
export function deleteUpload(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(path.resolve(__dirname, '../uploads', filename), err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

/**
 * Description placeholder
 *
 * @export
 * @param {number} bytes
 * @param {number} [decimals=2]
 * @returns {{ string: string, type: string }}
 */
export function formatBytes(bytes: number, decimals: number = 2): { string: string, type: string } {
    if (bytes === 0) return {
        string: '0 Bytes',
        type: 'Bytes'
    };

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return {
        string: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i],
        type: sizes[i]
    }
}






/**
 * Description placeholder
 *
 * @typedef {FileStreamOptions}
 */
type FileStreamOptions = {
    maxFileSize?: number;
    extensions?: string[];
}


/**
 * Description placeholder
 *
 * @typedef {CustomHeaderRequest}
 */
type CustomHeaderRequest = Request & {
    headers: {
        'x-content-type': string;
        'x-file-name': string;
        'x-file-size': string;
        'x-file-type': string;
        'x-file-ext': string;
    }

    on: (event: string, callback: (chunk: any) => void) => void;
    file: any;
}

/**
 * Description placeholder
 *
 * @typedef {CustomResponse}
 */
type CustomResponse = Response & {
    json: (data: any) => void;
}

/**
 * Description placeholder
 *
 * @param {FileStreamOptions} opts
 * @returns {(req: any, res: any, next: any) => unknown}
 */
export const fileStream = (opts: FileStreamOptions) => {
    return async(req: CustomHeaderRequest, res: CustomResponse, next: NextFunction) => {
        let { maxFileSize, extensions } = opts;
        maxFileSize = maxFileSize || 1000000;

        const generateFileId = () => {
            return uuid() + '-' + Date.now();
        }

        let fileId = generateFileId();
        let {
            headers: {
                'x-content-type': contentType,
                'x-file-name': fileName,
                'x-file-size': fileSize,
                'x-file-type': fileType,
                'x-file-ext': fileExt
            }
        } = req;

        if (maxFileSize && +fileSize > maxFileSize) {
            console.log('File size is too large', formatBytes(+fileSize), formatBytes(maxFileSize));
            return res.json({
                error: 'File size too large'
            });
        }

        if (extensions && !extensions.includes(fileExt)) {
            console.log('File type is not allowed', fileExt, extensions);
        }

        if (!fileExt.startsWith('.')) fileExt = '.' + fileExt;


        // never overwrite files
        while (fs.existsSync(path.resolve(__dirname, '../uploads', fileId + fileExt))) {
            fileId = generateFileId();
        }

        const file = fs.createWriteStream(path.resolve(__dirname, '../uploads', fileId + fileExt));

        let total = 0;
        req.on('data', (chunk) => {
            file.write(chunk);
            total += chunk.length;
            console.log('Uploaded', formatBytes(total), formatBytes(+fileSize), `(${Math.round(total / +fileSize * 100)}% )`);
        });

        req.on('end', () => {
            file.end();
            req.file = {
                id: fileId,
                name: fileName,
                size: fileSize,
                type: fileType,
                ext: fileExt,
                contentType
            }
            next();
        });

        req.on('error', (err) => {
            console.log(err);

            res.json({
                error: 'Error uploading file: ' + fileName
            })
        });
    }
}


/**
 * Description placeholder
 *
 * @typedef {FileCb}
 */
type FileCb = (file: any) => void;
/**
 * Description placeholder
 *
 * @typedef {FileOpts}
 */
type FileOpts = {
    sort?: (a: string, b: string) => number;
    recursive?: boolean;
    filter?: (file: string) => boolean;
}

/**
 * Description placeholder
 *
 * @export
 * @param {string} dir
 * @param {FileCb} cb
 * @param {FileOpts} [options={}]
 */
export function openAllInFolderSync(dir: string, cb: FileCb, options?: FileOpts) {
    if (!dir) throw new Error('No directory specified');
    if (!cb) throw new Error('No callback function specified');

    if (!fs.existsSync(dir)) return;
    if (!fs.lstatSync(dir).isDirectory()) return;
    const files = fs.readdirSync(dir);
    files.sort((a, b) => {
        // put directories first
        const aIsDir = fs.lstatSync(path.resolve(dir, a)).isDirectory();
        const bIsDir = fs.lstatSync(path.resolve(dir, b)).isDirectory();

        return aIsDir ? 1 : bIsDir ? -1 : 0;
    });

    if (!options) options = {};

    if (options.sort) {
        files.sort((a, b) => {
            if (fs.lstatSync(path.resolve(dir, a)).isDirectory() || fs.lstatSync(path.resolve(dir, b)).isDirectory()) return 0;
            return options.sort(path.resolve(dir, a), path.resolve(dir, b));
        });
    }
    files.forEach(file => {
        const filePath = path.resolve(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) openAllInFolderSync(filePath, cb, options);
        else cb(filePath);
    });
}

/**
 * Description placeholder
 *
 * @export
 * @param {string} dir
 * @param {FileCb} cb
 * @param {FileOpts} [options={}]
 * @returns {Promise<void>}
 */
export function openAllInFolder(dir: string, cb: FileCb, options: FileOpts = {}): Promise<void> {
    if (!dir) throw new Error('No directory specified');
    if (!cb) throw new Error('No callback function specified');
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)) return resolve();
        if (!fs.lstatSync(dir).isDirectory()) return resolve();

        fs.readdir(dir, (err, files) => {
            if (err) return reject(err);
            files.forEach(file => {
                const filePath = path.resolve(dir, file);
                if (fs.lstatSync(filePath).isDirectory()) openAllInFolder(filePath, cb);
                else cb(filePath);
            });
        });
    });
}