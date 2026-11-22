/* ==========================================================
   Jeu de morpion — logique de la partie (sans affichage)
   ----------------------------------------------------------
   Ce fichier ne touche jamais au HTML : il gère seulement
   l'état de la partie et les règles. L'affichage est dans
   main.js.
   ========================================================== */

(function () {
  "use strict";

  var CROIX = "X";
  var ROND = "O";

  /* Les 8 alignements gagnants (index des cases 0 à 8). */
  var ALIGNEMENTS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
    [0, 4, 8], [2, 4, 6]             // diagonales
  ];

  /** Crée une nouvelle partie : grille vide, la croix commence. */
  function creerPartie() {
    return {
      cases: [null, null, null, null, null, null, null, null, null],
      joueurCourant: CROIX,
      terminee: false,
      gagnant: null,          // CROIX, ROND, ou null (match nul ou partie en cours)
      alignementGagnant: null // les 3 index de l'alignement gagnant
    };
  }

  /**
   * Cherche un alignement de 3 symboles identiques.
   * Renvoie { symbole, alignement } ou null s'il n'y en a pas.
   */
  function chercherAlignement(partie) {
    for (var i = 0; i < ALIGNEMENTS.length; i++) {
      var a = ALIGNEMENTS[i];
      var symbole = partie.cases[a[0]];
      if (symbole !== null && symbole === partie.cases[a[1]] && symbole === partie.cases[a[2]]) {
        return { symbole: symbole, alignement: a.slice() };
      }
    }
    return null;
  }

  /** Indique si la case (0 à 8) est libre. */
  function estCaseLibre(partie, index) {
    return index >= 0 && index < partie.cases.length && partie.cases[index] === null;
  }

  /** Indique si toutes les cases sont occupées. */
  function estGrillePleine(partie) {
    return partie.cases.every(function (symbole) {
      return symbole !== null;
    });
  }

  /** Renvoie le symbole de l'autre joueur. */
  function autreJoueur(symbole) {
    return symbole === CROIX ? ROND : CROIX;
  }

  /**
   * Tente de jouer le coup du joueur courant dans la case donnée.
   * Renvoie { valide: true, symbole, issue } si le coup est accepté :
   *   - issue = "victoire" : le symbole joué aligne 3 cases, la partie est terminée ;
   *   - issue = "nul"      : la grille est pleine sans alignement, la partie est terminée ;
   *   - issue = null       : la partie continue, le tour passe à l'autre joueur.
   * Renvoie { valide: false, raison } si le coup est refusé (rien ne change) :
   *   - raison = "terminee" : la partie est déjà finie ;
   *   - raison = "occupee"  : la case est déjà occupée.
   */
  function jouerCoup(partie, index) {
    if (partie.terminee) {
      return { valide: false, raison: "terminee" };
    }
    if (!estCaseLibre(partie, index)) {
      return { valide: false, raison: "occupee" };
    }
    var symbole = partie.joueurCourant;
    partie.cases[index] = symbole;

    var alignement = chercherAlignement(partie);
    if (alignement) {
      partie.terminee = true;
      partie.gagnant = alignement.symbole;
      partie.alignementGagnant = alignement.alignement;
      return { valide: true, symbole: symbole, issue: "victoire" };
    }
    if (estGrillePleine(partie)) {
      partie.terminee = true;
      return { valide: true, symbole: symbole, issue: "nul" };
    }

    partie.joueurCourant = autreJoueur(symbole);
    return { valide: true, symbole: symbole, issue: null };
  }

  window.MorpionRegles = {
    CROIX: CROIX,
    ROND: ROND,
    creerPartie: creerPartie,
    estCaseLibre: estCaseLibre,
    estGrillePleine: estGrillePleine,
    chercherAlignement: chercherAlignement,
    jouerCoup: jouerCoup
  };
})();
