import * as nodemailer from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import * as dotenv from 'dotenv';
import * as os from 'os';

require('dotenv').config();

var transporter = nodemailer.createTransport(sgTransport({
    service: 'gmail',
    auth: {
        api_key: process.env.SENGRID_API_KEY
    }
}));









export class Email {
    static #templates: { [key: string]: string } = {};

    static get templates() {
        return this.#templates;
    }

    static addTemplate(name: string, template: string) {
        this.#templates[name] = template;
    }














    
    recipient: string;
    subject: string;
    #attachments: any[] = [];

    constructor(recipient: string, subject: string) {
        this.recipient = recipient;
        this.subject = subject;
    }

    addAttachment(attachment: any) {
        this.#attachments.push(attachment);
    }

    removeAttachment(attachment: any) {
        this.#attachments = this.#attachments.filter(a => a != attachment);
    }





    send() {
        if (os);
    }
}