<?php

/**
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

$searchItemRequest = new SearchItemsRequest ();
$searchItemRequest->PartnerType = "Associates";
// Put your Partner tag (Store/Tracking id) in place of Partner tag
$searchItemRequest->PartnerTag = <PARTNER_TAG>;
$searchItemRequest->Keywords = "Harry";
$searchItemRequest->SearchIndex = "All";
$searchItemRequest->Resources = ["Images.Primary.Small","ItemInfo.Title","Offers.Listings.Price"];
$host = "webservices.amazon.com";
$path = "/paapi5/searchitems";
$payload = json_encode ($searchItemRequest);
//Put your Access Key in place of <ACCESS_KEY> and Secret Key in place of <SECRET_KEY> in double quotes
$awsv4 = new AwsV4 (<ACCESS_KEY>, <SECRET_KEY>);
$awsv4->setRegionName("us-east-1");
$awsv4->setServiceName("ProductAdvertisingAPI");
$awsv4->setPath ($path);
$awsv4->setPayload ($payload);
$awsv4->setRequestMethod ("POST");
$awsv4->addHeader ('content-encoding', 'amz-1.0');
$awsv4->addHeader ('content-type', 'application/json; charset=utf-8');
$awsv4->addHeader ('host', $host);
$awsv4->addHeader ('x-amz-target', 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems');
$headers = $awsv4->getHeaders ();
$headerString = "";
foreach ( $headers as $key => $value ) {
    $headerString .= $key . ': ' . $value . "\r\n";
}
$params = array (
        'http' => array (
            'header' => $headerString,
            'method' => 'POST',
            'content' => $payload
        )
    );
$stream = stream_context_create ( $params );

$fp = @fopen ( 'https://'.$host.$path, 'rb', false, $stream );

if (! $fp) {
    throw new Exception ( "Exception Occured" );
}
$response = @stream_get_contents ( $fp );
if ($response === false) {
    throw new Exception ( "Exception Occured" );
}
echo $response;

class SearchItemsRequest {
    public $PartnerType;
    public $PartnerTag;
    public $Keywords;
    public $SearchIndex;
    public $Resources;
}
?>
