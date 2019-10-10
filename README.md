# ucdavis-seminars

You must create a `.env` folder containing the following information:

```
ACCESSKEYID=...
SECRETACCESSKEY=...
PORT=8080
```

Make sure you create a DynamoDB table with SeminarID as the primary key inside AWS, you can do that by creating an AWS account for free.

ACCESKEYID must be the AWS access key id

SECRETACCESSKEY must be the AWS secret access key

PORT must be 8080 (because of the Dockerfile)
