# Seitenfunkeln

Professioneller Pinterest- und Affiliate-Blog für Anfängerinnen und Anfänger, die mit KI eigene
Buchideen entwickeln und Amazon KDP verständlich kennenlernen möchten.

## Was bereits fertig ist

- responsive Startseite mit klarer Pinterest-Einstiegslogik
- sechs ausführliche Mehrwertartikel
- transparente Empfehlungsseite für den Kurs Kapitel 2
- kostenloses 16-seitiges Starterpaket mit 12 KI-Prompts und 4 Vorlagen
- Ressourcen-, Über-uns-, Kontakt- und Transparenzseiten
- ausgefülltes Impressum und an Cloudflare Workers angepasste Datenschutzerklärung
- eigene optimierte Webbilder
- mobile Navigation, SEO-Metadaten und strukturierte Artikeldaten
- 404-Seite und Vorveröffentlichungs-Sperre für Suchmaschinen

Der gebaute Blog liegt im Ordner site/. Die Strategie- und Textgrundlagen
bleiben zusätzlich unter docs/ erhalten.

## Lokal öffnen

site/index.html kann direkt im Browser geöffnet werden.

Für eine lokale Vorschau über einen Webserver:

```powershell
python -m http.server 4177 --directory site
```

Danach ist der Blog unter http://127.0.0.1:4177 erreichbar.

## Neu bauen

```powershell
node build.mjs
```

Der Build erzeugt alle HTML-Seiten neu und kopiert die optimierten Assets nach
site/.

Das kostenlose PDF kann nach Textänderungen separat neu erzeugt werden:

```powershell
python generate-freebie.py
```

## Noch zu ergänzen

Alle persönlichen Angaben stehen zentral in src/site-data.mjs:

1. persönlicher Digistore24-Affiliate-Link
2. affiliatePlaceholder nach Einsetzen des Links auf false setzen
3. vor einem Wechsel des Hostings oder dem Einbau externer Dienste die Datenschutzerklärung aktualisieren

Das Starterpaket bleibt ein reiner Direktdownload. Die Website enthält dafür
keine Newsletter-Anmeldung, kein E-Mail-Feld und keinen automatischen Verteiler.

Das Impressum enthält die bereitgestellten Betreiberangaben. Die Datenschutzerklärung
bildet den aktuellen Stand mit Cloudflare Workers, lokalem PDF-Download, Gmail-Kontakt und
reinen externen Digistore24-Links ab. Änderungen an diesen Diensten erfordern vor ihrem
Einsatz eine erneute Prüfung und Anpassung.

## Veröffentlichung über Cloudflare Workers

Das Repository dient als Quellcode-Speicher. Die gebaute Website wird aus dem Ordner
`site/` über Cloudflare Workers Static Assets veröffentlicht. Die Konfiguration liegt in
`wrangler.jsonc`; der Bereitstellungsbefehl lautet `npx wrangler deploy`.

## Gestaltung

- Dunkelhimbeer: #791844
- tiefes Himbeer: #4b0c2e
- warmes Gold: #d0a15d
- Altrosa: #cc7187
- Salbeigrün: #587166

Die Bildsprache ist warm, weich und verträumt: Bücher, Blumen, Kerzenlicht,
Fantasie und Gemeinschaft statt Büro- oder Produktivitätsmotiven. Die zwölf
getrennten Serienmotive liegen unter `assets/images/seitenfunkeln-serie/`; das
KREAMIX-Motiv bleibt wegen der abweichenden Kursbezeichnung unveröffentlicht.
