# CIM Dr MERAD

Site vitrine du Centre de Radiologie et d'Imagerie Médicale – Birtouta (Dr MERAD, médecin radiologue).

**En ligne :** https://cimdrmerad.com/ (FR) · https://cimdrmerad.com/ar/ (AR)

## Contenu

Site statique bilingue (HTML/CSS/JS, sans dépendances ni build), deux pages indépendantes reliées par un lien de bascule FR/AR :

- Header/navbar fixe avec menu burger mobile
- Hero, Services (6 prestations avec accordéon "en savoir plus"), À propos (avec note Google), Pourquoi nous choisir
- FAQ (schema.org FAQPage)
- Localisation avec carte Google Maps intégrée (pin exact) et horaires d'ouverture
- Formulaire de demande de RDV (date/heure aux créneaux d'ouverture) qui prépare un message WhatsApp
- Contact : téléphone, email, WhatsApp, Facebook, Instagram (dont boutons flottants)
- Assistant virtuel (chatbot FAQ) FR/AR : bulle flottante, menu de questions fréquentes qui renvoie vers WhatsApp/téléphone/Google Maps (généré en JS, sans backend)
- Bouton "retour en haut" au scroll, animations fade-in
- SEO : meta/OG/JSON-LD par page, hreflang FR/AR/x-default, sitemap.xml, robots.txt
- Google Analytics (GA4)

## Structure

```
index.html        page FR
ar/index.html      page AR (lang=ar, dir=rtl)
css/style.css      styles (partagé FR/AR)
js/script.js       menu burger, accordéon, formulaire RDV, fade-in, retour en haut, chatbot
assets/            logo, photos, favicon
sitemap.xml
robots.txt
```

## Développement local

Ouvrir `index.html` (ou `ar/index.html`) directement dans un navigateur, ou servir le dossier :

```
npx serve .
```

## Déploiement

Le site est déployé automatiquement via GitHub Pages à chaque `git push` sur `main`.
