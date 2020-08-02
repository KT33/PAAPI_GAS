function main() {

  var word = "HarryPotter";
  var Partner_Tag = PropertiesService.getScriptProperties().getProperty("PartnerTag");
  var Access_Key = PropertiesService.getScriptProperties().getProperty("AccessKey");
  var Sectet_Key = PropertiesService.getScriptProperties().getProperty("SecretKey");
  var tag = "kt33-22"

  var host = "webservices.amazon.co.jp";
  var region = "us-west-2";
  var path = "/paapi5/searchitems";

  //日時の取得
  var now = new Date();
  var yyyymmdd = Utilities.formatDate(now, "GMT", "yyyyMMdd")
  var timestamp = yyyymmdd + "T" + Utilities.formatDate(now, "GMT", "HHmmss") + "Z";
  // console.log(yyyymmdd);
  // Logger.log(timestamp);

//  var canonicalURL=prepareCanonicalRequest(timestamp,"payload");
    var canonicalURL=prepareCanonicalRequest("20200802T134800Z","payload");
  Logger.log(canonicalURL);

  Logger.log(SHA256(canonicalURL));
  
//  var stringToSign=prepareStringToSign(timestamp, yyyymmdd,canonicalURL);
    var stringToSign=prepareStringToSign("20200802T134800Z", "20200802",canonicalURL);
  Logger.log(stringToSign);
  

  var headers = {
    //    'Host': host,
    'Accept': 'application/json, text/javascript',
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json; charset=UTF-8',
    //    'X-Amz-Date': timestamp,
    'X-Amz-Date': timestamp,
    'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
    'Content-Encoding': 'amz-1.0',
    'Authorization': 'AWS4-HMAC-SHA256 Credential='+Access_Key+'/20200801/us-west-2/ProductAdvertisingAPI/aws4_request SignedHeaders=content-encoding;host;x-amz-date;x-amz-target  Signature=e7267f6e690acb83f8dfe0ec96874e64ae48e11f9119eaed8951c75022820d9d'
  };
  // Logger.log(headers);

  var dataString = '{\n    "Keywords": "' + word + '",\n    "PartnerTag": "' + Partner_Tag + '",\n    "PartnerType": "Associates",\n    "Marketplace": "www.amazon.co.jp"\n}';
  // Logger.log(dataString);

  var url = 'https://webservices.amazon.co.jp/paapi5/searchitems';

  var options = {
    method: 'POST',
    headers: headers,
    payload: dataString,
    muteHttpExceptions: true,
  };
  //  Logger.log(options);


  // request(options, callback);

  var response = UrlFetchApp.fetch(url, options);
  // Logger.log(response);

}

//改行が２連続しているところがあるからそこはあやしいかも...
function prepareCanonicalRequest(timestamp,payload){
  var canonicalUrl="POST\n";
  canonicalUrl=canonicalUrl+ "/paapi5/searchitems"+"\n\n";
  canonicalUrl=canonicalUrl+"content-encoding:amz-1.0"+"\n";
  canonicalUrl=canonicalUrl+"content-type:application/json; charset=utf-8"+"\n";
  canonicalUrl=canonicalUrl+"host:webservices.amazon.co.jp"+"\n";
  canonicalUrl=canonicalUrl+"x-amz-date:"+timestamp+"\n";
  canonicalUrl=canonicalUrl+"x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems"+"\n\n";
  canonicalUrl=canonicalUrl+"content-encoding;content-type;host;x-amz-date;x-amz-target"+"\n";
  // canonicalUrl=canonicalUrl+SHA256(payload);
  canonicalUrl=canonicalUrl+SHA256('{"PartnerType":"Associates","PartnerTag":"shark0731-22","Keywords":"Harry","SearchIndex":"All","Resources":["Images.Primary.Small","ItemInfo.Title","Offers.Listings.Price"]}');
  return canonicalUrl;
}

function prepareStringToSign(timestamp,yyyymmdd,canonicalURL){
  var stringToSign="AWS4-HMAC-SHA256"+"\n";
  stringToSign=stringToSign+timestamp+"\n";
  stringToSign=stringToSign+yyyymmdd+"/us-west-2/ProductAdvertisingAPI/aws4_request"+"\n";
  stringToSign=stringToSign+SHA256(canonicalURL);
  return stringToSign;
}






function SHA256 (input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,input);
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


 function test2(){
   var payload='POST\n/paapi5/searchitems\n\ncontent-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:webservices.amazon.co.jp\nx-amz-date:20200802T134800Z\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n\ncontent-encoding;content-type;host;x-amz-date;x-amz-target\nd0a0554f78af0fe8ce5fbbe9d2d89695fc21507a7ec2f64e7e7e5b0e207d7a41';
 //  var encoded = Utilities.base64EncodeWebSafe("{"PartnerType":"Associates","PartnerTag":"shark0731-22","Keywords":"Harry","SearchIndex":"All","Resources":["Images.Primary.Small","ItemInfo.Title","Offers.Listings.Price"]}");
   Logger.log(payload);
   var encoded = SHA256(payload);
   Logger.log(encoded);
 }