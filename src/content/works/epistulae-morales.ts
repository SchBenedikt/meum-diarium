import { Work } from '@/types/blog';

const work: Work = {
  title: 'Epistulae Morales',
  author: 'seneca',
  year: '62–65 n. Chr.',
  slug: 'epistulae-morales',
  summary: `124 Briefe an Lucilius über stoische Lebensführung. Senecas meistgelesenes Werk: praktische Philosophie für den Alltag. Themen: Zeit, Tod, Freundschaft, Reichtum, Tugend, Glück.`,
  takeaway: `Philosophie als Lebenskunst. Die Briefe zeigen, wie stoische Prinzipien konkret umgesetzt werden. Ein zeitloser Ratgeber für ethisches Leben in einer komplexen Welt. Die Verbindung von theoretischer Weisheit und praktischer Anwendung macht diese Briefe bis heute relevant.`,
  structure: [
    {
      title: 'Buch I–III: Grundlagen der stoischen Lebensführung',
      content: `Einleitung in die stoische Philosophie als praktische Lebenskunst. Zeit als kostbarstes Gut, richtige Nutzung der Freizeit, Bedeutung der Freundschaft, Umgang mit Reichtum und Armut.`
    },
    {
      title: 'Buch IV–V: Umgang mit Affekten und Tugenden',
      content: `Beherrschung von Zorn, Furcht und Leidenschaft. Die vier Kardinaltugenden: Weisheit, Tapferkeit, Gerechtigkeit, Mäßigung. Praktische Übungen zur Charakterbildung.`
    },
    {
      title: 'Buch VI–VII: Soziale Beziehungen und Öffentliches Leben',
      content: `Rolle des Philosophen in der Gesellschaft. Umgang mit Sklaven, Freunden und Feinden. Bedeutung des Rückzugs aus der Politik für philosophische Praxis.`
    },
    {
      title: 'Buch VIII–X: Vorbilder und Lebensbeispiele',
      content: `Beispiele vorbildlicher Stoiker. Analyse von Lebensentscheidungen. Vorbilder wie Cato, Brutus, Scipio. Anwendung philosophischer Prinzipien auf konkrete Situationen.`
    }
  ]
};

export default work;
