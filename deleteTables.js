// you will need an IAM account setup with permissions 
// for DynamoDB, Alexa Skills Kit, AWS IOT, and Lambda
var AWS = require("aws-sdk");

//edit the below to reflect your desired region and endpoint
//this is currently setup for DynamoDB local db for testing.
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();


var tables = [
    {
        TableName : "Kegs"
    },
    {
        TableName : "Pour"
    },
];

var deleteTable = function deleteTable(tableData) {
    return Promise.all(tableData.map(function(table) {
        var params = table;
        return dynamodb.deleteTable(params).promise();
    })
    );
};
 
var outputSuccess = function outputSuccess(tables) {
    var name = tables.map(function(table) {
        return table.TableName;
    });
    console.log("Succesfully deleted: " + name)
}

deleteTable(tables)
    .then(outputSuccess.bind(null,tables))
    .catch(console.error.bind(console));