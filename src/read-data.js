const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  endpoint: new AWS.Endpoint("http://localhost:8000"),
  region: "us-west-2",
  // what could you do to improve performance?
});

const tableName = "SchoolStudents";
const studentLastNameGsiName = "studentLastNameGsi";

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.studentId
 * @param {string} [event.studentLastName]
 */
exports.handler = async (event) => {
  // TODO use the AWS.DynamoDB.DocumentClient to write a query against the 'SchoolStudents' table and return the results.
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).

  // TODO (extra credit) if event.studentLastName exists then query using the 'studentLastNameGsi' GSI and return the results.

  // TODO (extra credit) limit the amount of records returned in the query to 5 and then implement the logic to return all
  //  pages of records found by the query (uncomment the test which exercises this functionality)

  const params = {
    TableName: tableName,
    KeyConditionExpression: "schoolId = :schoolId",
    ExpressionAttributeValues: {
      ":schoolId": event.schoolId,
    },
    Limit: 5,
  };
  if (event.studentId) {
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND studentId = :studentId`;
    params.ExpressionAttributeValues[":studentId"] = event.studentId;
  }
  //use gsi to search
  if (event.studentLastName) {
    params.IndexName = "studentLastNameGsi";
    params.KeyConditionExpression = "studentLastName = :studentLastName";
    params.ExpressionAttributeValues = {
      ":studentLastName": event.studentLastName,
    };
  }

  return queryItems(params);
};

//recusive call to get all items
const queryItems = async (params) => {
  const { Items, LastEvaluatedKey } = await dynamodb.query(params).promise();
  if (LastEvaluatedKey) {
    return [
      ...Items,
      ...(await queryItems({
        ...params,
        ExclusiveStartKey: LastEvaluatedKey,
      })),
    ];
  }
  return Items;
};
