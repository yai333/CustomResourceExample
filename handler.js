"use strict";
const AWS = require("aws-sdk");
var response = require("cfn-response");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.AddDefaultPost = async (event, context) => {
  console.log("AddDefaultPost");
  const Key = event.ResourceProperties.Key;
  var responseData = { UUID: Key };
  return response.send(event, context, response.SUCCESS, responseData);
};

module.exports.SetDefaultSiteConfig = async (event, context) => {
  console.log("SetDefaultSiteConfig");
  const Key = event.ResourceProperties.Key;
  var responseData = { UUID: Key };
  return response.send(event, context, response.SUCCESS, responseData);
};
