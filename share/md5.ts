export class Md5Util {
  private static hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
  private static b64pad = '='; /* base-64 pad character. "=" for strict RFC compliance   */
  private static chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */


  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  static hex_md5(s: string) {
    return Md5Util.binl2hex(Md5Util.core_md5(Md5Util.str2binl(s), s.length * Md5Util.chrsz));
  }

  static b64_md5(s: string) {
    return Md5Util.binl2b64(Md5Util.core_md5(Md5Util.str2binl(s), s.length * Md5Util.chrsz));
  }

  static str_md5(s: string) {
    return Md5Util.binl2str(Md5Util.core_md5(Md5Util.str2binl(s), s.length * Md5Util.chrsz));
  }

  static hex_hmac_md5(key: string, data: string) {
    return Md5Util.binl2hex(Md5Util.core_hmac_md5(key, data));
  }

  static b64_hmac_md5(key: string, data: string) {
    return Md5Util.binl2b64(Md5Util.core_hmac_md5(key, data));
  }

  static str_hmac_md5(key: string, data: string) {
    return Md5Util.binl2str(Md5Util.core_hmac_md5(key, data));
  }

  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length
   */
  private static core_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = Md5Util.md5_ff(a, b, c, d, x[i], 7, -680876936);
      d = Md5Util.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = Md5Util.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = Md5Util.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = Md5Util.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = Md5Util.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = Md5Util.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = Md5Util.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = Md5Util.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = Md5Util.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = Md5Util.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = Md5Util.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = Md5Util.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = Md5Util.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = Md5Util.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = Md5Util.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = Md5Util.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = Md5Util.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = Md5Util.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = Md5Util.md5_gg(b, c, d, a, x[i], 20, -373897302);
      a = Md5Util.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = Md5Util.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = Md5Util.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = Md5Util.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = Md5Util.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = Md5Util.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = Md5Util.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = Md5Util.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = Md5Util.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = Md5Util.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = Md5Util.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = Md5Util.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = Md5Util.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = Md5Util.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = Md5Util.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = Md5Util.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = Md5Util.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = Md5Util.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = Md5Util.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = Md5Util.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = Md5Util.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = Md5Util.md5_hh(d, a, b, c, x[i], 11, -358537222);
      c = Md5Util.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = Md5Util.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = Md5Util.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = Md5Util.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = Md5Util.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = Md5Util.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = Md5Util.md5_ii(a, b, c, d, x[i], 6, -198630844);
      d = Md5Util.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = Md5Util.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = Md5Util.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = Md5Util.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = Md5Util.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = Md5Util.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = Md5Util.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = Md5Util.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = Md5Util.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = Md5Util.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = Md5Util.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = Md5Util.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = Md5Util.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = Md5Util.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = Md5Util.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = Md5Util.safe_add(a, olda);
      b = Md5Util.safe_add(b, oldb);
      c = Md5Util.safe_add(c, oldc);
      d = Md5Util.safe_add(d, oldd);
    }
    return Array(a, b, c, d);

  }

  /*
   * These functions implement the four basic operations the algorithm uses.
   */
  private static md5_cmn(q, a, b, x, s, t) {
    return Md5Util.safe_add(Md5Util.bit_rol(Md5Util.safe_add(Md5Util.safe_add(a, q), Md5Util.safe_add(x, t)), s), b);
  }

  private static md5_ff(a, b, c, d, x, s, t) {
    return Md5Util.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  private static md5_gg(a, b, c, d, x, s, t) {
    return Md5Util.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  private static md5_hh(a, b, c, d, x, s, t) {
    return Md5Util.md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }

  private static md5_ii(a, b, c, d, x, s, t) {
    return Md5Util.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
   * Calculate the HMAC-MD5, of a key and some data
   */
  private static core_hmac_md5(key, data) {
    let bkey = Md5Util.str2binl(key);
    if (bkey.length > 16) {
      bkey = Md5Util.core_md5(bkey, key.length * Md5Util.chrsz);
    }

    let ipad = Array(16), opad = Array(16);
    for (let i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    let hash = Md5Util.core_md5(ipad.concat(Md5Util.str2binl(data)), 512 + data.length * Md5Util.chrsz);
    return Md5Util.core_md5(opad.concat(hash), 512 + 128);
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  private static safe_add(x, y) {
    let lsw = (x & 0xFFFF) + (y & 0xFFFF);
    let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  private static bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*
   * Convert a string to an array of little-endian words
   * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
   */
  private static str2binl(str) {
    let bin = Array();
    let mask = (1 << Md5Util.chrsz) - 1;
    for (let i = 0; i < str.length * Md5Util.chrsz; i += Md5Util.chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / Md5Util.chrsz) & mask) << (i % 32);
    }
    return bin;
  }

  /*
   * Convert an array of little-endian words to a string
   */
  private static binl2str(bin) {
    let str = '';
    let mask = (1 << Md5Util.chrsz) - 1;
    for (let i = 0; i < bin.length * 32; i += Md5Util.chrsz) {
      str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
    }
    return str;
  }
  /*
   * Convert an array of little-endian words to a hex string.
   */
  private static binl2hex(binarray) {
    let hex_tab = Md5Util.hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
        hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
  }

  /*
   * Convert an array of little-endian words to a base-64 string
   */
  private static binl2b64(binarray) {
    let tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i += 3) {
      let triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
        | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
        | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) {
          str += Md5Util.b64pad;
        } else {
          str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
      }
    }
    return str;
  }
}
