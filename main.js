function main() {

  var word = "Harry";
  var Partner_Tag = PropertiesService.getScriptProperties().getProperty("PartnerTag");
  var Access_Key = PropertiesService.getScriptProperties().getProperty("AccessKey");
  var Secret_Key = PropertiesService.getScriptProperties().getProperty("SecretKey");

  var host = "webservices.amazon.co.jp";
  var region = "us-west-2";
  var path = "/paapi5/searchitems";

  //日時の取得
  var now = new Date();
  var yyyymmdd = Utilities.formatDate(now, "GMT", "yyyyMMdd")
  var timestamp = yyyymmdd + "T" + Utilities.formatDate(now, "GMT", "HHmmss") + "Z";
  // console.log(yyyymmdd);
  // Logger.log(timestamp);
  yyyymmdd = "20200804";
  timestamp = "20200804T141928Z";

  var dataString = '{\n    "Keywords": "' + word + '",\n    "PartnerTag": "' + Partner_Tag + '",\n    "PartnerType": "Associates",\n    "Marketplace": "www.amazon.co.jp"\n}';
  //  var dataString = '{\n   "PartnerType":"Associates",\n   "PartnerTag":"shark0731-22",\n    "Keywords":"Harry",\n   "SearchIndex":"All",\n    "Resources":["Images.Primary.Small",\n    "ItemInfo.Title",\n   "Offers.Listings.Price"]}';
  //  Logger.log(dataString);
  //  dataString='{\n    "Keywords": "Harry",\n    "PartnerTag": "shark0731-22",\n    "PartnerType": "Associates",\n    "Marketplace": "www.amazon.co.jp"\n}'
  // dataString = '{"Keywords":"Harry","PartnerTag": "shark0731-22","PartnerType": "Associates","Marketplace": "www.amazon.co.jp"}';
  //  Logger.log(test);

  //  var canonicalURL=prepareCanonicalRequest(timestamp,"payload");
  var canonicalURL = prepareCanonicalRequest(timestamp, dataString);

  //  Logger.log(canonicalURL);
  //  Logger.log(SHA256(canonicalURL));

  var stringToSign = prepareStringToSign(timestamp, yyyymmdd, canonicalURL);
  //  var stringToSign = prepareStringToSign("20200802T134800Z", "20200802", canonicalURL);


  var signature = calculateSignature(Secret_Key, yyyymmdd, region, "ProductAdvertisingAPI", stringToSign);
  Logger.log("signature");
  Logger.log(signature);

  var Authorization = "AWS4-HMAC-SHA256 Credential=" + Access_Key + "/" + yyyymmdd + "/us-west-2/ProductAdvertisingAPI/aws4_request SignedHeaders=content-encoding;host;x-amz-date;x-amz-target  Signature=" + signature;
  // Logger.log(Authorization);
  Authorization = "AWS4-HMAC-SHA256 Credential=AKIAIDXIEXSD36CHFA5A/20200804/us-west-2/ProductAdvertisingAPI/aws4_request SignedHeaders=content-encoding;host;x-amz-date;x-amz-target  Signature=2d8a4cae5bd711cab035aaf34c937128f5660e15b239b77d5f9b8f4619c67445";

  var headers = {
    //    'Host': host,
    'Accept': 'application/json, text/javascript',
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json; charset=UTF-8',
    //    'X-Amz-Date': timestamp,
    'X-Amz-Date': timestamp,
    'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
    'Content-Encoding': 'amz-1.0',
    'Authorization': Authorization
  };
  Logger.log(headers);


  var url = 'https://webservices.amazon.co.jp/paapi5/searchitems';

  var options = {
    method: 'POST',
    headers: headers,
    payload: dataString,
    muteHttpExceptions: true,
  };
  Logger.log(options);


  // request(options, callback);

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response);

}

function prepareCanonicalRequest(timestamp, payload) {
  var canonicalUrl = "POST\n";
  canonicalUrl = canonicalUrl + "/paapi5/searchitems" + "\n\n";
  canonicalUrl = canonicalUrl + "content-encoding:amz-1.0" + "\n";
  canonicalUrl = canonicalUrl + "content-type:application/json; charset=UTF-8" + "\n";
  canonicalUrl = canonicalUrl + "host:webservices.amazon.co.jp" + "\n";
  canonicalUrl = canonicalUrl + "x-amz-date:" + timestamp + "\n";
  canonicalUrl = canonicalUrl + "x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems" + "\n\n";
  canonicalUrl = canonicalUrl + "content-encoding;content-type;host;x-amz-date;x-amz-target" + "\n";
  // canonicalUrl=canonicalUrl+SHA256(payload);
  canonicalUrl = canonicalUrl + SHA256(payload);
  //canonicalUrl = canonicalUrl + SHA256('{"PartnerType":"Associates","PartnerTag":"shark0731-22","Keywords":"Harry","SearchIndex":"All","Resources":["Images.Primary.Small","ItemInfo.Title","Offers.Listings.Price"]}');

  return canonicalUrl;
}

function prepareStringToSign(timestamp, yyyymmdd, canonicalURL) {
  var stringToSign = "AWS4-HMAC-SHA256" + "\n";
  stringToSign = stringToSign + timestamp + "\n";
  stringToSign = stringToSign + yyyymmdd + "/us-west-2/ProductAdvertisingAPI/aws4_request" + "\n";
  stringToSign = stringToSign + SHA256(canonicalURL);
  return stringToSign;
}



function calculateSignature(secretAccessKey, currentDate, regionName, serviceName, stringToSign) {
  var kDate = my_HMAC_keytext(currentDate, "AWS4" + secretAccessKey);
  // Logger.log("kDate\n");
  // Logger.log(kDate);
  var kRegion = my_HMAC_keyB64(regionName, kDate);
  // Logger.log("kRegion\n");
  // Logger.log(kRegion);
  // Logger.log(my_HMAC_keyB64_HEXOutput(regionName, kDate));
  var kService = my_HMAC_keyB64(serviceName, kRegion);
  // Logger.log("kService\n");
  // Logger.log(kService);
  // Logger.log(my_HMAC_keyB64_HEXOutput(serviceName, kRegion));
  var kSigning = my_HMAC_keyB64("aws4_request", kService);
  // Logger.log("kSigning\n");
  // Logger.log(kSigning);
  // Logger.log(my_HMAC_keyB64_HEXOutput("aws4_request", kService));

  var signatureKey = kSigning;
  var signature = my_HMAC_keyB64_HEXOutput(stringToSign, signatureKey);
  // Logger.log(signature);

  // Logger.log(signatureKey);
  // var signature = my_HMAC_keyB64(stringToSign, signatureKey);
  // Logger.log(stringToSign);
  // Logger.log(signatureKey);
  return signature;
}


// function getSignatureKey(key, date, regionName, serviceName) {
//   // var kDate = hash_hmac(date, "AWS4" + key);
//   // var kRegion = hash_hmac(regionName, kDate);
//   // var kService = hash_hmac(serviceName, kRegion);
//   // var kSigning = hash_hmac("aws4_request", kService);

//   var kDate = my_HMAC_keytext(date, "AWS4" + key);
//   var kRegion = my_HMAC_keyB64(regionName, kDate);
//   var kService = my_HMAC_keyB64(serviceName, kRegion);
//   var kSigning = my_HMAC_keyB64("aws4_request", kService);
//   return kSigning;
//   // var kDate = Utilities.computeHmacSha256Signature(date, "AWS4" + key);
//   // kDate = kDate.reduce(function (str, chr) {
//   //   chr = (chr < 0 ? chr + 256 : chr).toString(16);
//   //   return str + (chr.length == 1 ? '0' : '') + chr;
//   // }, '');
//   // var kRegion = Utilities.computeHmacSha256Signature(regionName, kDate);
//   // kRegion = kRegion.reduce(function (str, chr) {
//   //   chr = (chr < 0 ? chr + 256 : chr).toString(16);
//   //   return str + (chr.length == 1 ? '0' : '') + chr;
//   // }, '');
//   // var kService = Utilities.computeHmacSha256Signature(serviceName, kRegion);
//   // kService = kService.reduce(function (str, chr) {
//   //   chr = (chr < 0 ? chr + 256 : chr).toString(16);
//   //   return str + (chr.length == 1 ? '0' : '') + chr;
//   // }, '');
//   // var kSigning = Utilities.computeHmacSha256Signature("aws4_request", kService);
//   // kSigning = kSigning.reduce(function (str, chr) {
//   //   chr = (chr < 0 ? chr + 256 : chr).toString(16);
//   //   return str + (chr.length == 1 ? '0' : '') + chr;
//   // }, '');
//   // return kSigning;
// }

// function hash_hmac(value, key) {
//   var output = Utilities.computeHmacSha256Signature(value, key);
//   output = output.reduce(function (str, chr) {
//     chr = (chr < 0 ? chr + 256 : chr).toString(16);
//     return str + (chr.length == 1 ? '0' : '') + chr;
//   }, '');

//   // output=Utilities.base64Encode(output);
//   // output=encodeURIComponent(output);
//   return output;
// }



function SHA256(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  var txtHash = '';
  for (i = 0; i < rawHash.length; i++) {
    var hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}


function my_HMAC_keytext(value, key) {
  const shaObj = new jsSHA("SHA-256", "TEXT", {
    hmacKey: { value: key, format: "TEXT" },
  });
  shaObj.update(value);
  const hmac = shaObj.getHash("B64");
  return hmac;
}

function my_HMAC_keyB64(value, key) {
  const shaObj = new jsSHA("SHA-256", "TEXT", {
    hmacKey: { value: key, format: "B64" },
  });
  shaObj.update(value);
  const hmac = shaObj.getHash("B64");
  return hmac;
}

function my_HMAC_keyB64_HEXOutput(value, key) {
  const shaObj = new jsSHA("SHA-256", "TEXT", {
    hmacKey: { value: key, format: "B64" },
  });
  shaObj.update(value);
  const hmac = shaObj.getHash("HEX");
  return hmac;
}

/**
 * A JavaScript implementation of the SHA family of hashes - defined in FIPS PUB 180-4, FIPS PUB 202,
 * and SP 800-185 - as well as the corresponding HMAC implementation as defined in FIPS PUB 198-1.
 *
 * Copyright 2008-2020 Brian Turek, 1998-2009 Paul Johnston & Contributors
 * Distributed under the BSD License
 * See http://caligatio.github.com/jsSHA/ for more information
 *
 * Two ECMAScript polyfill functions carry the following license:
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED,
 * INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 * MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 * See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
 */
!function (t, r) { "object" == typeof exports && "undefined" != typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define(r) : (t = t || self).jsSHA = r() }(this, (function () { "use strict"; var t = function (r, n) { return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, r) { t.__proto__ = r } || function (t, r) { for (var n in r) r.hasOwnProperty(n) && (t[n] = r[n]) })(r, n) }; var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; function n(t, r, n, i) { var e, o, u, s = r || [0], f = (n = n || 0) >>> 3, h = -1 === i ? 3 : 0; for (e = 0; e < t.length; e += 1)o = (u = e + f) >>> 2, s.length <= o && s.push(0), s[o] |= t[e] << 8 * (h + i * (u % 4)); return { value: s, binLen: 8 * t.length + n } } function i(t, i, e) { switch (i) { case "UTF8": case "UTF16BE": case "UTF16LE": break; default: throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE") }switch (t) { case "HEX": return function (t, r, n) { return function (t, r, n, i) { var e, o, u, s; if (0 != t.length % 2) throw new Error("String of HEX type must be in byte increments"); var f = r || [0], h = (n = n || 0) >>> 3, a = -1 === i ? 3 : 0; for (e = 0; e < t.length; e += 2) { if (o = parseInt(t.substr(e, 2), 16), isNaN(o)) throw new Error("String of HEX type contains invalid characters"); for (u = (s = (e >>> 1) + h) >>> 2; f.length <= u;)f.push(0); f[u] |= o << 8 * (a + i * (s % 4)) } return { value: f, binLen: 4 * t.length + n } }(t, r, n, e) }; case "TEXT": return function (t, r, n) { return function (t, r, n, i, e) { var o, u, s, f, h, a, c, w, v = 0, E = n || [0], A = (i = i || 0) >>> 3; if ("UTF8" === r) for (c = -1 === e ? 3 : 0, s = 0; s < t.length; s += 1)for (u = [], 128 > (o = t.charCodeAt(s)) ? u.push(o) : 2048 > o ? (u.push(192 | o >>> 6), u.push(128 | 63 & o)) : 55296 > o || 57344 <= o ? u.push(224 | o >>> 12, 128 | o >>> 6 & 63, 128 | 63 & o) : (s += 1, o = 65536 + ((1023 & o) << 10 | 1023 & t.charCodeAt(s)), u.push(240 | o >>> 18, 128 | o >>> 12 & 63, 128 | o >>> 6 & 63, 128 | 63 & o)), f = 0; f < u.length; f += 1) { for (h = (a = v + A) >>> 2; E.length <= h;)E.push(0); E[h] |= u[f] << 8 * (c + e * (a % 4)), v += 1 } else for (c = -1 === e ? 2 : 0, w = "UTF16LE" === r && 1 !== e || "UTF16LE" !== r && 1 === e, s = 0; s < t.length; s += 1) { for (o = t.charCodeAt(s), !0 === w && (o = (f = 255 & o) << 8 | o >>> 8), h = (a = v + A) >>> 2; E.length <= h;)E.push(0); E[h] |= o << 8 * (c + e * (a % 4)), v += 2 } return { value: E, binLen: 8 * v + i } }(t, i, r, n, e) }; case "B64": return function (t, n, i) { return function (t, n, i, e) { var o, u, s, f, h, a, c = 0, w = n || [0], v = (i = i || 0) >>> 3, E = -1 === e ? 3 : 0, A = t.indexOf("="); if (-1 === t.search(/^[a-zA-Z0-9=+/]+$/)) throw new Error("Invalid character in base-64 string"); if (t = t.replace(/=/g, ""), -1 !== A && A < t.length) throw new Error("Invalid '=' found in base-64 string"); for (o = 0; o < t.length; o += 4) { for (f = t.substr(o, 4), s = 0, u = 0; u < f.length; u += 1)s |= r.indexOf(f.charAt(u)) << 18 - 6 * u; for (u = 0; u < f.length - 1; u += 1) { for (h = (a = c + v) >>> 2; w.length <= h;)w.push(0); w[h] |= (s >>> 16 - 8 * u & 255) << 8 * (E + e * (a % 4)), c += 1 } } return { value: w, binLen: 8 * c + i } }(t, n, i, e) }; case "BYTES": return function (t, r, n) { return function (t, r, n, i) { var e, o, u, s, f = r || [0], h = (n = n || 0) >>> 3, a = -1 === i ? 3 : 0; for (o = 0; o < t.length; o += 1)e = t.charCodeAt(o), u = (s = o + h) >>> 2, f.length <= u && f.push(0), f[u] |= e << 8 * (a + i * (s % 4)); return { value: f, binLen: 8 * t.length + n } }(t, r, n, e) }; case "ARRAYBUFFER": try { new ArrayBuffer(0) } catch (t) { throw new Error("ARRAYBUFFER not supported by this environment") } return function (t, r, i) { return function (t, r, i, e) { return n(new Uint8Array(t), r, i, e) }(t, r, i, e) }; case "UINT8ARRAY": try { new Uint8Array(0) } catch (t) { throw new Error("UINT8ARRAY not supported by this environment") } return function (t, r, i) { return n(t, r, i, e) }; default: throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY") } } function e(t, n, i, e) { switch (t) { case "HEX": return function (t) { return function (t, r, n, i) { var e, o, u = "", s = r / 8, f = -1 === n ? 3 : 0; for (e = 0; e < s; e += 1)o = t[e >>> 2] >>> 8 * (f + n * (e % 4)), u += "0123456789abcdef".charAt(o >>> 4 & 15) + "0123456789abcdef".charAt(15 & o); return i.outputUpper ? u.toUpperCase() : u }(t, n, i, e) }; case "B64": return function (t) { return function (t, n, i, e) { var o, u, s, f, h, a = "", c = n / 8, w = -1 === i ? 3 : 0; for (o = 0; o < c; o += 3)for (f = o + 1 < c ? t[o + 1 >>> 2] : 0, h = o + 2 < c ? t[o + 2 >>> 2] : 0, s = (t[o >>> 2] >>> 8 * (w + i * (o % 4)) & 255) << 16 | (f >>> 8 * (w + i * ((o + 1) % 4)) & 255) << 8 | h >>> 8 * (w + i * ((o + 2) % 4)) & 255, u = 0; u < 4; u += 1)a += 8 * o + 6 * u <= n ? r.charAt(s >>> 6 * (3 - u) & 63) : e.b64Pad; return a }(t, n, i, e) }; case "BYTES": return function (t) { return function (t, r, n) { var i, e, o = "", u = r / 8, s = -1 === n ? 3 : 0; for (i = 0; i < u; i += 1)e = t[i >>> 2] >>> 8 * (s + n * (i % 4)) & 255, o += String.fromCharCode(e); return o }(t, n, i) }; case "ARRAYBUFFER": try { new ArrayBuffer(0) } catch (t) { throw new Error("ARRAYBUFFER not supported by this environment") } return function (t) { return function (t, r, n) { var i, e = r / 8, o = new ArrayBuffer(e), u = new Uint8Array(o), s = -1 === n ? 3 : 0; for (i = 0; i < e; i += 1)u[i] = t[i >>> 2] >>> 8 * (s + n * (i % 4)) & 255; return o }(t, n, i) }; case "UINT8ARRAY": try { new Uint8Array(0) } catch (t) { throw new Error("UINT8ARRAY not supported by this environment") } return function (t) { return function (t, r, n) { var i, e = r / 8, o = -1 === n ? 3 : 0, u = new Uint8Array(e); for (i = 0; i < e; i += 1)u[i] = t[i >>> 2] >>> 8 * (o + n * (i % 4)) & 255; return u }(t, n, i) }; default: throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY") } } var o = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], u = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], s = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]; function f(t) { var r = { outputUpper: !1, b64Pad: "=", outputLen: -1 }, n = t || {}, i = "Output length must be a multiple of 8"; if (r.outputUpper = n.outputUpper || !1, n.b64Pad && (r.b64Pad = n.b64Pad), n.outputLen) { if (n.outputLen % 8 != 0) throw new Error(i); r.outputLen = n.outputLen } else if (n.shakeLen) { if (n.shakeLen % 8 != 0) throw new Error(i); r.outputLen = n.shakeLen } if ("boolean" != typeof r.outputUpper) throw new Error("Invalid outputUpper formatting option"); if ("string" != typeof r.b64Pad) throw new Error("Invalid b64Pad formatting option"); return r } function h(t, r) { return t >>> r | t << 32 - r } function a(t, r) { return t >>> r } function c(t, r, n) { return t & r ^ ~t & n } function w(t, r, n) { return t & r ^ t & n ^ r & n } function v(t) { return h(t, 2) ^ h(t, 13) ^ h(t, 22) } function E(t, r) { var n = (65535 & t) + (65535 & r); return (65535 & (t >>> 16) + (r >>> 16) + (n >>> 16)) << 16 | 65535 & n } function A(t, r, n, i) { var e = (65535 & t) + (65535 & r) + (65535 & n) + (65535 & i); return (65535 & (t >>> 16) + (r >>> 16) + (n >>> 16) + (i >>> 16) + (e >>> 16)) << 16 | 65535 & e } function p(t, r, n, i, e) { var o = (65535 & t) + (65535 & r) + (65535 & n) + (65535 & i) + (65535 & e); return (65535 & (t >>> 16) + (r >>> 16) + (n >>> 16) + (i >>> 16) + (e >>> 16) + (o >>> 16)) << 16 | 65535 & o } function d(t) { return h(t, 7) ^ h(t, 18) ^ a(t, 3) } function l(t) { return h(t, 6) ^ h(t, 11) ^ h(t, 25) } function R(t) { return "SHA-224" == t ? u.slice() : s.slice() } function U(t, r) { var n, i, e, u, s, f, R, U, y, b, T, m, F = []; for (n = r[0], i = r[1], e = r[2], u = r[3], s = r[4], f = r[5], R = r[6], U = r[7], T = 0; T < 64; T += 1)F[T] = T < 16 ? t[T] : A(h(m = F[T - 2], 17) ^ h(m, 19) ^ a(m, 10), F[T - 7], d(F[T - 15]), F[T - 16]), y = p(U, l(s), c(s, f, R), o[T], F[T]), b = E(v(n), w(n, i, e)), U = R, R = f, f = s, s = E(u, y), u = e, e = i, i = n, n = E(y, b); return r[0] = E(n, r[0]), r[1] = E(i, r[1]), r[2] = E(e, r[2]), r[3] = E(u, r[3]), r[4] = E(s, r[4]), r[5] = E(f, r[5]), r[6] = E(R, r[6]), r[7] = E(U, r[7]), r } return function (r) { function n(t, n, e) { var o = this; if ("SHA-224" !== t && "SHA-256" !== t) throw new Error("Chosen SHA variant is not supported"); var u = e || {}; return (o = r.call(this, t, n, e) || this).t = o.i, o.o = !0, o.u = -1, o.s = i(o.h, o.v, o.u), o.A = U, o.p = function (t) { return t.slice() }, o.l = R, o.R = function (r, n, i, e) { return function (t, r, n, i, e) { for (var o, u = 15 + (r + 65 >>> 9 << 4), s = r + n; t.length <= u;)t.push(0); for (t[r >>> 5] |= 128 << 24 - r % 32, t[u] = 4294967295 & s, t[u - 1] = s / 4294967296 | 0, o = 0; o < t.length; o += 16)i = U(t.slice(o, o + 16), i); return "SHA-224" === e ? [i[0], i[1], i[2], i[3], i[4], i[5], i[6]] : i }(r, n, i, e, t) }, o.U = R(t), o.T = 512, o.m = "SHA-224" === t ? 224 : 256, o.F = !1, u.hmacKey && o.B(function (t, r, n, e) { var o = t + " must include a value and format"; if (!r) { if (!e) throw new Error(o); return e } if (void 0 === r.value || !r.format) throw new Error(o); return i(r.format, r.encoding || "UTF8", n)(r.value) }("hmacKey", u.hmacKey, o.u)), o } return function (r, n) { function i() { this.constructor = r } t(r, n), r.prototype = null === n ? Object.create(n) : (i.prototype = n.prototype, new i) }(n, r), n }(function () { function t(t, r, n) { var i = n || {}; if (this.h = r, this.v = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1"); this.g = t, this.Y = [], this.H = 0, this.S = !1, this.I = 0, this.C = !1, this.L = [], this.N = [] } return t.prototype.update = function (t) { var r, n = 0, i = this.T >>> 5, e = this.s(t, this.Y, this.H), o = e.binLen, u = e.value, s = o >>> 5; for (r = 0; r < s; r += i)n + this.T <= o && (this.U = this.A(u.slice(r, r + i), this.U), n += this.T); this.I += n, this.Y = u.slice(n >>> 5), this.H = o % this.T, this.S = !0 }, t.prototype.getHash = function (t, r) { var n, i, o = this.m, u = f(r); if (this.F) { if (-1 === u.outputLen) throw new Error("Output length must be specified in options"); o = u.outputLen } var s = e(t, o, this.u, u); if (this.C && this.t) return s(this.t(u)); for (i = this.R(this.Y.slice(), this.H, this.I, this.p(this.U), o), n = 1; n < this.numRounds; n += 1)this.F && o % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - o % 32), i = this.R(i, o, 0, this.l(this.g), o); return s(i) }, t.prototype.setHMACKey = function (t, r, n) { if (!this.o) throw new Error("Variant does not support HMAC"); if (this.S) throw new Error("Cannot set MAC key after calling update"); var e = i(r, (n || {}).encoding || "UTF8", this.u); this.B(e(t)) }, t.prototype.B = function (t) { var r, n = this.T >>> 3, i = n / 4 - 1; if (1 !== this.numRounds) throw new Error("Cannot set numRounds with MAC"); if (this.C) throw new Error("MAC key already set"); for (n < t.binLen / 8 && (t.value = this.R(t.value, t.binLen, 0, this.l(this.g), this.m)); t.value.length <= i;)t.value.push(0); for (r = 0; r <= i; r += 1)this.L[r] = 909522486 ^ t.value[r], this.N[r] = 1549556828 ^ t.value[r]; this.U = this.A(this.L, this.U), this.I = this.T, this.C = !0 }, t.prototype.getHMAC = function (t, r) { var n = f(r); return e(t, this.m, this.u, n)(this.i()) }, t.prototype.i = function () { var t; if (!this.C) throw new Error("Cannot call getHMAC without first setting MAC key"); var r = this.R(this.Y.slice(), this.H, this.I, this.p(this.U), this.m); return t = this.A(this.N, this.l(this.g)), t = this.R(r, this.m, this.T, t, this.m) }, t }()) }));
