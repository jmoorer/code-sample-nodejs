const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  endpoint: new AWS.Endpoint("http://localhost:8000"),
  region: "us-west-2",
  // what could you do to improve performance?
});

const Joi = require("joi");

const tableName = "SchoolStudents";

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.schoolName
 * @param {string} event.studentId
 * @param {string} event.studentFirstName
 * @param {string} event.studentLastName
 * @param {string} event.studentGrade
 */
exports.handler = async (event) => {
  // TODO validate that all expected attributes are present (assume they are all required)
  // TODO use the AWS.DynamoDB.DocumentClient to save the 'SchoolStudent' record
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).

  //validation
  const schema = Joi.object({
    schoolId: Joi.string().required(),
    schoolName: Joi.string().required(),
    studentId: Joi.string().required(),
    studentFirstName: Joi.string().required(),
    studentLastName: Joi.string().required(),
    studentGrade: Joi.string().required(),
  });
  const {
    schoolId,
    schoolName,
    studentId,
    studentFirstName,
    studentGrade,
    studentLastName,
  } = event;

  const { value, error } = schema.validate({
    schoolId,
    schoolName,
    studentId,
    studentFirstName,
    studentGrade,
    studentLastName,
  });

  if (error) {
    throw new Error(result.error.details.map((e) => e.message).join(","));
  }

  return dynamodb
    .put({
      TableName: tableName,
      Item: value,
    })
    .promise();
};
