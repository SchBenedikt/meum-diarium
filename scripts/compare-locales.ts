import { de } from '../src/locales/de';
import { en } from '../src/locales/en';
import { la } from '../src/locales/la';

function getKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res.concat(prefix + el);
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return res.concat(getKeys(obj[el], prefix + el + '.'));
        }
        return res.concat(prefix + el);
    }, []);
}

const deKeys = getKeys(de);
const enKeys = getKeys(en);
const laKeys = getKeys(la);

console.log('Comparing DE and EN:');
deKeys.filter(k => !enKeys.includes(k)).forEach(k => console.log(`Missing in EN: ${k}`));
enKeys.filter(k => !deKeys.includes(k)).forEach(k => console.log(`Missing in DE (found in EN): ${k}`));

console.log('\nComparing DE and LA:');
deKeys.filter(k => !laKeys.includes(k)).forEach(k => console.log(`Missing in LA: ${k}`));
laKeys.filter(k => !deKeys.includes(k)).forEach(k => console.log(`Missing in DE (found in LA): ${k}`));
