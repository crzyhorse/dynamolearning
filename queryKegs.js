var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for latest unkicked keg");

var params = {
    TableName : "Kegs",
    IndexName : "DateKicked-index",
    KeyConditionExpression: "DateKicked = :str",
    ExpressionAttributeValues: {
        ":str": "unkicked",
    }
};

docClient.query(params, function(err, data) {
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
