const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/content');
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('"en": {\n        "term": "",') ||
        content.includes('"en": {\n    "title": "",') ||
        content.includes('"en": {\n    "title": "asdf"') ||
        content.includes('"en": {\n    "title": "placeholder"')) {
        console.log(`Empty/Placeholder EN translation: ${file}`);
    }
    if (content.includes('"la": {\n        "term": "",') ||
        content.includes('"la": {\n    "title": "",')) {
        console.log(`Empty LA translation: ${file}`);
    }
});
