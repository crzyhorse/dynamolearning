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
        // This will store information about the currently tapped keg, as well as past kegs.
        TableName : "Kegs",
        KeySchema: [       
            {   AttributeName: "KegName", // partition key
                KeyType: "HASH"
            },   
            {  
                AttributeName: "DateTapped", // sort key
                KeyType: "RANGE"
            }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'DateKicked-index',
                KeySchema: [
                    {
                        AttributeName: 'DateKicked',
                        KeyType: 'HASH'
                    },
                    {
                        AttributeName: 'KegName',
                        KeyType: 'RANGE'
                    }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                },
                Projection: {
                    ProjectionType: 'ALL'
                }
            },
            {
                IndexName: 'TapNumber-index',
                KeySchema: [
                    {
                        AttributeName: 'TapNumber',
                        KeyType: 'HASH'
                    },
                    {
                        AttributeName: 'KegName',
                        KeyType: 'RANGE'
                    }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                },
                Projection: {
                    ProjectionType: 'ALL'
                }
            }
        ],
        AttributeDefinitions: [       
        { 
                AttributeName: "KegName", 
                AttributeType: "S" 
            },
            {
                AttributeName: "DateKicked", 
                AttributeType: "S"
            },
            {   
                AttributeName: "DateTapped",
                AttributeType: "S"
            },
            {
                AttributeName: "TapNumber",
                AttributeType: "N"
            }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    },
    {
        // This will store information about each pour.
        TableName: 'Pour',
        KeySchema: [
            {
                AttributeName: 'PourTime',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'Pourer',
                KeyType: 'RANGE'
            }
        ],
    //    GlobalSecondaryIndexes: [{
    //            IndexName: 'Pour-index',
    //            KeySchema: [
    //                {
    //                    AttributeName: 'ImageId',
    //                    KeyType: 'HASH'
    //                },
    //                {
    //                    KeyType: 'RANGE'
    //                    AttributeName: 'Tag',
    //                }
    //            ],
    //            Projection: {
    //                ProjectionType: 'KEYS_ONLY'
    //            },
    //            ProvisionedThroughput: {
    //                ReadCapacityUnits: 1,
    //                WriteCapacityUnits: 1
    //            }
    //        }
    //    ],
    //    LocalSecondaryIndexes: [{
    //            IndexName: 'VoteCount-index',
    //            KeySchema: [
    //                {
    //                    AttributeName: 'Tag',
    //                    KeyType: 'HASH'
    //                },
    //               {
    //                    AttributeName: 'VoteCount',
    //                    KeyType: 'RANGE'
    //                }
    //            ],
    //            Projection: {
    //                ProjectionType: 'ALL'
    //            }
    //        }
    //    ],
        AttributeDefinitions: [
            {
                AttributeName: 'PourTime',
                AttributeType: 'S'
            },
            {
                AttributeName: 'Pourer',
                AttributeType: 'S'
            },
        ],
        ProvisionedThroughput:  {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    }
];
//console.log("Creating the Kegs table");
//dynamodb.createTable(KegTable, function(err, data) {
//    if (err) {
//        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//    } else {
//        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
//    }
//});

// This CreateTable request will create the Pour table.
// This will store information about each pour.


//console.log("Creating the Pour table");
//dynamodb.createTable(PourTable, function(err, data) {
//    if (err) {
//        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//    } else {
//        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
//    }
//});
console.log("listing tables");
dynamodb.listTables({}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
}); 



//createTable(dynamodb,KegTable);
//createTable(dynamodb,PourTable);

var createTable = function createTable(tableData) {
    return Promise.all(tableData.map(function(table) {
        var params = table;
        return dynamodb.createTable(params).promise();
    })
    );
};

var outputSuccess = function outputSuccess(tables) {
    var name = tables.map(function(table) {
        return table.TableName;
    });
    console.log("Succesfully created: " + name)
}

createTable(tables)
    .then(outputSuccess.bind(null,tables))
    .catch(console.error.bind(console));