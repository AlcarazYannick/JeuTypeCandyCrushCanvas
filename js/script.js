// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;
let canvas, ctx, canvasLargeur, canvasHauteur;
let mousePos = {};
let userState = "rien";
let cookieDragguee = null;
let cookieClick = null;
let anim;


function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  loadAssets(startGame);
}

function startGame(assetsLoaded) {
  
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext("2d");
  canvasLargeur = canvas.width;
  canvasHauteur = canvas.height;

  grille = new Grille(9, 9, canvasLargeur, canvasHauteur, assetsLoaded);

  canvas.onmousedown = traiteMouseDown;
  canvas.onmouseup = traiteMouseUp;
  canvas.onmousemove = traiteMouseMove;
  canvas.onclick = traiteClick;

  requestAnimationFrame(AnimationLoop);
}

function traiteMouseDown(event){
  console.log("DOWN : USERSTAAAAAATE !!! "+ userState);
  //console.log("Souris cliquée bouton = " + event.button);
  //console.log("Souris cliquée " + mousePos.x + " " + mousePos.y) 

  switch(userState){
    case "cookieEnDrag":
    case "rien": 
    // on a cliqué sur un ccokie, on va recherche le cookie en fonction
    // du x et y cliqué 
    // puis on va changer l'etat pour cookieEnDrag
    userState = "cookieEnDrag";
    
    let swap = grille.getCookie(mousePos.x, mousePos.y);
    cookieDragguee = swap;
    //cookieDragguee = new Cookie(swap.type, swap.ligne, swap.colonne, swap.image);
    

    grille.tabCookiesCliquees.push(cookieDragguee);
    //grille.invisible(grille.tabCookies[swap.ligne][swap.colonne]);

    
    
  }
}

function traiteMouseUp(event){
  console.log("UP : USERSTAAAAAATE !!! "+ userState);
  //console.log("Souris relachée bouton = " + event.button);
  //console.log("Souris relachée " + mousePos.x + " " + mousePos.y);

  switch(userState){
    case "cookieEnDrag":

      cookieCible = grille.getCookie(mousePos.x, mousePos.y);
      grille.tabCookiesCliquees.push(cookieCible);
      // regarder si on peut swapper ? ou si on est trop loin ?
      console.log("on essaie d'echanger avec un cookie de type : " + cookieCible.type);
      
      //grille.tabCookies[swap.ligne][swap.colonne] = grille.tabCookiesCliquees[0];
      
      //userState = "cookieEnDrop";
      if(grille.swapPossible()){
        grille.swapCookies();
        anim = 1;
      }
      else{
        grille.tabCookiesCliquees[0].deselectionnee();
        grille.tabCookiesCliquees = [];
        anim = -1;
      }

      
      userState = "rien";
      break;
    case "rien": 
      break; 
    case "cookie1Click":
      break;  
  }

}

function traiteClick(event){
  
  //console.log("Souris relachée bouton = " + event.button);
  //console.log("Souris relachée " + mousePos.x + " " + mousePos.y);

  switch(userState){
    case "cookieEnDrag":
    case "rien": 
      userState = "cookie1Click";
      
      let swap = grille.getCookie(mousePos.x, mousePos.y);
      cookieClick = swap;
      //cookieDragguee = new Cookie(swap.type, swap.ligne, swap.colonne, swap.image);
      

      grille.tabCookiesCliquees.push(cookieClick);

      /*console.log("CLICK : USERSTAAAAAATE !!! "+ userState);
      console.log("CLICK : ANIIIIIIIM !!! "+ anim);

      if(anim = -1){
        console.log("CLICK : ANIIIIIIIM !!! "+ anim);
        cookieClick.selectionnee();
      }  
      else{
        cookieClick.deselectionnee();
      }  */  
      break;

    case "cookie1Click":
      userState = "rien";
      
      let swap2 = grille.getCookie(mousePos.x, mousePos.y);
      cookieClick = swap2;
      //cookieDragguee = new Cookie(swap.type, swap.ligne, swap.colonne, swap.image);
      

      grille.tabCookiesCliquees.push(cookieClick);

      if(grille.swapPossible()){
        grille.swapCookies();
      }
      else{
        grille.tabCookiesCliquees = [];
      }

      cookieClick.deselectionnee();
      break;

  }
  


}



function getMousePos(event){
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  mousePos = {
    x:x,
    y:y,
  };
}

function traiteMouseMove(event){
  getMousePos(event);
}

function AnimationLoop(){

  
  //Efface les canvas
  ctx.clearRect(0, 0, canvasLargeur, canvasHauteur);

  //On dessine les objets
  grille.drawGrille(ctx);
  grille.showCookies(ctx);

  
  
  switch(userState){
    case "cookieEnDrag": {
      grille.tabCookiesCliquees[0].dragAndDraw(ctx, mousePos.x, mousePos.y);
      break;
    }/*
    case "cookieEnDrop":{
      //console.log("distance" + Cookie.distance(grille.tabCookiesCliquees[0], grille.tabCookiesCliquees[1]))
      //console.log("direction" + Cookie.direction(grille.tabCookiesCliquees[0], grille.tabCookiesCliquees[1]));


      //if(Cookie.distance(grille.tabCookiesCliquees[0], grille.tabCookiesCliquees[1]) == 1){
        if(Cookie.direction(grille.tabCookiesCliquees[0], grille.tabCookiesCliquees[1]) == "haut"){

          console.log("haut");
          grille.tabCookiesCliquees[1].drawHaut(ctx, grille.tabCookiesCliquees[0].colonne, grille.tabCookiesCliquees[0].ligne);
          
          
        }
        else if(Cookie.direction(grille.tabCookiesCliquees[0], grille.tabCookiesCliquees[1]) == "bas"){



          console.log("tabclik l0 : "+ grille.tabCookiesCliquees[0].ligne);
          console.log("tabclik c0 : "+ grille.tabCookiesCliquees[0].colonne);

          console.log("tabclik l1 : "+ grille.tabCookiesCliquees[1].ligne);
          console.log("tabclik c1 : "+ grille.tabCookiesCliquees[1].colonne);

          

          console.log("bas");
          grille.tabCookiesCliquees[1].drawBas(ctx, grille.tabCookiesCliquees[0].colonne , grille.tabCookiesCliquees[0].ligne);
          
          
        }
        else if(Cookie.direction(grille.tabCookiesCliquees[0], grille.tabCookiesCliquees[1]) == "gauche"){

          grille.tabCookiesCliquees[1].drawGauche(ctx, mousePos.x, mousePos.y);
          //console.log("gauche");
          
        }
        else if(Cookie.direction(grille.tabCookiesCliquees[0], grille.tabCookiesCliquees[1]) == "droite"){

          grille.tabCookiesCliquees[1].drawDroite(ctx, mousePos.x, mousePos.y);
          //console.log("droite");
          
        }
        else{
          console.log("autre");
          userState = "rien";
          grille.visible(grille.tabCookiesCliquees[0]);
          break;
        }
        break;
      //}

    }
    case "swap" :{
      grille.tabCookiesCliquees = [];   
      mousePos = {}
      userState = "rien";
      break;
    }*/
    
  }
  // on demande à redessiner 60 fois par seconde
  requestAnimationFrame(AnimationLoop)
}



