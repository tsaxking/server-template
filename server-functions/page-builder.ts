import * as fs from 'fs';
import * as path from 'path';
import { getJSON, getTemplate } from './get-file';
import { NextFunction, Request, Response } from 'express';

const builder: {
    [key: string]: (req: Request) => string;
} = {};


module.exports = (req: Request, res: Response, next: NextFunction) => {
    const { url } = req;
    if (builder[url]) {
        res.send(builder[url]);
    } else {
        next();
    }
}