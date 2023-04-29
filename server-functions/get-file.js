"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAllInFolder = exports.openAllInFolderSync = exports.fileStream = exports.formatBytes = exports.deleteUpload = exports.getUpload = exports.uploadMultipleFiles = exports.saveUpload = exports.saveTemplate = exports.saveTemplateSync = exports.getTemplate = exports.getTemplateSync = exports.saveJSON = exports.saveJSONSync = exports.getJSON = exports.getJSONSync = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
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
function getJSONSync(file) {
    if (file.startsWith('/'))
        file = '.' + file;
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
    }
    catch (e) {
        console.error('Error parsing JSON file: ' + file, e);
        return false;
    }
}
exports.getJSONSync = getJSONSync;
;
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
function getJSON(file) {
    return new Promise((res, rej) => {
        if (file.startsWith('/'))
            file = '.' + file;
        const p = path.resolve(__dirname, '../jsons', file + '.json');
        if (!fs.existsSync(p)) {
            return res(false);
        }
        fs.readFile(p, 'utf8', (err, content) => {
            if (err)
                return rej(err);
            // remove all /* */ comments
            content = content.replace(/\/\*[\s\S]*?\*\//g, '');
            // remove all // comments
            content = content.replace(/\/\/.*/g, '');
            try {
                res(JSON.parse(content));
            }
            catch (e) {
                console.error('Error parsing JSON file: ' + file, e);
                res(false);
            }
        });
    });
}
exports.getJSON = getJSON;
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
function saveJSONSync(file, data) {
    if (file.startsWith('/'))
        file = '.' + file;
    const p = path.resolve(__dirname, '../jsons', file + '.json');
    try {
        JSON.stringify(data);
    }
    catch (e) {
        console.error('Error stringifying JSON file: ' + file, e);
        return false;
    }
    fs.writeFileSync(p, JSON.stringify(data, null, 4), 'utf8');
    return true;
}
exports.saveJSONSync = saveJSONSync;
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
function saveJSON(file, data) {
    return new Promise((res, rej) => {
        if (file.startsWith('/'))
            file = '.' + file;
        const p = path.resolve(__dirname, '../jsons', file + '.json');
        try {
            JSON.stringify(data);
        }
        catch (e) {
            console.error('Error stringifying JSON file: ' + file, e);
            return res(false);
        }
        fs.writeFile(p, JSON.stringify(data, null, 4), 'utf8', err => {
            if (err)
                return rej(err);
            res(true);
        });
    });
}
exports.saveJSON = saveJSON;
/**
 * Gets an html template from the templates folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @returns {string|boolean} false if there is an error, otherwise the html
 */
function getTemplateSync(file) {
    if (file.startsWith('/'))
        file = '.' + file;
    const p = path.resolve(__dirname, '../templates', file + '.html');
    if (!fs.existsSync(p)) {
        return false;
    }
    const data = fs.readFileSync(p, 'utf8');
    return data;
}
exports.getTemplateSync = getTemplateSync;
;
/**
 * Gets an html template from the templates folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @returns {Promise<string|boolean>} false if there is an error, otherwise the html
 */
function getTemplate(file) {
    return new Promise((res, rej) => {
        if (file.startsWith('/'))
            file = '.' + file;
        const p = path.resolve(__dirname, '../templates', file + '.html');
        if (!fs.existsSync(p)) {
            return res(false);
        }
        fs.readFile(p, 'utf8', (err, data) => {
            if (err)
                return rej(err);
            res(data);
        });
    });
}
exports.getTemplate = getTemplate;
/**
 * Saves an html template to the templates folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @param {string} data the data to save
 * @returns {boolean} whether the file was saved successfully
 */
function saveTemplateSync(file, data) {
    if (file.startsWith('/'))
        file = '.' + file;
    const p = path.resolve(__dirname, '../templates', file + '.html');
    fs.writeFileSync(p, data, 'utf8');
    return true;
}
exports.saveTemplateSync = saveTemplateSync;
/**
 * Saves an html template to the templates folder
 *
 * @export
 * @param {string} file the file name with no extension (ex '/index')
 * @param {string} data the data to save
 * @returns {Promise<boolean>} whether the file was saved successfully
 */
function saveTemplate(file, data) {
    return new Promise((res, rej) => {
        if (file.startsWith('/'))
            file = '.' + file;
        const p = path.resolve(__dirname, '../templates', file);
        fs.writeFile(p, data, 'utf8', err => {
            if (err)
                return rej(err);
            res(true);
        });
    });
}
exports.saveTemplate = saveTemplate;
/**
 * Saves a file to the uploads folder
 *
 * @export
 * @param {*} data the data to save
 * @param {string} filename the filename to save it as
 * @returns {Promise<void>}
 */
function saveUpload(data, filename) {
    return new Promise((res, rej) => {
        data = Buffer.from(data, 'binary');
        fs.writeFile(path.resolve(__dirname, '../uploads', filename), data, err => {
            if (err)
                rej(err);
            else
                res();
        });
    });
}
exports.saveUpload = saveUpload;
/**
 * Description placeholder
 *
 * @export
 * @param {File[]} files
 * @returns {Promise<void>}
 */
function uploadMultipleFiles(files) {
    return new Promise((resolve, reject) => {
        const promises = [];
        files.forEach(file => {
            promises.push(saveUpload(file.data, file.filename + file.ext));
        });
        Promise.all(promises).then(() => resolve()).catch(err => reject(err));
    });
}
exports.uploadMultipleFiles = uploadMultipleFiles;
/**
 * Description placeholder
 *
 * @export
 * @param {string} filename
 * @returns {*}
 */
function getUpload(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '../uploads', filename), (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
exports.getUpload = getUpload;
/**
 * Description placeholder
 *
 * @export
 * @param {string} filename
 * @returns {Promise<void>}
 */
function deleteUpload(filename) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.resolve(__dirname, '../uploads', filename), err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
exports.deleteUpload = deleteUpload;
/**
 * Description placeholder
 *
 * @export
 * @param {number} bytes
 * @param {number} [decimals=2]
 * @returns {{ string: string, type: string }}
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return {
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
    };
}
exports.formatBytes = formatBytes;
/**
 * Description placeholder
 *
 * @param {FileStreamOptions} opts
 * @returns {(req: any, res: any, next: any) => unknown}
 */
const fileStream = (opts) => {
    return async (req, res, next) => {
        let { maxFileSize, extensions } = opts;
        maxFileSize = maxFileSize || 1000000;
        const generateFileId = () => {
            return (0, uuid_1.v4)() + '-' + Date.now();
        };
        let fileId = generateFileId();
        let { headers: { 'x-content-type': contentType, 'x-file-name': fileName, 'x-file-size': fileSize, 'x-file-type': fileType, 'x-file-ext': fileExt } } = req;
        if (maxFileSize && +fileSize > maxFileSize) {
            console.log('File size is too large', formatBytes(+fileSize), formatBytes(maxFileSize));
            return res.json({
                error: 'File size too large'
            });
        }
        if (extensions && !extensions.includes(fileExt)) {
            console.log('File type is not allowed', fileExt, extensions);
        }
        if (!fileExt.startsWith('.'))
            fileExt = '.' + fileExt;
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
            };
            next();
        });
        req.on('error', (err) => {
            console.log(err);
            res.json({
                error: 'Error uploading file: ' + fileName
            });
        });
    };
};
exports.fileStream = fileStream;
/**
 * Description placeholder
 *
 * @export
 * @param {string} dir
 * @param {FileCb} cb
 * @param {FileOpts} [options={}]
 */
function openAllInFolderSync(dir, cb, options) {
    if (!dir)
        throw new Error('No directory specified');
    if (!cb)
        throw new Error('No callback function specified');
    if (!fs.existsSync(dir))
        return;
    if (!fs.lstatSync(dir).isDirectory())
        return;
    const files = fs.readdirSync(dir);
    files.sort((a, b) => {
        // put directories first
        const aIsDir = fs.lstatSync(path.resolve(dir, a)).isDirectory();
        const bIsDir = fs.lstatSync(path.resolve(dir, b)).isDirectory();
        return aIsDir ? 1 : bIsDir ? -1 : 0;
    });
    if (!options)
        options = {};
    if (options.sort) {
        files.sort((a, b) => {
            if (fs.lstatSync(path.resolve(dir, a)).isDirectory() || fs.lstatSync(path.resolve(dir, b)).isDirectory())
                return 0;
            return options.sort(path.resolve(dir, a), path.resolve(dir, b));
        });
    }
    files.forEach(file => {
        const filePath = path.resolve(dir, file);
        if (fs.lstatSync(filePath).isDirectory())
            openAllInFolderSync(filePath, cb, options);
        else
            cb(filePath);
    });
}
exports.openAllInFolderSync = openAllInFolderSync;
/**
 * Description placeholder
 *
 * @export
 * @param {string} dir
 * @param {FileCb} cb
 * @param {FileOpts} [options={}]
 * @returns {Promise<void>}
 */
function openAllInFolder(dir, cb, options = {}) {
    if (!dir)
        throw new Error('No directory specified');
    if (!cb)
        throw new Error('No callback function specified');
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir))
            return resolve();
        if (!fs.lstatSync(dir).isDirectory())
            return resolve();
        fs.readdir(dir, (err, files) => {
            if (err)
                return reject(err);
            files.forEach(file => {
                const filePath = path.resolve(dir, file);
                if (fs.lstatSync(filePath).isDirectory())
                    openAllInFolder(filePath, cb);
                else
                    cb(filePath);
            });
        });
    });
}
exports.openAllInFolder = openAllInFolder;
