# Farm-Planer für Minecraft

Website zum Planen und Bauen von Minecraft-Farmen (Java Edition 1.21).

- 20 Farmen (Eisen, Gold, Bruchstein, Holz, Schleim, Essen, Mob/XP, Dorfbewohner, Creeper, Blaze, Enderman, Pflanzen, Wolle …) in 61 Stufen von **Anfänger** bis **Endgame**
- Ertrag pro Stunde, laufende Kosten (z. B. Knochenmehl), Baukosten in Rohstoffen, Laufzeit-Rechner
- To-Do-Liste zum Abhaken (wird im Browser gespeichert), austauschbare Blöcke markiert
- 3D-Ansicht und Schicht-Plan: Schicht für Schicht nach oben gehen
- Schematic-Download als `.litematic` (Litematica) und `.schem` (WorldEdit)
- Erklärung + Bauanleitung zu jeder Stufe, „Meine Farmen" mit Status, Fortschritt und gemeinsamer Einkaufsliste
- **Animationen** „So funktioniert's": Mobs, Beobachter, Kolben und Items zeigen die Mechanik Schritt für Schritt
- **Echte Minecraft-Texturen**: eigene Minecraft-`.jar` oder Resource Pack auswählen – wird nur im Browser entpackt und gespeichert (Texturen werden aus Lizenzgründen nicht mitgeliefert)
- **Druckansicht / PDF** mit allen Schicht-Plänen (gleiche Schichten zusammengefasst), Materialliste zum Abhaken und Anleitung

## Starten

Einfach `index.html` im Browser öffnen – oder online über GitHub Pages
(Settings → Pages → Branch auswählen, Ordner `/`).

Lokal mit Server: `python3 -m http.server` und dann http://localhost:8000 öffnen.

## Aufbau

| Datei | Inhalt |
|---|---|
| `js/blocks.js` | Blöcke, Mobs, Rohstoff-Rezepte |
| `js/designs.js` | Generatoren für die Baupläne |
| `js/farms.js` | Alle Farmen mit Stufen, Raten, Kosten, Erklärungen |
| `js/viewer3d.js` | 3D-Ansicht (Three.js) |
| `js/schematic.js` | Export `.schem` / `.litematic` |
| `js/textures.js` | Echte Texturen aus .jar/.zip laden |
| `js/animations.js` | Animationen „So funktioniert's" |
| `js/app.js` | Oberfläche, Druckansicht, Einkaufsliste |

Neue Farm hinzufügen: in `js/farms.js` einen Eintrag in `MF.FARMS` ergänzen; der Bauplan entsteht in `build(b)` mit `b.set(x, y, z, 'block')`, `b.fill(...)` und `b.mob(...)`.

Hinweis: Raten sind Richtwerte, die Baupläne sind vereinfachte Nachbauten bekannter Farm-Prinzipien – große Farmen zuerst in einer Kreativwelt testen.
