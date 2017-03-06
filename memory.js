// updated from this source: https://github.com/skilldrick/6502js/blob/master/assembler.js#L212

/*
2600 6507 CPU consists of (2^13) Memory shared by everything
Total Memory Address range:  $0000 - $1FFF

Address range   Function
-------------------------------
$0000 - $007F   TIA registers
$0080 - $00FF   RAM
$0200 - $02FF   RIOT registers
$1000 - $1FFF   ROM

 */

/*global dec2hex*/
function Memory() {
  var memArray = new Array(0x1FFF);

  this.prototype = {
    set: function(addr, val) {
      return memArray[addr] = val;
    },

    get: function(addr) {
      return memArray[addr];
    },

    getWord: function(addr) {
      return this.get(addr) + (this.get(addr + 1) << 8);
    },

    // storeByte() - Poke a byte, don't touch any registers

    storeByte: function(addr, value) {
      this.set(addr, value & 0xff);
    },

    // storeKeypress() - Store keycode in ZP $ff
    storeKeypress: function(e) {
      var value = e.which;
      this.storeByte(0xff, value);
    },

    format: function(start, length) {
      var html = '';
      var n;

      for (var x = 0; x < length; x++) {
        if ((x & 15) === 0) {
          if (x > 0) { html += "\n"; }
          n = (start + x);
          html += dec2hex(((n >> 8) & 0xff));
          html += dec2hex((n & 0xff));
          html += ": ";
        }
        html += dec2hex(this.get(start + x));
        html += " ";
      }
      return html;
    }

  };

}