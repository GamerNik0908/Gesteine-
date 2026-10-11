/* Alle Farmen. Jede Farm hat mehrere Stufen (tiers).
 * rates:  [Item, pro Stunde]
 * upkeep: [Item, pro Stunde, Hinweis]  – was man laufend reinstecken muss
 * extras: [Item, Anzahl, Hinweis]       – Dinge, die keine Blöcke sind
 * Alle Zahlen sind gerundete Richtwerte (Java Edition 1.21, Schwierigkeit Normal). */
(function () {
  const MF = (window.MF = window.MF || {});
  const D = MF.D;

  MF.LEVELS = {
    1: { name: 'Anfänger', color: '#6cc04a' },
    2: { name: 'Fortgeschritten', color: '#3fa9f5' },
    3: { name: 'Profi', color: '#b46cf0' },
    4: { name: 'Endgame', color: '#ff8a1f' },
  };

  MF.CATEGORIES = ['Ressourcen', 'Essen', 'Mobs & XP', 'Pflanzen & Deko'];

  MF.FARMS = [
    // =========================================================== EISEN
    {
      id: 'eisen', name: 'Eisenfarm', cat: 'Ressourcen', icon: '⚙️', color: '#d8d8d8',
      product: 'Eisenbarren',
      desc: 'Dorfbewohner haben Angst vor einem Zombie und rufen Eisengolems. Die Golems werden von Wasser in eine Lava-Grube geschoben.',
      tiers: [
        {
          level: 1, name: 'Mini-Eisenfarm (3 Dorfbewohner)', difficulty: 2,
          rates: [['Eisenbarren', 300], ['Mohnblumen', 150]],
          upkeep: [],
          extras: [['Namensschild', 1, 'für den Zombie'], ['Amboss (zum Benennen)', 1, '']],
          req: ['Mind. 100 Blöcke weg von anderen Dörfern', '3 Dorfbewohner (Boot oder Lore zum Transport)'],
          how: 'Drei Dorfbewohner, die vor Kurzem geschlafen haben, sehen einen Zombie und bekommen Panik. Panische Dorfbewohner rufen einen Eisengolem, der auf der Plattform unter ihnen erscheint. Das Wasser schiebt den Golem zur Mitte, er fällt in die 2×2-Grube und berührt dort mit dem Kopf die Lava. Das Eisen fällt in die Trichter.',
          steps: [
            'Baue die Grube: 2×2 Trichter (zeigen nach unten) auf zwei Doppeltruhen.',
            'Stelle auf jeden Trichter ein Schild und gieße Lava auf die Schilder.',
            'Baue die Plattform (10×10) einen Block über der Lava, Glasrand drumherum.',
            'Setze in die 4 Grubenfelder auf Plattformhöhe Wandschilder – sie halten das Wasser auf.',
            'Gieße Wasser an allen Rändern: es fließt zur Mitte.',
            'Baue 4 Blöcke über der Plattform die Glas-Kapsel mit 3 Betten.',
            'Bring die Dorfbewohner und den Zombie (mit Namensschild!) rein.',
          ],
          tips: ['Die Kapsel MUSS aus Glas sein – auf Glas spawnen keine Golems.', 'Der Zombie braucht eine Stufe über dem Kopf, sonst verbrennt er in der Sonne.', 'Dorfbewohner müssen alle 20 Minuten schlafen können – Betten nicht vergessen.'],
          build: (b) => D.ironModule(b, 0, 0, 10, [[3, 2]]),
        },
        {
          level: 2, name: 'Eisenfarm mit 4 Kapseln (12 Dorfbewohner)', difficulty: 3,
          rates: [['Eisenbarren', 1100], ['Mohnblumen', 550]],
          upkeep: [],
          extras: [['Namensschild', 4, 'je Kapsel ein Zombie']],
          req: ['Mind. 100 Blöcke weg von anderen Dörfern', '12 Dorfbewohner'],
          how: 'Gleiches Prinzip wie die Mini-Farm, aber 4 Kapseln über einer größeren Plattform. Jede Kapsel ruft unabhängig Golems, deshalb steigt die Rate fast um das Vierfache.',
          steps: ['Baue erst Grube und Plattform (14×14) wie bei der Mini-Farm.', 'Setze die 4 Kapseln auf Höhe +4 über der Plattform.', 'Fülle jede Kapsel mit 3 Dorfbewohnern und einem Zombie.', 'Leere die Truhen regelmäßig oder hänge eine Trichterkette an.'],
          tips: ['Mit einer Lore auf Schienen bekommst du die Dorfbewohner am leichtesten nach oben.', 'Golems können nur bis 8 Blöcke seitlich der Dorfbewohner spawnen – Plattform nicht größer bauen.'],
          build: (b) => D.ironModule(b, 0, 0, 14, [[1, 1], [8, 1], [1, 7], [8, 7]]),
        },
        {
          level: 3, name: 'Eisen-Fabrik (4 Module, 48 Dorfbewohner)', difficulty: 4,
          rates: [['Eisenbarren', 4000], ['Mohnblumen', 2000]],
          upkeep: [],
          extras: [['Namensschild', 16, ''], ['Trichterkette / Sortieranlage', 1, 'optional, um Mohn auszusortieren']],
          req: ['Großer freier Platz (ca. 32×32)', '48 Dorfbewohner – am besten eine Dorfbewohner-Zucht vorher bauen'],
          how: 'Vier vollständige 14×14-Module nebeneinander. Jedes Modul hat seine eigene Grube und eigene Truhen. Das ist schon eine richtig große Farm – mehr Eisen braucht man fast nie.',
          steps: ['Baue ein Modul komplett fertig und teste es.', 'Kopiere es dreimal daneben (Abstand: gemeinsame Glaswand).', 'Verbinde die Truhen mit einer Trichterkette zu einem Lager.'],
          tips: ['Eine Dorfbewohner-Zucht in der Nähe spart viel Lauferei.', 'Lagert die Farm zu sehr? Schalte die Partikel herunter.'],
          build: (b) => {
            const pods = [[1, 1], [8, 1], [1, 7], [8, 7]];
            for (const [mx, mz] of [[0, 0], [15, 0], [0, 15], [15, 15]]) D.ironModule(b, mx, mz, 14, pods);
          },
        },
        {
          level: 4, name: 'Eisen-Gigant (9 Module)', difficulty: 5,
          rates: [['Eisenbarren', 9000], ['Mohnblumen', 4500]],
          upkeep: [],
          extras: [['Namensschild', 36, ''], ['Sortieranlage', 1, 'empfohlen']],
          req: ['108 Dorfbewohner', 'Starker PC / Server (viele Entities)'],
          how: '3×3 Module – das ist die „unendlich krasse" Variante. Gleiches Prinzip, einfach neunmal. Ideal für Leuchtfeuer-Pyramiden aus Eisen oder riesige Bauprojekte.',
          steps: ['Baue Modul für Modul und teste jedes einzeln.', 'Plane vorher ein Lager mit Sortieranlage für Eisen und Mohn.'],
          tips: ['108 Dorfbewohner können Lag verursachen.', 'Mohn kannst du kompostieren oder zu rotem Farbstoff machen.'],
          build: (b) => {
            const pods = [[1, 1], [8, 1], [1, 7], [8, 7]];
            for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) D.ironModule(b, i * 15, j * 15, 14, pods);
          },
        },
      ],
    },

    // =========================================================== GOLD
    {
      id: 'gold', name: 'Goldfarm', cat: 'Ressourcen', icon: '🪙', color: '#f5c542',
      product: 'Goldnuggets',
      desc: 'Zombifizierte Piglins spawnen aus Netherportalen oder auf dem Nether-Dach und werden zu Gold verarbeitet.',
      tiers: [
        {
          level: 1, name: 'Portal-Goldfarm (Oberwelt)', difficulty: 2,
          rates: [['Goldnuggets', 400], ['Verrottetes Fleisch', 300], ['XP-Punkte', 1500]],
          upkeep: [],
          extras: [['Feuerzeug', 1, 'zum Anzünden der Portale']],
          req: ['Schwierigkeit mindestens Normal', 'Viel Obsidian (Eimer-Methode oder Diamantspitzhacke)'],
          how: 'In der Oberwelt spawnen auf Netherportal-Blöcken ab und zu zombifizierte Piglins. Sie laufen aus dem Portal in einen Wasserkanal, der sie zu deinem AFK-Platz bringt. Dort schlägst du ihnen durch einen Halb-Spalt auf die Füße.',
          steps: ['Baue 3 Portalrahmen nebeneinander (2 Reihen übereinander).', 'Davor einen 2 breiten Wasserkanal, der zur Grube fließt.', 'Am Ende: Wandschilder, darunter 2 Trichter auf Truhen.', 'Dein Platz: daneben, hinter einer oberen Stufe.', 'Zünde alle Portale an.'],
          tips: ['Schlag immer nur mit einem Schwert mit Plünderung – mehr Gold.', 'Die Piglins werden wütend, kommen aber nicht durch den Spalt.'],
          build: (b) => D.portalFarm(b, 3, 2),
        },
        {
          level: 2, name: 'Nether-Dach-Farm (3 Ebenen)', difficulty: 4,
          rates: [['Goldnuggets', 3000], ['Goldbarren', 60], ['Verrottetes Fleisch', 1500]],
          upkeep: [],
          extras: [['Schildkrötenei', 3, 'nur mit Behutsamkeit abbaubar'], ['Enderperlen', 4, 'um aufs Nether-Dach zu kommen']],
          req: ['Nether-Dach (über dem Grundgestein, Y > 128)', 'Spitzhacke mit Behutsamkeit (für die Eier)'],
          how: 'Auf dem Nether-Dach spawnen fast nur zombifizierte Piglins. Ein Schildkrötenei in der Mitte jeder Ebene lockt sie an. Auf dem Weg dorthin laufen sie über offene Falltüren (die sie für Boden halten) und fallen über 30 Blöcke in den Tod. Gold landet in den Trichtern.',
          steps: ['Perlen dich durch das Grundgestein aufs Dach.', 'Baue den Schacht mit 3×3 Trichtern ganz unten.', 'Baue 31 Blöcke höher die erste Ebene (23×23), in der Mitte ein Block mit Schildkrötenei.', 'Setze die 8 offenen Falltüren um das Ei.', 'Die nächsten Ebenen jeweils 3 Blöcke höher.', 'Oben eine Schicht Stufen, damit keine Ghasts spawnen.'],
          tips: ['Ebenen genau 2 Blöcke hoch lassen – dann spawnen keine Ghasts.', 'Bleib in der Nähe (AFK), sonst spawnen keine Mobs.'],
          build: (b) => D.lureLayers(b, { R: 10, layers: 3, drop: 30, gap: 3, bait: 'egg', roof: true }),
        },
        {
          level: 4, name: 'Gold-Gigant (6 Ebenen, Magma)', difficulty: 5,
          rates: [['Goldnuggets', 14000], ['Goldbarren', 300], ['Verrottetes Fleisch', 7000]],
          upkeep: [],
          extras: [['Schildkrötenei', 6, ''], ['Sortieranlage', 1, 'für Fleisch / Gold / Schwerter']],
          req: ['Nether-Dach', 'Tausende Magmablöcke (Basaltdelta oder Tauschen)'],
          how: 'Die große Version: 6 Ebenen mit 43×43 Blöcken. Der Boden ist aus Magmablöcken – darauf spawnen nur feuerfeste Mobs wie zombifizierte Piglins. Damit kommen fast nur Piglins und die Rate explodiert.',
          steps: ['Wie die 3-Ebenen-Farm, nur größer.', 'Alle Böden aus Magmablöcken.', 'Plane ein großes Lager mit Sortieranlage.'],
          tips: ['Fleisch kannst du an Geistliche Dorfbewohner gegen Smaragde tauschen.', 'Bau mit Feuerresistenz-Tränken, falls du runterfällst.'],
          build: (b) => D.lureLayers(b, { R: 20, layers: 6, drop: 30, gap: 3, bait: 'egg', roof: true, floor: 'magma' }),
        },
      ],
    },

    // =========================================================== BRUCHSTEIN
    {
      id: 'bruchstein', name: 'Bruchsteinfarm', cat: 'Ressourcen', icon: '🪨', color: '#8a8a8a',
      product: 'Bruchstein',
      desc: 'Lava + Wasser = Bruchstein. Vom einfachen Generator bis zur Kolben-Batterie.',
      tiers: [
        {
          level: 1, name: 'Einfacher Bruchstein-Generator', difficulty: 1,
          rates: [['Bruchstein', 1200]],
          upkeep: [['Spitzhacken-Haltbarkeit', 1200, 'Mit Reparatur (Mending) kostenlos']],
          extras: [['Spitzhacke (Effizienz)', 1, '']],
          req: ['1 Lavaeimer, 1 Wassereimer'],
          how: 'Lava fließt nach rechts, Wasser fließt in das Loch daneben. Wo fließende Lava auf fließendes Wasser trifft, entsteht Bruchstein. Das Loch sorgt dafür, dass das Wasser nicht auf die Lavaquelle fließt (sonst gäbe es Obsidian).',
          steps: ['Grabe eine Rinne: Lava – Abbaufeld – Loch – Wasser.', 'Gieße zuerst die Lava, dann das Wasser.', 'Stell dich vor das Abbaufeld und baue ab.'],
          tips: ['Das Loch ist der wichtigste Teil – ohne Loch entsteht Obsidian.', 'Mit Effizienz V + Eile II baust du in einem Klick ab.'],
          build: (b) => D.cobbleGen(b, 0, false),
        },
        {
          level: 2, name: 'Kolben-Generator ×4', difficulty: 2,
          rates: [['Bruchstein', 4000]],
          upkeep: [['Spitzhacken-Haltbarkeit', 4000, 'Mit Reparatur kostenlos']],
          extras: [],
          req: ['Etwas Redstone & Netherquarz (Beobachter)'],
          how: 'Ein Beobachter schaut auf das Feld, wo der Bruchstein entsteht. Sobald ein Stein da ist, feuert er über Redstone einen Kolben, der den Stein nach vorne schiebt. So bilden sich Reihen aus Bruchstein, die du schnell abbauen kannst.',
          steps: ['Baue 4 Generatoren nebeneinander (5 Blöcke Abstand).', 'Kolben hinter das Abbaufeld, schaut nach vorne.', 'Beobachter über das Feld (Gesicht nach unten), darüber ein Block.', 'Redstone auf den Block über dem Kolben – er verbindet sich mit dem Block über dem Beobachter.'],
          tips: ['Du kannst entlang der Reihen laufen und alles abbauen.'],
          build: (b) => { for (let i = 0; i < 4; i++) D.cobbleGen(b, i * 5, true); },
        },
        {
          level: 3, name: 'Bruchstein-Batterie ×10', difficulty: 3,
          rates: [['Bruchstein', 9000]],
          upkeep: [['Spitzhacken-Haltbarkeit', 9000, 'Mit Reparatur kostenlos']],
          extras: [['Leuchtfeuer mit Eile II', 1, 'stark empfohlen']],
          req: ['10 Lavaeimer'],
          how: 'Zehn Kolben-Generatoren in einer Reihe. Mit Effizienz V und Eile II ist jeder Stein sofort weg – perfekt für große Bauprojekte oder zum Herstellen von Stein (Ofen).',
          steps: ['Baue einen Kolben-Generator und teste ihn.', 'Wiederhole ihn 10-mal nebeneinander.', 'Ein Leuchtfeuer in der Nähe gibt dir Eile.'],
          tips: ['Bruchstein lässt sich im Ofen zu Stein brennen.'],
          build: (b) => { for (let i = 0; i < 10; i++) D.cobbleGen(b, i * 5, true); },
        },
      ],
    },

    // =========================================================== HOLZ
    {
      id: 'holz', name: 'Baumfarm', cat: 'Ressourcen', icon: '🌳', color: '#8a6a3e',
      product: 'Holzstämme',
      desc: 'Setzlinge pflanzen, mit Knochenmehl wachsen lassen, fällen. Kostet Knochenmehl!',
      tiers: [
        {
          level: 1, name: 'Birken-Setzlingsfeld', difficulty: 1,
          rates: [['Birkenstämme', 400], ['Setzlinge', 60]],
          upkeep: [['Knochenmehl', 50, 'optional – Bäume wachsen auch von selbst']],
          extras: [['Axt', 1, '']],
          req: ['Freier Platz mit Himmel darüber'],
          how: 'Birken wachsen ohne Äste und sind 1 Block breit – leicht zu fällen. Mit Fackeln wachsen sie auch nachts. Pflanze nach dem Fällen sofort einen neuen Setzling.',
          steps: ['Lege ein Feld mit Erde an (Abstand 3 zwischen den Setzlingen).', 'Pflanze die Setzlinge und stelle Fackeln dazwischen.', 'Mit Knochenmehl geht es sofort.'],
          tips: ['Birke wächst auch neben anderen Bäumen gut.'],
          build: (b) => {
            for (let x = -1; x <= 13; x++) for (let z = -1; z <= 9; z++) b.set(x, 0, z, 'dirt');
            for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) b.set(i * 4, 1, j * 4, 'sapling');
            for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) b.set(2 + i * 4, 1, 2 + j * 4, 'torch');
          },
        },
        {
          level: 2, name: 'Riesenfichte mit Knochenmehl-Werfer', difficulty: 2,
          rates: [['Fichtenstämme', 2000]],
          upkeep: [['Knochenmehl', 250, 'ca. 4–5 pro Baum']],
          extras: [['Axt mit Effizienz V', 1, ''], ['Knochenmehl-Vorrat', 128, 'Startvorrat']],
          req: ['Freier Platz ca. 15×15 bis Höhe 35'],
          how: '4 Fichtensetzlinge im 2×2 auf Podsol/Erde wachsen zu einer Riesenfichte mit 60–100 Stämmen. Ein Werfer mit Knochenmehl und Knopf lässt sie sofort wachsen. Du fällst den Stamm von unten nach oben.',
          steps: ['Lege 2×2 Podsol oder Erde.', 'Pflanze 4 Fichtensetzlinge.', 'Werfer daneben (zeigt auf einen Setzling), Knochenmehl rein, Knopf drauf.', 'Knopf drücken → Baum wächst → fällen → neu pflanzen.'],
          tips: ['Kombiniere mit der Knochenmehl-Farm, dann kostet die Farm nichts mehr.', 'Riesenfichten verwandeln Erde in Podsol – praktisch!'],
          build: (b) => {
            b.fill(-4, 0, -4, 5, 0, 5, 'cobble');
            b.fill(0, 0, 0, 1, 0, 1, 'podzol');
            b.fill(0, 1, 0, 1, 1, 1, 'spruce_sapling');
            b.set(-1, 1, 0, 'dispenser:e');
            b.set(-1, 2, 0, 'button');
            b.set(-2, 1, 1, 'afk');
          },
        },
        {
          level: 3, name: 'Holzfäller-Station (4 Riesenfichten)', difficulty: 3,
          rates: [['Fichtenstämme', 4500]],
          upkeep: [['Knochenmehl', 600, 'Knochenmehl-Farm empfohlen']],
          extras: [['Axt mit Effizienz V + Haltbarkeit + Reparatur', 2, ''], ['Eile-II-Leuchtfeuer', 1, 'empfohlen']],
          req: ['Freier Platz ca. 40×15', 'Knochenmehl-Farm'],
          how: 'Vier Fichten-Stationen nebeneinander. Während du einen Baum fällst, kann der nächste schon wachsen. Mit einem Eile-Leuchtfeuer und guter Axt ist das die schnellste Holzquelle ohne TNT-Technik.',
          steps: ['Baue vier Stationen mit je 8 Blöcken Abstand.', 'Fülle alle Werfer mit Knochenmehl.', 'Baue ein Leuchtfeuer in der Mitte.'],
          tips: ['Kombinierbar mit der Knochenmehl-Farm (Moos).'],
          build: (b) => {
            b.fill(-4, 0, -4, 29, 0, 5, 'cobble');
            for (let i = 0; i < 4; i++) {
              const x = i * 8;
              b.fill(x, 0, 0, x + 1, 0, 1, 'podzol');
              b.fill(x, 1, 0, x + 1, 1, 1, 'spruce_sapling');
              b.set(x - 1, 1, 0, 'dispenser:e');
              b.set(x - 1, 2, 0, 'button');
            }
            b.set(-2, 1, 3, 'afk');
          },
        },
      ],
    },

    // =========================================================== SCHLEIM
    {
      id: 'schleim', name: 'Schleimfarm', cat: 'Ressourcen', icon: '🟩', color: '#7cc56e',
      product: 'Schleimbälle',
      desc: 'In Schleim-Chunks spawnen unter Y=40 Schleime – egal wie hell es ist. Sie hüpfen von den Ebenen in eine Magma-Grube.',
      tiers: [
        {
          level: 1, name: 'Schleimchunk-Farm (2 Ebenen)', difficulty: 2,
          rates: [['Schleimbälle', 150]],
          upkeep: [],
          extras: [],
          req: ['Ein Schleimchunk (z. B. mit chunkbase.com „Slime Finder" und deinem Seed)', 'Unter Y = 40 bauen', 'Den ganzen Chunk ausgraben'],
          how: 'Schleime spawnen in Schleimchunks egal wie hell es ist. Fackeln verhindern also alle anderen Monster. Die Schleime hüpfen über den offenen Rand nach unten, Wasser schiebt sie zur Mitte in eine Grube mit Magmablöcken. Kleine Schleime sterben dort und lassen Schleimbälle fallen, die Trichterloren unter dem Magma einsammeln.',
          steps: ['Finde einen Schleimchunk und grabe ihn aus (16×16).', 'Baue unten den Sammelboden mit Wasser zur Mitte.', 'Grube: Magmablöcke, darunter Schienen mit Trichterloren, darunter Trichter und Truhen.', 'Baue die Ebenen (14×14) mit 3 Blöcken Platz dazwischen. Der Rand bleibt offen!', 'Stelle Fackeln auf jede Ebene.'],
          tips: ['Stell dich 24–128 Blöcke entfernt hin, sonst spawnt nichts.', 'Trichterloren saugen Items auch durch volle Blöcke an.'],
          build: (b) => D.slimeFarm(b, 2),
        },
        {
          level: 2, name: 'Schleimturm (5 Ebenen)', difficulty: 3,
          rates: [['Schleimbälle', 400]],
          upkeep: [],
          extras: [],
          req: ['Schleimchunk unter Y = 40'],
          how: 'Gleiche Farm, nur mit 5 Ebenen. Mehr Fläche = mehr Schleime.',
          steps: ['Wie die 2-Ebenen-Farm.', 'Jede Ebene 4 Blöcke über der vorherigen.'],
          tips: ['Je tiefer du baust (bis Y=-64), desto mehr Ebenen passen.'],
          build: (b) => D.slimeFarm(b, 5),
        },
        {
          level: 3, name: 'Schleim-Fabrik (10 Ebenen)', difficulty: 4,
          rates: [['Schleimbälle', 800]],
          upkeep: [],
          extras: [['Sortieranlage', 1, 'optional']],
          req: ['Schleimchunk, ganz unten (ab Y = -64)'],
          how: 'Zehn Ebenen nutzen den ganzen Höhenbereich unter Y=40. Damit hast du Schleim für Klebrige Kolben, Schleimblöcke und Flugmaschinen ohne Ende.',
          steps: ['Grabe den Chunk von Y=-64 bis Y=-20 aus.', 'Baue Sammelboden und 10 Ebenen.'],
          tips: ['Höhlen in der Nähe ausleuchten – sonst spawnen dort Mobs statt in der Farm.'],
          build: (b) => D.slimeFarm(b, 10),
        },
      ],
    },

    // =========================================================== FELDFRÜCHTE
    {
      id: 'feld', name: 'Feldfrüchte (Karotten/Kartoffeln)', cat: 'Essen', icon: '🥕', color: '#e08a2a',
      product: 'Karotten / Kartoffeln',
      desc: 'Vom Handfeld bis zur vollautomatischen Dorfbewohner-Farm, die Essen in eine Truhe wirft.',
      tiers: [
        {
          level: 1, name: 'Klassisches 9×9-Feld', difficulty: 1,
          rates: [['Karotten', 300]],
          upkeep: [],
          extras: [['Hacke', 1, ''], ['Karotten zum Pflanzen', 80, '']],
          req: [],
          how: 'Ein Wasserblock bewässert 4 Blöcke in jede Richtung – genau ein 9×9-Feld. Zaun drumherum, damit keine Tiere reinlaufen. Ernte, wenn die Karotten reif sind, und pflanze direkt neu.',
          steps: ['Erde 9×9 mit Hacke bearbeiten.', 'In die Mitte ein Wasserblock.', 'Karotten pflanzen, Zaun und Fackeln drumherum.'],
          tips: ['Fackeln = Wachstum auch nachts.', 'Nicht auf dem Ackerboden springen, sonst wird er zu Erde.'],
          build: (b) => {
            for (let x = 0; x < 9; x++) for (let z = 0; z < 9; z++) {
              if (x === 4 && z === 4) { b.set(x, 0, z, 'water'); continue; }
              b.set(x, 0, z, 'farmland'); b.set(x, 1, z, 'carrots');
            }
            b.walls(-1, 0, -1, 9, 0, 9, 'dirt');
            b.walls(-1, 1, -1, 9, 1, 9, 'fence');
            for (const [x, z] of [[-1, -1], [9, -1], [-1, 9], [9, 9]]) b.set(x, 2, z, 'torch');
          },
        },
        {
          level: 2, name: 'Dorfbewohner-Farm (automatisch)', difficulty: 2,
          rates: [['Karotten', 450]],
          upkeep: [],
          extras: [],
          req: ['2 Bauern + 1 weiterer Dorfbewohner'],
          how: 'Bauern-Dorfbewohner ernten und pflanzen von selbst. Haben sie genug Essen, werfen sie es einem anderen Dorfbewohner zu. Dieser steht in einer kleinen Zelle auf einem Trichter – alles, was er nicht aufhebt, landet in der Truhe. Der Spalt zwischen unterer und oberer Stufe ist nur 1 Block hoch: Essen fliegt durch, Dorfbewohner passen nicht.',
          steps: ['Baue das 9×9-Feld mit Glaswand drumherum.', 'Zwei Komposter in die Ecken (machen die Dorfbewohner zu Bauern).', 'An einer Seite die Empfänger-Zelle mit Trichter und Truhe.', 'Zwischen Feld und Zelle: untere Stufe + darüber obere Stufe.', 'Bringe die Dorfbewohner rein.'],
          tips: ['Der Empfänger hebt erst Essen auf, bis sein Inventar voll ist – danach geht alles in die Truhe.'],
          build: (b) => D.cropModule(b, 0, 0, 0, 2, false),
        },
        {
          level: 3, name: 'Gemüse-Hochhaus (3 Etagen)', difficulty: 3,
          rates: [['Karotten', 1400]],
          upkeep: [],
          extras: [],
          req: ['6 Bauern + 3 Empfänger'],
          how: 'Drei Dorfbewohner-Felder übereinander gestapelt, beleuchtet mit Fackeln. Jede Etage arbeitet unabhängig.',
          steps: ['Baue eine Etage fertig.', 'Die nächste Etage 4 Blöcke höher (Boden = Decke der unteren).', 'Fackeln auf jede Etage.'],
          tips: ['Karotten kannst du gegen Smaragde bei Bauern tauschen!'],
          build: (b) => { for (let i = 0; i < 3; i++) D.cropModule(b, 0, i * 4, 0, 2, true); },
        },
      ],
    },

    // =========================================================== HÜHNCHEN
    {
      id: 'huhn', name: 'Hühnerfarm', cat: 'Essen', icon: '🍗', color: '#f2f2f2',
      product: 'Gebratenes Hähnchen',
      desc: 'Hühner legen Eier, ein Werfer verschießt sie, die Küken wachsen auf und werden von Lava gebraten.',
      tiers: [
        {
          level: 1, name: 'Eier-Sammler', difficulty: 1,
          rates: [['Eier', 120]],
          upkeep: [],
          extras: [['Weizensamen', 16, 'zum Anlocken']],
          req: ['16 Hühner'],
          how: 'Hühner sitzen auf Trichtern. Jedes Ei, das sie legen, wandert sofort in die Truhe. Die Eier kannst du werfen, um mehr Hühner zu bekommen, oder zum Backen benutzen.',
          steps: ['2 Trichter auf eine Doppeltruhe.', 'Glas drumherum, 2 Blöcke hoch.', 'Hühner mit Samen hineinlocken.'],
          tips: ['Gib den Hühnern keinen Platz zum Weglaufen – 1×2 reicht.'],
          build: (b) => {
            b.set(0, 0, 0, 'chest'); b.set(1, 0, 0, 'chest');
            b.set(0, 1, 0, 'hopper:d'); b.set(1, 1, 0, 'hopper:d');
            b.walls(-1, 1, -1, 2, 3, 1, 'glass');
            b.fill(0, 4, 0, 1, 4, 0, 'glass');
            b.mob(0, 1, 0, 'chicken', 8); b.mob(1, 1, 0, 'chicken', 8);
          },
        },
        {
          level: 2, name: 'Automatische Hähnchen-Küche', difficulty: 3,
          rates: [['Gebratenes Hähnchen', 60], ['Federn', 60]],
          upkeep: [],
          extras: [],
          req: ['48 Hühner'],
          how: 'Erwachsene Hühner sitzen auf einer Trichterreihe. Die Eier wandern in einen Werfer, der von einem Beobachter-Takt ständig feuert. Die Küken schlüpfen direkt im Koch-Trichter. Küken sind klein genug, um unter der Lava zu sitzen – wenn sie erwachsen werden, wachsen sie mit dem Kopf in die Lava und landen gebraten in der Truhe.',
          steps: ['Truhe, darauf der Koch-Trichter, darüber Lava (mit Glas eingeschlossen).', 'Werfer daneben, zeigt in den Koch-Trichter.', 'Zwei Beobachter, die sich ansehen, neben den Werfer (Takt).', 'Auf den Werfer eine Trichterreihe – dort sitzen die Hühner.', 'Glas um die Hühner.'],
          tips: ['Max. 24 Tiere pro Block, sonst sterben sie durch Gedränge.'],
          build: (b) => D.chickenCooker(b, 0, 0, 4, 12),
        },
        {
          level: 3, name: 'Hähnchen-Großküche (3 Linien)', difficulty: 4,
          rates: [['Gebratenes Hähnchen', 300], ['Federn', 300]],
          upkeep: [],
          extras: [],
          req: ['360 Hühner (vorher züchten!)', 'Guter PC'],
          how: 'Drei Küchen mit jeweils 6 Brut-Trichtern und je 20 Hühnern. Damit hast du Essen für immer.',
          steps: ['Baue eine Küche wie in der Fortgeschritten-Stufe.', 'Wiederhole sie zweimal daneben.', 'Verbinde die Truhen mit einer Trichterkette.'],
          tips: ['Viele Tiere = Lag. Im Zweifel lieber weniger Hühner pro Trichter.'],
          build: (b) => { for (let i = 0; i < 3; i++) D.chickenCooker(b, 0, i * 4, 6, 20); },
        },
      ],
    },

    // =========================================================== MELONE/KÜRBIS
    {
      id: 'melone', name: 'Melonen- & Kürbisfarm', cat: 'Essen', icon: '🍉', color: '#7aa02a',
      product: 'Melonen / Kürbisse',
      desc: 'Stängel lassen Früchte auf die Erde daneben wachsen. Beobachter erkennen die Frucht, Kolben brechen sie ab.',
      tiers: [
        {
          level: 1, name: 'Stängel-Reihen (manuell)', difficulty: 1,
          rates: [['Melonenscheiben', 150]],
          upkeep: [],
          extras: [['Hacke', 1, '']],
          req: [],
          how: 'Jeder Stängel braucht einen freien Erdblock daneben, auf dem die Frucht wächst. Deshalb immer abwechselnd: Erde – Stängel – Wasser – Stängel – Erde.',
          steps: ['Lege Reihen: Erde, Ackerboden, Wasser, Ackerboden, Erde.', 'Pflanze Kerne auf den Ackerboden.', 'Ernte die Früchte, die auf der Erde wachsen.'],
          tips: ['Mit Behutsamkeit bekommst du ganze Melonenblöcke.'],
          build: (b) => {
            for (let x = 0; x < 9; x++) {
              b.set(x, 0, 0, 'dirt'); b.set(x, 0, 1, 'farmland'); b.set(x, 1, 1, 'melon_stem');
              b.set(x, 0, 2, 'water'); b.set(x, 0, 3, 'farmland'); b.set(x, 1, 3, 'melon_stem'); b.set(x, 0, 4, 'dirt');
            }
            b.set(0, 1, 0, 'melon'); b.set(4, 1, 4, 'melon');
            b.set(-1, 1, 2, 'torch'); b.set(9, 1, 2, 'torch');
          },
        },
        {
          level: 2, name: 'Automatische Melonenreihe', difficulty: 2,
          rates: [['Melonenscheiben', 160], ['oder Kürbisse', 30]],
          upkeep: [],
          extras: [],
          req: ['Etwas Eisen für Trichterloren'],
          how: 'Über jedem Fruchtfeld schaut ein Beobachter nach unten. Wächst eine Frucht, gibt er ein Signal nach oben in einen Block. Der Redstone daneben schaltet den Block über dem Kolben ein – der Kolben schiebt und zerbricht die Frucht. Trichterloren unter der Erde saugen die Items durch den Block hindurch ein.',
          steps: ['Unten: Trichterkette mit Schienen und Trichterloren darauf.', 'Darauf die Erdreihe (Fruchtfelder).', 'Daneben Ackerboden mit Stängeln und eine Wasserreihe.', 'Kolben hinter die Erde, zeigen auf das Fruchtfeld.', 'Beobachter über jedes Fruchtfeld (Gesicht nach unten), darüber Blöcke.', 'Redstone auf die Blöcke über den Kolben.'],
          tips: ['Kürbisse funktionieren genauso.'],
          build: (b) => D.melonRow(b, 0, 0, 9, 1, 'melon_stem'),
        },
        {
          level: 3, name: 'Melonen-Fabrik (2×16 doppelseitig)', difficulty: 3,
          rates: [['Melonenscheiben', 550], ['oder Kürbisse', 110]],
          upkeep: [],
          extras: [],
          req: ['Viel Eisen (32 Trichterloren)'],
          how: 'Zwei gespiegelte Reihen teilen sich eine Wasserreihe. Doppelt so viele Stängel auf fast gleichem Platz.',
          steps: ['Baue die erste Reihe wie bei Fortgeschritten (16 lang).', 'Spiegle sie auf der anderen Seite der Wasserreihe.'],
          tips: ['Melonenscheiben sind super zum Handeln mit Bauern-Dorfbewohnern.'],
          build: (b) => { D.melonRow(b, 0, 0, 16, 1, 'melon_stem'); D.melonRow(b, 0, 4, 16, -1, 'pumpkin_stem'); },
        },
      ],
    },

    // =========================================================== HONIG
    {
      id: 'honig', name: 'Honigfarm', cat: 'Essen', icon: '🍯', color: '#f2a72a',
      product: 'Honig / Honigwaben',
      desc: 'Bienen bringen Nektar, der Stock füllt sich, ein Werfer erntet automatisch.',
      tiers: [
        {
          level: 1, name: 'Bienenstöcke über Lagerfeuer', difficulty: 1,
          rates: [['Honigflaschen', 10]],
          upkeep: [['Glasflaschen', 10, 'werden zu Honigflaschen']],
          extras: [],
          req: ['Bienen (Nest mit Behutsamkeit abbauen)'],
          how: 'Bienen sammeln Nektar an Blumen. Nach 5 Ausflügen ist der Stock voll und du kannst ihn mit einer Glasflasche ernten. Das Lagerfeuer darunter beruhigt die Bienen, damit sie dich nicht stechen.',
          steps: ['Lagerfeuer auf den Boden, darauf direkt den Bienenstock.', 'Viele Blumen rundherum.', 'Wenn Honig am Stock tropft: mit Glasflasche rechtsklicken.'],
          tips: ['Mit einer Schere bekommst du Honigwaben statt Honig.'],
          build: (b) => {
            for (let x = -2; x <= 6; x++) for (let z = -1; z <= 4; z++) b.set(x, -1, z, 'grass');
            for (const x of [0, 4]) { b.set(x, -1, 0, 'cobble'); b.set(x, 0, 0, 'campfire'); b.set(x, 1, 0, 'beehive:s'); b.mob(x, 1, 1, 'bee', 3); }
            for (let x = -2; x <= 6; x += 2) for (const z of [2, 4]) b.set(x, 0, z, 'flower');
          },
        },
        {
          level: 2, name: 'Honigwaben-Automat (6 Stöcke)', difficulty: 2,
          rates: [['Honigwaben', 50]],
          upkeep: [['Schere', 0.2, 'eine Schere hält 238 Ernten']],
          extras: [],
          req: ['6 Bienenstöcke mit je 3 Bienen'],
          how: 'Ein Beobachter schaut von oben auf den Bienenstock. Sobald der Stock voll ist, ändert er seinen Zustand – der Beobachter feuert und schaltet über Redstone den Werfer mit Schere. Die Waben fallen heraus, eine Trichterlore darunter sammelt sie.',
          steps: ['Trichterkette, darauf Schienen mit Trichterloren.', 'Auf die Schienen die Bienenstöcke (Öffnung nach vorne).', 'Werfer mit Schere hinter jeden Stock.', 'Beobachter auf den Stock (Gesicht nach unten), darüber ein Block.', 'Redstone auf den Block über dem Werfer.', 'Blumen vor die Stöcke.'],
          tips: ['Werfer machen die Bienen nicht wütend – Lagerfeuer braucht man hier nicht.'],
          build: (b) => D.honeyRow(b, 0, 0, 6),
        },
        {
          level: 3, name: 'Honig-Imkerei (2×8 Stöcke)', difficulty: 3,
          rates: [['Honigwaben', 140]],
          upkeep: [['Schere', 0.6, '']],
          extras: [],
          req: ['16 Bienenstöcke, 48 Bienen', 'Großes Blumenfeld'],
          how: 'Zwei lange Reihen mit je 8 Stöcken. Honigwaben brauchst du für Kerzen, Bienenstöcke und zum Wachsen von Kupfer.',
          steps: ['Baue zwei Reihen wie bei Fortgeschritten, Rücken an Rücken.', 'Lege ein großes Blumenfeld davor.'],
          tips: ['Blumenwald-Biom ist ideal.'],
          build: (b) => { D.honeyRow(b, 0, 0, 8); D.honeyRow(b, 0, 6, 8); },
        },
      ],
    },

    // =========================================================== SEETANG
    {
      id: 'seetang', name: 'Seetangfarm', cat: 'Essen', icon: '🌿', color: '#3c7d2b',
      product: 'Seetang / Getrockneter Seetang',
      desc: 'Seetang wächst schnell unter Wasser. Getrocknet ist er Essen und als Block ein super Brennstoff.',
      tiers: [
        {
          level: 1, name: 'Seetang-Teich', difficulty: 1,
          rates: [['Seetang', 300]],
          upkeep: [],
          extras: [],
          req: ['Seetang aus dem Ozean'],
          how: 'Seetang wächst nach oben, solange über ihm Wasser ist. Brich den zweiten Block ab – der untere bleibt stehen und wächst nach.',
          steps: ['Baue ein 6×4 großes Becken, 3 tief.', 'Fülle es mit Wasser und pflanze Seetang auf den Boden.', 'Ernte immer den 2. Block von unten.'],
          tips: ['Getrockneter Seetang (im Ofen) ist schnelles Essen.'],
          build: (b) => {
            b.fill(-1, 0, -1, 6, 3, 4, 'glass'); b.fill(0, 0, 0, 5, 0, 3, 'cobble');
            b.fill(0, 1, 0, 5, 3, 3, 'water');
            for (let x = 0; x < 6; x++) for (let z = 0; z < 4; z++) { b.set(x, 1, z, 'kelp'); b.set(x, 2, z, 'kelp'); }
          },
        },
        {
          level: 2, name: 'Seetang mit Kolben (Hebel)', difficulty: 2,
          rates: [['Seetang', 120]],
          upkeep: [],
          extras: [],
          req: [],
          how: 'Kolben stehen auf Höhe des 2. Seetang-Blocks. Legst du den Hebel um, brechen alle Kolben den Seetang ab. Die Items schwimmen nach oben in einen Wasserstrom, der sie zum Trichter bringt.',
          steps: ['Reihe aus 7 Seetang (2 hoch) mit Glas davor.', 'Kolben hinter den 2. Block, dahinter Blöcke mit Redstone drauf.', 'Oben ein Wasserstrom (Quelle am Anfang), am Ende ein Trichter mit Truhe.', 'Hebel am Ende der Redstone-Leitung.'],
          tips: ['Wasser fließt nur 7 Blöcke weit – mehr Reihen statt längere Reihen.'],
          build: (b) => { D.kelpRow(b, 0, 0, 7, false); D.kelpRow(b, 10, 0, 7, false); },
        },
        {
          level: 3, name: 'Seetang-Fabrik mit Takt', difficulty: 3,
          rates: [['Seetang', 380], ['→ Getrockneter Seetang', 380]],
          upkeep: [['Brennstoff', 0, 'Getrocknete Seetangblöcke halten sich selbst am Laufen']],
          extras: [['Räucherofen', 6, 'zum Trocknen'], ['Werkbank-Automat', 1, 'optional: macht Seetangblöcke']],
          req: [],
          how: 'Ein Beobachter-Takt feuert die Kolben dauernd. Der Seetang wird sofort geerntet, sobald er gewachsen ist. Das Ergebnis kannst du in Räucheröfen trocknen und zu Blöcken pressen – ein Block brennt 20 Items!',
          steps: ['Baue 6 Segmente (2 Reihen × 3) mit je 7 Seetang.', 'Statt Hebel: zwei Beobachter, die sich ansehen.', 'Hänge Räucheröfen an die Truhen.'],
          tips: ['Der Beobachter-Takt ist laut – baue die Farm nicht direkt neben dein Haus.'],
          build: (b) => { for (const oz of [0, 4]) for (const ox of [0, 12, 24]) D.kelpRow(b, ox, oz, 7, true); },
        },
      ],
    },

    // =========================================================== MOB-FARM
    {
      id: 'mob', name: 'Mob- & XP-Farm', cat: 'Mobs & XP', icon: '💀', color: '#6a6a8a',
      product: 'XP & Mob-Drops',
      desc: 'Monster spawnen im Dunkeln, werden zu dir gebracht und fast tot gefallen. Ein Schlag – XP!',
      tiers: [
        {
          level: 1, name: 'Zombie-/Skelett-Spawner-Farm', difficulty: 2,
          rates: [['XP-Punkte', 2000], ['Verrottetes Fleisch / Knochen', 400]],
          upkeep: [['Schwert-Haltbarkeit', 400, 'Mit Reparatur kostenlos']],
          extras: [['Schwert mit Plünderung', 1, '']],
          req: ['Ein Verlies (Dungeon) mit Zombie- oder Skelett-Spawner'],
          how: 'Wasser schiebt die Mobs aus dem Spawner-Raum in eine Blasensäule aus Seelensand. Die bringt sie 25 Blöcke hoch, dort fallen sie 22 Blöcke tief – genau so tief, dass sie mit einem halben Herz unten ankommen. Du stehst direkt daneben (also in Reichweite des Spawners) und erledigst sie mit einem Schlag.',
          steps: ['Grabe den Raum um den Spawner auf 9×9 aus (4 hoch).', 'Wasserquellen an der Rückwand – sie fließen nach vorne.', 'Vorne ein Querkanal zur Blasensäule (Seelensand unten).', 'Blasensäule aus Wasserquellen in einem Glasrohr 25 hoch.', 'Oben: Wasser schiebt die Mobs über ein Schild in den Fallschacht.', 'Unten: Trichter + Truhe, dein Platz hinter einer oberen Stufe.'],
          tips: ['Der Spawner läuft nur, wenn du max. 16 Blöcke entfernt bist.', 'Skelett-Spawner = Knochen für Knochenmehl!'],
          build: (b) => D.spawnerFarm(b, 'spawn_zombie'),
        },
        {
          level: 2, name: 'Dunkelraum-Mobturm (2 Ebenen)', difficulty: 3,
          rates: [['XP-Punkte', 2500], ['Knochen', 250], ['Pfeile', 250], ['Schwarzpulver', 150], ['Fäden', 100]],
          upkeep: [['Schwert-Haltbarkeit', 500, '']],
          extras: [],
          req: ['Hoch in die Luft bauen (über Y=150) oder über einem Ozean', 'Umgebung ausleuchten'],
          how: 'Auf dunklen Ebenen spawnen Monster. Sie laufen zufällig herum, fallen in einen der vier Wasserkanäle und werden zur Mitte gespült. Dort halten Wandschilder das Wasser auf – die Mobs fallen durch und landen 22 Blöcke tiefer mit wenig Leben bei dir.',
          steps: ['Baue Fallschacht und Tötungskammer.', 'Erste Ebene (18×18) 22 Blöcke über der Kammer.', 'Vier Kanäle (2 breit, 1 tief) zur Mitte, Wasserquellen am Rand.', 'Wandschilder in die 2×2-Mitte.', 'Nächste Ebene 3 Blöcke darüber, Dach oben drauf.'],
          tips: ['Mobs spawnen nur 24–128 Blöcke von dir weg.', 'Ebenen 2 Blöcke hoch = keine Endermen.'],
          build: (b) => D.mobTower(b, { floors: 2 }),
        },
        {
          level: 4, name: 'Monster-Hochhaus (6 Ebenen)', difficulty: 4,
          rates: [['XP-Punkte', 6000], ['Knochen', 750], ['Pfeile', 750], ['Schwarzpulver', 450], ['Fäden', 300]],
          upkeep: [['Schwert-Haltbarkeit', 1200, '']],
          extras: [['Sortieranlage', 1, 'empfohlen']],
          req: ['Über einem Ozean, Umgebung im Umkreis von 128 Blöcken ausgeleuchtet'],
          how: 'Sechs Ebenen über einem Ozean. Die oberen Mobs fallen tiefer und sterben teilweise schon beim Aufprall (Loot, aber kein XP). Für maximale Raten: Höhlen im Umkreis ausleuchten oder einen Perimeter graben.',
          steps: ['Wie der 2-Ebenen-Turm, nur mit 6 Ebenen.', 'Bau über einem Ozean – dort gibt es keine Höhlen.'],
          tips: ['Endgame-Trick: Die Fläche rundherum (128 Blöcke) leer graben = fast doppelte Rate.'],
          build: (b) => D.mobTower(b, { floors: 6 }),
        },
      ],
    },

    // =========================================================== CREEPER
    {
      id: 'creeper', name: 'Creeperfarm', cat: 'Mobs & XP', icon: '💥', color: '#4caf50',
      product: 'Schwarzpulver',
      desc: 'Spezieller Dunkelraum, in dem nur Creeper Platz haben – für Raketen und TNT.',
      tiers: [
        {
          level: 1, name: 'Mini-Creeperraum', difficulty: 2,
          rates: [['Schwarzpulver', 80], ['XP-Punkte', 300]],
          upkeep: [],
          extras: [],
          req: ['Über einem Ozean oder hoch in der Luft'],
          how: 'Unter jeder Spawn-Decke hängen geschlossene obere Falltüren. Dadurch ist der Raum nur 1,8 Blöcke hoch: Creeper (1,7) passen, Zombies und Skelette (fast 2) nicht. Wasserkanäle bringen die Creeper zum Fallschacht.',
          steps: ['Baue Kammer und Fallschacht.', 'Spawn-Ebene mit 4 Wasserkanälen zur Mitte.', 'Obere Falltüren (geschlossen) an die Decke über den Spawnflächen.'],
          tips: ['Spinnen passen leider auch rein – ihr Faden ist aber auch nützlich.'],
          build: (b) => D.mobTower(b, { floors: 1, arm: 6, creeper: true }),
        },
        {
          level: 2, name: 'Creeperturm (3 Ebenen)', difficulty: 3,
          rates: [['Schwarzpulver', 300], ['XP-Punkte', 1000]],
          upkeep: [],
          extras: [],
          req: ['Über einem Ozean'],
          how: 'Drei Creeper-Ebenen mit voller Größe. Die Creeper fallen 22 Blöcke und sind fast tot – ein Schlag reicht.',
          steps: ['Wie der Mini-Raum, aber 18×18 und 3 Ebenen.'],
          tips: ['Schwarzpulver + Papier = Raketen für die Elytra.'],
          build: (b) => D.mobTower(b, { floors: 3, creeper: true }),
        },
        {
          level: 4, name: 'Raketen-Fabrik (8 Ebenen)', difficulty: 5,
          rates: [['Schwarzpulver', 900], ['XP-Punkte', 2500]],
          upkeep: [],
          extras: [['Sortieranlage', 1, '']],
          req: ['Über einem Ozean, Perimeter empfohlen'],
          how: 'Acht Ebenen voller Creeper. Genug Schwarzpulver für unendlich Raketen und TNT.',
          steps: ['Wie der Creeperturm, 8 Ebenen hoch.'],
          tips: ['Kombiniere mit einer Zuckerrohrfarm für Papier.'],
          build: (b) => D.mobTower(b, { floors: 8, creeper: true }),
        },
      ],
    },

    // =========================================================== BLAZE
    {
      id: 'blaze', name: 'Lohenfarm (Blaze)', cat: 'Mobs & XP', icon: '🔥', color: '#ffb02e',
      product: 'Lohenruten',
      desc: 'Lohen-Spawner in einer Netherfestung. Lohenruten brauchst du für Braustände und Enderaugen.',
      tiers: [
        {
          level: 1, name: 'Lohen-Käfig', difficulty: 2,
          rates: [['Lohenruten', 150], ['XP-Punkte', 1500]],
          upkeep: [['Schwert-Haltbarkeit', 300, '']],
          extras: [['Feuerresistenz-Trank', 2, 'zur Sicherheit']],
          req: ['Netherfestung mit Lohen-Spawner'],
          how: 'Du umbaust den Spawner mit einem Raum. Die Lohen kommen auf dich zu, können aber nur durch den halben Spalt unter der oberen Stufe sehen. Du schlägst sie von deinem sicheren Platz aus.',
          steps: ['Baue einen 9×9-Raum um den Spawner.', 'An einer Seite: obere Stufe als Spalt, dahinter dein Platz.'],
          tips: ['Schneebälle machen Lohen Schaden – praktisch im Notfall.'],
          build: (b) => {
            b.walls(-5, 0, -5, 5, 6, 5, 'cobble'); b.fill(-4, 0, -4, 4, 0, 4, 'cobble'); b.fill(-5, 6, -5, 5, 6, 5, 'cobble');
            b.set(0, 3, 0, 'spawner'); b.mob(0, 4, 0, 'blaze');
            b.set(5, 1, 0, 'slab_top'); b.set(5, 2, 0, 'cobble');
            b.fill(6, 0, -1, 7, 0, 1, 'cobble'); b.set(6, 1, 0, 'afk'); b.fill(6, 3, -1, 7, 3, 1, 'cobble');
            b.walls(6, 1, -1, 8, 2, 1, 'cobble', true); b.set(6, 1, 0, 'afk'); b.set(6, 2, 0, null); b.set(7, 1, 0, null); b.set(7, 2, 0, null);
          },
        },
        {
          level: 2, name: 'Lohen-Fallrohr', difficulty: 3,
          rates: [['Lohenruten', 300], ['XP-Punkte', 3000]],
          upkeep: [['Schwert-Haltbarkeit', 600, '']],
          extras: [],
          req: ['Netherfestung mit Lohen-Spawner'],
          how: 'Wenn Lohen nichts angreifen, sinken sie langsam nach unten. Ein Loch im Boden führt sie in ein Glasrohr zu deinem AFK-Platz. Dort kommen sie einzeln an, und du schlägst ihnen durch den Spalt auf die Füße.',
          steps: ['Raum um den Spawner (9×9, 5 hoch).', 'Loch im Boden, darunter Glasrohr 3 tief.', 'Unten Trichter + Truhe, dein Platz hinter einer oberen Stufe.'],
          tips: ['Du bist innerhalb von 16 Blöcken – der Spawner bleibt aktiv.'],
          build: (b) => {
            b.walls(-5, 0, -5, 5, 6, 5, 'cobble'); b.fill(-4, 0, -4, 4, 0, 4, 'cobble'); b.fill(-5, 6, -5, 5, 6, 5, 'cobble');
            b.set(0, 3, 0, 'spawner'); b.mob(0, 4, 0, 'blaze');
            b.set(0, 0, 3, null);
            for (let y = -3; y <= -1; y++) { b.set(-1, y, 3, 'glass'); b.set(1, y, 3, 'glass'); b.set(0, y, 2, 'glass'); if (y < -1) b.set(0, y, 4, 'glass'); }
            b.set(0, -4, 3, 'hopper:d'); b.set(0, -5, 3, 'chest');
            b.set(0, -3, 4, 'slab_top'); b.set(0, -2, 4, 'cobble'); b.set(0, -1, 4, 'cobble');
            b.fill(-1, -4, 4, 1, -4, 6, 'cobble'); b.set(0, -3, 5, 'afk'); b.set(-1, -3, 5, 'glass'); b.set(1, -3, 5, 'glass'); b.set(0, -3, 6, 'glass');
            b.fill(-1, -1, 5, 1, -1, 6, 'cobble');
          },
        },
        {
          level: 3, name: 'Automatische Lohen-Presse', difficulty: 4,
          rates: [['Lohenruten', 500]],
          upkeep: [],
          extras: [],
          req: ['Netherfestung mit Lohen-Spawner'],
          how: 'Wie das Fallrohr, aber unten ist eine 1×1-Kammer ohne Ausgang. Ab 25 Lohen in einem Block sterben sie durch Gedränge („Entity Cramming"). Das läuft ganz ohne dich – allerdings gibt es dann keine XP.',
          steps: ['Fallrohr wie in Stufe 2, aber ohne Spalt.', 'Unten ein Trichter, der in eine Truhe führt.', 'Lass die Farm laufen, solange du in der Nähe bist.'],
          tips: ['Gamerule maxEntityCramming muss auf 24 stehen (Standard).'],
          build: (b) => {
            b.walls(-5, 0, -5, 5, 6, 5, 'cobble'); b.fill(-4, 0, -4, 4, 0, 4, 'cobble'); b.fill(-5, 6, -5, 5, 6, 5, 'cobble');
            b.set(0, 3, 0, 'spawner'); b.mob(0, 4, 0, 'blaze');
            b.set(0, 0, 3, null);
            for (let y = -4; y <= -1; y++) { b.set(-1, y, 3, 'glass'); b.set(1, y, 3, 'glass'); b.set(0, y, 2, 'glass'); b.set(0, y, 4, 'glass'); }
            b.set(0, -5, 3, 'hopper:e'); b.set(1, -5, 3, 'chest');
          },
        },
      ],
    },

    // =========================================================== ENDERMAN
    {
      id: 'enderman', name: 'Endermanfarm', cat: 'Mobs & XP', icon: '🟣', color: '#7b4bb0',
      product: 'Enderperlen & XP',
      desc: 'Im Ende spawnen Endermen auf jedem Block. Eine Endermite lockt sie über Falltüren in einen tiefen Schacht.',
      tiers: [
        {
          level: 1, name: 'Ender-Unterstand', difficulty: 1,
          rates: [['Enderperlen', 80], ['XP-Punkte', 800]],
          upkeep: [],
          extras: [['Schwert', 1, '']],
          req: ['Im Ende (nach dem Enderdrachen)'],
          how: 'Endermen sind 2,9 Blöcke groß. Unter einem Dach, das nur 2 Blöcke hoch ist, kommen sie nicht an dich ran. Schau sie an, damit sie angreifen, und schlag sie von unten.',
          steps: ['Baue eine Plattform mit einem 2 Blöcke hohen Dach.', 'Stell dich in die Mitte.', 'Schau Endermen an – sie kommen zu dir, passen aber nicht drunter.'],
          tips: ['Ein Kürbis auf dem Kopf verhindert, dass sie wütend werden – hier willst du das aber!'],
          build: (b) => {
            b.fill(-4, 0, -4, 4, 0, 4, 'endstone');
            b.fill(-2, 3, -2, 2, 3, 2, 'endstone');
            for (const [x, z] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) b.fill(x, 1, z, x, 2, z, 'endstone');
            b.set(0, 1, 0, 'afk');
          },
        },
        {
          level: 2, name: 'Endermite-Falle (Kreuz)', difficulty: 3,
          rates: [['Enderperlen', 800], ['XP-Punkte', 5000]],
          upkeep: [],
          extras: [['Namensschild', 1, 'für die Endermite']],
          req: ['Über der Leere, mind. 128 Blöcke von der Hauptinsel entfernt', 'Eine Endermite (entsteht manchmal beim Perlenwerfen)'],
          how: 'Endermen hassen Endermiten. Die Endermite sitzt in einer Lore in der Mitte. Die Endermen laufen hin, betreten die offenen Falltüren und fallen 42 Blöcke – sie kommen mit 1 Herz unten an. Du stehst unten und machst sie mit einem Schlag platt.',
          steps: ['Baue dir weit draußen über der Leere eine Plattform.', 'Unten die Kammer mit Trichtern, dein Platz hinter einer oberen Stufe.', '42 Blöcke höher: Kreuz-Plattform mit 3×3-Mitte.', 'In die Mitte: Block mit Schiene, Lore und benannter Endermite.', 'Offene Falltüren rund um die Mitte.'],
          tips: ['Die Endermite muss benannt sein, sonst verschwindet sie.', 'Plündern III auf dem Schwert = mehr Perlen.'],
          build: (b) => D.lureLayers(b, { R: 14, layers: 1, drop: 42, gap: 4, bait: 'mite', plus: true, floor: 'endstone', afk: true }),
        },
        {
          level: 4, name: 'Ender-Plattform XXL (2 Ebenen)', difficulty: 5,
          rates: [['Enderperlen', 3000], ['XP-Punkte', 15000]],
          upkeep: [],
          extras: [['Namensschild', 2, '']],
          req: ['Über der Leere, weit weg von der Hauptinsel', 'Sehr viele Blöcke (über 3000)'],
          how: 'Zwei volle 43×43-Ebenen mit je einer Endermite. Mit dieser Farm bekommst du in wenigen Minuten 30 Level – perfekt zum Verzaubern und Reparieren.',
          steps: ['Wie die Kreuz-Farm, aber volle Fläche und 2 Ebenen.', 'Jede Ebene 4 Blöcke über der vorherigen.'],
          tips: ['Zum Bauen: Schwebe-Trick mit Gerüst oder fliegen mit Elytra.'],
          build: (b) => D.lureLayers(b, { R: 20, layers: 2, drop: 42, gap: 4, bait: 'mite', floor: 'endstone', afk: true }),
        },
      ],
    },

    // =========================================================== KNOCHENMEHL
    {
      id: 'knochenmehl', name: 'Knochenmehlfarm', cat: 'Pflanzen & Deko', icon: '🦴', color: '#ece8dc',
      product: 'Knochenmehl',
      desc: 'Komposter machen aus Pflanzen Knochenmehl. Mit Moos wird daraus eine Farm, die mehr erzeugt als sie braucht.',
      tiers: [
        {
          level: 1, name: 'Kompost-Station', difficulty: 1,
          rates: [['Knochenmehl', 40]],
          upkeep: [['Samen / Pflanzen', 450, 'ca. 7–11 Pflanzen pro Knochenmehl']],
          extras: [],
          req: [],
          how: 'Wirf Samen, Setzlinge oder Blätter oben in die Truhe. Trichter füllen sie in den Komposter, das fertige Knochenmehl fällt unten in die Truhe.',
          steps: ['Truhe → Trichter → Komposter → Trichter → Truhe (von oben nach unten).', 'Baue zwei Stationen nebeneinander.'],
          tips: ['Kuchen und Kürbiskuchen füllen den Komposter am schnellsten.'],
          build: (b) => {
            for (const x of [0, 2]) { b.set(x, 3, 0, 'chest'); b.set(x, 2, 0, 'hopper:d'); b.set(x, 1, 0, 'composter'); b.set(x, 0, 0, 'hopper:d'); b.set(x, -1, 0, 'chest'); }
          },
        },
        {
          level: 2, name: 'Moosfarm', difficulty: 2,
          rates: [['Knochenmehl', 300]],
          upkeep: [['Knochenmehl', 60, 'kommt aus der Farm selbst']],
          extras: [['Hacke', 1, 'baut Moos am schnellsten ab'], ['Knochenmehl-Start', 32, '']],
          req: ['Ein Moosblock (Üppige Höhlen oder Wandernder Händler)'],
          how: 'Knochenmehl auf einem Moosblock verwandelt Stein und Erde in der Nähe in Moos. Moos kompostierst du wieder zu Knochenmehl – am Ende kommt deutlich mehr raus, als du reingesteckt hast.',
          steps: ['Lege 7×7 Stein, in die Mitte den Moosblock.', 'Werfer mit Knochenmehl direkt über das Moos (zeigt nach unten), Knopf drauf.', 'Drücke den Knopf, baue das neue Moos ab (nicht den mittleren Block!).', 'Lege neuen Stein und wirf das Moos in die Komposter.'],
          tips: ['Mit 4 Kompostern geht das Verarbeiten viel schneller.'],
          build: (b) => {
            b.fill(0, 0, 0, 6, 0, 6, 'stone'); b.set(3, 0, 3, 'moss');
            b.set(3, 1, 3, 'dispenser:d'); b.set(3, 2, 3, 'button');
            for (let i = 0; i < 4; i++) { const x = i; b.set(x, 3, 9, 'hopper:d'); b.set(x, 2, 9, 'composter'); b.set(x, 1, 9, 'hopper:e'); }
            b.set(4, 1, 9, 'chest');
            for (let i = 0; i < 4; i++) b.set(i, 4, 9, 'chest');
            b.set(5, 1, 3, 'afk');
          },
        },
        {
          level: 3, name: 'Skelett-Spawner (Knochen)', difficulty: 3,
          rates: [['Knochenmehl', 1200], ['Pfeile', 300], ['XP-Punkte', 2000]],
          upkeep: [],
          extras: [['Schwert mit Plünderung', 1, '']],
          req: ['Verlies mit Skelett-Spawner'],
          how: 'Die Spawner-Farm aus der Mob-Kategorie, aber mit einem Skelett-Spawner. Jeder Knochen ergibt 3 Knochenmehl – das ist die mit Abstand größte Knochenmehl-Quelle.',
          steps: ['Siehe Mob-Farm (Spawner).', 'Knochen in einer Werkbank zu Knochenmehl verarbeiten.'],
          tips: ['Perfekt zusammen mit der Baumfarm.'],
          build: (b) => D.spawnerFarm(b, 'skeleton'),
        },
      ],
    },

    // =========================================================== ZUCKERROHR
    {
      id: 'zuckerrohr', name: 'Zuckerrohrfarm', cat: 'Pflanzen & Deko', icon: '🎋', color: '#8fc163',
      product: 'Zuckerrohr',
      desc: 'Für Papier (Raketen, Bücher, Karten) und Zucker. Beobachter merken, wenn das Rohr gewachsen ist.',
      tiers: [
        {
          level: 1, name: 'Zuckerrohr-Feld', difficulty: 1,
          rates: [['Zuckerrohr', 100]],
          upkeep: [],
          extras: [],
          req: ['Zuckerrohr (wächst an Wasser)'],
          how: 'Zuckerrohr braucht Wasser direkt neben dem Erd- oder Sandblock. Ein Wasserkanal mit Erde auf beiden Seiten ist ideal. Ernte immer ab dem 2. Block.',
          steps: ['Grabe Wasserkanäle mit je einer Erdreihe links und rechts.', 'Pflanze Zuckerrohr auf alle Erdblöcke.'],
          tips: ['Bau den untersten Block nie ab – er wächst nach.'],
          build: (b) => {
            for (let x = 0; x < 9; x++) for (const z of [0, 3]) {
              b.set(x, 0, z, 'water'); b.set(x, -1, z, 'cobble');
              for (const dz of [-1, 1]) { b.set(x, 0, z + dz, 'dirt'); b.set(x, 1, z + dz, 'sugarcane'); b.set(x, 2, z + dz, 'sugarcane'); }
            }
          },
        },
        {
          level: 2, name: 'Beobachter-Zuckerrohr (12er Reihe)', difficulty: 2,
          rates: [['Zuckerrohr', 40]],
          upkeep: [],
          extras: [],
          req: ['Etwas Netherquarz (Beobachter)'],
          how: 'Der Beobachter schaut auf den 3. Block. Wächst das Rohr dorthin, gibt er ein Signal nach hinten in den Redstone. Der schaltet den Block unter sich ein, und der Kolben daneben bricht das Rohr ab Block 2 ab. Trichterloren unter der Erde sammeln alles.',
          steps: ['Trichterkette mit Schienen und Trichterloren.', 'Erde darauf, Wasser daneben, Zuckerrohr pflanzen.', 'Kolben auf Höhe 2 hinter dem Rohr.', 'Beobachter auf Höhe 3 (Gesicht zum Rohr).', 'Block hinter dem Kolben, Redstone darauf (hinter dem Beobachter).', 'Glaswand vorne.'],
          tips: ['Langsam, aber vollautomatisch und gratis.'],
          build: (b) => D.caneRow(b, 0, 0, 12, 'sugarcane', true, 'cart'),
        },
        {
          level: 3, name: 'Papier-Fabrik (4×16)', difficulty: 3,
          rates: [['Zuckerrohr', 210]],
          upkeep: [],
          extras: [['Werkbank-Automat', 1, 'optional: macht direkt Papier']],
          req: ['Viel Eisen für Trichterloren'],
          how: 'Vier Beobachter-Reihen mit je 16 Zuckerrohr. Mit einem Werkbank-Automaten (Crafter) wird daraus direkt Papier.',
          steps: ['Baue 4 Reihen hintereinander (je 4 Blöcke Abstand).', 'Alle Truhen an einer Seite – leicht zu leeren.'],
          tips: ['Bambus-Farm daneben = Brennstoff für die Öfen.'],
          build: (b) => { for (let i = 0; i < 4; i++) D.caneRow(b, 0, i * 4, 16, 'sugarcane', true, 'cart'); },
        },
      ],
    },

    // =========================================================== BAMBUS
    {
      id: 'bambus', name: 'Bambusfarm', cat: 'Pflanzen & Deko', icon: '🎍', color: '#6aa232',
      product: 'Bambus',
      desc: 'Bambus wächst extrem schnell. Ideal als Brennstoff, für Gerüste und Bambusholz.',
      tiers: [
        {
          level: 1, name: 'Bambus-Wäldchen', difficulty: 1,
          rates: [['Bambus', 300]],
          upkeep: [],
          extras: [],
          req: ['Bambus (Dschungel oder Pandas)'],
          how: 'Bambus wächst auf Erde ganz von allein bis 12–16 Blöcke hoch. Abbauen geht mit dem Schwert sofort.',
          steps: ['Lege ein 5×5-Erdfeld an.', 'Pflanze überall Bambus.', 'Ernte mit dem Schwert ab dem 2. Block.'],
          tips: ['2 Bambus = 1 Stock. 1 Bambus ist ein halber Brennvorgang.'],
          build: (b) => { for (let x = 0; x < 5; x++) for (let z = 0; z < 5; z++) { b.set(x, 0, z, 'dirt'); for (let y = 1; y <= 4; y++) b.set(x, y, z, 'bamboo'); } },
        },
        {
          level: 2, name: 'Beobachter-Bambus (12er Reihe)', difficulty: 2,
          rates: [['Bambus', 200]],
          upkeep: [],
          extras: [],
          req: [],
          how: 'Genau wie die Zuckerrohr-Reihe, nur ohne Wasser. Der Beobachter sieht den Bambus auf Höhe 3, der Kolben bricht ihn auf Höhe 2.',
          steps: ['Trichterloren-Sammler bauen.', 'Erde darauf, Bambus pflanzen.', 'Kolben + Beobachter + Redstone wie beim Zuckerrohr.'],
          tips: ['Bambus in Öfen: 1 Bambus schmilzt 0,25 Items.'],
          build: (b) => D.caneRow(b, 0, 0, 12, 'bamboo', false, 'cart'),
        },
        {
          level: 3, name: 'Bambus-Kraftwerk (4×16)', difficulty: 3,
          rates: [['Bambus', 1000]],
          upkeep: [],
          extras: [['Öfen', 8, 'optional, für eine Super-Ofen-Anlage']],
          req: [],
          how: 'Vier lange Reihen, die zusammen eine ganze Ofen-Anlage mit Brennstoff versorgen können.',
          steps: ['Baue 4 Reihen hintereinander.', 'Verbinde die Truhen mit den Öfen.'],
          tips: ['Bambus-Floß und Bambusbretter sind hübsch zum Bauen.'],
          build: (b) => { for (let i = 0; i < 4; i++) D.caneRow(b, 0, i * 4, 16, 'bamboo', false, 'cart'); },
        },
      ],
    },

    // =========================================================== KAKTUS
    {
      id: 'kaktus', name: 'Kaktusfarm', cat: 'Pflanzen & Deko', icon: '🌵', color: '#2f7a2a',
      product: 'Kaktus / grüner Farbstoff',
      desc: 'Kakteen brechen von selbst ab, wenn neben ihnen ein Block ist. Daraus wird im Ofen grüner Farbstoff + XP.',
      tiers: [
        {
          level: 1, name: 'Kaktus-Beet', difficulty: 1,
          rates: [['Kaktus', 30]],
          upkeep: [],
          extras: [],
          req: ['Sand, Kaktus'],
          how: 'Kakteen dürfen keinen Block neben sich haben. Deshalb pflanzt man sie mit 1 Block Abstand auf Sand.',
          steps: ['Lege Sand im Schachbrettmuster mit Abstand.', 'Pflanze die Kakteen.', 'Ernte ab dem 2. Block.'],
          tips: ['Kaktus im Ofen = grüner Farbstoff + XP.'],
          build: (b) => {
            b.fill(-1, -1, -1, 7, -1, 7, 'cobble');
            for (let x = 0; x <= 6; x += 2) for (let z = 0; z <= 6; z += 2) { b.set(x, 0, z, 'sand'); b.set(x, 1, z, 'cactus'); }
            b.walls(-1, 0, -1, 7, 0, 7, 'fence');
          },
        },
        {
          level: 2, name: 'Kaktus-Turm (3 Ebenen)', difficulty: 2,
          rates: [['Kaktus', 150]],
          upkeep: [],
          extras: [],
          req: [],
          how: 'Jeder Kaktus steht auf Sand. Neben dem Platz, wo er zum 2. Mal wächst, steht ein Block – der Kaktus bricht sofort ab. Dieser Block trägt gleichzeitig den Sand der nächsten Ebene. Die Kakteen fallen nach unten ins Wasser, das sie zum Trichter bringt.',
          steps: ['Sammelboden mit Wasser zur Trichterreihe in der Mitte.', 'Erste Ebene: Sand auf Stützen, Kaktus darauf.', 'Brecher-Block 2 hoch neben jeden Kaktus.', 'Nächste Ebene versetzt auf den Brecher-Blöcken.'],
          tips: ['Ein paar Kakteen gehen verloren, weil sie auf andere Kakteen fallen – das ist normal.'],
          build: (b) => D.cactusTower(b, 4, 3),
        },
        {
          level: 3, name: 'Kaktus-Hochhaus (8 Ebenen)', difficulty: 3,
          rates: [['Kaktus', 1400], ['XP (im Ofen)', 1400]],
          upkeep: [],
          extras: [['Öfen', 4, 'für grünen Farbstoff + XP']],
          req: [],
          how: 'Acht Ebenen auf 17×17 Blöcken. Mit Öfen dahinter wird das zu einer kleinen XP-Farm.',
          steps: ['Wie der Kaktus-Turm, nur größer und höher.'],
          tips: ['Grüner Farbstoff + Kaktus = Handel mit Wanderhändlern/Dorfbewohnern.'],
          build: (b) => D.cactusTower(b, 8, 8),
        },
      ],
    },

    // =========================================================== WOLLE
    {
      id: 'wolle', name: 'Wollfarm', cat: 'Pflanzen & Deko', icon: '🐑', color: '#e6e6e6',
      product: 'Wolle',
      desc: 'Schafe fressen Gras, ihre Wolle wächst nach – ein Beobachter merkt das und schert automatisch.',
      tiers: [
        {
          level: 1, name: 'Schafweide', difficulty: 1,
          rates: [['Wolle', 100]],
          upkeep: [['Schere-Haltbarkeit', 60, '']],
          extras: [['Schere', 1, ''], ['Weizen', 6, 'zum Anlocken']],
          req: ['6 Schafe'],
          how: 'Schafe auf einer Grasweide fressen Gras und bekommen dadurch neue Wolle. Mit der Schere scheren gibt 1–3 Wolle pro Schaf.',
          steps: ['Grasfläche mit Zaun drumherum.', 'Schafe mit Weizen reinlocken.', 'Regelmäßig scheren.'],
          tips: ['Färbe die Schafe – dann wächst farbige Wolle nach!'],
          build: (b) => {
            for (let x = 0; x < 7; x++) for (let z = 0; z < 7; z++) b.set(x, 0, z, 'grass');
            b.walls(-1, 0, -1, 7, 0, 7, 'dirt'); b.walls(-1, 1, -1, 7, 1, 7, 'fence');
            for (const [x, z] of [[1, 1], [4, 2], [2, 4], [5, 5], [1, 5], [5, 1]]) b.mob(x, 1, z, 'sheep');
          },
        },
        {
          level: 2, name: 'Auto-Wollfarm (8 Schafe)', difficulty: 2,
          rates: [['Wolle', 150]],
          upkeep: [['Schere', 0.6, 'eine Schere = 238 Schuren']],
          extras: [],
          req: ['8 Schafe (Farbe frei wählbar)'],
          how: 'Jedes Schaf steht allein auf einem Grasblock. Frisst es das Gras, wird daraus Erde – der Beobachter daneben merkt das. Sein Signal geht über einen Block und Redstone in den Werfer mit Schere, der das Schaf schert. Die Wolle fällt auf den Grasblock, eine Trichterlore darunter saugt sie ein.',
          steps: ['Trichterkette, darauf Schienen + Trichterloren (unter jedem Schaf).', 'Darauf eine Reihe Grasblöcke.', 'Werfer mit Schere vor jedes Schaf.', 'Beobachter unter den Werfer (schaut auf das Gras).', 'Block hinter den Beobachter, Redstone darauf.', 'Glas um jedes Schaf.'],
          tips: ['Gras breitet sich von den Nachbar-Grasblöcken wieder aus – deshalb ist die ganze Reihe Gras.'],
          build: (b) => D.woolRow(b, 0, 8),
        },
        {
          level: 3, name: 'Regenbogen-Wollfarm (16 Farben)', difficulty: 3,
          rates: [['Wolle (alle 16 Farben)', 300]],
          upkeep: [['Schere', 1.2, '']],
          extras: [['Farbstoffe', 16, 'je eine Farbe']],
          req: ['16 Schafe, jedes in einer anderen Farbe'],
          how: 'Zwei Reihen mit je 8 Schafen in allen 16 Farben. Jede Farbe kommt in die gleiche Truhe – oder du baust eine Sortieranlage dahinter.',
          steps: ['Baue zwei Reihen wie bei Fortgeschritten.', 'Färbe jedes Schaf mit einem anderen Farbstoff.'],
          tips: ['Perfekt für Pixel-Art und bunte Bauten.'],
          build: (b) => { D.woolRow(b, 0, 8); const o = new MF.Build(); D.woolRow(o, 0, 8); for (const [k, v] of o.m) { const [x, y, z] = k.split(',').map(Number); b.set(x, y, 6 - z, v.replace(':n', ':s')); } for (const m of o.mobs) b.mob(m[0], m[1], 6 - m[2], m[3], m[4]); },
        },
      ],
    },

    // =========================================================== DORFBEWOHNER
    {
      id: 'dorf', name: 'Dorfbewohner-Zucht', cat: 'Ressourcen', icon: '🧑‍🌾', color: '#a87c5d',
      product: 'Dorfbewohner',
      desc: 'Mehr Dorfbewohner für Eisenfarmen, Handelshallen und Bauern. Ein Bauer versorgt die Zucht automatisch mit Essen.',
      tiers: [
        {
          level: 1, name: 'Liebes-Hütte (manuell füttern)', difficulty: 1,
          rates: [['Dorfbewohner', 4]],
          upkeep: [['Karotten / Brot', 24, '12 Karotten pro Dorfbewohner machen ihn paarungsbereit']],
          extras: [],
          req: ['2 Dorfbewohner'],
          how: 'Dorfbewohner vermehren sich, wenn sie genug Essen haben und es freie Betten gibt (mehr Betten als Dorfbewohner). Wirf ihnen Karotten oder Brot zu – Herzchen erscheinen und ein Baby wird geboren. Das Baby passt durch den 1 Block hohen Spalt in den Auslauf, die Eltern nicht.',
          steps: ['Glas-Hütte (5×5) mit 3 Betten bauen.', 'Zwei Dorfbewohner hineinbringen.', 'Karotten durch die Öffnung oben werfen.', 'Babys laufen durch den Spalt (untere + obere Stufe) in den Auslauf.'],
          tips: ['Mehr Betten = mehr Babys möglich. Jedes Baby braucht ein freies Bett.', 'Babys sind nach 20 Minuten erwachsen.'],
          build: (b) => {
            b.fill(0, 0, 0, 4, 0, 4, 'cobble');
            b.walls(-1, 0, -1, 5, 2, 5, 'glass');
            b.fill(-1, 3, -1, 5, 3, 5, 'glass');
            b.set(2, 3, 2, null);
            for (let i = 0; i < 3; i++) { b.set(i * 2, 1, 0, 'bed:s'); b.set(i * 2, 1, 1, 'bed_head:s'); }
            b.mob(1, 1, 3, 'villager'); b.mob(3, 1, 3, 'villager');
            b.set(5, 1, 2, 'slab'); b.set(5, 2, 2, 'slab_top');
            b.fill(6, 0, 1, 8, 0, 3, 'cobble');
            b.walls(5, 1, 0, 9, 2, 4, 'glass', true);
            b.set(5, 1, 2, 'slab'); b.set(5, 2, 2, 'slab_top');
            b.mob(7, 1, 2, 'villager');
          },
        },
        {
          level: 2, name: 'Automatische Zucht mit Bauer', difficulty: 2,
          rates: [['Dorfbewohner', 6]],
          upkeep: [],
          extras: [],
          req: ['2 Dorfbewohner (einer wird zum Bauern)', 'Karotten zum Pflanzen'],
          how: 'Der Bauer erntet die Karotten und teilt das Essen mit dem anderen Dorfbewohner. Dadurch sind beide immer bereit zur Paarung – sobald ein Bett frei ist, kommt ein Baby. Babys sind nur knapp 1 Block groß und schlüpfen durch den Spalt in den Auslauf.',
          steps: ['Boden 7×5, darauf ein kleines Karottenfeld mit Wasser in der Mitte.', 'Komposter in die Ecke (macht den Dorfbewohner zum Bauern).', '3 Betten auf die andere Seite.', 'Glas rundherum, Dach drauf.', 'An der Seite: untere Stufe + darüber obere Stufe = Baby-Ausgang.', 'Dahinter ein Auslauf (oder direkt die Schienen zur Eisenfarm).'],
          tips: ['Babys aus dem Auslauf kannst du mit einer Lore zur Eisenfarm fahren.', 'Halte die Zucht weit weg von anderen Dörfern, damit die Betten nicht „geklaut" werden.'],
          build: (b) => {
            b.fill(0, 0, 0, 6, 0, 4, 'cobble');
            for (let x = 1; x <= 3; x++) for (let z = 1; z <= 3; z++) {
              if (x === 2 && z === 2) { b.set(x, 0, z, 'water'); continue; }
              b.set(x, 0, z, 'farmland'); b.set(x, 1, z, 'carrots');
            }
            b.set(0, 1, 0, 'composter');
            for (const z of [0, 2]) { b.set(5, 1, z, 'bed:s'); b.set(5, 1, z + 1, 'bed_head:s'); }
            b.set(6, 1, 0, 'bed:s'); b.set(6, 1, 1, 'bed_head:s');
            b.mob(2, 1, 1, 'farmer'); b.mob(4, 1, 3, 'villager');
            b.walls(-1, 0, -1, 7, 2, 5, 'glass');
            b.fill(-1, 3, -1, 7, 3, 5, 'glass');
            b.set(1, 2, 0, 'torch');
            b.set(7, 0, 3, 'cobble'); b.set(7, 1, 3, 'slab'); b.set(7, 2, 3, 'slab_top');
            b.fill(8, 0, 1, 11, 0, 5, 'cobble');
            b.walls(7, 1, 0, 12, 2, 6, 'glass', true);
            b.set(7, 1, 3, 'slab'); b.set(7, 2, 3, 'slab_top');
          },
        },
        {
          level: 3, name: 'Zucht-Station (2 Zellen + Lore)', difficulty: 3,
          rates: [['Dorfbewohner', 12]],
          upkeep: [],
          extras: [['Lore', 4, 'zum Abtransport der Dorfbewohner']],
          req: ['4 Dorfbewohner'],
          how: 'Zwei automatische Zuchtzellen teilen sich einen Auslauf. Im Auslauf liegen Schienen: Babys setzen sich in die Lore und du fährst sie direkt zu deiner Eisenfarm oder Handelshalle.',
          steps: ['Baue zwei Zellen wie bei Fortgeschritten, gespiegelt.', 'Der Auslauf liegt in der Mitte.', 'Schienen durch den Auslauf legen.'],
          tips: ['Ein Baby in einer Lore steigt nicht von selbst aus – perfekt zum Transport.'],
          build: (b) => {
            const cell = (ox, mirror) => {
              const X = (x) => (mirror ? ox - x : ox + x);
              b.fill(X(0), 0, 0, X(6), 0, 4, 'cobble');
              for (let x = 1; x <= 3; x++) for (let z = 1; z <= 3; z++) {
                if (x === 2 && z === 2) { b.set(X(x), 0, z, 'water'); continue; }
                b.set(X(x), 0, z, 'farmland'); b.set(X(x), 1, z, 'carrots');
              }
              b.set(X(0), 1, 0, 'composter');
              for (const z of [0, 2]) { b.set(X(5), 1, z, 'bed:s'); b.set(X(5), 1, z + 1, 'bed_head:s'); }
              b.set(X(6), 1, 0, 'bed:s'); b.set(X(6), 1, 1, 'bed_head:s');
              b.mob(X(2), 1, 1, 'farmer'); b.mob(X(4), 1, 3, 'villager');
              b.walls(X(-1), 0, -1, X(7), 2, 5, 'glass');
              b.fill(X(-1), 3, -1, X(7), 3, 5, 'glass');
              b.set(X(1), 2, 0, 'torch');
              b.set(X(7), 1, 3, 'slab'); b.set(X(7), 2, 3, 'slab_top');
            };
            cell(0, false);
            cell(16, true);
            b.fill(8, 0, -1, 8, 0, 6, 'cobble');
            b.fill(8, 1, -1, 8, 1, 6, 'rail');
            b.mob(8, 1, 3, 'minecart');
            b.walls(7, 0, -2, 9, 2, 7, 'glass', true);
            b.set(7, 1, 3, 'slab'); b.set(7, 2, 3, 'slab_top');
            b.set(9, 1, 3, 'slab'); b.set(9, 2, 3, 'slab_top');
            b.set(8, 1, -2, null); b.set(8, 2, -2, null);
            b.set(8, 1, 7, null); b.set(8, 2, 7, null);
          },
        },
      ],
    },
  ];

  // Mob-Typen, die nur in Spawner-Farmen vorkommen
  MF.BLOCKS.skeleton = { name: 'Skelett', color: '#d6d6d6', shape: 'entity', size: [0.6, 1.99], entity: true, noList: true };
  MF.BLOCKS.blaze = { name: 'Lohe', color: '#ffb02e', shape: 'entity', size: [0.6, 1.8], entity: true, noList: true };
  MF.BLOCKS.spawn_zombie = { name: 'Zombie (vom Spawner)', color: '#4f8a3c', shape: 'entity', size: [0.6, 1.95], entity: true, noList: true };
})();
