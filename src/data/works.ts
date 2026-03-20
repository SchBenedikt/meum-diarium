import { Work } from '@/types/blog';
import deBelloGallico from '@/content/works/de-bello-gallico';
import deBelloCivili from '@/content/works/de-bello-civili';
import inCatilinam from '@/content/works/in-catilinam';
import resGestae from '@/content/works/res-gestae';
import deRePublica from '@/content/works/de-re-publica';
import deOfficiis from '@/content/works/de-officiis';
import philippicae from '@/content/works/philippicae';
import deIra from '@/content/works/de-ira';
import epistulaeMorales from '@/content/works/epistulae-morales';
import catilinaeConiuratio from '@/content/works/catilinae-coniuratio';

export const works: Record<string, Work> = {
    'de-bello-gallico': deBelloGallico,
    'de-bello-civili': deBelloCivili,
    'de-re-publica': deRePublica,
    'de-officiis': deOfficiis,
    'in-catilinam': inCatilinam,
    'philippicae': philippicae,
    'res-gestae': resGestae,
    'de-ira': deIra,
    'epistulae-morales': epistulaeMorales,
    'catilinae-coniuratio': catilinaeConiuratio,
};
