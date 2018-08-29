var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var queryTable = function queryTable(queryParams) {
    return docClient.query(queryParams).promise();
};

var outputError = function (err) {
    console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
}

// query current keg
// takes TapNumber as input. 
// In case of single tap system, defaults is tap 1.
var currentKeg = function(TapNumber = 1) {
    params = {
        TableName : "Kegs",
        KeyConditionExpression: "DateKicked = :str and TapNumber = :d",
        ExpressionAttributeValues: {
            ":str": 'unkicked',
            ":d" : TapNumber
        }
    }
    return queryTable(params);
}

// query keg by name
// takes KegName and DateKicked as inputs. 
var kegByName = function(KegName, DateKicked = undefined, OnlyKicked = false) {
    params = {
        TableName : "Kegs",
        IndexName: "KegName-index",
        KeyConditionExpression: "KegName = :str",
        ExpressionAttributeValues: {
            ":str": KegName,
        }
    }
    if (DateKicked != undefined &&  !OnlyKicked) {
        params.KeyConditionExpression += " and DateKicked = :date"
        params.ExpressionAttributeValues[":date"] = DateKicked;
    }
    return queryTable(params);
}

//var curkeg = currentKeg().then(data => {
//    console.log('Read table succeeded!', data);
//}).catch(outputError);;
var bod = kegByName("Boddington's").then(data => {
       console.log('Read table succeeded!', data);
    }).catch(outputError);;
