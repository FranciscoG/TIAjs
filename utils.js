// http://stackoverflow.com/a/12987042/395414
function hex2bin(n) { return parseInt(n,16).toString(2); }

function bin2hex(n){ return parseInt(n,2).toString(16); }

function dec2bin(n){ return n.toString(2); }

function dec2hex(n){ return n.toString(16); }

function pad(s,z){ s=""+s; return s.length < z ? pad("0"+s,z) : s; }

// convert a 6 character hex color string to rgb
function hex2rgb (hex6) {
  var parts = hex6.replace("#","").match(/[0-9Aa-f]{2}/ig);
  parts.forEach(function(e, i, arr) {
    parts[i] = parseInt(arr[i], 16);
  });
  return {r: parts[0], g: parts[1], b: parts[2] };
}