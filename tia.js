/*
the screen is divided into 160 "clocks" (aka pixels)
then it takes 68 clocks to return the clock back to the begining of the next scan line

Horizontal clock counts total: 228
68 hysnc + 160 drawing

Total Scanline: 262
3 vsync + 37 vblank + 192 viewable scanlines + 30 overscan

76 machine cycles @ 3 clocks each 
*/

var cv = document.getElementById('canvas');
cv.style.backgroundColor = "#000";
var ctx = cv.getContext("2d");
ctx.fillStyle = "#000";

var scanline = [];
var verticals = [];
var callstack = [];

function resetScanline() {
  for (var i=0;i<160;i++) {
    if (i%5 === 0) {
      scanline.push(1); continue;
    }
    scanline.push(0);
  }
}

function resetVerticals() {
  for (var i=0;i<192;i++) {
    verticals.push(scanline);
  }
}

resetScanline();
resetVerticals();

function hex2rgb (hex) {
  var parts = hex.match(/.{2}/g);
  parts.forEach(function(e, i, arr) {
    parts[i] = parseInt(arr[i], 16);
  });
  return parts;
}

function drawPixel(currentClock, currentLine, hexColor) {
  var rgb = hex2rgb(hexColor);
  var id = ctx.createImageData(1,1);
  var d  = id.data;
  d[0]   = +rgb[0];
  d[1]   = +rgb[1];
  d[2]   = +rgb[2];
  d[3]   = 255;
  ctx.putImageData( id, currentClock, currentLine );
}

function popStack() {
  var next = callstack.shift();

  if (next === "WSYNC") {
    return next;
  }

  if (typeof next === 'function') {
    next();
  }
}


var fps = 60;
var WSYNC = 0;
function frame() {

  setTimeout(function() {
    requestAnimationFrame(frame);
  
    verticals.forEach(function(v,y){
      
      v.forEach(function(s,x){
        if (WSYNC === 1 && x !== 0) {
          return;
        } else {
          WSYNC = 0;
        }

        // before draw we should check register for data
        drawPixel(x, y, '696969');

        if (x % 3 === 0) {
          // call a function from the stack every 3 clock (aka 1 cycle)
          var next = popStack();

          WSYNC = (next === "WSYNC") ? 1 : 0;
        }

      });

    });
    
  }, 1000 / fps);
}

frame();