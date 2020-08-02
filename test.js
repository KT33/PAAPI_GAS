function Authentication() {

  console.log("test");
  
  var Partner_Tag = PropertiesService.getScriptProperties().getProperty("PartnerTag");
  var Access_Key = PropertiesService.getScriptProperties().getProperty("AccessKey");
  var Sectet_Key = PropertiesService.getScriptProperties().getProperty("SecretKey");

  var host = "webservices.amazon.co.jp";
  var uri = "/paapi5/searchitems";


  var params = {
    Service: "ProductAdvertisingAPI",
    // Version: "2013-08-01",
    Operation: "SearchItems",
    AWSAccessKeyId: Access_Key,
    AssociateTag: Partner_Tag,
    SearchIndex: "All",
    Timestamp: new Date().toISOString(),
    Keywords: "Harry",
    // ResponseGroup: "ItemAttributes"
  };
  Logger.log("\nparams:"+params);
//  Logger.log(params);

  var sort_params = Object.keys(params).sort();
  sort_params = sort_params.map(function (key) {
    return key + "=" + encodeURIComponent(params[key]);
  });

  Logger.log("\n sort_params:"+sort_params);
  // Logger.log(sort_params);

  var canonical_query_string = sort_params.join("&");
  Logger.log("\canonical_query_string:"+canonical_query_string);
  // Logger.log(canonical_query_string);

  var string_to_sign = "POST\n" + host + "\n" + uri + "\n" + canonical_query_string;
  Logger.log("\string_to_sign:"+string_to_sign);
  // Logger.log(string_to_sign);

  var signature = Utilities.base64Encode(Utilities.computeHmacSha256Signature(string_to_sign, Sectet_Key));
    Logger.log("\signature:"+signature);
  // Logger.log(signature);

  //Signature
  var now = new Date();
  var yyyymmdd = now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + now.getDate()).slice(-2);
  console.log(yyyymmdd);
  console.log("test");
}


function test() {
  var key =Sectet_Key;
  var date = "20200728";
  var date = "20200728";
  var regionName = "us-west-2";
  var serviceName = "ProductAdvertisingAPI";
  //  Logger.log(typeof(date));
  var sign = getSignatureKey(key, date, regionName, serviceName);
  Logger.log(sign);
}



function getSignatureKey(key, dateStamp, regionName, serviceName) {

  var kDate = Utilities.computeHmacSha256Signature(dateStamp, "AWS4" + key);
  //  Logger.log(typeof(kDate));
  //   Logger.log(kDate);
  kDate = kDate.reduce(function (str, chr) {
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return str + (chr.length == 1 ? '0' : '') + chr;
  }, '');
  //  Logger.log(typeof(kDate));
  // Logger.log(kDate);
  var kRegion = Utilities.computeHmacSha256Signature(regionName, kDate);
  kRegion = kRegion.reduce(function (str, chr) {
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return str + (chr.length == 1 ? '0' : '') + chr;
  }, '');
  var kService = Utilities.computeHmacSha256Signature(serviceName, kRegion);
  kService = kService.reduce(function (str, chr) {
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return str + (chr.length == 1 ? '0' : '') + chr;
  }, '');
  var kSigning = Utilities.computeHmacSha256Signature("aws4_request", kService);
  kSigning = kSigning.reduce(function (str, chr) {
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return str + (chr.length == 1 ? '0' : '') + chr;
  }, '');
  return kSigning;
}

// function getSignatureKey(key, dateStamp, regionName, serviceName) {
//   var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
//   var kRegion = crypto.HmacSHA256(regionName, kDate);
//   var kService = crypto.HmacSHA256(serviceName, kRegion);
//   var kSigning = crypto.HmacSHA256("aws4_request", kService);
//   return kSigning;
// }



//function new_paapi() {
//  //     var cipher = new cCryptoGS.Cipher('this is my passphrase', 'aes');
//  //   Logger.log(cipher);
//  //     var encryptedMessage = cipher.encrypt ('this is my message to be encrypted');
//  // Logger.log(encryptedMessage);  
//  //   var decryptedMessage = cipher.decrypt (encryptedMessage);
//  // Logger.log(decryptedMessage);
//
//
//
//  var text = timestamp + method + path;
//  var signature = Utilities.computeHmacSha256Signature(text, secretKey);
//  var sign = signature.reduce(function (str, chr) {
//    chr = (chr < 0 ? chr + 256 : chr).toString(16);
//    return str + (chr.length == 1 ? '0' : '') + chr;
//  }, '');
//
//}