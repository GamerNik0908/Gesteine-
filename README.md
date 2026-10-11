# Farm-Planer für Minecraft

Website zum Planen und Bauen von Minecraft-Farmen (Java Edition 1.21).

- 19 Farmen (Eisen, Gold, Bruchstein, Holz, Schleim, Essen, Mob/XP, Creeper, Blaze, Enderman, Pflanzen, Wolle …) in 58 Stufen von **Anfänger** bis **Endgame**
- Ertrag pro Stunde, laufende Kosten (z. B. Knochenmehl), Baukosten in Rohstoffen, Laufzeit-Rechner
- To-Do-Liste zum Abhaken (wird im Browser gespeichert), austauschbare Blöcke markiert
- 3D-Ansicht und Schicht-Plan: Schicht für Schicht nach oben gehen
- Schematic-Download als `.litematic` (Litematica) und `.schem` (WorldEdit)
- Erklärung + Bauanleitung zu jeder Stufe, „Meine Farmen" mit Status und Fortschritt

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
| `js/app.js` | Oberfläche |

Neue Farm hinzufügen: in `js/farms.js` einen Eintrag in `MF.FARMS` ergänzen; der Bauplan entsteht in `build(b)` mit `b.set(x, y, z, 'block')`, `b.fill(...)` und `b.mob(...)`.

Hinweis: Raten sind Richtwerte, die Baupläne sind vereinfachte Nachbauten bekannter Farm-Prinzipien – große Farmen zuerst in einer Kreativwelt testen.
