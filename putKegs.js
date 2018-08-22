var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing kegs into DynamoDB. Please wait.");

var kegs = [
    {
        KegName : "Boddington's",
        DateTapped: "2016-01-01",
        DateKicked: "2016-12-31",
        TapNumber: 1
    },
    {
        KegName : "Franzizkaner",
        DateTapped: "2017-01-01",
        DateKicked: "2017-12-31",
        TapNumber: 2
    },
    {
        KegName : "Stella Artois",
        DateTapped: "2018-01-01",
        DateKicked: "2018-12-13",
        TapNumber: 3
    },
    {
        KegName : "Konig Ludwig",
        DateTapped: "2019-01-01",
        DateKicked: "unkicked",
        TapNumber: 4
    },
];

kegs.forEach(function(keg) {
    var params = {
        TableName: "Kegs",
        Item: {
            "KegName":  keg.KegName,
            "DateTapped": keg.DateTapped,
            "DateKicked":  keg.DateKicked,
            "TapNumber" : keg.TapNumber
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add keg", keg.KegName, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", keg.KegName);
       }
    });
});
