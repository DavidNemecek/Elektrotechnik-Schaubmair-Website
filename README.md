# Elektrotechnik-Schaubmair-Website

Statische Website für **Elektrotechnik Schaubmair** (GitHub Pages).

## Inhalte pflegen

- Startseite: `website/index.html`
- Impressum: `website/impressum.html`
- Datenschutz: `website/datenschutz.html`
- Kontaktdaten (zentral): `website/business.json`
- Projektbilder: `website/images/` (wird nach `/_site/images/` kopiert)

## Deployment

Der GitHub Actions Workflow `.github/workflows/deploy-pages.yml` baut aus `website/` die Pages‑Site
und kopiert `website/images/` nach `images/` im Output.

## Lokal ansehen

Da `website/` im Deployment nach `_site/` kopiert wird (inkl. `website/images/`), ist der
einfachste lokale Preview:

- Build: `powershell -ExecutionPolicy Bypass -File scripts/build-local.ps1`
- Serve: `powershell -ExecutionPolicy Bypass -File scripts/serve-local.ps1`
