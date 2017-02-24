  /*
    colors specificied by the TIA Color Chart in the Stella programming Guide
    http://www.randomterrain.com/atari-2600-memories-tia-color-charts.html
    http://www.qotile.net/minidig/docs/tia_color.html
   */

  /**
   * hex : the hex decimal color 
   * dec :  the 0-255 decimeal color
   * perc : the percentage of 255
   */
  var LUM = [
    { val: 0x0, hex: '00', dec : 0   },
    { val: 0x2, hex: '40', dec : 64  },
    { val: 0x4, hex: '6C', dec : 108 },
    { val: 0x6, hex: '90', dec : 144 },
    { val: 0x8, hex: 'B0', dec : 176 },
    { val: 0xA, hex: 'C8', dec : 200 },
    { val: 0xC, hex: 'DC', dec : 220 },
    { val: 0xE, hex: 'EC', dec : 236 },
  ];


  // there are 16 HUE values
  var HUE = [
    '000000',
    '444400',
    '702800',
    '841800',
    '880000',
    '78005c',
    '480078',
    '140084',
    '000088',
    '00187c',
    '002c5c',
    '003c2c',
    '003c00',
    '143800',
    '2c3000',
    '442800'
  ];

  // convert a 6 character hex color string to rgb
  function hex2rgb (hex6) {
    var parts = hex6.match(/[0-9Aa-f]{2}/ig);
    parts.forEach(function(e, i, arr) {
      parts[i] = parseInt(arr[i], 16);
    });
    return parts;
  }

  // take a 2 digit hex number and returns an RGB color
  function getColor(hex2) {
    var hue_lum = hex2.match(/[0-9Aa-f]{1}/ig); // remove non-hex number chars
    console.log(hue_lum);

    var hue = HUE[ parseInt(hue_lum[0], 16) ]; // the actual color
    var lum = parseInt(hue_lum[1], 16);  // the shade of color

    console.log(hue, lum);
    var rgb  = hex2rgb(hue);
    console.log(rgb);

    if (lum % 2 !== 0) { lum--; }
    var tint_factor = LUM[ lum / 2 ].perc;
  
    return rgb.map(function(x){
      // if (x === 0 || x === 255 ) { return  x; }
      return Math.floor( x + (255 - x) * tint_factor );
    });
  }

// 6C/6D  rgb(196, 156, 236)
  console.log( getColor('6C') );
  console.log( getColor('0F') );