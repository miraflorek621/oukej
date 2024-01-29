
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

