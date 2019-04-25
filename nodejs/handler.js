"use strict";
const AWS = require("aws-sdk");
const axios = require("axios");
const uuid = require("uuidv4");
const dynamodb = new AWS.DynamoDB();

module.exports.addDefaultPost = async (event, context) => {
  console.log("Invoking AddDefaultPost" + new Date());
  if (event.RequestType === "Delete") {
    return sendResponse(event, context, "SUCCESS");
  }
  const stackLastUpdatedTime = event.ResourceProperties.StackLastUpdatedTime;
  const responseData = {
    LastUpdatedTime: stackLastUpdatedTime.LastUpdatedTime
  };
  try {
    const scanTableParams = {
      TableName: process.env.POSTS_TABLE_NAME
    };
    const tableData = await dynamodb.scan(scanTableParams).promise();

    if (tableData && tableData.Items && tableData.Items.length === 0) {
      const id = uuid();
      const defaultPostParams = {
        Item: {
          id: {
            S: id
          },
          title: {
            S: "Welcome to simpleCMS"
          },
          author: {
            S: "Admin"
          },
          content: {
            S: `Welcome to simpleCMS. The blog you just visited
             is powered by simpleCMS, an easy and powerful way to start blogging.`
          }
        },
        ReturnConsumedCapacity: "NONE",
        TableName: process.env.POSTS_TABLE_NAME
      };
      await dynamodb.putItem(defaultPostParams).promise();
    }
    await sendResponse(event, context, "SUCCESS", responseData);
  } catch (err) {
    console.log("Error", err);
    await sendResponse(event, context, "FAILED");
  }
  return;
};

const sendResponse = async (
  event,
  context,
  responseStatus,
  responseData,
  physicalResourceId
) => {
  const reason =
    responseStatus == "FAILED"
      ? "See the details in CloudWatch Log Stream: " + context.logStreamName
      : undefined;

  const responseBody = JSON.stringify({
    StackId: event.StackId,
    RequestId: event.RequestId,
    Status: responseStatus,
    Reason: reason,
    PhysicalResourceId: physicalResourceId || context.logStreamName,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData
  });

  const responseOptions = {
    headers: {
      "Content-Type": "",
      "Content-Length": responseBody.length
    }
  };

  console.info("Response body:\n", responseBody);

  try {
    await axios.put(event.ResponseURL, responseBody, responseOptions);
    console.info("CloudFormationSendResponse Success");
  } catch (error) {
    console.error("CloudFormationSendResponse Error:");
    if (error.response) {
      console.error(error.response);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    console.error(error.config);
    throw new Error("Could not send CloudFormation response");
  }
};
