# LEDWall Calculator Pro

Calcolatore per schermi LED modulari (P2.9, tile 500×500mm / 168×168px), pensato per Wave&Co / Colorlight Z4. Installabile come app su smartphone e Windows (PWA).

## Struttura del repository

```
├── index.html            # App completa (HTML+CSS+JS in un solo file)
├── manifest.json          # Manifest PWA (nome, colori, icone)
├── service-worker.js      # Cache offline / installabilità
├── browserconfig.xml      # Tile per il menu Start di Windows
├── iconledwallcalcpro.png # Icona 512×512 dell'app (da aggiungere tu)
├── LICENSE                 # Licenza MIT
├── .gitignore
└── README.md
```

> **Icona**: metti il tuo file `iconledwallcalcpro.png` (512×512 px, sfondo pieno — su Windows/Android viene ritagliato in cerchio/squircle, quindi evita margini trasparenti troppo larghi) nella root del repository, allo stesso livello di `index.html`. È già collegata in `index.html`, `manifest.json` e `browserconfig.xml`: non serve nessun'altra modifica.

## Funzionalità

- Input bidirezionale metri ↔ mattonelle, rapporto **16:X** a colore dinamico
- Specifiche modulo + limiti hardware, stock mattonelle/processori con avviso
- **Schema e Mappatura** (tab Dati/Corrente): 8 pattern di collegamento cabinet (angolo di partenza × orientamento, come nei processori NovaStar), etichette M#/B#, barre di utilizzo per porta/linea, indicatori "Loading Capacity Usage" (blu/rosso/grigio), pulsanti di ribilanciamento (± porte, ± fasi)
- Recap materiali (cavi Ethercon, PowerCon, prese CEE, quadri)
- Generatore test pattern (6 tipi) con download PNG
- Esportazione PDF dell'intero report
- **PWA**: funziona offline dopo il primo caricamento, installabile come app

## Uso in locale

Apri `index.html` in un browser: nessuna build, nessuna dipendenza server. Il service worker richiede però di essere servito via `http(s)://` (anche in locale, es. `python3 -m http.server`) — aprendo il file direttamente come `file://` l'app funziona comunque, solo senza cache offline.

## Pubblicazione online (GitHub Pages)

1. Carica tutti i file (incluso `iconledwallcalcpro.png`) nella root del repo su GitHub.
2. Settings → Pages → Deploy from branch → branch `main`, cartella `/ (root)`.
3. Dopo un paio di minuti l'app sarà su `https://<utente>.github.io/<repo>/`.

## Installazione come app

- **Android (Chrome)**: apri il sito → menu ⋮ → "Aggiungi a schermata Home" / "Installa app".
- **iPhone (Safari)**: apri il sito → icona Condividi → "Aggiungi alla schermata Home".
- **Windows (Edge/Chrome)**: apri il sito → icona di installazione nella barra degli indirizzi (o menu → "Installa LEDWall Calculator Pro"). L'app compare anche come tile nel menu Start grazie a `browserconfig.xml`.

## Note tecniche

- Capacità per porta dati: min tra limite pixel (655.360 → 23 tile) e limite lato (3840px → 22 tile) = **22 tile/porta**
- Assegnazione sender: se le linee main sono ≤ 2, il backup condivide lo stesso sender nelle porte rimanenti; se sono ≥ 3, il backup usa sempre sender dedicati
- Ogni linea PowerCon appartiene a **una sola fase** (L1/L2/L3), mai divisa
- I collegamenti seguono uno degli 8 pattern selezionabili (angolo di partenza + orientamento orizzontale/verticale), come nei reali processori video LED
