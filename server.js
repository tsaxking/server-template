const express = require('express');
require('dotenv').config();
const { Server } = require('socket.io');
const http = require('http');
const { getJSON } = require('jquery');
const { openAllInFolder, openAllInFolderSync } = require('./server-functions/get-file');
const path = require('path');
const fs = require('fs');

const { PORT } = process.env;

const [,, mode, ...args] = process.argv;


const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    // your socket code here


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));


const staticFiles = {
    topScripts: [],
    bottomScripts: [],
    styles: []
};

const build = getJSON('/build');
if (mode === 'production') {
    const files = Object.keys(build.streams);

    files.forEach((file) => {
        switch (file) {
            case 'top':
                staticFiles.topScripts.push(`../static/build/${file}.min.js`);
                break;
            case 'bottom':
                staticFiles.bottomScripts.push(`../static/build/${file}.min.js`);
                break;
            case 'style':
                staticFiles.styles.push(`../static/build/${file}.min.css`);
                break;
        }
    });
} else { // development
    openAllInFolderSync(path.resolve('./static/js/top'), (file) => {
        staticFiles.topScripts.push(`../static/js/top/${file}`);
    }, {
        sort: (a, b) => {
            return build.top.priority.indexOf(a) - build.top.priority.indexOf(b);
        }
    });

    openAllInFolderSync(path.resolve('./static/js/bottom'), (file) => {
        staticFiles.bottomScripts.push(`../static/js/bottom/${file}`);
    }, {
        sort: (a, b) => {
            return build.bottom.priority.indexOf(a) - build.bottom.priority.indexOf(b);
        }
    });

    openAllInFolderSync(path.resolve('./static/css'), (file) => {
        staticFiles.styles.push(`../static/css/${file}`);
    }, {
        sort: (a, b) => {
            return build.style.priority.indexOf(a) - build.style.priority.indexOf(b);
        }
    });
}


// your requests here




server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});