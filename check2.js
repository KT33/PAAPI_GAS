function myFunction() {
  
  //  //スプレッドシートシートを取得
  //  var datasheet = SpreadsheetApp.getActiveSheet();
  //
  //  datasheet.getRange(1, 1).setValue("test");

  var target_url = String("www.amazon.com");
  var title = "test messege";
  var flag = 0;
  //  Logger.log(text);
  //  datasheet.getRange(2, 1).setValue(text);
  
//  target_url="https://www.notion.so/5cb4565978884702aef3e2fd262475a1";

  if (target_url.match(/amazon/)) {
    flag = 1;
  } else {
    flag = -1;
  }

  var value;
  if (target_url.match(/\?/)) {
    //    value = "You say " + text + "num=" + my_num;
    value = {
      return_url: target_url + "&tag=shark0731-22",
      chrck_flag: flag,
    };
  } else {
    // value = "Please say something";
    value = {
      return_url: target_url + "?tag=shark0731-22",
      chrck_flag: flag,
    };
  }


  var result = {
    message: value
  }

    Logger.log(value);
  Logger.log(result);
  //  datasheet.getRange(3, 1).setValue(result);


  var out = ContentService.createTextOutput();
  //  Logger.log(out);
  //  datasheet.getRange(4, 1).setValue(out);


  //Mine TypeをJSONに
  out.setMimeType(ContentService.MimeType.JSON);

  //JSONテキストをセット
  out.setContent(JSON.stringify(result));
  Logger.log(out);
  //  datasheet.getRange(5, 1).setValue(out);

  // var json=JSON.parse(out);
  // datasheet.getRange(6, 1).setValue(json);

  return out;
}
