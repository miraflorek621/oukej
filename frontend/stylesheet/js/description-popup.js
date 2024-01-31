
//1
document.getElementById("popup-2").style.display = "none";
let vis = 0;

function description(element1, element2){
  
  
  if (vis == 0){
    document.getElementById(element1).style.display = "none";
    document.getElementById(element2).style.display = "block";
    vis = 1;
  }
  else{
    document.getElementById(element1).style.display = "block";
    document.getElementById(element2).style.display = "none";
    vis = 0;
  }
  
}

document.getElementById("des-vis").onclick = function() {description("popup", "popup-2")};
//2

document.getElementById("popup-3").style.display = "none";
let vis1 = 0;
document.getElementById("des-vis1").onclick = function() {description("popup-1", "popup-3")};
//3

document.getElementById("popup-5").style.display = "none";
let vis2 = 0;
document.getElementById("des-vis2").onclick = function() {description("popup-4", "popup-5")};
//4

document.getElementById("popup-7").style.display = "none";
let vis3 = 0;
document.getElementById("des-vis3").onclick = function() {description("popup-6", "popup-7")};
//5

document.getElementById("popup-9").style.display = "none";
let vis4 = 0;
document.getElementById("des-vis4").onclick = function() {description("popup-8", "popup-9")};