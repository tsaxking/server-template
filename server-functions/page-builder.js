"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = {};
module.exports = (req, res, next) => {
    const { url } = req;
    if (builder[url]) {
        res.send(builder[url]);
    }
    else {
        next();
    }
};
