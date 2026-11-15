# CIM Dr MERAD

Site vitrine du **Centre d'Imagerie Médicale et de Radiologie CIM Dr MERAD**, à Birtouta (Alger), dirigé par le Dr Lotfi MERAD, médecin radiologue.

**En ligne :** https://cimdrmerad.com/ (FR) · https://cimdrmerad.com/ar/ (AR)

Site statique bilingue (HTML, CSS et JavaScript, sans dépendance ni étape de build), hébergé sur GitHub Pages avec le domaine `cimdrmerad.com`.

## Pages

Chaque page existe en français et en arabe (`/ar/…`, `lang="ar" dir="rtl"`), reliées par le bouton de langue et les balises `hreflang`.

| Page | FR | AR |
|---|---|---|
| Accueil | `/` | `/ar/` |
| Scanner | `/scanner/` | `/ar/scanner/` |
| Échographie et écho-doppler | `/echographie/` | `/ar/echographie/` |
| Radiologie | `/radiologie/` | `/ar/radiologie/` |
| Mammographie | `/mammographie/` | `/ar/mammographie/` |
| Panoramique dentaire | `/panoramique-dentaire/` | `/ar/panoramique-dentaire/` |
| Cytoponction échoguidée | `/cytoponction/` | `/ar/cytoponction/` |
| Le Dr MERAD | `/dr-merad/` | `/ar/dr-merad/` |
| Recrutement | `/recrutement/` | `/ar/recrutement/` |
| Politique de confidentialité | `/confidentialite/` | `/ar/confidentialite/` |
| Page d'erreur | `404.html` | (FR et AR sur la même page) |

## Fonctionnalités

**Accueil**
- Hero avec badge de note Google, boutons Nous localiser / Écrire sur WhatsApp / Nos services
- 6 cartes d'examens, entièrement cliquables vers leur page
- À propos, Pourquoi nous choisir, galerie « Visite du centre » (photos réelles), avis patients
- Localisation : plan statique (capture Google Maps) qui lance l'itinéraire en un clic, adresse, repères, horaires
- FAQ en accordéon
- Formulaire de contact (nom, examen, question) qui ouvre WhatsApp avec le message déjà rédigé ; rien n'est envoyé à un serveur

**Pages d'examen**
- Présentation avec photo réelle de l'appareil, bloc « Pourquoi chez nous », liste des examens, préparation, avis, FAQ, appel à l'action WhatsApp

**Commun à toutes les pages**
- Barre de navigation fixe avec menu burger sur mobile
- Pied de page en colonnes : Le centre, Nos examens, Nous contacter, lien vers la politique de confidentialité
- Boutons flottants WhatsApp, Facebook, Instagram et retour en haut
- Assistant virtuel (chatbot FAQ) FR/AR, généré en JavaScript, sans backend
- Animations d'apparition au défilement

## SEO et partage

- `title` et `meta description` propres à chaque page, avec la localisation (Birtouta)
- Un seul `h1` par page
- `canonical`, `hreflang` FR/AR/x-default
- Données structurées JSON-LD : `MedicalClinic`, `FAQPage`, `MedicalWebPage`, `BreadcrumbList`, `JobPosting`, `Physician`
- Open Graph et Twitter Cards, avec une image de partage 1200×630 par page (`assets/og-*.jpg`)
- `sitemap.xml` (toutes les pages FR et AR) et `robots.txt`
- Google Analytics (GA4)

## Structure

```
index.html                  accueil FR
ar/index.html               accueil AR
<examen>/index.html         pages d'examen FR (scanner, echographie, radiologie,
                            mammographie, panoramique-dentaire, cytoponction)
ar/<examen>/index.html      pages d'examen AR
dr-merad/, recrutement/, confidentialite/   pages annexes (FR, et AR sous ar/)
404.html                    page d'erreur personnalisée
css/style.css               styles partagés FR/AR (RTL inclus)
js/script.js                menu burger, accordéons FAQ, formulaire WhatsApp,
                            apparitions, retour en haut, chatbot
assets/                     logo, favicon, photos (.jpg + .webp), images de partage (og-*.jpg)
sitemap.xml, robots.txt, CNAME
.gitattributes              fins de ligne LF pour tous les fichiers texte
```

## Conventions

- **Nom officiel** : « Centre d'Imagerie Médicale et de Radiologie CIM Dr MERAD » (AR : « مركز التصوير الطبي والأشعة CIM الدكتور مراد »).
- **Images** : chaque photo existe en `.jpg` et en `.webp`, insérée avec `<picture><source type="image/webp">…<img src="….jpg"></picture>`. Les images de partage `og-*.jpg` restent en JPEG.
- **Pages arabes** : les numéros de téléphone visibles sont entourés de `<span dir="ltr">` pour s'afficher dans le bon ordre.
- **Liens d'appel** au format international : `tel:+21321002273`, `tel:+213552055077`.
- **Ajout d'une page** : l'ajouter au `sitemap.xml`, au pied de page de toutes les pages si besoin, et à la page 404 s'il s'agit d'un examen.
- **Modification simultanée du HTML et de `js/script.js`** : publier d'abord le script (compatible avec l'ancien HTML), puis le HTML une dizaine de minutes plus tard, à cause du cache navigateur de GitHub Pages.

## Développement local

Les pages utilisent des chemins absolus (`/css/…`, `/assets/…`) : il faut servir le dossier plutôt qu'ouvrir les fichiers directement.

```
python -m http.server 8000
```

Puis ouvrir http://localhost:8000/.

## Déploiement

Déploiement automatique par GitHub Pages à chaque `git push` sur `main` (en ligne après une à deux minutes). Les fichiers sont mis en cache 10 minutes par les navigateurs.

Le dossier `interne/` (documents de travail) est exclu de ce dépôt par `.gitignore`.
