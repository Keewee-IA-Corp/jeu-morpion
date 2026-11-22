/* ==========================================================
   Jeu de morpion — script principal (affichage)
   ----------------------------------------------------------
   La grille est écrite directement en HTML (index.html) : elle
   est visible même sans JavaScript.
   Ce fichier s'occupe de l'affichage (cases, messages) et des
   clics. Les règles et l'état de la partie sont dans regles.js,
   chargé avant ce fichier.
   ========================================================== */

(function () {
  "use strict";

  var Regles = window.MorpionRegles;

  var NOMS_JOUEURS = {};
  NOMS_JOUEURS[Regles.CROIX] = "Joueur 1 (croix)";
  NOMS_JOUEURS[Regles.ROND] = "Joueur 2 (rond)";

  var NOMS_SYMBOLES = {};
  NOMS_SYMBOLES[Regles.CROIX] = "croix";
  NOMS_SYMBOLES[Regles.ROND] = "rond";

  var NOMS_SYMBOLES_PLURIEL = {};
  NOMS_SYMBOLES_PLURIEL[Regles.CROIX] = "croix";
  NOMS_SYMBOLES_PLURIEL[Regles.ROND] = "ronds";

  /* Symboles dessinés en SVG (décoratifs : le nom est dans l'aria-label). */
  var DESSINS = {};
  DESSINS[Regles.CROIX] =
    '<svg class="symbole symbole--croix" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
    '<line x1="22" y1="22" x2="78" y2="78" /><line x1="78" y1="22" x2="22" y2="78" /></svg>';
  DESSINS[Regles.ROND] =
    '<svg class="symbole symbole--rond" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
    '<circle cx="50" cy="50" r="28" /></svg>';

  var partie = Regles.creerPartie();

  /* Nombre de parties terminées (victoire ou match nul) depuis l'ouverture
     de la page. Une partie abandonnée par « Nouvelle partie » ne compte pas.
     Repart à 0 à chaque actualisation (pas de sauvegarde). */
  var partiesTerminees = 0;

  /** Affiche le nombre de parties terminées sous la grille. */
  function afficherCompteur() {
    var valeur = document.getElementById("compteur-parties");
    if (valeur) {
      valeur.textContent = String(partiesTerminees);
    }
  }

  /** Compte une partie de plus, à appeler une seule fois quand une partie se termine. */
  function compterPartieTerminee() {
    partiesTerminees += 1;
    afficherCompteur();
  }

  /* Nombre de victoires de chaque joueur depuis l'ouverture de la page.
     Les matchs nuls ne sont pas comptés ici. Conservé par « Nouvelle partie »,
     remis à 0 à chaque actualisation (pas de sauvegarde). */
  var victoires = {};
  victoires[Regles.CROIX] = 0;
  victoires[Regles.ROND] = 0;

  var IDS_SCORE = {};
  IDS_SCORE[Regles.CROIX] = "score-croix";
  IDS_SCORE[Regles.ROND] = "score-rond";

  /** Affiche le nombre de victoires de la croix et du rond sous la grille. */
  function afficherScore() {
    [Regles.CROIX, Regles.ROND].forEach(function (joueur) {
      var valeur = document.getElementById(IDS_SCORE[joueur]);
      if (valeur) {
        valeur.textContent = String(victoires[joueur]);
      }
    });
  }

  /** Ajoute une victoire au gagnant, à appeler une seule fois quand une partie se termine. */
  function compterVictoire(gagnant) {
    if (!gagnant || !victoires.hasOwnProperty(gagnant)) {
      return; // match nul : aucun score ne change
    }
    victoires[gagnant] += 1;
    afficherScore();
  }

  /** Récupère les 9 cases de la grille, dans l'ordre (0 à 8). */
  function recupererCases() {
    return Array.prototype.slice.call(document.querySelectorAll(".grille .case"));
  }

  /** Construit l'étiquette accessible d'une case : « Case 5, ligne 2, colonne 2, croix ». */
  function etiquetteCase(index, symbole) {
    var ligne = Math.floor(index / 3) + 1;
    var colonne = (index % 3) + 1;
    var contenu = symbole ? NOMS_SYMBOLES[symbole] : "vide";
    return "Case " + (index + 1) + ", ligne " + ligne + ", colonne " + colonne + ", " + contenu;
  }

  /** Affiche le symbole joué dans une case. */
  function afficherSymbole(bouton, index, symbole) {
    bouton.innerHTML = DESSINS[symbole];
    bouton.classList.add("case--occupee");
    bouton.setAttribute("aria-label", etiquetteCase(index, symbole));
  }

  /** Écrit un message dans la zone annoncée aux lecteurs d'écran. */
  function afficherMessage(texte) {
    var zone = document.getElementById("message");
    if (zone) {
      zone.textContent = texte;
    }
  }

  /** Texte de l'indicateur de tour : « Au tour de la croix (joueur 1) ». */
  var TEXTES_TOUR = {};
  TEXTES_TOUR[Regles.CROIX] = "Au tour de la croix (joueur 1)";
  TEXTES_TOUR[Regles.ROND] = "Au tour du rond (joueur 2)";

  /** Met à jour l'indicateur du joueur dont c'est le tour (symbole + texte). */
  function afficherTour() {
    var indicateur = document.getElementById("tour");
    var symbole = document.getElementById("tour-symbole");
    var texte = document.getElementById("tour-texte");
    if (!indicateur || !symbole || !texte) {
      return;
    }
    var joueur = partie.joueurCourant;
    indicateur.hidden = false;
    indicateur.classList.toggle("tour--croix", joueur === Regles.CROIX);
    indicateur.classList.toggle("tour--rond", joueur === Regles.ROND);
    symbole.innerHTML = DESSINS[joueur];
    texte.textContent = TEXTES_TOUR[joueur];
  }

  /** Masque l'indicateur de tour quand la partie est terminée. */
  function masquerTour() {
    var indicateur = document.getElementById("tour");
    if (indicateur) {
      indicateur.hidden = true;
    }
  }

  /** Message de fin de partie : victoire ou match nul. */
  function texteFinDePartie() {
    if (partie.gagnant) {
      return "Victoire du " + NOMS_JOUEURS[partie.gagnant] + " : trois " +
        NOMS_SYMBOLES_PLURIEL[partie.gagnant] + " alignés ! La partie est terminée.";
    }
    return "Match nul : les 9 cases sont occupées sans alignement. La partie est terminée.";
  }

  /** Bloque toutes les cases et met en valeur l'alignement gagnant. */
  function bloquerGrille() {
    var cases = recupererCases();
    cases.forEach(function (bouton) {
      bouton.classList.add("case--bloquee");
      bouton.setAttribute("aria-disabled", "true");
    });
    if (partie.alignementGagnant) {
      partie.alignementGagnant.forEach(function (index) {
        var bouton = cases[index];
        bouton.classList.add("case--gagnante");
        bouton.setAttribute("aria-label", etiquetteCase(index, partie.gagnant) + ", alignement gagnant");
      });
    }
    var grille = document.querySelector(".grille");
    if (grille) {
      grille.classList.add("grille--terminee");
    }
  }

  /** Réagit au clic (ou à Entrée / Espace) sur une case. */
  function surClicCase(evenement) {
    var bouton = evenement.currentTarget;
    var index = Number(bouton.getAttribute("data-case"));
    var resultat = Regles.jouerCoup(partie, index);

    if (!resultat.valide) {
      if (resultat.raison === "terminee") {
        afficherMessage(texteFinDePartie());
        return;
      }
      afficherMessage("Cette case est déjà occupée : choisissez une case vide. " +
        "C'est toujours au tour du " + NOMS_JOUEURS[partie.joueurCourant] + ".");
      return;
    }

    afficherSymbole(bouton, index, resultat.symbole);

    if (partie.terminee) {
      // Ce coup vient de terminer la partie (les coups suivants sont refusés
      // plus haut) : elle n'est donc comptée qu'une seule fois.
      bloquerGrille();
      masquerTour();
      afficherMessage(texteFinDePartie());
      compterPartieTerminee();
      compterVictoire(partie.gagnant);
      return;
    }
    // Coup valide : on efface un éventuel message d'erreur et on change de tour.
    afficherMessage("");
    afficherTour();
  }

  /** Remet une case dans son état de départ (vide, cliquable). */
  function viderCase(bouton, index) {
    bouton.innerHTML = "";
    bouton.classList.remove("case--occupee", "case--bloquee", "case--gagnante");
    bouton.removeAttribute("aria-disabled");
    bouton.setAttribute("aria-label", etiquetteCase(index, null));
  }

  /** Lance une nouvelle partie : grille vidée, message effacé, la croix commence. */
  function nouvellePartie() {
    partie = Regles.creerPartie();
    recupererCases().forEach(function (bouton, index) {
      viderCase(bouton, index);
    });
    var grille = document.querySelector(".grille");
    if (grille) {
      grille.classList.remove("grille--terminee");
    }
    afficherMessage("");
    afficherTour();
  }

  /** Branche les cases et le bouton « Nouvelle partie », puis affiche le premier tour. */
  function demarrer() {
    recupererCases().forEach(function (bouton) {
      bouton.addEventListener("click", surClicCase);
    });
    var boutonNouvellePartie = document.getElementById("nouvelle-partie");
    if (boutonNouvellePartie) {
      boutonNouvellePartie.addEventListener("click", nouvellePartie);
    }
    afficherTour();
    afficherCompteur();
    afficherScore();
  }

  demarrer();

  // Exposé pour les prochaines user stories.
  window.Morpion = {
    recupererCases: recupererCases,
    nouvellePartie: nouvellePartie,
    partie: function () {
      return partie;
    },
    partiesTerminees: function () {
      return partiesTerminees;
    },
    victoires: function () {
      return { croix: victoires[Regles.CROIX], rond: victoires[Regles.ROND] };
    }
  };
})();
