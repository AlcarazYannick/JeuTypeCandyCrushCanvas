/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  tabCookies = [];
  tabCookiesCliquees = [];
  cookieSwap = new Cookie();

  constructor(l, c, canvasLargeur, canvasHauteur, assetsLoaded) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.canvasLargeur = canvasLargeur;
    this.canvasHauteur = canvasHauteur;
    this.cookiesCliquees = [];
    this.largeurColonnes = canvasLargeur / c;
    this.hauteurLignes = canvasHauteur / l;
    this.assets = assetsLoaded;

    // on passe en paramètre le nombre de cookies différents. 4 = facile, 5 = moyen,
    // 6 = difficile
    this.remplirTableauDeCookies(6); // valeurs possible : 4, 5, 6 par ex
  }

  drawGrille(ctx) {
    ctx.save();
    // todo : dessiner une grille
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "lightgrey";

    for(let x = this.largeurColonnes; x < this.canvasLargeur; x+=this.largeurColonnes){
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasHauteur)
    } 

    for(let y = this.hauteurLignes; y < this.canvasHauteur; y+=this.hauteurLignes){
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasLargeur, y)
    } 
    ctx.stroke();
    ctx.restore();
  }



  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies(ctx) {
    let y = 0;
    // TODO dessiner les cookies dans la grille
    ctx.save();
    for(let l = 0; l < this.nbLignes; l++){
      let x = 5
      for(let c = 0; c < this.nbColonnes; c++){  
        let cookie = this.tabCookies[l][c];
        cookie.draw(ctx, x, y)
        
        //ctx.drawImage(this.assets.croissant, x, y);
        x += this.largeurColonnes;
      }
      y += this.hauteurLignes;
    }
    ctx.restore();
  }


  getCookie(x, y){

    let l = Math.floor(y / this.hauteurLignes);
    let c = Math.floor(x / this.largeurColonnes);

    console.log("ligne : "+ l);
    console.log("colonne : "+ c);

    console.log(this.tabCookies[l][c])
    
    return this.tabCookies[l][c]
  }

  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    this.tabCookies = create2DArray(this.nbLignes);


    for(let l = 0; l < this.nbLignes; l++){
      for(let c = 0; c < this.nbColonnes; c++){
        let type = Math.floor(nbDeCookiesDifferents * Math.random());
        let cookie;

        switch(type){
          case 0:
            cookie = new Cookie(type, l, c, this.assets.croissant);
            break;
          case 1:
            cookie = new Cookie(type, l, c, this.assets.cupcake);
            break;
          case 2:
            cookie = new Cookie(type, l, c, this.assets.danish);
            break;
          case 3:
            cookie = new Cookie(type, l, c, this.assets.donut);
            break; 
          case 4:
            cookie = new Cookie(type, l, c, this.assets.macaroon);
            break; 
          case 5:
            cookie = new Cookie(type, l, c, this.assets.sugarCookie);
            break; 
        }
        this.tabCookies[l][c] = cookie;
      }
    }
    // TODO : remplir le tableau avec des cookies au hasard
  }

  swapPossible(){
    let cookie1 = this.tabCookiesCliquees[0];
    let cookie2 = this.tabCookiesCliquees[1];

    /*
    //VERSION ALTERNATIVE POUR LA DISTANCE
    let diffLignes = Math.abs(cookie1.ligne - cookie2.ligne);
    let diffColonnes = Math.abs(cookie1.colonne - cookie2.colonne);
    return (diffLignes === 1) || (diffColonnes === 1);
    */


    return (Cookie.distance(cookie1, cookie2) === 1);
  }

  swapCookies(){
    ctx.save();
    let cookie1 = this.tabCookiesCliquees[0];
    let cookie2 = this.tabCookiesCliquees[1]; 
    this.tabCookiesCliquees[0].deselectionnee();
    this.tabCookiesCliquees[1].deselectionnee();

    let tmpType = cookie1.type;
    let tmpImage = cookie1.image;

    cookie1.type = cookie2.type;
    cookie1.image = cookie2.image;

    cookie2.type = tmpType;
    cookie2.image = tmpImage;

    grille.tabCookiesCliquees = [];

    //this.tabCookiesCliquees[0].deselectionnee();
    
    

    ctx.restore();

  }
  invisible(cookie){
    this.cookieSwap.image = cookie.image;
    cookie.image = this.assets.tile;
    
  }

  visible(cookie){
    cookie.image = this.cookieSwap.image;
  }
}
