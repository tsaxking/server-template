import * as fs from 'fs';
import * as path from 'path';
import { getJSON, getTemplate } from './files';
import { NextFunction, Request, Response } from 'express';
import { MAIN } from './databases';
import { fromSnakeCase, capitalize, toSnakeCase } from './structure/text';
import { Server } from 'socket.io';
import { Session } from './structure/sessions';
import { SocketWrapper } from './structure/socket';


declare global {
    namespace Express {
        interface Request {
            session: Session;
            start: number;
            io: Server;
            file?: {
                id: string;
                name: string;
                size: number;
                type: string;
                ext: string;
                contentType: string;
                filename: string
            }
            socketIO?: SocketWrapper;
        }
    }
}


const builds: {
    [key: string]: (req?: Request) => Promise<string>;
} = {
    // put your pages here:
    /*
    example:
        '/account': async (req: Request) => {
            const { account } = req.session;

            if (account) {
                const template = await getTemplate('account', account); // uses node-html-constructor if you pass in the second parameter
                return template;
            }

            return 'You are not logged in.';
        }
    */
};


export const builder = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req;
    if (builds[url]) {
        res.send(await builds[url](req));
    } else {
        next();
    }
};

export const homeBuilder = async (url: string) => {
    return await getTemplate('home/index', {
        pageTitle: capitalize(fromSnakeCase(url, '-')).slice(1),
        content: builds[url] ? await builds[url]() : '',
        footer: await getTemplate('components/footer', {
            year: new Date().getFullYear()
        }),
        navbar: await navBuilder(url, false)
    });
};


export const navBuilder = async (url: string, offcanvas: boolean) => {
    return await getTemplate('components/navbar', {
        offcanvas: {
            offcanvas
        },
        navbarRepeat: await getJSON('pages/home').then((data) => {
            return data.map((page: string) => {
                return {
                    active: '/' + page === url,
                    name: capitalize(fromSnakeCase(page, '-')),
                    link: '/' + page
                }
            });
        })
    })
}