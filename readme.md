# CIM Dr MERAD

Site vitrine du Centre de Radiologie et d'Imagerie Médicale – Birtouta (Dr MERAD, médecin radiologue).

**En ligne :** https://adelmerad.github.io/CIM-Dr-MERAD/

## Contenu

Site statique une page (HTML/CSS/JS, sans dépendances ni build) :

- Header/navbar fixe avec menu burger mobile
- Hero, Services (6 prestations), À propos, Pourquoi nous choisir
- Localisation avec carte Google Maps intégrée
- Contact (téléphone + WhatsApp)
- Animations fade-in au scroll

## Structure

```
index.html       page unique
css/style.css     styles
js/script.js      menu burger, fade-in au scroll
assets/           logo, photos, favicon
```

## Développement local

Ouvrir `index.html` directement dans un navigateur, ou servir le dossier :

```
npx serve .
```

## Déploiement

Le site est déployé automatiquement via GitHub Pages à chaque `git push` sur `main`.
