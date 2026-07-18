import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { articles, course, site } from "./src/site-data.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "site");

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const arrow = '<span aria-hidden="true">&rarr;</span>';

function legalAddress() {
  return [site.legalName, site.legalCareOf, site.legalStreet, site.legalCity, site.legalCountry]
    .filter(Boolean)
    .join("<br>");
}

function logo() {
  return '<a class="brand" href="index.html" aria-label="Seitenfunkeln Startseite">'
    + '<span class="brand-mark" aria-hidden="true">S</span>'
    + '<span><strong>Seitenfunkeln</strong><small>KI, KDP &amp; dein Weg zum eigenen Buch</small></span>'
    + '</a>';
}

function header(current = "") {
  const links = [
    ["start", "index.html", "Start"],
    ["blog", "blog.html", "Blog"],
    ["ressourcen", "ressourcen.html", "Ressourcen"],
    ["ueber", "ueber-seitenfunkeln.html", "Über Seitenfunkeln"]
  ];
  const items = links.map(([key, href, label]) => '<a '
    + (key === current ? 'class="is-current" aria-current="page" ' : '')
    + 'href="' + href + '">' + label + '</a>').join("");

  return '<header class="site-header" data-header>'
    + '<div class="header-inner">' + logo()
    + '<button class="menu-button" type="button" aria-label="Menü öffnen" aria-expanded="false" data-menu-button>'
    + '<span></span><span></span><span></span></button>'
    + '<nav class="main-nav" aria-label="Hauptnavigation" data-menu>' + items
    + '<a class="nav-cta" href="kapitel-2-erfahrung-kdp-kurs.html">Kapitel 2 entdecken</a>'
    + '</nav></div></header>';
}

function footer() {
  return '<footer class="site-footer"><div class="footer-main">'
    + '<div class="footer-brand">' + logo()
    + '<p>Hier teile ich verständliche KDP-Tipps, ehrliche Gedanken und meine persönliche Erfahrung mit Kapitel 2 mit dir. Meine Empfehlung ist unabhängig und transparent gekennzeichnet.</p></div>'
    + '<div><h2>Entdecken</h2><a href="blog.html">Alle Beiträge</a><a href="ressourcen.html">Kostenlose Ressourcen</a><a href="kapitel-2-erfahrung-kdp-kurs.html">Kapitel 2 kennenlernen</a></div>'
    + '<div><h2>Transparenz</h2><a href="affiliate-hinweis.html">Affiliate-Hinweis</a><a href="haftung-downloads.html">Haftung &amp; Downloads</a><a href="datenschutz.html">Datenschutz</a><a href="impressum.html">Impressum</a><a href="kontakt.html">Kontakt</a></div>'
    + '</div><div class="footer-bottom"><span>&copy; <span data-year></span> Seitenfunkeln</span><span>Mit Herz. Mit Freude.</span></div></footer>';
}

function pageShell({ title, description, current, content, image = "assets/images/hero-seitenfunkeln-warm-v4.webp", type = "website", jsonLd = null }) {
  const fullTitle = title === site.name ? site.name + " – " + site.tagline : title + " | " + site.name;
  const schema = jsonLd ? '<script type="application/ld+json">' + JSON.stringify(jsonLd) + '</script>' : '';
  const robots = site.preLaunch ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">';
  return '<!doctype html><html lang="de"><head>'
    + '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
    + robots
    + '<title>' + esc(fullTitle) + '</title><meta name="description" content="' + esc(description) + '">'
    + '<meta name="theme-color" content="#791844"><meta property="og:type" content="' + type + '">'
    + '<meta property="og:title" content="' + esc(fullTitle) + '"><meta property="og:description" content="' + esc(description) + '">'
    + '<meta property="og:image" content="' + image + '"><meta name="twitter:card" content="summary_large_image">'
    + '<link rel="stylesheet" href="assets/styles.css?v=6">' + schema + '</head>'
    + '<body><a class="skip-link" href="#inhalt">Zum Inhalt springen</a>'
    + '<div class="disclosure-bar">Seitenfunkeln ist ein unabhängiger Empfehlungsblog. Werbliche Inhalte und Affiliate-Links sind als Anzeige gekennzeichnet.</div>'
    + header(current) + '<main id="inhalt">' + content + '</main>' + footer()
    + '<div class="toast" role="status" aria-live="polite" data-toast></div>'
    + '<script src="assets/site.js?v=6" defer></script></body></html>';
}

function articleCard(article, featured = false) {
  const cardImage = article.cardImage || article.image;
  const imageClass = article.cardImage ? ' article-image-contained' : '';
  return '<article class="article-card' + (featured ? ' article-card-featured' : '') + '">'
    + '<a class="article-image' + imageClass + '" href="' + article.slug + '.html" tabindex="-1" aria-hidden="true">'
    + '<img src="' + cardImage + '" alt="" loading="lazy"></a>'
    + '<div class="article-card-body"><div class="article-meta"><span>' + article.category + '</span><span>' + article.readTime + ' Lesezeit</span></div>'
    + '<h3><a href="' + article.slug + '.html">' + article.cardTitle + '</a></h3>'
    + '<p>' + article.description + '</p><a class="text-link" href="' + article.slug + '.html">Weiterlesen ' + arrow + '</a></div></article>';
}

function courseLink(label = "Kapitel 2 kennenlernen", className = "button button-primary") {
  return '<a class="' + className + '" href="kapitel-2-erfahrung-kdp-kurs.html">' + label + ' ' + arrow + '</a>';
}

function affiliateButton(label = "Kapitel 2 beim Anbieter ansehen") {
  return '<a class="button button-gold" href="' + site.affiliateUrl + '" target="_blank" rel="sponsored nofollow noopener"'
    + (site.affiliatePlaceholder ? ' data-affiliate-placeholder="true"' : '') + '>' + label + ' ' + arrow + '</a>';
}

function externalLinkNotice() {
  return '<small class="external-link-notice">Anzeige / Affiliate-Link zu Digistore24 · <a href="haftung-downloads.html#externe-links">Hinweise zu externen Links</a></small>';
}

function downloadControl(meta) {
  const downloadHref = site.freebieUrl;
  const downloadAttributes = /^https?:\/\//.test(downloadHref) ? ' target="_blank" rel="noopener"' : ' download';
  return '<div class="download-consent" data-download-consent>'
    + '<a class="download-legal-link" href="haftung-downloads.html#downloads">Hinweise zu Downloads und Haftung lesen</a>'
    + '<label class="download-ack"><input type="checkbox" data-download-ack><span>Ich habe die Hinweise gelesen und verstanden. Download und Nutzung erfolgen im gesetzlich zulässigen Umfang auf eigenes Risiko.</span></label>'
    + '<a class="button button-gold download-button" href="' + downloadHref + '"' + downloadAttributes + ' data-download-link><span aria-hidden="true">↓</span> Kostenlos herunterladen</a>'
    + '<small>' + meta + '</small></div>';
}

function homePage() {
  const cards = articles.map((article, index) => articleCard(article, index === 0)).join("");
  const journeyVisuals = [
    ["kdp-ki-30-tage-plan.html", "assets/images/seitenfunkeln-serie/07-vom-entwurf-zum-buch-retusche.webp", "Vom Entwurf zum eigenen Buch"],
    ["amazon-kdp-ki-buecher-anfaenger.html", "assets/images/seitenfunkeln-serie/08-ki-sinnvoll-nutzen.png", "KI sinnvoll für dein Buch nutzen"],
    ["kdp-ki-30-tage-plan.html", "assets/images/seitenfunkeln-serie/11-zeit-sparen.png", "Zeit für deine Buchidee schaffen"],
    ["kapitel-2-erfahrung-kdp-kurs.html", "assets/images/seitenfunkeln-serie/12-freiheit.png", "Freiheit leben und den eigenen Weg gestalten"]
  ].map(item => '<a href="' + item[0] + '"><img src="' + item[1] + '" alt="' + item[2] + '" loading="lazy"></a>').join("");
  const content = '<section class="hero"><img class="hero-image" src="assets/images/hero-seitenfunkeln-warm-v4.webp" alt="Warme Buchwelt mit Blumen, Kerzenlicht und einem offenen Buch voller goldener Funken">'
    + '<div class="hero-shade" aria-hidden="true"></div><div class="hero-content"><span class="hero-brand">Seitenfunkeln</span>'
    + '<p class="eyebrow">Für Anfängerinnen und Anfänger mit einem Traum und ganz vielen Ideen</p><h1>Dein Traum vom eigenen Buch darf klein anfangen.</h1>'
    + '<p class="hero-copy">Vielleicht trägst du schon länger eine Buchidee im Herzen. Hier teile ich mit dir, was mir beim Verstehen, Planen und Losgehen geholfen hat – liebevoll, verständlich und ohne Fachchinesisch.</p>'
    + '<div class="button-row"><a class="button button-primary" href="amazon-kdp-ki-buecher-anfaenger.html">Meine Reise beginnen ' + arrow + '</a>'
    + courseLink("Kapitel 2 kennenlernen", "button button-ghost") + '</div></div></section>'
    + '<section class="trust-strip" aria-label="Wofür Seitenfunkeln steht"><div><strong>Ohne Vorwissen</strong><span>Jeder Begriff wird verständlich erklärt.</span></div>'
    + '<div><strong>Mit viel Herz</strong><span>Dein Traum und dein Tempo dürfen Raum bekommen.</span></div>'
    + '<div><strong>Gemeinsam statt allein</strong><span>Motivation und liebevoller Austausch tragen dich.</span></div></section>'
    + '<section class="section intro-section"><div class="section-heading"><span class="eyebrow">Du musst nicht alles auf einmal können</span>'
    + '<h2>Aus einer leisen Idee darf deine ganz eigene Reise werden.</h2><p>Ich möchte dir Wissen so weitergeben, wie ich es selbst gern bekommen hätte: verständlich, ermutigend und in kleinen Schritten, die sich wirklich machbar anfühlen.</p></div>'
    + '<div class="three-steps"><div><span>01</span><h3>Deinen Traum greifen</h3><p>Aus einem Gedanken wird eine Buchidee, die zu dir und den Menschen passt, die du erreichen möchtest.</p></div>'
    + '<div><span>02</span><h3>Deinen Weg entdecken</h3><p>Du lernst KDP und KI in einfachen Worten kennen und verstehst, was deine nächsten Schritte sind.</p></div>'
    + '<div><span>03</span><h3>Mit Mut losgehen</h3><p>Du setzt in deinem Tempo um – getragen von Wissen, Motivation und ganz viel Herz.</p></div></div></section>'
    + '<section class="section latest-section"><div class="section-heading row-heading"><div><span class="eyebrow">Starte hier</span><h2>Die wichtigsten Beiträge für deinen Anfang</h2></div>'
    + '<a class="text-link" href="blog.html">Alle Beiträge ' + arrow + '</a></div><div class="article-grid">' + cards + '</div></section>'
    + '<section class="home-freebie-band"><div class="home-freebie-copy"><span class="eyebrow">Mein Geschenk für deinen Anfang</span><h2>12 liebevolle KI-Prompts und 4 Vorlagen für deine erste Buchidee.</h2>'
    + '<p>Das kostenlose Seitenfunkeln-Starterpaket hilft dir, deine Gedanken zu sortieren, eine Idee zu prüfen und einen kleinen 30-Tage-Weg zu beginnen.</p>'
    + '<a class="button button-gold" href="ressourcen.html">Starterpaket entdecken ' + arrow + '</a><small>16 Seiten · PDF · kein Newsletter</small></div>'
    + '<img src="assets/images/seitenfunkeln-starterpaket-cover.webp" alt="Cover des kostenlosen Seitenfunkeln-Starterpakets" loading="lazy"></section>'
    + '<section class="book-proof-section"><div class="book-proof-inner"><figure class="book-proof-figure"><img src="assets/images/meine-buchprojekte-tisch-v1.webp" alt="Acht eigene Buchprojekte von Nicole Feller liebevoll auf einem Holztisch angeordnet" loading="lazy"><figcaption>Eine Auswahl meiner eigenen Buchprojekte.</figcaption></figure>'
    + '<div class="book-proof-copy"><span class="eyebrow">Meine eigenen Buchprojekte</span><h2>Aus meinen Ideen wurden echte Bücher.</h2>'
    + '<p>Was du hier siehst, habe ich selbst erschaffen und umgesetzt. Am Anfang standen viele Gedanken, Bilder und der Wunsch, daraus etwas Eigenes entstehen zu lassen.</p>'
    + '<p>Kapitel 2 hat mir dabei geholfen, Zusammenhänge besser zu verstehen, meinen Weg klarer zu sehen und aus Ideen wirkliche Buchprojekte zu machen. Genau deshalb teile ich meine Erfahrung heute mit dir.</p>'
    + courseLink("Wie Kapitel 2 mir geholfen hat", "button button-secondary") + '</div></div></section>'
    + '<section class="section journey-section"><div class="section-heading"><span class="eyebrow">Dein Weg darf sich gut anfühlen</span><h2>Mit Freude lernen, gestalten und den eigenen Traum wachsen lassen.</h2></div><div class="journey-visuals">' + journeyVisuals + '</div></section>'
    + '<section class="course-band course-band-warm"><div class="course-image course-image-collage"><img src="assets/images/seitenfunkeln-serie/10-community-retusche.webp" alt="Drei liebevoll gestaltete Bücher werden gemeinsam hochgehalten" loading="lazy"></div>'
    + '<div class="course-copy"><span class="eyebrow">Anzeige · meine persönliche Empfehlung</span><h2>Warum ich Kapitel 2 von Herzen weiterempfehle.</h2>'
    + '<p>Mit Kapitel 2 habe ich selbst eigene Ideen umgesetzt und Dinge erschaffen. Der Kurs hat mir dabei vieles verständlich gemacht und mich wirklich weitergebracht. Deshalb lege ich ihn allen ans Herz, die ebenfalls von einem eigenen Buch träumen und sich liebevolle Begleitung für ihren Anfang wünschen.</p>'
    + '<ul class="tick-list"><li>liebevoll und anfängerfreundlich erklärt</li><li>aktive, herzliche Community</li><li>Motivationssongs für deinen Weg</li><li>Support und gemeinsames Weitergehen</li></ul>'
    + courseLink("Komm mit auf die Reise") + '</div></section>'
    + '<section class="section closing-section"><span class="eyebrow">Ein Gedanke zum Mitnehmen</span><blockquote>Du brauchst keine perfekte erste Idee. Du brauchst eine Idee, die du verstehen, prüfen und Schritt für Schritt verbessern kannst.</blockquote>'
    + '<a class="button button-secondary" href="erste-kdp-buchidee-finden.html">Meine erste Idee finden ' + arrow + '</a></section>';
  return pageShell({ title: site.name, description: site.description, current: "start", content });
}

function blogPage() {
  const content = '<header class="page-intro"><span class="eyebrow">Seitenfunkeln Blog</span><h1>Von deiner Idee zum eigenen Buch – liebevoll und in deinem Tempo.</h1>'
    + '<p>Hier teile ich verständliche Anleitungen, ehrliche Erfahrungen und kleine Übungen mit dir, damit du deinen nächsten Schritt klarer sehen kannst.</p></header>'
    + '<section class="section blog-list"><div class="filter-row" aria-label="Themenübersicht"><span>Einfach starten</span><span>Ideen prüfen</span><span>Fehler vermeiden</span><span>Kurs entscheiden</span></div>'
    + '<div class="article-grid article-grid-wide">' + articles.map((article, index) => articleCard(article, index === 0)).join("") + '</div></section>'
    + '<section class="mini-course-cta"><div><span class="eyebrow">Anzeige · was mir geholfen hat</span><h2>Du wünschst dir einen liebevollen Weg, der dich Schritt für Schritt mitnimmt?</h2></div>'
    + '<div><p>Dann teile ich gern meine Erfahrung mit Kapitel 2 mit dir. Auf meiner unabhängigen Empfehlungsseite erfährst du, was mich weitergebracht hat und warum ich den Kurs ans Herz lege.</p>' + courseLink("Meine Erfahrung lesen") + '</div></section>';
  return pageShell({ title: "Blog für KDP-Anfängerinnen und Anfänger", description: "Liebevolle, verständliche Artikel über Amazon KDP, KI-Bücher und deinen Weg von der Idee zum eigenen Buch.", current: "blog", content });
}

function renderSection(section, index) {
  const paragraphs = (section.paragraphs || []).map(text => '<p>' + text + '</p>').join("");
  const bullets = section.bullets ? '<ul>' + section.bullets.map(item => '<li>' + item + '</li>').join("") + '</ul>' : '';
  const numbered = section.numbered ? '<ol>' + section.numbered.map(item => '<li>' + item + '</li>').join("") + '</ol>' : '';
  const note = section.note ? '<aside class="article-note"><strong>Gut zu wissen</strong><p>' + section.note + '</p></aside>' : '';
  const quote = section.quote ? '<blockquote>' + section.quote + '</blockquote>' : '';
  const links = section.links ? '<div class="source-links"><strong>Offizielle Quellen</strong>' + section.links.map(([label, href]) => '<a href="' + href + '" target="_blank" rel="noopener">' + label + ' ' + arrow + '</a>').join("") + '</div>' : '';
  const inlineCta = index === 1 ? '<aside class="inline-cta"><span class="eyebrow">Anzeige · was mir geholfen hat</span><h3>Mit Kapitel 2 habe ich selbst Ideen in die Tat umgesetzt.</h3>'
    + '<p>Der verständliche Aufbau, die herzliche Community, motivierende Songs und der Support haben mich weitergebracht. Deshalb möchte ich meine Erfahrung mit dir teilen.</p>' + courseLink("Meine Erfahrung lesen", "button button-secondary")
    + '</aside>' : '';
  return '<section><h2>' + section.heading + '</h2>' + paragraphs + bullets + numbered + note + quote + links + '</section>' + inlineCta;
}

function articlePage(article) {
  const displayImage = article.cardImage || article.image;
  const displayImageAlt = article.cardImage ? article.cardTitle : article.imageAlt;
  const content = '<article class="article"><header class="article-header"><div class="article-heading"><a class="back-link" href="blog.html">&larr; Zum Blog</a>'
    + '<div class="article-meta"><span>' + article.category + '</span><span>' + article.readTime + ' Lesezeit</span></div><h1>' + article.title + '</h1>'
    + '<p class="lead">' + article.description + '</p></div><img src="' + displayImage + '" alt="' + displayImageAlt + '"></header>'
    + '<div class="article-layout"><aside class="article-aside"><span>In diesem Beitrag</span><strong>' + article.readTime + ' Lesezeit</strong>'
    + '<a href="ressourcen.html">Kostenlosen Ideencheck öffnen</a></aside>'
    + '<div class="article-body"><div class="article-intro"><p class="personal-intro"><strong>Von mir für dich:</strong> Ich möchte dir dieses Thema so erklären, dass du dich nicht von Fachbegriffen oder zu vielen Schritten auf einmal ausbremsen lässt.</p>' + article.intro.map(text => '<p>' + text + '</p>').join("") + '</div>'
    + article.sections.map(renderSection).join("")
    + '<aside class="article-end"><span class="eyebrow">Anzeige · meine persönliche Empfehlung</span><h2>Mir hat Kapitel 2 geholfen, aus Ideen etwas Eigenes zu erschaffen.</h2>'
    + '<p>Darum lege ich den Kurs allen ans Herz, die sich in diesem Wunsch wiederfinden und sich einen verständlichen, liebevollen Weg zum eigenen Buch wünschen.</p>' + courseLink("Warum ich Kapitel 2 empfehle")
    + '</aside>'
    + '</div></div></article>' + relatedArticles(article);
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.description, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } };
  return pageShell({ title: article.title, description: article.description, current: "blog", content, image: displayImage, type: "article", jsonLd: schema });
}

function relatedArticles(article) {
  const related = articles.filter(item => item.slug !== article.slug).slice(0, 3);
  return '<section class="section related"><div class="section-heading"><span class="eyebrow">Weiterlesen</span><h2>Diese Beiträge helfen dir als Nächstes</h2></div><div class="article-grid">'
    + related.map(item => articleCard(item)).join("") + '</div></section>';
}

function coursePage() {
  const content = '<article class="course-page"><header class="course-hero"><div><a class="back-link light" href="blog.html">&larr; Zum Blog</a>'
    + '<span class="eyebrow">Anzeige · unabhängige Affiliate-Empfehlung</span><h1>' + course.title + '</h1><p>' + course.description + '</p>'
    + '<div class="button-row">' + affiliateButton() + '<a class="button button-ghost" href="#einschaetzung">Erst in Ruhe lesen</a></div>'
    + '<small>Bei einem Kauf über meinen Affiliate-Link erhalte ich eine Provision; für dich entstehen keine Mehrkosten. <a href="haftung-downloads.html#externe-links">Hinweise zu externen Links</a></small></div>'
    + '<img src="' + course.image + '" alt="' + course.imageAlt + '"></header>'
    + '<section class="verdict" id="einschaetzung"><div><span class="eyebrow">Mein ehrlicher Blick</span><h2>Was mich an Kapitel 2 überzeugt und berührt hat.</h2></div>'
    + '<div><p>Ich habe Kapitel 2 als einen liebevollen Einstieg für Anfängerinnen und Anfänger erlebt, die mit KI eigene Bücher erschaffen und Amazon KDP verständlich kennenlernen möchten.</p>'
    + '<p><strong>Was für mich den Unterschied macht:</strong> Das Wissen wird nicht kühl vermittelt. Zur klaren Anleitung kommen eine aktive Community, Support, motivierende Songs und ganz viel Herz.</p>'
    + '<p><strong>Meine Erfahrung:</strong> Mit Kapitel 2 habe ich selbst eigene Ideen umgesetzt und Dinge erschaffen. Der Kurs hat mir geholfen, Zusammenhänge besser zu verstehen, und mich auf meinem Weg wirklich weitergebracht.</p>'
    + '<p class="independent-note"><strong>Damit es ganz klar ist:</strong> Ich habe Kapitel 2 nicht erstellt und bin weder Anbieter noch Teil des Kurs- oder Supportteams. Seitenfunkeln ist meine unabhängige Empfehlung.</p></div></section>'
    + '<section class="section course-gifts"><div class="course-gift-primary"><span class="eyebrow">Was ich hilfreich finde</span><h2>Ein verständlicher Einstieg, der dich nicht alleinlässt.</h2><ul class="tick-list"><li>einfache Erklärungen von Anfang an</li><li>ein klarer Weg in kleinen Schritten</li><li>eine aktive, herzliche Community</li><li>Support, wenn Fragen auftauchen</li><li>Motivationssongs, die dich wieder aufrichten</li></ul></div>'
    + '<div class="course-gift-heart"><span class="eyebrow">Was für mich besonders ist</span><h2>Lernen darf sich warm und ermutigend anfühlen.</h2><p>Ich habe erlebt, dass der Kurs Wissen mit Motivation und echtem Miteinander verbindet. Du kannst Fragen stellen, dich inspirieren lassen und in deinem eigenen Tempo wachsen.</p><p>Genau diese Mischung hat mir geholfen, nicht nur zu lernen, sondern meine Ideen wirklich umzusetzen.</p></div></section>'
    + '<section class="section course-details"><div class="section-heading"><span class="eyebrow">Was du dir Schritt für Schritt aufbaust</span><h2>Vom ersten Gedanken zu deinem eigenen Buchprojekt.</h2></div>'
    + '<div class="detail-list"><div><span>01</span><h3>Grundlagen verstehen</h3><p>Du lernst KDP und den sinnvollen Einsatz von KI in einfacher Sprache kennen.</p></div>'
    + '<div><span>02</span><h3>Deine Idee entfalten</h3><p>Du entwickelst Buchideen und findest heraus, welche davon wirklich zu dir und deinem Wunsch passen.</p></div>'
    + '<div><span>03</span><h3>Dein Buch entstehen lassen</h3><p>Der Kurs führt dich durch die Schritte, mit denen aus einer Idee ein echtes Buchprojekt werden darf.</p></div>'
    + '<div><span>04</span><h3>Dranbleiben mit Herz</h3><p>Motivierende Songs, Community und Support erinnern dich daran, warum du diese Reise begonnen hast.</p></div></div></section>'
    + '<section class="fit-section"><div><span class="eyebrow">Für wen sich diese Reise besonders lohnt</span><h2>Kapitel 2 kann genau dein nächster Schritt sein, wenn ...</h2><ul><li>du schon lange von einem eigenen Buch träumst</li><li>du bei null beginnst und einfache Erklärungen brauchst</li><li>du mit KI kreativ werden möchtest</li><li>du in kleinen, verständlichen Schritten lernen möchtest</li><li>du dir eine liebevolle Gemeinschaft wünschst</li></ul></div>'
    + '<div><span class="eyebrow">Vielleicht erkennst du dich hier wieder</span><h2>Du spürst: Da wartet noch etwas auf mich.</h2><ul><li>du möchtest deine Ideen endlich sichtbar machen</li><li>du wünschst dir Mut und Motivation zum Dranbleiben</li><li>du möchtest lernen, ohne von Fachbegriffen erschlagen zu werden</li><li>du willst deinen eigenen Weg mit Freude gestalten</li><li>du möchtest später vielleicht auch andere Menschen inspirieren</li></ul></div></section>'
    + '<section class="section course-transparency"><span class="eyebrow">Meine Erfahrung mit Kapitel 2</span><h2>Warum ich diesen Kurs von Herzen weiterempfehle.</h2>'
    + '<p>Mit Kapitel 2 habe ich selbst eigene Ideen umgesetzt und Dinge erschaffen. Dabei habe ich nicht nur verständliches Wissen bekommen, sondern auch Motivation, Gemeinschaft und den Mut, wirklich dranzubleiben. Das hat mich auf meinem eigenen Weg weitergebracht.</p>'
    + '<p>Deshalb lege ich Kapitel 2 allen ans Herz, die sich darin wiederfinden: Du trägst eine Idee in dir, möchtest etwas Eigenes erschaffen und wünschst dir einen liebevollen, verständlichen Anfang.</p>'
    + '<p>Meine Empfehlung ist unabhängig und basiert auf meiner persönlichen Erfahrung mit Kapitel 2.</p>'
    + '<p>Meine Erfahrung ist persönlich und kein Versprechen für bestimmte Ergebnisse oder Einnahmen. Dein Weg hängt davon ab, was du daraus machst, wie sorgfältig du arbeitest und wie konsequent du umsetzt.</p>'
    + '<p>Wenn du über meinen Link teilnimmst, erhalte ich eine Affiliate-Provision. Dein Preis bleibt dadurch gleich – und meine Empfehlung bleibt von Herzen.</p></section>'
    + '<section class="final-cta"><span class="eyebrow">Deine Entscheidung darf sich gut anfühlen</span><h2>Schau in Ruhe, ob Kapitel 2 zu dir und deinem Weg passt.</h2><p>Auf der offiziellen Verkaufsseite des Anbieters findest du die aktuell gültigen Kursinhalte, Konditionen und alle Informationen für deine eigene Entscheidung.</p>'
    + affiliateButton("Zur offiziellen Verkaufsseite") + externalLinkNotice() + '</section></article>';
  return pageShell({ title: course.title, description: course.description, current: "", content, image: course.image, type: "article" });
}

function resourcesPage() {
  const content = '<section class="freebie-hero"><div class="freebie-hero-inner"><div class="freebie-copy"><span class="eyebrow">Kostenloses Seitenfunkeln-Starterpaket</span>'
    + '<h1>Dein erstes Buch darf klein anfangen.</h1><p>Mit 12 liebevollen KI-Prompts und 4 ausfüllbaren Vorlagen kommst du von der ersten Idee zu einem klaren, prüfbaren Buchkonzept.</p>'
    + '<ul class="freebie-checks"><li>ohne Fachchinesisch</li><li>sofort als PDF</li><li>kein Newsletter</li></ul>' + downloadControl('16 Seiten · PDF direkt von Seitenfunkeln · 0 €')
    + '</div><figure class="freebie-cover"><img src="assets/images/seitenfunkeln-starterpaket-cover.webp" alt="Cover: Dein erstes Buch darf klein anfangen">'
    + '<figcaption>Prompt-Galerie, Arbeitsblätter und 30-Tage-Weg</figcaption></figure></div></section>'
    + '<section class="freebie-numbers" aria-label="Inhalt des Starterpakets"><div><strong>12</strong><span>sofort nutzbare Prompts</span></div><div><strong>4</strong><span>ausfüllbare Vorlagen</span></div><div><strong>30</strong><span>Tage für einen ruhigen Start</span></div><div><strong>0 €</strong><span>keine E-Mail-Abfrage</span></div></section>'
    + '<section class="section freebie-contents"><div class="section-heading"><span class="eyebrow">Das erwartet dich</span><h2>Nicht nur Ideen sammeln. Einen echten nächsten Schritt finden.</h2><p>Jede Seite führt dich ein kleines Stück weiter, ohne so zu tun, als müsste heute schon alles fertig sein.</p></div>'
    + '<div class="freebie-content-grid"><div><span class="resource-number">01</span><h3>Prompt-Galerie</h3><p>12 kopierbare Prompts für Buchideen, Zielgruppe, Nische, Konzept, Gliederung, Qualitätsprüfung, Titel und Coverbriefing.</p></div>'
    + '<div><span class="resource-number">02</span><h3>Buchideen-Kompass</h3><p>Ein liebevolles Arbeitsblatt, das Interessen, Zielgruppe, Nutzen und deine drei stärksten Ideen zusammenführt.</p></div>'
    + '<div><span class="resource-number">03</span><h3>Konzept und Nischen-Notizen</h3><p>Vorlagen für deinen roten Faden und eine ehrliche Auswertung deiner eigenen Amazon-Beobachtungen.</p></div>'
    + '<div><span class="resource-number">04</span><h3>30-Tage-Weg</h3><p>Vier ruhige Wochen von der Idee bis zu einem kleinen Prototyp, plus Qualitätscheck vor der Veröffentlichung.</p></div></div></section>'
    + '<section class="freebie-sample"><div><span class="eyebrow">Ein Blick ins Starterpaket</span><h2>Der Prompt, der dir Klarheit schenkt, bevor du losrennst.</h2><p>Du kannst ihn direkt kopieren und mit deinen eigenen Angaben füllen.</p></div>'
    + '<blockquote><strong>Bitte frag mich zuerst</strong><p>Bevor du eine Lösung vorschlägst, stelle mir bitte nacheinander fünf kurze Rückfragen. Hilf mir damit, Zielgruppe, Nutzen, Umfang, Stil und meinen verfügbaren Zeitrahmen zu klären.</p><span>Bonus-Prompt auf Seite 3</span></blockquote></section>'
    + '<section class="section freebie-templates"><div class="section-heading"><span class="eyebrow">Für Stift, Herz und klare Gedanken</span><h2>Vorlagen, die du wirklich ausfüllen kannst.</h2></div>'
    + '<div class="template-list"><article><span>01</span><div><h3>Dein Buchideen-Kompass</h3><p>Aus Herzensthemen werden drei greifbare Ideen.</p></div></article><article><span>02</span><div><h3>Dein Buchkonzept auf einer Seite</h3><p>Zielgruppe, Nutzen, Inhalt und offene Fragen bleiben im Blick.</p></div></article>'
    + '<article><span>03</span><div><h3>Deine ruhigen Nischen-Notizen</h3><p>Du vergleichst nur das, was du selbst beobachtet hast.</p></div></article><article><span>04</span><div><h3>Dein sanfter 30-Tage-Weg</h3><p>Ein kleiner Plan, der sich nach Fortschritt statt Druck anfühlt.</p></div></article></div></section>'
    + '<section class="freebie-download-band"><span class="eyebrow">Deine Idee wartet nicht auf Perfektion</span><h2>Hol dir deinen ersten kleinen Funken.</h2><p>Das komplette Starterpaket kannst du direkt öffnen, speichern und ausdrucken.</p>' + downloadControl('Direktdownload · kein Newsletter · keine Dateneingabe') + '</section>'
    + '<section class="section glossary"><div class="section-heading"><span class="eyebrow">Ohne Fachchinesisch</span><h2>Vier Begriffe, die du wirklich brauchst</h2></div>'
    + '<dl><div><dt>KDP</dt><dd>Amazons Plattform, über die du eigene E-Books und gedruckte Bücher veröffentlichen kannst.</dd></div>'
    + '<div><dt>Nische</dt><dd>Ein klar eingegrenztes Thema für eine bestimmte Zielgruppe.</dd></div>'
    + '<div><dt>Marge</dt><dd>Der Betrag, der nach den relevanten Kosten pro Verkauf ungefähr übrig bleibt.</dd></div>'
    + '<div><dt>Affiliate-Link</dt><dd>Ein gekennzeichneter Empfehlungslink. Bei einem Kauf kann die empfehlende Person eine Provision erhalten.</dd></div></dl>'
    + '<div class="official-links"><h3>Bitte immer aktuell prüfen</h3><a class="resource-link" href="https://kdp.amazon.com/help/topic/G200672390" target="_blank" rel="noopener">KDP-Inhaltsrichtlinien ' + arrow + '</a>'
    + '<a class="resource-link" href="https://kdp.amazon.com/help/topic/G200672400" target="_blank" rel="noopener">Rechte an Inhalten ' + arrow + '</a><a class="resource-link" href="https://kdp.amazon.com/royalty-calculator" target="_blank" rel="noopener">Tantiemenrechner ' + arrow + '</a></div></section>'
    + '<section class="course-bridge"><img src="assets/images/seitenfunkeln-serie/10-community-retusche.webp" alt="Drei liebevoll gestaltete Bücher werden gemeinsam hochgehalten" loading="lazy"><div><span class="eyebrow">Wenn du begleitet weitergehen möchtest</span><h2>Vom ersten Funken zum eigenen Buch.</h2>'
    + '<p>Mit Kapitel 2 habe ich selbst Ideen umgesetzt und Dinge erschaffen. Der verständliche Aufbau, die herzliche Community, der Support und die motivierenden Songs haben mir geholfen, dranzubleiben.</p><p>Deshalb lege ich den Kurs allen ans Herz, die nach dem Starterpaket spüren: Ich möchte diesen Weg nicht allein zusammensuchen.</p>'
    + courseLink("Meine Erfahrung mit Kapitel 2 lesen", "button button-light") + '<small>Persönliche Empfehlung · noch kein Kauf-Link</small></div></section>';
  return pageShell({ title: "Kostenloses KI-Buch-Starterpaket", description: "12 kostenlose KI-Prompts, 4 ausfüllbare Vorlagen und ein sanfter 30-Tage-Weg für deine erste KDP-Buchidee.", current: "ressourcen", content, image: "assets/images/seitenfunkeln-starterpaket-cover.webp" });
}

function aboutPage() {
  const content = '<header class="page-intro compact"><span class="eyebrow">Über Seitenfunkeln</span><h1>Ein liebevoller Ort zwischen deinem Traum und dem ersten mutigen Schritt.</h1></header>'
    + '<section class="section editorial-page"><div class="editorial-lead"><p>Viele Menschen tragen eine kreative Idee lange still mit sich herum. Dann kommt der Moment, in dem aus „irgendwann“ vielleicht wirklich „jetzt“ werden darf.</p>'
    + '<p>Mit Seitenfunkeln möchte ich dir für genau diesen Moment Mut machen und meine Erfahrungen verständlich und ehrlich mit dir teilen.</p></div><div class="editorial-columns"><div><h2>Wofür ich mit Seitenfunkeln stehe</h2><p>Für einfache Erklärungen, liebevolle Ermutigung und kleine Schritte, die sich machbar anfühlen. KI darf dir helfen – aber deine Idee, deine Stimme und dein Herz geben dem Buch seine Bedeutung.</p></div>'
    + '<div><h2>Warum ich Kapitel 2 empfehle</h2><p>Mit Kapitel 2 habe ich selbst eigene Ideen umgesetzt und Dinge erschaffen. Der verständliche Aufbau, die herzliche Community, der Support und die motivierenden Songs haben mich wirklich weitergebracht. Deshalb lege ich den Kurs allen ans Herz, die sich einen ebenso liebevollen Anfang wünschen.</p></div></div>'
    + '<p class="independent-note"><strong>Meine Rolle:</strong> Ich habe Kapitel 2 nicht erstellt, verkaufe ihn nicht selbst und gehöre nicht zum Kurs- oder Supportteam. Ich teile meine unabhängige Empfehlung und kann über gekennzeichnete Affiliate-Links eine Provision erhalten.</p>'
    + '<aside class="values"><div><strong>liebevoll</strong><span>Dein Traum darf Raum bekommen.</span></div><div><strong>verständlich</strong><span>Begriffe werden einfach erklärt.</span></div><div><strong>ermutigend</strong><span>Jeder kleine Schritt zählt.</span></div></aside></section>';
  return pageShell({ title: "Über Seitenfunkeln", description: "Warum Seitenfunkeln als unabhängiger Empfehlungsblog Anfängerinnen und Anfänger auf dem Weg zum eigenen KI-Buch ermutigt.", current: "ueber", content });
}

function simplePage(title, eyebrow, description, body, current = "") {
  const content = '<header class="page-intro compact"><span class="eyebrow">' + eyebrow + '</span><h1>' + title + '</h1><p>' + description + '</p></header>'
    + '<section class="section legal-page">' + body + '</section>';
  return pageShell({ title, description, current, content });
}

function contactPage() {
  const body = '<h2>So erreichst du mich</h2><p>Wenn du einen Hinweis, eine Frage zum Blog oder eine Korrektur für mich hast, kannst du mir gern eine E-Mail schreiben.</p>'
    + '<a class="button button-primary" href="mailto:' + site.email + '">E-Mail schreiben</a>'
    + '<h2>Fragen zum Kurs oder Kurskauf</h2><p>Ich bin nicht die Kursanbieterin und kann Fragen zu Bestellung, Zahlung, Zugang, Rechnung, Widerruf oder technischem Kurssupport nicht beantworten. Bitte wende dich dafür an den auf der offiziellen Verkaufsseite oder in deiner Bestellbestätigung genannten Anbieter beziehungsweise an Digistore24.</p>';
  return simplePage("Kontakt", "Sprich mit mir", "Deine Fragen und Hinweise zum Blog sind bei mir willkommen.", body);
}

function affiliatePage() {
  const body = '<h2>Transparenz bei Empfehlungen</h2><p>Einige Links auf Seitenfunkeln sind Affiliate-Links. Ich kennzeichne sie als „Anzeige“, „Affiliate-Link“ oder „Affiliate-Empfehlung“.</p>'
    + '<p>Wenn du über einen solchen Link ein Produkt kaufst, kann ich eine Provision erhalten. Für dich verändert sich der Kaufpreis dadurch nicht.</p>'
    + '<h2>Meine Rolle</h2><p>Seitenfunkeln ist ein unabhängiger Empfehlungsblog. Ich habe Kapitel 2 nicht erstellt und bin weder Kursanbieter noch Teil des Kurs- oder Supportteams. Der Kaufvertrag kommt mit dem auf der offiziellen Verkaufsseite genannten Anbieter zustande.</p>'
    + '<p>Ich teile hier meine persönliche Erfahrung und frei zugängliche Informationen. Interne Unterlagen oder geschützte Kursinhalte gebe ich nicht weiter.</p>'
    + '<h2>Warum ich Kapitel 2 empfehle</h2><p>Mit Kapitel 2 habe ich selbst eigene Ideen umgesetzt und Dinge erschaffen. Der Kurs hat mir verständliches Wissen, Motivation und eine herzliche Gemeinschaft gegeben und mich damit auf meinem Weg weitergebracht. Diese persönliche Erfahrung ist der Grund für meine Empfehlung.</p>'
    + '<h2>Deine Entscheidung</h2><p>Ich verspreche dir weder bestimmte Einnahmen noch ein bestimmtes Ergebnis. Bitte prüfe vor dem Kauf die aktuell gültigen Angaben, Leistungen und Bedingungen auf der verlinkten Verkaufsseite. Meine Empfehlung ersetzt keine rechtliche, steuerliche oder geschäftliche Beratung.</p>'
    + '<p>Ergänzend gelten meine <a href="haftung-downloads.html#externe-links">Hinweise zu externen Links und Affiliate-Zielen</a>.</p>';
  return simplePage("Affiliate-Hinweis", "Offen empfohlen", "So funktionieren Empfehlungen und Provisionen auf Seitenfunkeln.", body);
}

function liabilityPage() {
  const body = '<p><strong>Stand: 18. Juli 2026</strong></p>'
    + '<div class="legal-warning"><strong>Wichtig in einem Satz</strong><p>Ich stelle Inhalte, Links und kostenlose Downloads sorgfältig bereit. Trotzdem solltest du Dateien vor dem Öffnen prüfen und Angaben auf externen Seiten selbst kontrollieren.</p></div>'
    + '<h2>1. Inhalte auf Seitenfunkeln</h2>'
    + '<p>Die Inhalte dieses Blogs werden mit angemessener Sorgfalt erstellt und regelmäßig auf erkennbare Fehler geprüft. Sie dienen der allgemeinen Information und geben teilweise meine persönliche Erfahrung wieder. Eine Gewähr für Vollständigkeit, Richtigkeit, Aktualität oder dauerhafte Verfügbarkeit kann ich nicht übernehmen.</p>'
    + '<p>Die Inhalte sind keine Rechts-, Steuer-, Finanz- oder Unternehmensberatung und ersetzen keine Prüfung deines konkreten Einzelfalls durch eine entsprechend qualifizierte Fachperson. Entscheidungen über Buchprojekte, Veröffentlichungen, Verträge oder geschäftliche Schritte triffst du in eigener Verantwortung.</p>'
    + '<h2 id="downloads">2. Kostenlose Downloads von Seitenfunkeln</h2>'
    + '<p>Eigene Downloads, insbesondere das Seitenfunkeln-Starterpaket, werden mit angemessener Sorgfalt erstellt und unmittelbar über diese Website bereitgestellt. Dennoch kann ich keine absolute Freiheit von Schadsoftware, Übertragungsfehlern, Beschädigungen oder späteren Manipulationen außerhalb meines Einflussbereichs garantieren.</p>'
    + '<p>Prüfe vor dem Öffnen bitte die Webadresse, den Dateinamen und den Dateityp. Halte Betriebssystem, Browser und Schutzsoftware aktuell, führe bei Bedarf eine Sicherheitsprüfung durch und sichere wichtige Daten. Öffne eine Datei nicht, wenn dein Gerät eine Warnung anzeigt, Dateiname oder Dateityp unerwartet sind oder der Download von einer anderen Adresse stammt als auf dieser Website angegeben.</p>'
    + '<p>Download, Öffnen und Nutzung erfolgen im gesetzlich zulässigen Umfang auf eigene Verantwortung und eigenes Risiko. Für Schäden, die durch Eingriffe Dritter, eine nachträgliche Veränderung außerhalb meines Verantwortungsbereichs, eine unsichere Systemumgebung oder das Ignorieren erkennbarer Warnungen entstehen, hafte ich nur nach Maßgabe der gesetzlichen Vorschriften und der Haftungsgrenzen unter Ziffer 5.</p>'
    + '<p>Auf der Ressourcenseite muss dieser Hinweis vor dem Download ausdrücklich bestätigt werden. Die Bestätigung wird nur im Browser für den jeweiligen Klick ausgewertet und nicht gespeichert.</p>'
    + '<h2>3. Downloads bei externen Anbietern</h2>'
    + '<p>Führt ein Link zu einer Datei oder einem Downloadangebot eines anderen Anbieters, wird die Datei nicht automatisch durch Seitenfunkeln geladen. Erst dein bewusster Klick öffnet das fremde Angebot. Für Bereitstellung, Sicherheit, Inhalt, Funktionsfähigkeit und Datenverarbeitung dieses Downloads ist der jeweilige Anbieter verantwortlich.</p>'
    + '<p>Nutze möglichst nur die offizielle Quelle, kontrolliere die Zieladresse und beachte die dortigen Datenschutz-, Nutzungs- und Sicherheitshinweise. Bei einem ungewöhnlichen Umleitungsziel, einer Browserwarnung oder einem unerwarteten Dateityp solltest du den Vorgang abbrechen.</p>'
    + '<h2 id="externe-links">4. Externe Links und Affiliate-Links</h2>'
    + '<p>Seitenfunkeln enthält Links zu Internetseiten Dritter, unter anderem zu Amazon KDP, Digistore24 und zur offiziellen Verkaufsseite von Kapitel 2. Mit dem Setzen eines Links mache ich mir nicht automatisch sämtliche gegenwärtigen oder später geänderten Inhalte der Zielseite zu eigen. Zum Zeitpunkt der Verlinkung prüfe ich die Zielseite auf für mich erkennbare Rechtsverstöße. Eine dauernde Kontrolle fremder Seiten ohne konkreten Anlass ist nicht möglich.</p>'
    + '<p>Erhalte ich einen nachvollziehbaren Hinweis auf rechtswidrige, schädliche oder irreführende Inhalte, prüfe ich den betroffenen Link und entferne ihn, soweit dies erforderlich und zumutbar ist. Für die Inhalte, technische Sicherheit, Verfügbarkeit und Datenverarbeitung der Zielseite bleibt grundsätzlich deren Betreiber verantwortlich.</p>'
    + '<p>Bei einem Affiliate-Link endet mein eigener Informationsbereich mit dem Klick auf den gekennzeichneten Link. Angaben zu Preis, Leistungsumfang, Verfügbarkeit, Bestellung, Zahlung, Widerruf, Lieferung, Kurszugang und Support auf der Zielseite stammen vom dort genannten Anbieter und müssen dort aktuell geprüft werden. Ein Kaufvertrag über Kapitel 2 kommt nicht mit Nicole Feller oder Seitenfunkeln zustande, sondern mit dem auf der Verkaufs- oder Bestellseite genannten Vertragspartner.</p>'
    + '<p>Meine Empfehlung und meine persönliche Erfahrung sind weder eine Garantie für bestimmte Ergebnisse noch ein Versprechen für Einnahmen oder geschäftlichen Erfolg.</p>'
    + '<h2>5. Gesetzlich zwingende Haftung bleibt bestehen</h2>'
    + '<p>Diese Hinweise beschränken meine Haftung ausschließlich im gesetzlich zulässigen Umfang. Unberührt bleibt insbesondere die Haftung für Vorsatz und grobe Fahrlässigkeit, für Schäden aus der Verletzung von Leben, Körper oder Gesundheit, nach dem Produkthaftungsgesetz, wegen arglistigen Verschweigens eines Mangels, aus einer ausdrücklich übernommenen Garantie sowie in allen anderen Fällen zwingender gesetzlicher Haftung.</p>'
    + '<p>Soweit gesetzlich zulässig, ist die Haftung bei leicht fahrlässiger Verletzung wesentlicher Pflichten auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Gesetzliche Ansprüche und Beweislastregeln werden durch diese Hinweise nicht unzulässig verändert.</p>'
    + '<h2>6. Verdächtige Datei oder problematischer Link?</h2>'
    + '<p>Bitte brich den Download oder Seitenaufruf ab und sende mir den genauen Link, den Dateinamen und eine kurze Beschreibung an <a href="mailto:' + site.email + '">' + site.email + '</a>. Ich prüfe den Hinweis so schnell wie möglich.</p>';
  return simplePage("Haftung & Downloads", "Sicher und transparent", "Hinweise zu eigenen Downloads, externen Links und Affiliate-Zielen auf Seitenfunkeln.", body);
}

function imprintPage() {
  const body = '<h2>Angaben gemäß § 5 DDG</h2><p>' + legalAddress() + '</p>'
    + '<h2>Kontakt</h2><p>E-Mail: ' + site.email + '</p>'
    + '<h2>Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV</h2><p>' + legalAddress() + '</p>'
    + '<h2>Umsatzsteuer</h2><p>Kein Ausweis der Umsatzsteuer gemäß § 19 UStG.</p>'
    + '<h2>Projektangabe</h2><p>Seitenfunkeln ist ein unabhängiger Empfehlungsblog von Nicole Feller.</p>'
    + '<h2>Haftung für Inhalte, Links und Downloads</h2><p>Ausführliche Hinweise zu eigenen Downloads, externen Seiten, Affiliate-Links und den gesetzlichen Haftungsgrenzen findest du unter <a href="haftung-downloads.html">Haftung &amp; Downloads</a>.</p>';
  return simplePage("Impressum", "Pflichtangaben", "Anbieterkennzeichnung für Seitenfunkeln.", body);
}

function privacyPage() {
  const body = '<p><strong>Stand: 18. Juli 2026</strong></p>'
    + '<p>Diese Datenschutzerklärung informiert dich darüber, welche personenbezogenen Daten beim Besuch von Seitenfunkeln verarbeitet werden. Die Website ist bewusst datensparsam aufgebaut. Es gibt kein Nutzerkonto, kein Kontaktformular, keinen Newsletter und keine eigene Besucheranalyse.</p>'
    + '<h2>1. Verantwortliche Stelle</h2><p>' + legalAddress() + '<br>E-Mail: <a href="mailto:' + site.email + '">' + site.email + '</a></p>'
    + '<p>Verantwortliche Stelle ist die Person, die über Zwecke und Mittel der Verarbeitung personenbezogener Daten auf dieser Website entscheidet.</p>'
    + '<h2>2. Aufruf der Website und Hosting über Cloudflare Workers</h2>'
    + '<p>Diese statische Website wird über Cloudflare Workers mit statischen Dateien bereitgestellt. Anbieter und Auftragsverarbeiter ist Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA.</p>'
    + '<p>Beim Aufruf der Website verarbeitet Cloudflare technisch erforderliche Verbindungsdaten. Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Adresse, zuvor besuchte Adresse, HTTP-Statuscode, übertragene Datenmenge, Browser-, Betriebssystem-, Geräte- und Spracheinstellungen sowie Sicherheits- und Fehlerereignisse gehören.</p>'
    + '<p>Die Verarbeitung ist erforderlich, um die Website sicher, stabil und schnell bereitzustellen, missbräuchliche Zugriffe abzuwehren und technische Fehler zu analysieren. Soweit ich über Zwecke und Mittel dieser Verarbeitung entscheide, beruht sie auf Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der funktionsfähigen und sicheren Bereitstellung dieses Informationsangebots.</p>'
    + '<p>Cloudflare betreibt ein weltweites Netzwerk. Deshalb kann eine Verarbeitung auch außerhalb des Europäischen Wirtschaftsraums, insbesondere in den USA, stattfinden. Cloudflare nennt hierfür seine Zertifizierung nach dem EU-US Data Privacy Framework und, falls dieses nicht anwendbar ist, die Standardvertragsklauseln der Europäischen Kommission einschließlich ergänzender Schutzmaßnahmen.</p>'
    + '<p>Weitere Informationen: <a href="https://www.cloudflare.com/en-gb/cloudflare-customer-dpa/" target="_blank" rel="noopener">Cloudflare Data Processing Addendum</a> und <a href="https://www.cloudflare.com/policies/privacy/" target="_blank" rel="noopener">Cloudflare-Datenschutzerklärung</a>.</p>'
    + '<h2>3. Verschlüsselte Übertragung</h2><p>Beim Aufruf der veröffentlichten Website über eine HTTPS-Adresse wird die Verbindung zwischen deinem Browser und dem Hostingserver verschlüsselt. Achte insbesondere bei externen Links darauf, dass die aufgerufene Adresse mit <code>https://</code> beginnt.</p>'
    + '<h2>4. Cookies, Tracking und eingebundene Drittinhalte</h2>'
    + '<p>Seitenfunkeln setzt im eigenen Seitencode keine Cookies, Analysewerkzeuge, Zählpixel, Werbenetzwerke oder vergleichbare Tracking-Technologien ein. Es werden weder <code>localStorage</code> noch <code>sessionStorage</code> verwendet. Schriftarten, Bilder, Stylesheets und Skripte werden lokal über denselben Hostingdienst geladen. Es sind keine YouTube-Videos, Social-Media-Widgets, Karten oder sonstigen Drittinhalte eingebettet, die bereits beim Seitenaufruf automatisch Daten an deren Anbieter übertragen.</p>'
    + '<p>Soweit Cloudflare im Einzelfall technisch notwendige Cookies oder vergleichbare Speicherzugriffe für die Übertragung, Missbrauchsabwehr oder Sicherheitsprüfung einsetzt, dienen diese ausschließlich der Bereitstellung des ausdrücklich aufgerufenen Dienstes. Grundlage ist § 25 Abs. 2 Nr. 2 TDDDG in Verbindung mit Art. 6 Abs. 1 lit. f DSGVO.</p>'
    + '<p>Da derzeit keine einwilligungsbedürftigen Technologien eingesetzt werden, erscheint kein Cookie-Banner. Sollte sich die technische Ausstattung ändern, wird diese Erklärung vor dem Einsatz aktualisiert und – sofern erforderlich – zuvor eine Einwilligung eingeholt.</p>'
    + '<h2>5. Kostenloser PDF-Download</h2>'
    + '<p>Das Seitenfunkeln-Starterpaket wird direkt von dieser Website als PDF-Datei bereitgestellt. Für den Download sind weder Name noch E-Mail-Adresse erforderlich. Es findet keine Newsletter-Anmeldung statt. Beim Abruf der Datei fallen lediglich die unter Ziffer 2 beschriebenen technisch notwendigen Verbindungsdaten beim Hostinganbieter an.</p>'
    + '<h2>6. Kontaktaufnahme per E-Mail</h2>'
    + '<p>Wenn du mir freiwillig eine E-Mail sendest, verarbeite ich die von dir übermittelten Angaben, insbesondere E-Mail-Adresse, Name, Nachrichteninhalt, Zeitpunkt und technische Begleitdaten, um deine Anfrage zu beantworten und die Kommunikation zu dokumentieren. Bitte sende keine vertraulichen oder besonders sensiblen Daten per unverschlüsselter E-Mail.</p>'
    + '<p>Bei vertragsbezogenen oder vorvertraglichen Anfragen ist Art. 6 Abs. 1 lit. b DSGVO die Rechtsgrundlage. Bei allgemeinen Fragen, Hinweisen oder Korrekturen beruht die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse liegt in der Bearbeitung und nachvollziehbaren Beantwortung der Nachricht. Gesetzlich erforderliche Aufbewahrungen beruhen auf Art. 6 Abs. 1 lit. c DSGVO.</p>'
    + '<p>Für das E-Mail-Postfach wird Gmail genutzt. Anbieter für Nutzerinnen und Nutzer im Europäischen Wirtschaftsraum ist grundsätzlich Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei kann eine Verarbeitung durch Google LLC in den USA oder weiteren Ländern stattfinden. Google nennt hierfür unter anderem das EU-US Data Privacy Framework und Standardvertragsklauseln. Es gelten ergänzend die <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener">Datenschutzinformationen von Google</a>.</p>'
    + '<p>Allgemeine Nachrichten werden gelöscht, sobald die Anfrage abschließend geklärt ist und keine berechtigten oder gesetzlichen Gründe für eine weitere Aufbewahrung bestehen. Vorgänge mit gesetzlichen Aufbewahrungspflichten werden für deren Dauer gespeichert. Deine Angaben werden nicht für einen Newsletter oder unaufgeforderte Werbung verwendet.</p>'
    + '<h2>7. Externe Links und Digistore24-Affiliate-Links</h2>'
    + '<p>Auf Seitenfunkeln befinden sich gewöhnliche externe Links, unter anderem zu Informationsseiten von Amazon KDP und zu Angeboten bei Digistore24. Vor einem bewussten Klick wird durch Seitenfunkeln keine Verbindung zu diesen Anbietern aufgebaut. Beim Klick verlässt du diese Website; dein Browser übermittelt dann die für den Aufruf technisch erforderlichen Daten unmittelbar an den jeweiligen Anbieter. Dort gelten dessen Datenschutz- und Cookie-Einstellungen.</p>'
    + '<p>Einige Links zu Digistore24 sind Affiliate-Links und enthalten eine Kennung, über die eine spätere Bestellung meiner Empfehlung zugeordnet werden kann. Die Links sind als Anzeige gekennzeichnet und technisch mit <code>sponsored</code>, <code>nofollow</code> und <code>noopener</code> versehen. Seitenfunkeln bindet keine Digistore24-Skripte, Bestellformulare oder Trackingpixel ein.</p>'
    + '<p>Erst nach dem Klick ruft dein Browser eine Seite der Digistore24 GmbH, St.-Godehard-Straße 32, 31139 Hildesheim, Deutschland, auf. Nach der aktuellen Datenschutzerklärung von Digistore24 können dort für das Affiliate-Tracking IP-Adresse und Cookies verarbeitet werden; Affiliate-Cookies können bis zu 185 Tage gespeichert werden. Darauf habe ich keinen technischen Einfluss. Einzelheiten findest du in der <a href="https://www.digistore24.com/page/privacy" target="_blank" rel="noopener">Datenschutzerklärung von Digistore24</a>.</p>'
    + '<p>Rechtsgrundlage für das Bereitstellen und Kennzeichnen meiner externen Empfehlungslinks ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der Finanzierung dieses kostenlosen Informationsangebots durch transparent gekennzeichnete Empfehlungen. Für die Datenverarbeitung auf der aufgerufenen Zielseite ist der jeweilige Anbieter verantwortlich.</p>'
    + '<h2>8. Empfänger und Datenweitergabe</h2>'
    + '<p>Personenbezogene Daten erhalten nur Stellen, die sie für die beschriebenen Zwecke benötigen: Cloudflare im Rahmen des Hostings, Google bei einer E-Mail-Kommunikation sowie ein externer Anbieter erst nach deinem Klick auf dessen Link. Eine weitere Weitergabe erfolgt nur, wenn sie gesetzlich erlaubt oder vorgeschrieben ist, du eingewilligt hast oder sie zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist. Ich verkaufe keine personenbezogenen Daten.</p>'
    + '<h2>9. Speicherdauer und Datenminimierung</h2>'
    + '<p>Ich speichere personenbezogene Daten nur so lange, wie sie für den jeweiligen Zweck erforderlich sind oder gesetzliche Aufbewahrungspflichten bestehen. Anschließend werden sie gelöscht oder – soweit eine Löschung vorübergehend nicht möglich ist – für andere Zwecke gesperrt. Für Daten, die Cloudflare, Google oder ein verlinkter Anbieter in eigener Verantwortung verarbeitet, gelten deren jeweilige Löschfristen.</p>'
    + '<h2>10. Deine Datenschutzrechte</h2>'
    + '<p>Unter den gesetzlichen Voraussetzungen hast du insbesondere das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen.</p>'
    + '<p>Zur Ausübung deiner Rechte genügt eine Nachricht an <a href="mailto:' + site.email + '">' + site.email + '</a>. Es findet keine ausschließlich automatisierte Entscheidungsfindung und kein Profiling durch Seitenfunkeln statt.</p>'
    + '<h2>11. Beschwerderecht</h2>'
    + '<p>Du hast gemäß Art. 77 DSGVO das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren. Für meinen Sitz ist insbesondere der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg zuständig. Informationen und das Beschwerdeformular findest du unter <a href="https://www.baden-wuerttemberg.datenschutz.de/beschwerde/" target="_blank" rel="noopener">baden-wuerttemberg.datenschutz.de</a>.</p>'
    + '<h2>12. Bereitstellung von Daten und Änderungen</h2>'
    + '<p>Die Bereitstellung der technischen Verbindungsdaten ist für den Aufruf der Website erforderlich. Eine Kontaktaufnahme per E-Mail und das Anklicken externer Links sind freiwillig. Ohne die Angaben aus einer E-Mail kann ich die jeweilige Anfrage möglicherweise nicht beantworten.</p>'
    + '<p>Diese Datenschutzerklärung wird angepasst, sobald sich Hosting, Kontaktweg oder eingesetzte Dienste ändern. Maßgeblich ist die jeweils auf dieser Seite veröffentlichte Fassung.</p>';
  return simplePage("Datenschutz", "Sorgsamer Umgang", "Informationen zur Verarbeitung personenbezogener Daten.", body);
}

function notFoundPage() {
  const content = '<section class="not-found"><span class="eyebrow">Fehler 404</span><h1>Diese Seite hat ihr Kapitel noch nicht gefunden.</h1><p>Zurück auf der Startseite findest du den einfachen Einstieg in KDP und KI-Bücher.</p><a class="button button-primary" href="index.html">Zur Startseite ' + arrow + '</a></section>';
  return pageShell({ title: "Seite nicht gefunden", description: "Diese Seite wurde nicht gefunden.", current: "", content });
}

async function build() {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(join(root, "assets"), join(output, "assets"), { recursive: true });
  await mkdir(join(output, "assets", "downloads"), { recursive: true });
  await cp(
    join(root, "output", "pdf", "seitenfunkeln-starterpaket.pdf"),
    join(output, "assets", "downloads", "seitenfunkeln-starterpaket.pdf")
  );

  const pages = new Map([
    ["index.html", homePage()],
    ["blog.html", blogPage()],
    ["kapitel-2-erfahrung-kdp-kurs.html", coursePage()],
    ["ressourcen.html", resourcesPage()],
    ["ueber-seitenfunkeln.html", aboutPage()],
    ["kontakt.html", contactPage()],
    ["affiliate-hinweis.html", affiliatePage()],
    ["haftung-downloads.html", liabilityPage()],
    ["impressum.html", imprintPage()],
    ["datenschutz.html", privacyPage()],
    ["404.html", notFoundPage()]
  ]);

  for (const article of articles) {
    pages.set(article.slug + ".html", articlePage(article));
  }

  for (const [filename, html] of pages) {
    await writeFile(join(output, filename), html, "utf8");
  }

  const robotsText = site.preLaunch
    ? "User-agent: *\nDisallow: /\n"
    : "User-agent: *\nAllow: /\nSitemap: " + site.baseUrl + "/sitemap.xml\n";
  await writeFile(join(output, "robots.txt"), robotsText, "utf8");

  const sitemapUrls = [...pages.keys()]
    .filter((filename) => filename !== "404.html")
    .map((filename) => "  <url><loc>" + site.baseUrl + "/" + (filename === "index.html" ? "" : filename) + "</loc></url>")
    .join("\n");
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + sitemapUrls + '\n</urlset>\n';
  await writeFile(join(output, "sitemap.xml"), sitemap, "utf8");

  const securityHeaders = "/*\n"
    + "  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'none'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; media-src 'self'; frame-src 'none'; manifest-src 'self'; upgrade-insecure-requests\n"
    + "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()\n"
    + "  Referrer-Policy: no-referrer\n"
    + "  X-Content-Type-Options: nosniff\n"
    + "  X-Frame-Options: DENY\n";
  await writeFile(join(output, "_headers"), securityHeaders, "utf8");

  console.log("Seitenfunkeln gebaut: " + pages.size + " Seiten in " + output);
}

await build();
