var nav = document.getElementsByTagName("nav")[0];
var burger = document.getElementsByClassName("burger")[0];

burger.addEventListener("click", clicked);
var j = 0;
function clicked() {
  if (j === 0) {
    nav.style = "left:0";
    j++;
  } else {
    nav.style = "left:-250px";
    j--;
  }
}




/*Write*/
 function _(selector){
  return document.querySelector(selector);
}
function setup(){
  let canvas = createCanvas(1400, 800);
  canvas.parent("canvas-wrapper");
  background(255);
}
function mouseDragged(){
  let type = _("#pen-pencil").checked?"pencil":"brush";
  let size = parseInt(_("#pen-size").value);
  let color = _("#pen-color").value;
  fill(color);
  stroke(color);
  if(type == "pencil"){
    line(pmouseX, pmouseY, mouseX, mouseY);
  } else {
    ellipse(mouseX, mouseY, size, size);
  }
}
_("#reset-canvas").addEventListener("click", function(){
  background(255);
});
_("#save-canvas").addEventListener("click",function(){
  saveCanvas(canvas, "sketch", "png");
});