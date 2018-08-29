var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();


//docClient.query(params, function(err, data) {
//    console.log("querying unkicked");
//    console.log(params);
//    if (err) {
//        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
//    } else {
//        console.log("Query succeeded.");
//        console.log(data);
//        data.Items.forEach(function(item) {
//            console.log(" -", item.KegName + ": " + item.DateTapped
//            + " ... " + item.DateKicked);
//        });
//    }
//});

//docClient.query(params, function(err, data) {
//    console.log("querying tap number");
//    console.log(params);
//    if (err) {
//        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
//    } else {
//        console.log("Query succeeded.");
//        console.log(data);
//        data.Items.forEach(function(item) {
//            console.log(" -", item.KegName + ": " + item.DateTapped
//            + " ... " + item.TapNumber);
//        });
//    }
//});


//docClient.query(params, function(err, data) {
//    console.log("querying tap number");
//    console.log(params);
//    if (err) {
//        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
//    } else {
//        console.log("Query succeeded.");
//        console.log(data);
//        data.Items.forEach(function(item) {
//            console.log(" -", item.KegName + ": " + item.DateTapped
//            + " ... " + item.TapNumber);
//        });
//    }
//});

var queryTable = function queryTable(queryParams) {
    return docClient.query(queryParams).promise();
};

//var outputSuccess = function (data) {
//    console.log("Query succeeded.");
//    console.log(data);
//    if (data.Count == 0) {
//        console.log("No results returned.");
//    } else {
//        console.log(data.Items[0].KegName)
//    }
//};

var outputError = function (err) {
    console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
}

// query current keg
var currentKeg = function(TapNumber) {
    params = {
        TableName : "Kegs",
        KeyConditionExpression: "DateKicked = :str and TapNumber = :d",
        ExpressionAttributeValues: {
            ":str": 'unkicked',
            ":d" : TapNumber
        }
    }
    queryTable(params).then(data => {
        console.log('Read table succeeded!', data);
    }).catch(outputError);
}

var curkeg = currentKeg(4);
console.log("curkeg = " + curkeg);