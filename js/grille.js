/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  tabCookies = [];
  tabCookiesCliquees = [];
  cookieSwap = new Cookie();
  nbDeCookiesDifferents = 6;
  monScore = 0;

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
    this.remplirTableauDeCookies(this.nbDeCookiesDifferents); // valeurs possible : 4, 5, 6 par ex
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
        cookie.draw(ctx, x, y);
        
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
  //VERSION DE LA METHODE QUI GENERE UNE GRILLE SANS ALIGNEMENT
  
    console.log("GRILLE SANS ALIGNEMENT GENERE");

    do{
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

    }while(this.faireDisparaitreTousLesAlignements())

     

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

    this.faireDisparaitreTousLesAlignements();
    this.chute();
    this.remplissage(this.nbDeCookiesDifferents);
    this.autoAlignementsCookies();
    ctx.restore();

  }

  invisible(cookie){
    this.cookieSwap.image = cookie.image;
    cookie.image = this.assets.tileEmpty;
    
  }

  visible(cookie){
    cookie.image = this.cookieSwap.image;
  }

   //Permet de faire disparaitre 3 (ou plus) cookies alignés en ligne et en colonne
   faireDisparaitreTousLesAlignements(){
    this.nbAlignements = 0;
    for(let i=0; i<this.nbColonnes; i++){
      this.faireDisparaitreMatch3Lignes(i);
    }
    
    for(let j=0; j<this.nbColonnes; j++){
      this.faireDisparaitreMatch3Colonnes(j);
    }

    return(this.nbAlignements !== 0);
  }


  //Permet de faire disparaitre 3 (ou plus) cookies alignés en ligne
  faireDisparaitreMatch3Lignes(i){
    for(let j=0; j<7; j++){
      if((this.tabCookies[i][j].type == this.tabCookies[i][j+1].type) && (this.tabCookies[i][j+1].type == this.tabCookies[i][j+2].type)){
        this.invisible(this.tabCookies[i][j]);
        this.invisible(this.tabCookies[i][j+1]);
        this.invisible(this.tabCookies[i][j+2]);
        this.nbAlignements++;
      }
    }
}

//Permet de faire disparaitre 3 (ou plus) cookies alignés en colonne
faireDisparaitreMatch3Colonnes(j){
    for(let i=0; i<7; i++){
      if((this.tabCookies[i][j].type == this.tabCookies[i+1][j].type) && (this.tabCookies[i+1][j].type == this.tabCookies[i+2][j].type)){
        this.invisible(this.tabCookies[i][j]);
        this.invisible(this.tabCookies[i+1][j]);
        this.invisible(this.tabCookies[i+2][j]);
        this.nbAlignements++;
      }
    }
}


//Permet de gérer la chute
chute(){
    
  for(let j=0; j<this.nbColonnes; j++){
    for(let i=this.nbLignes-1; i>-1; i--){

      //Si un cookie est invisible
      if(this.tabCookies[i][j].image == this.assets.tileEmpty){

        if(i != 0){
          let cpt = 0;
          //Je recherche un cookie visible
          do{
            cpt++;
          }while((i-cpt>0) && this.tabCookies[i - cpt][j].image == this.assets.tileEmpty)

          
          if(this.tabCookies[i - cpt][j].image != this.assets.tileEmpty){


            //ETAPE 1 : Je transpose les caractéristiques du cookie visible à celui de l'invisible
            //SANS ANIM
            this.tabCookies[i][j].type = this.tabCookies[i - cpt][j].type;
            this.tabCookies[i][j].deselectionnee();

            //AVEC ANIM
            // ?? this.tabCookies[i][j].animChute(ctx, this.tabCookies[i - cpt][j].colonne, this.tabCookies[i - cpt][j].ligne);

            //ETAPE 2 :et je rend invisible celui qui était visible
            this.invisible(this.tabCookies[i - cpt][j]);
            
            console.log("Chute(s)");

          }
        } 

      }
    }
  }
}


//Permet de remplir de nouveaux cookies après une chute de cookies
remplissage(nbDeCookiesDifferents) {

  for(let j=0; j<this.nbColonnes; j++){
    for(let i=this.nbLignes-1; i>-1; i--){
      //si un cookie est invisible
      if(this.tabCookies[i][j].image == this.assets.tileEmpty){

        this.tabCookies[i][j].type = Math.floor(Math.random()*(nbDeCookiesDifferents));
        this.tabCookies[i][j].deselectionnee(); //remove le invisible

        console.log("Remplissage(s)");
        this.score(); 
      
      }
    }
  }

}


/*Permet de faire disparaitre les cookies qui se sont formés indirectement 
    lors d'une chute et d'un remplissage de cookies,
    permet de gérer également la chute et le remplissage des cookies
    Utile également pour le bouton "Faire Disparaitre les cookies alignés" ( executable avec la deuxième version de remplirTableauDeCookies())
   */
  autoAlignementsCookies(){
    do{
      this.faireDisparaitreTousLesAlignements();
      this.chute();
      this.remplissage(this.nbDeCookiesDifferents);
    }while(this.faireDisparaitreTousLesAlignements())
  }

   //gestion du score :  augmente le score de 1 a chaque fois que la methode est appelé
   score(){
    this.monScore = this.monScore + 1;
    let nouveauScore = "Score :"+ this.monScore;
    //je change l'affichage du div qui permet d'affaicher le score par la variable nouveauScore
    document.querySelector("#score").textContent = nouveauScore;
  }


}
