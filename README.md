This is an example of using AWS Lambda-backed custom resource to Invoke Lambda functions when you create, update, or delete a stack

https://medium.com/@yia333/using-aws-cloudformation-macros-and-custom-resources-with-the-serverless-framework-ab7bb121d13d

### File Structure

- macro - Lambda macro to return LastUpdatedTime of stack
- nodejs - Lambda to add default post immediately after deployment

### Install Serverless Framework

```
$ npm install -g serverless
```

### Deploy CloudFormation macro

```
$ cd macro
$ npm install
$ sls deploy
```

### Deploy CloudFormation custom resource

```
 $ cd nodejs
 $ npm install
 $ sls deploy
```

Default post will be added to empty DynamoDb Posts table immediately after deployment
