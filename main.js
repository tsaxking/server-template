const arguments = process.argv.slice(2);
console.log('Arguments:', arguments.map(a => '\x1b[35m' + a + '\x1b[0m').join(' '));
const [env, port, ...args] = arguments;
const modes = {
    test: {
        type: 'test',
        description: 'In test mode, only ts is rendered. This is the mode you should use when debugging',
        command: 'npm test',
        quickInfo: [
            'Static Classes are \x1b[31mnot\x1b[0m combined',
            'Debugging is \x1b[32measier\x1b[0m',
            'Uploads are \x1b[31mslower\x1b[0m',
            'Auto \x1b[32mlogin\x1b[0m',
            'Browser window is \x1b[32mspawned\x1b[0m'
        ]
    },
    dev: {
        type: 'development',
        description: 'This environment is similar to the production environment, but it will still auto login and spawn a browser window.',
        command: 'npm run dev',
        quickInfo: [
            'Static Classes are \x1b[32mcombined\x1b[0m',
            'Debugging is \x1b[31mmore difficult\x1b[0m',
            'Uploads are \x1b[32mfaster\x1b[0m',
            'Auto \x1b[32mlogin\x1b[0m',
            'Browser window is \x1b[32mspawned\x1b[0m'
        ]
    },
    prod: {
        type: 'production',
        description: `In production, the idea is everything is more optimized. (This is a work in progress).`,
        command: 'npm start',
        quickInfo: [
            'Static Classes are \x1b[32mcombined\x1b[0m',
            'Debugging is \x1b[31mmore difficult\x1b[0m',
            'Uploads are \x1b[32mfaster\x1b[0m',
            'No \x1b[31mauto login\x1b[0m (if you are \x1b[34malready logged in\x1b[0m from previous sessions, you \x1b[32mwill be logged in.\x1b[0m All \x1b[34mnew\x1b[0m sessions will \x1b[31mnot\x1b[0m be logged in.)',
            'Browser window is \x1b[31mnot spawned\x1b[0m'
        ]
    }
}
console.clear();

if (process.argv[2] == 'help') {
    console.log('Hello! Welcome to the help menu, please read the following information carefully.');
    console.log('Available modes:');
    // in red
    console.log('\x1b[32m' + 'all modes run "npm i" && "db-updates.js"' + '\x1b[0m');
    for (const mode in modes) {
        // log in colors (type = purple) (command = yellow) (description = white)

        console.log(`\x1b[35m${modes[mode].type}\x1b[0m: \x1b[33m(${modes[mode].command})\x1b[0m - ${modes[mode].description}`);
        console.log(modes[mode].quickInfo.map(i => '    \x1b[34m-\x1b[0m ' + i).join('\n'));
    }
    return;
}
console.log(`Currently, you are running in \x1b[35m${modes[process.argv[2]].type} mode.\x1b[0m`);
console.log(modes[process.argv[2]].quickInfo.map(i => '    \x1b[34m-\x1b[0m ' + i).join('\n'));
console.log('Please run "npm run help" to see all the modes available.');

const {
    exec,
    spawn
} = require('child_process');

// dotenv
require('dotenv').config();

const spawnChild = ({ command, args = [], onData = true, onOpen = true, onClose = false }, name) => {
    const child = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        cwd: process.cwd(),
        env: process.env
    });
    if (onData) {
        child.stdout.on('data', data => {
            try {
                console.log(name + ':', data.toString().trim('\r'));
            } catch {}
        });
    }
    child.stderr.on('data', data => {
        try {
            console.log(name + ':', data.toString().trim('\r'));
        } catch {}
    });
    if (onClose) {
        child.on('exit', code => {
            try {
                console.log(name + ':', 'exited with code', code);
            } catch {}
        });
    }
    child.log = (...args) => {
        console.log(name + ':', ...args);
    }

    if (onOpen) {
        const funSpawnMessgges = [
            'A wild child has appeared!',
            'Summoning child...',
            'Child has been summoned!',
            'Child has been summoned!',
            'Child has been born!'
        ];

        child.log(funSpawnMessgges[Math.floor(Math.random() * funSpawnMessgges.length)]);
    }

    return child;
}

// build is in yellow
const update = spawnChild({
    command: 'npm',
    args: [
        'run',
        'update',
        'main'
    ]
}, '\x1b[36mUpdate\x1b[0m');

let gitClient;

const spawnGitClient = (...args) => {
    args = args.join(' ');
    // split by spaces unless the space is in single or double quotes
    args = args.split(' ').reduce((acc, cur) => {
        if (cur.startsWith('"') || cur.startsWith("'")) {
            acc.inQuotes = true;
            acc.string += cur + ' ';
        } else if (cur.endsWith('"') || cur.endsWith("'")) {
            acc.inQuotes = false;
            acc.string += cur + ' ';
            acc.array.push(acc.string.trim());
            acc.string = '';
        } else if (acc.inQuotes) {
            acc.string += cur + ' ';
        } else {
            acc.array.push(cur);
        }
        return acc;
    }, {
        array: [],
        string: '',
        inQuotes: false
    }).array;

    gitClient = spawnChild({
        command: 'git',
        args,
        onOpen: false,
        onClose: false
    }, '\x1b[35mGit\x1b[0m');
}

spawnGitClient('status');



update.stdout.on('data', data => {
    try {
        const str = data.toString().trim('\r');
        if (str.includes('Finished all update tasks')) {


            const now = new Date();
            const next2am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 2, 0, 0, 0);

            const hours = now.getHours() - next2am.getHours();
            const minutes = now.getMinutes() - next2am.getMinutes();
            const seconds = now.getSeconds() - next2am.getSeconds();

            console.log(`Next update is in ${24 - hours} hours, ${60 - minutes} minutes, and ${60 - seconds} seconds.`);

            setTimeout(() => {
                update.stdin.write('node ./server-update.js make events updates backup tba');
                setInterval(() => {
                    update.stdin.write('node ./server-update.js make events updates backup tba');
                }, 1000 * 60 * 60 * 24);
            }, Math.abs(next2am.getTime() - now.getTime()));

            // server is in green
            const build = spawnChild({
                command: 'node',
                args: [
                    'build.js',
                    env == 'test' ? '' : 'all',
                    env
                ]
            }, '\x1b[33mBuild\x1b[0m');
            // update is in cyan
            const server = spawnChild({
                command: 'nodemon',
                args: [
                    'server.js',
                    env ? env : 'test',
                    process.env.PORT || port || 2122,
                    ...args
                ]
            }, '\x1b[32mServer\x1b[0m');


            const killAll = () => {
                build.log('Process ended');
                build.kill();
                server.log('Process ended');
                server.kill();
                update.log('Process ended');
                update.kill();
                gitClient.log('Process ended');
                gitClient.kill();

                console.log('All processes ended');
                process.exit(0);
            }

            process.on('exit', (data) => {
                console.log('exit', data);

                killAll();
            });

            process.on('SIGINT', (data) => {
                console.log('SIGINT', data);

                killAll();
            });

            process.on('SIGTERM', (data) => {
                console.log('SIGTERM', data);

                killAll();
            });

            process.on('SIGUSR1', (data) => {
                console.log('SIGUSR1', data);

                killAll();
            });

            process.on('SIGUSR2', (data) => {
                console.log('SIGUSR2', data);

                killAll();
            });

            process.on('uncaughtException', (data) => {
                console.log('uncaughtException', data);

                killAll();
            });


            // when the user writes in the console
            process.stdin.on('data', (data) => {
                data = data.toString().trim('\r').split(' ');
                // const [childProcess, ...args] = data;

                // switch (childProcess.toLowerCase()) {
                //     case 'b', 'build', '-b':
                //         build.stdin.write(args.join(' ') + '\n');
                //         break;
                //     case 's', 'server', '-s':
                //         server.stdin.write(args.join(' ') + '\n');
                //         break;
                //     case 'd', 'update', '-d':
                //         update.stdin.write(args.join(' ') + '\n');
                //         break;
                //     default:
                //         console.log('Invalid command');
                //         break;
                // }

                const [command, ...args] = data;
                switch (command.toLowerCase()) {
                    case 'rebuild', 'rb':
                        build.stdin.write('rebuild');
                        break;
                    case 'update', 'ud':
                        update.stdin.write('npm run update\n');
                        break;
                    case 'restart', 'rs':
                        server.stdin.write('rs\n');
                        break;
                    case 'git':
                        spawnGitClient(...args);
                        break;
                    case 'db':
                        update.stdin.write('node ./init/server-update.js\n');
                        break;
                }
            });


            // const fs = require('fs');
            // const path = require('path');
            // const watchFiles = () => {
            //     const folders = [
            //         './server-functions',
            //         './static',
            //         './templates'
            //     ];

            //     const watchDir = (dir) => {
            //         // recursive to watch all files in dir

            //         const p = path.resolve(__dirname, dir);

            //         // if it is a file, watch
            //         if (fs) {

            //         } else {
            //             fs.readdirSync(p).forEach(f => watchDir);
            //         }
            //     }

            //     folders.forEach(watchDir);
            // };

            if (arguments.includes('prod') || arguments.includes('no-browser')) return;

            // open browser
            const url = 'http://localhost:' + (process.env.PORT || port || 2122);
            console.log('To not open browser, run in production mode or run with the argument "no-browser"');

            // start a new browser window
            // make it so that it can reload from the server
            switch (process.platform) {
                case 'win32':
                    exec('start ' + url);
                    break;
                case 'darwin': // apple
                    exec('open ' + url);
                    break;
                case 'linux':
                    exec('xdg-open ' + url);
                    break;
            }
        }
    } catch {}
});