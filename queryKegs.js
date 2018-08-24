var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();



var params = {
    TableName : "Kegs",
    KeyConditionExpression: "DateKicked = :str",
    ExpressionAttributeValues: {
        ":str": "unkicked",
    }
};

docClient.query(params, function(err, data) {
    console.log("querying unkicked");
    console.log(params);
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log(data);
        data.Items.forEach(function(item) {
            console.log(" -", item.KegName + ": " + item.DateTapped
            + " ... " + item.DateKicked);
        });
    }
});

params = {
    TableName : "Kegs",
    KeyConditionExpression: "DateKicked = :str and TapNumber = :num",
    ExpressionAttributeValues: {
        ":num": 1,
        ":str" : "unkicked"
    }
};

docClient.query(params, function(err, data) {
    console.log("querying tap number");
    console.log(params);
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log(data);
        data.Items.forEach(function(item) {
            console.log(" -", item.KegName + ": " + item.DateTapped
            + " ... " + item.TapNumber);
        });
    }
});