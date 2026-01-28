import { useParams } from 'react-router-dom';
import { authors as baseAuthors } from '@/data/authors';
import { Author } from '@/types/blog';
import { GeneralAboutPage } from './about/GeneralAboutPage';
import { CaesarAboutPage } from './about/CaesarAboutPage';
import { CiceroAboutPage } from './about/CiceroAboutPage';
import { AugustusAboutPage } from './about/AugustusAboutPage';
import { SenecaAboutPage } from './about/SenecaAboutPage';
import { CatilinaAboutPage } from './about/CatilinaAboutPage';

export default function AboutPage() {
  const { authorId } = useParams<{ authorId: string }>();

  if (!authorId || !baseAuthors[authorId as Author]) {
    return <GeneralAboutPage />;
  }

  switch (authorId) {
    case 'caesar':
      return <CaesarAboutPage />;
    case 'cicero':
      return <CiceroAboutPage />;
    case 'augustus':
      return <AugustusAboutPage />;
    case 'seneca':
      return <SenecaAboutPage />;
    case 'catilina':
      return <CatilinaAboutPage />;
    default:
      return <GeneralAboutPage />;
  }
}
