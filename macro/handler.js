"use strict";

const AWS = require("aws-sdk");
const cloudformation = new AWS.CloudFormation();

module.exports.getStackLastUpdatedTime = async (event, context) => {
  const StackName = `${event.params.stackName}`;
  const params = {
    StackName
  };
  try {
    const data = await cloudformation.describeStacks(params).promise();
    return {
      requestId: event["requestId"],
      status: "success",
      fragment: { LastUpdatedTime: data.Stacks[0].LastUpdatedTime }
    };
  } catch (error) {
    console.log("Error", error);
    return {
      requestId: event["requestId"],
      status: "failed",
      fragment: { LastUpdatedTime: "" }
    };
  }
};
