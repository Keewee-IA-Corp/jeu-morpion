# Historique des changements

## JME-20261120-224152-5 — Recommencer une partie

- `index.html` : bouton « Nouvelle partie » sous la zone de message.
- `assets/js/main.js` : fonction `nouvellePartie` qui recrée l'état de la partie (`Regles.creerPartie`, la croix commence), vide les 9 cases (symboles, classes `case--occupee` / `case--bloquee` / `case--gagnante`, `aria-disabled`, étiquettes accessibles « vide »), retire `grille--terminee`, efface le message de victoire, de match nul ou de coup interdit, et réaffiche l'indicateur de tour. Fonctionne pendant une partie en cours comme après la fin.
- `assets/css/style.css` : style du bouton (`.bouton`), avec contour de focus visible.
- `README.md` : explication du bouton.

## JME-20261120-224152-3 — Indiquer le joueur dont c'est le tour

- `index.html` : nouvel indicateur de tour au-dessus de la grille (symbole dessiné + texte « Au tour de la croix (joueur 1) » dès l'affichage de la page), annoncé aux lecteurs d'écran (`aria-live`).
- `assets/js/main.js` : `afficherTour` met à jour l'indicateur (symbole, texte, couleur) immédiatement après chaque coup valide ; un coup sur une case occupée ne le change pas ; il est masqué à la fin de la partie. La zone de message sous la grille est réservée aux coups interdits et à la fin de partie, et s'efface après un coup valide.
- `assets/css/style.css` : style de l'indicateur (`.tour`, bordure rouge pour la croix, bleue pour le rond).

## JME-20261120-224152-4 — Détecter la victoire et le match nul

- `assets/js/regles.js` : liste des 8 alignements gagnants (3 lignes, 3 colonnes, 2 diagonales) et fonction `chercherAlignement` ; `jouerCoup` renvoie l'issue du coup (`victoire`, `nul` ou `null`) et refuse tout coup une fois la partie terminée. L'état de la partie contient `terminee`, `gagnant` et `alignementGagnant`.
- `assets/js/main.js` : à la fin de la partie, annonce « Victoire du Joueur 1 (croix) / Joueur 2 (rond) » ou « Match nul » dans la zone `aria-live`, et bloque toutes les cases (`aria-disabled="true"`, clics ignorés).
- Les 3 cases de l'alignement gagnant sont mises en valeur (fond et contour), et leur étiquette accessible le précise.
- `assets/css/style.css` : styles des cases bloquées et gagnantes (`--couleur-case-bloquee`, `--couleur-case-gagnante`), message de fin en gras.

## JME-20261120-224152-2 — Placer une croix ou un rond au clic

- Nouveau fichier `assets/js/regles.js` : état de la partie et règles (la croix commence, une case occupée ne peut pas être rejouée, le tour passe après chaque coup valide).
- `assets/js/main.js` : clic (ou Entrée / Espace) sur une case vide → affichage d'une croix (joueur 1) ou d'un rond (joueur 2), dessinés en SVG ; mise à jour de l'étiquette accessible de la case.
- Clic sur une case occupée : la grille et le tour restent inchangés, un message l'annonce dans la zone `aria-live`.
- Message « Au tour du Joueur 1 (croix) / Joueur 2 (rond) » sous la grille.
- `assets/css/style.css` : couleurs des symboles (`--couleur-croix`, `--couleur-rond`) et style des cases occupées.
- `index.html` : chargement de `regles.js` avant `main.js`.

## JME-20261120-224152 — Afficher la grille de morpion

- Création de la structure du projet (`index.html`, `assets/css/style.css`, `assets/js/main.js`, `README.md`, `CHANGELOG.md`).
- Affichage d'une grille de 3 × 3 cases vides ; chaque case est un `<button>` avec une étiquette accessible (numéro, ligne, colonne).
- Grille carrée et adaptative (`min(90vw, 60vh, 420px)`) : entièrement visible sans défilement horizontal, du mobile (360 px) à l'ordinateur.
- Zone de message `aria-live` prête pour les annonces des prochaines user stories.
