
//1

document.getElementById("popup-2").style.display = "none";
let vis = 0;

function description(){
  
  
  if (vis == 0){
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup-2").style.display = "block";
    vis = 1;
  }
  else{
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-2").style.display = "none";
    vis = 0;
  }
  
}

document.getElementById("des-vis").onclick = function() {description()};


//2

document.getElementById("popup-3").style.display = "none";
let vis1 = 0;

function description1(){
  
  
  if (vis1 == 0){
    document.getElementById("popup-1").style.display = "none";
    document.getElementById("popup-3").style.display = "block";
    vis1 = 1;
  }
  else{
    document.getElementById("popup-1").style.display = "flex";
    document.getElementById("popup-3").style.display = "none";
    vis1 = 0;
  }
  
}

document.getElementById("des-vis1").onclick = function() {description1()};


//3

document.getElementById("popup-5").style.display = "none";
let vis2 = 0;

function description2(){
  
  
  if (vis2 == 0){
    document.getElementById("popup-4").style.display = "none";
    document.getElementById("popup-5").style.display = "block";
    vis2 = 1;
  }
  else{
    document.getElementById("popup-4").style.display = "flex";
    document.getElementById("popup-5").style.display = "none";
    vis2 = 0;
  }
  
}

document.getElementById("des-vis2").onclick = function() {description2()};

//4

document.getElementById("popup-7").style.display = "none";
let vis3 = 0;

function description3(){
  
  
  if (vis3 == 0){
    document.getElementById("popup-6").style.display = "none";
    document.getElementById("popup-7").style.display = "block";
    vis3 = 1;
  }
  else{
    document.getElementById("popup-6").style.display = "flex";
    document.getElementById("popup-7").style.display = "none";
    vis3 = 0;
  }
  
}

document.getElementById("des-vis3").onclick = function() {description3()};


//5

document.getElementById("popup-9").style.display = "none";
let vis4 = 0;

function description4(){
  
  
  if (vis4 == 0){
    document.getElementById("popup-8").style.display = "none";
    document.getElementById("popup-9").style.display = "block";
    vis4 = 1;
  }
  else{
    document.getElementById("popup-8").style.display = "flex";
    document.getElementById("popup-9").style.display = "none";
    vis4 = 0;
  }
  
}

document.getElementById("des-vis4").onclick = function() {description4()};