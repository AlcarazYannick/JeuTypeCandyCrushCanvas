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

  switch(userState){
    case "cookieEnDrag":
    case "rien": 
    // on a cliqué sur un ccokie, on va recherche le cookie en fonction
    // du x et y cliqué 
    // puis on va changer l'etat pour cookieEnDrag
    userState = "cookieEnDrag";
    
    let swap = grille.getCookie(mousePos.x, mousePos.y);
    cookieDragguee = swap;
    cookieDragguee.selectionnee();

    grille.tabCookiesCliquees.push(cookieDragguee);
 
  }
}

function traiteMouseUp(event){

  switch(userState){
    case "cookieEnDrag":

      cookieCible = grille.getCookie(mousePos.x, mousePos.y);
      grille.tabCookiesCliquees.push(cookieCible);
      // regarder si on peut swapper ? ou si on est trop loin ?
      console.log("on essaie d'echanger avec un cookie de type : " + cookieCible.type);
      
      if(grille.swapPossible()){
        grille.swapCookies();  
      }
      else{
        grille.tabCookiesCliquees = [];
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

  switch(userState){
    case "cookieEnDrag":
    case "rien": 
      userState = "cookie1Click";
      
      let swap = grille.getCookie(mousePos.x, mousePos.y);
      cookieClick = swap;


      grille.tabCookiesCliquees.push(cookieClick);
      break;

    case "cookie1Click":
      userState = "rien";
      
      let swap2 = grille.getCookie(mousePos.x, mousePos.y);
      cookieClick = swap2;
   
      grille.tabCookiesCliquees.push(cookieClick);

      if(grille.swapPossible()){
        grille.swapCookies();
      }
      else{
        grille.tabCookiesCliquees = [];
      }
      
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
    }
  }
  // on demande à redessiner 60 fois par seconde
  requestAnimationFrame(AnimationLoop);

}


