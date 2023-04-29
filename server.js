const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { getJSON } = require('jquery');
const { openAllInFolderSync } = require('./server-functions/get-file');
const path = require('path');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const { getClientIp } = require('request-ip');
const { Session } = require('./server-functions/structure/sessions');

require('dotenv').config();
const { PORT } = process.env;

const [,, mode, ...args] = process.argv;


const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    // your socket code here

    // ▄▀▀ ▄▀▄ ▄▀▀ █▄▀ ██▀ ▀█▀ ▄▀▀ 
    // ▄█▀ ▀▄▀ ▀▄▄ █ █ █▄▄  █  ▄█▀ 





























    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use('/static', express.static(path.resolve(__dirname, './static')));
app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

app.use((req, res, next) => {
    req.io = io;
    req.start = Date.now();
    req.ip = getClientIp(req);
    next();
});

function stripHtml(body) {
    let files;

    if (body.files) {
        files = JSON.parse(JSON.stringify(body.files));
        delete body.files;
    }

    let str = JSON.stringify(body);
    str = str.replace(/<[^<>]+>/g, '');

    obj = JSON.parse(str);
    obj.files = files;

    return obj;
}

// logs body of post request
app.post('/*', (req, res, next) => {
    req.body = stripHtml(req.body);
    next();
});

app.use(Session.middleware);


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


// █▀▄ ██▀ ▄▀▄ █ █ ██▀ ▄▀▀ ▀█▀ ▄▀▀ 
// █▀▄ █▄▄ ▀▄█ ▀▄█ █▄▄ ▄█▀  █  ▄█▀ 










































































let logCache = [];

// sends logs to client every 10 seconds
setInterval(() => {
    if (logCache.length) {
        io.to('logs').emit('request-logs', logCache);
        logCache = [];
    }
}, 1000 * 10);

app.use((req, res, next) => {
    const csvObj = {
        date: Date.now(),
        duration: Date.now() - req.start,
        ip: req.sessions.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        userAgent: req.headers['user-agent'],
        body: req.method == 'post' ? JSON.stringify((() => {
            let { body } = req;
            body = JSON.parse(JSON.stringify(body));
            delete body.password;
            delete body.confirmPassword;
            delete body.files;
            return body;
        })()) : '',
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query)
    };

    logCache.push(csvObj);

    ObjectsToCsv([csvObj]).toDisk('./logs.csv', { append: true });
});



const clearLogs = () => {
    fs.writeFileSync('./logs.csv', '');
    logCache = [];
}


console.log('Clearing logs in', timeTo12AM / 1000 / 60, 'minutes');
setTimeout(() => {
    clearLogs();
    setInterval(clearLogs, 1000 * 60 * 60 * 24);
}, timeTo12AM);


server.listen(PORT, () => {
    const domain = mode === 'production' ? 'https://www.{{example}}.com' : 'http://localhost';

    console.log('------------------------------------------------');
    console.log(`Listening on port \x1b[35m${domain}:${PORT}...\x1b[0m`);
});