import { Work } from '@/types/blog';

import deBelloGallico from '@/content/works/de-bello-gallico';
import deBelloCivili from '@/content/works/de-bello-civili';
import deRePublica from '@/content/works/de-re-publica';
import deLegibus from '@/content/works/de-legibus';
import tusculanaeDisputationes from '@/content/works/tusculanae-disputationes';
import deOfficiis from '@/content/works/de-officiis';
import deBrevitateVitae from '@/content/works/de-brevitate-vitae';
import deClementia from '@/content/works/de-clementia';
import epistulaeMorales from '@/content/works/epistulae-morales';
import resGestae from '@/content/works/res-gestae';


export const works: Record<string, Work> = {
  'de-bello-gallico': deBelloGallico,
  'de-bello-civili': deBelloCivili,
  'de-re-publica': deRePublica,
  'de-legibus': deLegibus,
  'tusculanae-disputationes': tusculanaeDisputationes,
  'de-officiis': deOfficiis,
  'de-brevitate-vitae': deBrevitateVitae,
  'de-clementia': deClementia,
  'epistulae-morales': epistulaeMorales,
  'res-gestae': resGestae,
};
