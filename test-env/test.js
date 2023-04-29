const { compile } = require('@gerhobbelt/gitignore-parser');



const ignoreArr = [
    'file-ext.txt',
    '*.ext',
    'folder/',
    'contents/*',
    '*/nested-folder/*',
    'filename.*'
];

const files = [
    '1/path/to/file.ext',
    '0/path/to/file.ext2',
    '1/path/to/file-ext.txt',
    '1/filename.test',
    '1/path/to/filename.test',
    '1/folder/file-thing.noext',
    '1/fo/nested-folder/file-thing.noext',
    '0/fo/bar/end-folder/file.noext',
    '0/fo/bar/end-filename.test',
    '1/contents/file.noext'
];

const gitignore = compile(ignoreArr.join('\n'));

console.log(files.map(file => {
    const expected = +file[0];
    const test = expected == gitignore.denies(file.slice(1));
    if (!test) return {
        file: file.slice(1),
        expected,
        test
    }
}));