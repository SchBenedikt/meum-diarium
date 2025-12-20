import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { authors as baseAuthors } from '@/data/authors';
import { Author, Work } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { Calendar, User, CheckCircle, ListTree, ArrowLeft, BookOpen, Award, Lightbulb, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import NotFound from './NotFound';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedWork, getTranslatedAuthor } from '@/lib/translator';
import { works as baseWorks } from '@/data/works';
import { PageHero } from '@/components/layout/PageHero';

export default function WorkPage() {
  const { slug, authorId } = useParams<{ slug: string, authorId: string }>();
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [work, setWork] = useState<Work | null>(null);
  const [author, setAuthor] = useState(authorId ? baseAuthors[authorId as Author] : null);
  const [otherWorks, setOtherWorks] = useState<Work[]>([]);

  useEffect(() => {
    if (authorId) {
      setCurrentAuthor(authorId as Author);
    }
  }, [authorId, setCurrentAuthor]);

  useEffect(() => {
    async function translateContent() {
      if (slug) {
        const translatedWork = await getTranslatedWork(language, slug);
        setWork(translatedWork);

        if (translatedWork) {
          const translatedAuthor = await getTranslatedAuthor(language, translatedWork.author);
          setAuthor(translatedAuthor);

          const allAuthorWorks = Object.values(baseWorks).filter(w => w.author === translatedWork.author && w.title !== translatedWork.title);
          const translatedOtherWorks = await Promise.all(
            allAuthorWorks.slice(0, 4).map(w => getTranslatedWork(language, slugify(w.title, { lower: true, strict: true })))
          );
          setOtherWorks(translatedOtherWorks.filter((w): w is Work => w !== null));
        }
      }
    }
    translateContent();
  }, [slug, language, authorId]);


  if (!work || !author) {
    // Show a loading state or return NotFound if fetch is complete but no work
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-12">
        <PageHero
          eyebrow={author.title}
          title={work.title}
          description={work.summary}
          backgroundImage={author.heroImage}
          kicker={
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"><Calendar className="h-3.5 w-3.5" />{work.year}</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50"><User className="h-3.5 w-3.5" />{author.name}</span>
            </div>
          }
        />

        <section className="section-shell -mt-10 sm:-mt-14">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <article>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card prose-blog text-lg max-w-none">
                <p className="lead text-xl !text-foreground !mb-8">{work.summary}</p>

                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-10">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-display text-lg font-medium text-primary !mt-0 !mb-1">{t('work_key_takeaway')}</h3>
                      <p className="!mb-0 text-primary/80">{work.takeaway}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <ListTree className="h-5 w-5 text-primary" />
                  <h2 className="!mt-0 !mb-0">{t('structure')}</h2>
                </div>

                <div className="space-y-4">
                  {work.structure.map((part, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                      <h4 className="font-semibold !mt-0 !mb-1">{part.title}</h4>
                      <p className="!mb-0 text-sm text-muted-foreground">{part.content}</p>
                    </div>
                  ))}
                </div>

                {/* Historical Context */}
                {work.slug === 'de-bello-gallico' && (
                  <>
                    <div className="mt-12 p-8 rounded-3xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Historischer Kontext</h3>
                      </div>
                      <p className="text-base leading-relaxed !mb-4">Das Werk entstand während und nach Caesars achtjährigem Feldzug in Gallien (58–50 v. Chr.). Es diente nicht nur als militärischer Bericht, sondern vor allem als politisches Instrument, um seine Taten in Rom zu rechtfertigen und seine Position zu stärken.</p>
                      <p className="text-base leading-relaxed !mb-0">Die Commentarii wurden jährlich als Rechenschaftsberichte an den Senat geschickt und sollten zeigen, dass Caesar im Interesse Roms handelte – auch wenn seine Kritiker ihm imperiale Ambitionen vorwarfen.</p>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-secondary/20 border border-border/40">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Literarische Bedeutung</h3>
                      </div>
                      <ul className="space-y-3 !mb-0">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Sprachliche Klarheit:</strong> Das Werk gilt als Musterbeispiel für klares, präzises Latein und wird bis heute im Lateinunterricht verwendet.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Dritte Person:</strong> Caesar schreibt über sich selbst in der dritten Person ("Caesar"), was objektive Distanz suggeriert – eine raffinierte rhetorische Strategie.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Ethnographische Details:</strong> Neben militärischen Berichten enthält das Werk wertvolle Beschreibungen der gallischen und germanischen Völker, Sitten und Geographie.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Politische Propaganda:</strong> Jedes Detail ist sorgfältig gewählt, um Caesars Führungsqualitäten, Tapferkeit und strategisches Genie zu unterstreichen.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-card/40 border border-border/40">
                      <div className="flex items-center gap-3 mb-4">
                        <Quote className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Berühmte Zitate</h3>
                      </div>
                      <blockquote className="border-l-4 border-primary pl-6 py-2 mb-4">
                        <p className="text-lg italic !mb-2">»Gallia est omnis divisa in partes tres...«</p>
                        <p className="text-sm text-muted-foreground !mb-0">Ganz Gallien ist in drei Teile geteilt – der berühmte Eröffnungssatz des Werkes.</p>
                      </blockquote>
                      <blockquote className="border-l-4 border-primary pl-6 py-2">
                        <p className="text-lg italic !mb-2">»Fere libenter homines id quod volunt credunt.«</p>
                        <p className="text-sm text-muted-foreground !mb-0">Die Menschen glauben gerne das, was sie wollen – aus Buch III.</p>
                      </blockquote>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Wirkung & Vermächtnis</h3>
                      </div>
                      <p className="text-base leading-relaxed !mb-4">De Bello Gallico hatte weitreichende Konsequenzen: Es stärkte Caesars Position in Rom, machte ihn zum Volkshelden und legitimierte seine territorialen Eroberungen. Die Unterwerfung Galliens brachte Rom immense Reichtümer – Gold, Sklaven und strategische Kontrolle über weite Teile Europas.</p>
                      <p className="text-base leading-relaxed !mb-0">Das Werk beeinflusste nicht nur die römische Politik, sondern auch die europäische Geschichtsschreibung für Jahrhunderte. Es ist eine der wichtigsten Quellen für die keltische und germanische Frühgeschichte und prägte das Bild der "barbarischen" Völker im römischen Bewusstsein.</p>
                    </div>
                  </>
                )}

                {work.slug === 'de-bello-civili' && (
                  <>
                    <div className="mt-12 p-8 rounded-3xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Historischer Kontext</h3>
                      </div>
                      <p className="text-base leading-relaxed !mb-4">Nach seiner Rückkehr aus Gallien 50 v. Chr. forderte der römische Senat Caesar auf, seine Legionen aufzulösen und als Privatmann nach Rom zurückzukehren. Caesar weigerte sich – er fürchtete politische Verfolgung – und überschritt stattdessen am 10. Januar 49 v. Chr. mit seinen Truppen den Rubikon, die Grenze zwischen seiner Provinz und Italien.</p>
                      <p className="text-base leading-relaxed !mb-0">Dieser Akt der Rebellion löste den Bürgerkrieg zwischen Caesar und den Optimaten unter Führung von Pompeius aus. De Bello Civili ist Caesars eigene Rechtfertigungsschrift für diesen Krieg.</p>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-card/40 border border-border/40">
                      <div className="flex items-center gap-3 mb-4">
                        <Quote className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Zentrale Themen</h3>
                      </div>
                      <ul className="space-y-3 !mb-0">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Dignitas:</strong> Caesar betont wiederholt, dass er für seine Ehre (dignitas) kämpft, nicht aus Machthunger.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Clementia:</strong> Seine Milde gegenüber besiegten Feinden wird als Zeichen moralischer Überlegenheit dargestellt.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Pompeius als Verräter:</strong> Der einstige Verbündete wird als unfähig und von den Optimaten manipuliert gezeigt.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-secondary/20 border border-border/40">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Wirkung</h3>
                      </div>
                      <p className="text-base leading-relaxed !mb-0">De Bello Civili ist unvollendet – es endet abrupt nach Caesars Sieg in Ägypten 48 v. Chr. Dennoch zeigt es Caesars meisterhafte Kontrolle über die Erzählung: Jedes Ereignis wird so präsentiert, dass seine Handlungen gerechtfertigt und unvermeidlich erscheinen. Der Bürgerkrieg wird nicht als sein Fehler, sondern als Resultat der Sturheit und Inkompetenz seiner Gegner dargestellt.</p>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Literarische Besonderheiten</h3>
                      </div>
                      <ul className="space-y-3 !mb-0">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Unfertig:</strong> Das Werk bricht plötzlich ab, vermutlich weil Caesar zu beschäftigt war oder Aulus Hirtius es nicht fortsetzen konnte.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Direkter Ton:</strong> Im Vergleich zu De Bello Gallico ist De Bello Civili persönlicher und emotionaler – der Leser spürt Caesars Frustration.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Rechtfertigungswerk:</strong> Das gesamte Werk ist eine Apologie – Caesars Versuch, die Nachwelt von seiner Unschuld zu überzeugen.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-card/40 border border-border/40">
                      <div className="flex items-center gap-3 mb-4">
                        <Quote className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Schlüsselmommente</h3>
                      </div>
                      <blockquote className="border-l-4 border-primary pl-6 py-2 mb-4">
                        <p className="text-lg italic !mb-2">»Pompeius iniquissimis condicionibus non accepit.«</p>
                        <p className="text-sm text-muted-foreground !mb-0">Pompeius akzeptierte die unfairest möglichen Bedingungen nicht – Caesars Sicht auf die Verhandlungen.</p>
                      </blockquote>
                      <blockquote className="border-l-4 border-primary pl-6 py-2">
                        <p className="text-lg italic !mb-2">»Unum Pompeius ab legione negarat.«</p>
                        <p className="text-sm text-muted-foreground !mb-0">Pompeius verweigerte sich einer einzigen Legion – Caesars Argument für die Notwendigkeit des Krieges.</p>
                      </blockquote>
                    </div>

                    <div className="mt-8 p-8 rounded-3xl bg-secondary/20 border border-border/40">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="h-6 w-6 text-primary" />
                        <h3 className="font-display text-2xl font-bold !mt-0">Historische Bedeutung</h3>
                      </div>
                      <p className="text-base leading-relaxed !mb-4">De Bello Civili dokumentiert den Niedergang der römischen Republik. Es zeigt nicht nur militärische Ereignisse, sondern auch die politischen und moralischen Konflikte, die zur Alleinherrschaft Caesars führten.</p>
                      <p className="text-base leading-relaxed !mb-0">Das Werk ist heute eine Primärquelle für das späte 1. Jahrhundert v. Chr. und bietet Einblicke in römische Militärlogistik, Strategie und die politischen Lager der Zeit. Trotz Caesars offensichtlicher Voreingenommenheit ist es ein unverzichtbares Dokument für das Verständnis der späten Republik.</p>
                    </div>
                  </>
                )}
              </motion.div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">{author.title}</p>
                    </div>
                  </div>
                  <Link to={`/${author.id}/about`} className="w-full">
                    <Button variant="tonal" className="w-full">{t('moreAbout', { name: author.name.split(' ').pop() || '' })}</Button>
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
                  <h3 className="font-display text-lg font-medium mb-4">{t('otherWorks')}</h3>
                  <div className="space-y-2">
                    {otherWorks.map((relatedWork) => (
                      <Link key={relatedWork.title} to={`/${relatedWork.author}/works/${slugify(relatedWork.title, { lower: true, strict: true })}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        - {relatedWork.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
