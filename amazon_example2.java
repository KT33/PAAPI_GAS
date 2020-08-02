package com.amazon.paapi.test;

/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import java.util.Map;
import java.util.TreeMap;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

public class PaapiClient {

    public static void main(String[] args) throws Exception {

        String HOST = "webservices.amazon.com";
        String region = "us-east-1";
        String path = "/paapi5/searchitems";

        // Sample SearchItems request. You can also use scratchpad tool (UI) to test a request and then use JSON Payload value here. Scratchpad link: https://webservices.amazon.com/paapi5/scratchpad/index.html
        // Put your Partner tag (Store/Tracking id) in place of Partner tag
        String requestPayload = "{\"Keywords\":\"harry\","
                + "\"PartnerTag\":\"PartnerTag\",\"PartnerType\":\"Associates\","
                + "\"SearchIndex\":\"All\","
                +"\"Resources\": [\"Images.Primary.Small\",\"ItemInfo.Title\",\"Offers.Listings.Price\"]}";

        TreeMap<String, String> headers = new TreeMap<String, String>();
        headers.put("host", HOST);
        headers.put("content-type", "application/json; charset=utf-8");
        // x-amz-target is value specific to your version and operation. For version 1's SearchItems it'll be com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems
        headers.put("x-amz-target", "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems");
        headers.put("content-encoding", "amz-1.0");

        // Put your Access Key in place of <ACCESS_KEY> and Secret Key in place of <SECRET_KEY> in double quotes
        AWSV4Auth awsv4Auth = new AWSV4Auth.Builder(<ACCESS_KEY>, <SECRET_KEY>)
            .path(path)
            .region(region)
            .service("ProductAdvertisingAPI")
            .httpMethodName("POST")
            .headers(headers)
            .payload(requestPayload)
            .build();

        HttpClient client = HttpClientBuilder.create().build();
        HttpPost httpPost = new HttpPost("https://" + HOST + path);
        httpPost.setEntity(new StringEntity(requestPayload));
        // Signing
        Map<String, String> header = awsv4Auth.getHeaders();
        for (Map.Entry<String, String> entrySet : header.entrySet()) {
            httpPost.addHeader(entrySet.getKey(), entrySet.getValue());
            // Print headers by un-commenting following line
            //System.out.println("Key: " + entrySet.getKey() + " Value: " + entrySet.getValue());
        }

        HttpResponse response = client.execute(httpPost);
        HttpEntity entity = response.getEntity();
        String jsonResponse = EntityUtils.toString(entity, "UTF-8");
        int statusCode = response.getStatusLine().getStatusCode();
        System.out.println(jsonResponse);
        if(statusCode == 200) {
            System.out.println("Successfully received response from Product Advertising API.");
        } else {
            JSONObject json = new JSONObject(jsonResponse);
            if(json.has("Errors")) {
                JSONArray errorArray = json.getJSONArray("Errors");
                for(int i = 0; i < errorArray.length(); i++) {
                    JSONObject e = errorArray.getJSONObject(i);
                    System.out.println("Error Code: "+e.get("Code")+", Message: "+e.get("Message"));
                }
            } else {
                System.out.println("Error Code: InternalFailure, Message: The request processing has failed because of an unknown error, exception or failure. Please retry again.");
            }
        }
    }
}
