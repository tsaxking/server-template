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
exports.Email = void 0;
const nodemailer = __importStar(require("nodemailer"));
const sgTransport = __importStar(require("nodemailer-sendgrid-transport"));
const os = __importStar(require("os"));
require('dotenv').config();
var transporter = nodemailer.createTransport(sgTransport({
    service: 'gmail',
    auth: {
        api_key: process.env.SENGRID_API_KEY
    }
}));
class Email {
    static #templates = {};
    static get templates() {
        return this.#templates;
    }
    static addTemplate(name, template) {
        this.#templates[name] = template;
    }
    recipient;
    subject;
    #attachments = [];
    constructor(recipient, subject) {
        this.recipient = recipient;
        this.subject = subject;
    }
    addAttachment(attachment) {
        this.#attachments.push(attachment);
    }
    removeAttachment(attachment) {
        this.#attachments = this.#attachments.filter(a => a != attachment);
    }
    send() {
        if (os)
            ;
    }
}
exports.Email = Email;
