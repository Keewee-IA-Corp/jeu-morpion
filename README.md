# Jeu de morpion

Un petit jeu de morpion (tic-tac-toe) à deux joueurs, sur le même appareil, qui tourne entièrement dans le navigateur.

## Ouvrir le jeu

Ouvrez simplement le fichier `index.html` dans un navigateur (double-clic). Aucune installation ni connexion n'est nécessaire.

## Pages

- `index.html` : écran du jeu, avec la grille de 3 × 3 cases.

## Comment jouer

- Les deux joueurs jouent à tour de rôle sur le même appareil. Le joueur 1 joue la croix et commence toujours ; le joueur 2 joue le rond.
- Cliquez (ou appuyez sur Entrée / Espace) sur une case vide pour y placer votre symbole : le tour passe ensuite à l'autre joueur.
- Une case déjà occupée ne peut pas être rejouée : le clic est ignoré et le tour ne change pas.
- L'indicateur au-dessus de la grille montre à tout moment à qui c'est le tour (croix ou rond) ; le message sous la grille signale les coups interdits et la fin de partie.
- Le premier joueur qui aligne 3 symboles (sur une ligne, une colonne ou une diagonale) gagne : le jeu annonce sa victoire, met en valeur l'alignement et bloque toutes les cases.
- Si les 9 cases sont occupées sans alignement, le jeu annonce un match nul.
- Le bouton « Nouvelle partie », sous la grille, relance une partie à tout moment (en cours ou terminée) : la grille est vidée, le message précédent disparaît et la croix recommence. Actualiser la page relance aussi une partie.
- Sous la grille, le compteur « Parties terminées » augmente de 1 à chaque victoire ou match nul. Une partie relancée avec « Nouvelle partie » avant sa fin n'est pas comptée. Le compteur repart à 0 quand on actualise la page.

## Structure

```
index.html            écran du jeu
assets/css/style.css  styles (variables CSS dans :root)
assets/js/regles.js   logique de la partie (état, coups, tours, victoire, match nul), sans affichage
assets/js/main.js     affichage et gestion des clics
assets/img/           images (vide)
CHANGELOG.md          historique des changements
```
