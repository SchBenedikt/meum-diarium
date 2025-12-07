import { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '1765110703574',
  slug: 'asdf',
  author: 'caesar',
  title: 'asdf',
  
  excerpt: '',
  historicalDate: '50 v. Chr.',
  historicalYear: -50,
  date: new Date().toISOString().split('T')[0],
  readingTime: 5,
  tags: [],
  coverImage: '',
  content: {
    diary: ``,
    scientific: ``
  },
  translations: {}
};

export default post;
