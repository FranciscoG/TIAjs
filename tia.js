/*
the screen is divided into 160 "clocks" (aka pixels)
then it takes 68 clocks to return the clock back to the begining of the next scan line

Horizontal clock counts total: 228
68 hysnc + 160 drawing

Total Scanline: 262
3 vsync + 37 vblank + 192 viewable scanlines + 30 overscan

76 machine cycles @ 3 clocks each 
*/

function Stella(canvasElem) {
  canvasElem.style.backgroundColor = "#000";
  var ctx = canvasElem.getContext("2d");
  ctx.fillStyle = "#000";

  // const fps = 60;
  const scanlineCount = 262;
  const clockCount = 228;

  var WSYNC = 0;
  var scanlines = []; // represents array of 262 scanline
  var callstack = ['WSYNC', 'WSYNC', 'WSYNC','WSYNC','WSYNC','WSYNC','WSYNC','WSYNC','WSYNC','WSYNC','WSYNC'];

  function resetFrame() {
    for (let i=0;i<scanlineCount;i++) {
      scanlines.push(new Array(clockCount));
    }
  }
  resetFrame();

  function drawPixel(currentClock, currentLine, hexColor) {
    var getColor = NTSC_COLORS[hexColor];

    var id = ctx.createImageData(1,1);
    var d = id.data;
    d[0] = getColor.r;
    d[1] = getColor.g;
    d[2] = getColor.b;
    d[3] = 255;
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

  function oneClock(pix, x, y, state) {
    if (x % 3 === 0) {
      // call a function from the stack every 3 clocks (aka 1 cycle)
      var next = popStack();

      WSYNC = (next === "WSYNC") ? 1 : 0;
    }

    if (WSYNC === 1 && x !== 0) {
      return; // do nothing until X = 0
    } else {
      WSYNC = 0;
    }

    // pix is binary 1|0, if 1 then draw
    if (state === "draw") {
      // before draw we should check register for data
      drawPixel(x, y, "44");
    }
  }

  function oneScanline(line, y, state) { 
    var lineLen = line.length;

    // iterate through our 228 clock counts within one scan line
    for (let clock=0;clock<lineLen;clock++) {
      let pixel = line[clock]; // get value of pixel: 1 or 0
      let drawing = state === "draw" ? state : null;

      if (clock < 68) {
        oneClock(pixel, clock, y, "hsync");
      } else {
        oneClock(pixel, clock, y, drawing);
      }
    }
  }


  function beam() {
    console.time("oneFrame");
    var vertLen = scanlines.length;

    // iterate over the 262 scan lines
    for (var y=0;y<vertLen;y++) {
      var line = scanlines[y];
      
      if ( y < 3 ) {
        oneScanline(line, y, "vsync");
        continue;
      }

      if (y >= 3 && y < 40) {
        oneScanline(line, y, "vblank");
        continue;
      }
      
      if (y >= 232) {
        oneScanline(line, y, "overscan");
        continue;
      }

      // default draw
      oneScanline(line, y, "draw");
    }
    console.timeEnd("oneFrame");
  }

  // function frame() {

  //   setTimeout(function() {
  //     requestAnimationFrame(frame);
  //       beam();
  //   }, 1000 / fps);
  // }

  // frame();

  beam();

}

var cv = document.getElementById('canvas');
var tia = new Stella(cv);