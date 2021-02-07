class Cookie {

  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];


  constructor(type, ligne, colonne, image) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;

    this.image = image; // pour canvas
    this.width = 80;
    this.height = 80;

    this.currentX = 0;
    this.currentY = 0;

    this.currentX2 = 900;
    this.currentY2 = ( this.ligne * 88.88888888888889);
  }



  draw(ctx, x, y) {
    ctx.save();
    ctx.drawImage(this.image, x, this.currentY, this.width, this.height);

    if(this.currentY < y){
      this.currentY += 10;
    }

    if(this.currentY2 > y){
      this.currentY2 -= 1;
    }

    ctx.restore();
  }


  drawHaut(ctx, x, y) {

    console.log(grille.hauteurLignes); 

    ctx.save();
    console.log("currentY "+ this.currentY);
    console.log("y "+ y);

    ctx.drawImage(this.image, x*grille.largeurColonnes, this.currentY, this.width, this.height);

    if(this.currentY < y*grille.hauteurLignes){
      this.currentY += 1;
    }
    else{
      userState = "swap";
    }

    console.log("US :"+userState);
    ctx.restore();
  }

/*

  drawBas(ctx, x, y) {
    
    ctx.save();
    console.log("hauteur de la case bas : "+ this.currentY2);
    console.log("hauteur a atteindre :  "+ y*grille.hauteurLignes);


    //ctx.drawImage(this.image, x*grille.largeurColonnes, this.currentY2, this.width, this.height);

    if(this.currentY2 > y*grille.hauteurLignes){
      this.currentY2 = this.currentY2 - 1;
    }
    else{
      userState = "swap";
    }

    console.log("US :"+userState);
    ctx.restore();
  }




  drawGauche(ctx, x, y) {
    ctx.save();
    ctx.drawImage(this.image, this.currentX , y, this.width, this.height);

    if(this.currentX < x){
      this.currentX -= 90;
    }

    ctx.restore();
  }




  drawDroite(ctx, x, y) {
    ctx.save();
    ctx.drawImage(this.image, this.currentX , y, this.width, this.height);

    if(this.currentX < x){
      this.currentX += 90;
    }

    ctx.restore();
  }
*/

  dragAndDraw(ctx, x, y) {
    ctx.save();
    ctx.drawImage(this.image, x, y, this.width, this.height);
    ctx.restore();
  }


  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    //console.log("Distance = " + distance);
    //console.log("Cookie 1: ligne"+ l1+ "colonne"+ c1 );
    //console.log("Cookie 2: ligne"+ l2+ "colonne"+ c2 );
    return distance;
  }

  /*
  static direction(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    if(c1-c2 == -1){
      return "droite";
    }
    else if(c1-c2 == 1){
      return "gauche";
    }
    else if(l1-l2 == -1){
      return "bas";
    }
    else if(l1-l2 == 1){
      return "haut";
    }
    else{
      return "erreur";
    }
    
  }*/

  selectionnee(){
    switch(this.type){
      case 0:
        this.image = grille.assets.croissantHighlighted;
          break;
      case 1:
        this.image = grille.assets.cupcakeHighlighted;
          break;
      case 2:
        this.image = grille.assets.danishHighlighted;
          break;
      case 3:
        this.image = grille.assets.donutHighlighted;
          break;
      case 4:
        this.image = grille.assets.macaroonHighlighted;
          break;
      case 5:
        this.image = grille.assets.sugarCookieHighlighted;
          break;
    }
  }


  deselectionnee(){
    switch(this.type){
      case 0:
        this.image = grille.assets.croissant;
          break;
      case 1:
        this.image = grille.assets.cupcake;
          break;
      case 2:
        this.image = grille.assets.danish;
          break;
      case 3:
        this.image = grille.assets.donut;
          break;
      case 4:
        this.image = grille.assets.macaroon;
          break;
      case 5:
        this.image = grille.assets.sugarCookie;
        break;
    }
  }

}
