const fs = require('fs');
const path = require('path');
const UglifyJS = require("uglify-js");
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const ChildProcess = require('child_process');

const readJSON = (path) => {
    let content = fs.readFileSync(path, 'utf8');

    // remove all /* */ comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // remove all // comments
    content = content.replace(/\/\/.*/g, '');

    return JSON.parse(content);
}

const build = getJSON('/build');

const mapDirectory = (dir, type, priority = []) => {
    const files = [];

    const readDir = (dir) => {
        const list = fs.readdirSync(dir);

        list.forEach((file) => {
            const filePath = path.join(dir, file);

            const stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                readDir(filePath);
            } else {
                const ext = path.extname(filePath);
                // console.log(ext, type);
                if (ext !== '.' + type) return;
                const name = path.basename(filePath, ext);

                files.push({
                    path: filePath,
                    name: name,
                    ext,
                    priority: priority.indexOf(name) !== -1 ? priority.indexOf(name) : Infinity
                });
            }
        });
    };

    readDir(dir);

    files.sort((a, b) => a.priority - b.priority);

    return files;
};

const delimiters = {
    js: ";",
    css: "\n"
}

const spawnChild = ({ command, args = [], onData = true, onOpen = true, onClose = false }, name) => {
    const child = ChildProcess.spawn(command, args, {
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

const runTs = async (directory) => {
    return new Promise((res,rej) => {
        const tsConfig = readJSON(path.resolve(__dirname, directory, './tsconfig.json'));

        const child = ChildProcess.spawn('tsc', [], {
            stdio: 'pipe',
            shell: true,
            cwd: directory,
            env: process.env
        });

        // log data in green
        const log = (data) => {
            console.log('\x1b[32mtsc:\x1b[0m', data.toString().trim('\r'));
        };

        child.stdout.on('data', log);
        child.stderr.on('data', log);
        child.on('close', (code) => {
            console.error(`tsc child process exited with code ${code}`);

            switch (code) {
                // if tsc is not installed
                case 127:
                    return rej('tsc is not installed properly on your machine! Please install it globally with "npm i -g typescript"!', directory);
                // if tsc is installed but there is no tsconfig.json
                case 1:
                    return rej('No tsconfig.json found!', directory);
                default:
                    break;
            }
    
            if (!tsConfig.compilerOptions.outFile) return rej('No outFile defined in tsconfig.json!', directory);
            if (!tsConfig.compilerOptions.outDir) tsConfig.compilerOptions.outDir = './';
            res(path.resolve(__dirname, directory, tsConfig.compilerOptions.outDir, tsConfig.compilerOptions.outFile));

            child.kill();
        });
    });
}


const runBuild = async (build) => {
    const { ignore: globalIgnore, minify, submodules, streams, buildDir } = build;

    if (!streams) {
        console.error('No streams defined! Aborting build...');

        console.log('Build failed!', 'Be sure to add a property "streams" to your build.json file.');
        console.log("Example:");
        console.log(JSON.stringify({
            ...build,
            streams: {
                folder: './src (or any other folder)',
                type: 'js (or css)',
                priority: ['index.js', 'main.js', '(any other files you want to be loaded first in order)'],
                ignore: ['test.js', '(any other files you want to ignore)'],
                ts: '(true or false) - if true, will run "tsc" in the folder before writing to the stream'
            }
        }));

        return;
    }

    const fileStreams = Object.keys(streams).reduce((acc, cur) => {
        acc[cur] = fs.createWriteStream(path.resolve(__dirname, buildDir, cur + '.' + streams[cur].type));
        return acc;
    }, {});

    if (!fs.existsSync(path.resolve(__dirname, buildDir))) {
        fs.mkdirSync(path.resolve(__dirname, buildDir));
    }

    for (const [name, file] of Object.entries(streams)) {
        const { folder, type, priority, ignore, ts } = file;

        const dir = path.resolve(__dirname, folder);

        const fileStream = fileStreams[name];

        const files = mapDirectory(dir, type, priority);


        for (const file of files) {
            if (ignore && ignore.indexOf(file.name) !== -1) continue;
            if (globalIgnore && globalIgnore.indexOf(file.name) !== -1) continue;

            console.log('Writing', file.name + file.ext, 'to', name + '.' + type, '...');

            if (ts) {
                const path = await runTs(dir);
                const content = fs.readFileSync(path);
                fileStream.write(content);
                fileStream.write(delimiters[type]);

                continue;
            }
            
            const content = fs.readFileSync(file.path);
            fileStream.write(content);
            fileStream.write(delimiters[type]);
        }
    }

    if (submodules) {
        for (const [name, submodule] of Object.entries(submodules)) {
            const folder = path.resolve(__dirname, name);

            if (!fs.existsSync(folder)) {
                console.error(`Submodule ${name} does not exist!`);
                continue;
            }

            const { ts, stream, type, ignore, priority } = submodule;

            // console.log(path.resolve(__dirname, buildDir, name + '.' + type));

            const fileStream = fileStreams[stream];

            if (ts) {
                // console.log('is it this fucking thing?')
                const filePath = await runTs(folder);
                // console.log('path:', filePath);
                const content = fs.readFileSync(path.resolve(__dirname, filePath));

                fileStream.write(content);
                fileStream.write(delimiters[type]);
                continue;
            }


            const files = mapDirectory(folder, type, priority);

            files.forEach((file) => {
                if (ignore && ignore.indexOf(file.name) !== -1) return;
                if (globalIgnore && globalIgnore.indexOf(file.name) !== -1) return;

                const content = fs.readFileSync(file.path);

                fileStream.write(content);
                fileStream.write(delimiters[type]);
            });
        }
    }


    if (minify) {
        Object.keys(build.streams).forEach((stream) => {
            const streamPath = path.resolve(__dirname, buildDir, stream + '.' + build.streams[stream].type);

            let content = fs.readFileSync(streamPath, 'utf8');
            const ext = path.extname(streamPath);

            switch (ext) {
                case '.js':
                    content = UglifyJS.minify(content, {
                        compress: {
                            drop_console: true
                        }
                    }).code;
                    fs.writeFileSync(path.resolve(__dirname, buildDir, stream + '.min' + ext), content);
                    break;
                case '.css':
                    postcss([autoprefixer, cssnano])
                        .process(content, { from: undefined })
                        .then((result) => {
                            content = result.css;
                            fs.writeFileSync(path.resolve(__dirname, buildDir, stream + '.min' + ext), content);
                        });
                    break;
            }
        });

    }
};

runBuild(build);

process.on('data', (data) => {
    data = data.toString().trim().replace('\r', '');
    const [command, ...args] = data.split(' ');

    switch (command) {
        case 'rebuild' || 'build' || 'rb' || 'b':
            runBuild();
            break;
    }
});

fs.watch(path.resolve(__dirname, '../static'), (event, filename) => {
    const exists = Object.entries(build.streams).filter(([stream, {type}]) => {
        return stream + '.min.' + type === filename;
    });

    if (exists.length) return;

    console.log('File changed, rebuilding...');
    runBuild();
});