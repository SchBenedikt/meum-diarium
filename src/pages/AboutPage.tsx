import { useParams } from 'react-router-dom';
import { useAuthors } from '@/hooks/use-authors';
import { Author } from '@/types/blog';
import AboutPageNewLayout from './AboutPageNewLayout';
import { CaesarAboutPage } from './about/CaesarAboutPage';
import { CiceroAboutPage } from './about/CiceroAboutPage';
import { AugustusAboutPage } from './about/AugustusAboutPage';
import { SenecaAboutPage } from './about/SenecaAboutPage';
import { CatilinaAboutPage } from './about/CatilinaAboutPage';

export default function AboutPage() {
  const { authorId } = useParams<{ authorId: string }>();
  const { authors } = useAuthors();
  
  if (!authorId || !authors[authorId as Author]) {
    return <AboutPageNewLayout />;
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
      return <AboutPageNewLayout />;
  }
}
