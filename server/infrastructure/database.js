const AWS = require("aws-sdk");
const dynamodb = require("aws-sdk/clients/dynamodb");
const redis = require("redis");
const uuid4 = require("uuid/v4");

AWS.config.accessKeyId = process.env.ACCESSKEYID;
AWS.config.secretAccessKey = process.env.SECRETACCESSKEY;

const client = new dynamodb.DocumentClient({
  region: "us-west-2"
});

const redisClient = new redis.createClient({ host: "redis" });
redisClient.on("error", err => {
  console.log(err);
});

const getAllSeminars = async () => {
  return await new Promise(resolve => {
    redisClient.get("seminars", (err, reply) => {
      if (reply === null) {
        client.scan(
          {
            TableName: "Seminars"
          },
          (err, seminars) => {
            if (err) {
              return resolve(err);
            }
            redisClient.setex("seminars", 60, JSON.stringify(seminars));
            return resolve(seminars);
          }
        );
      } else {
        return resolve(JSON.parse(reply));
      }
    });
  });
};

const insertNewSeminar = async payload => {
  try {
    await client
      .put({
        TableName: "Seminars",
        Item: {
          SeminarId: uuid4(),
          ...payload
        }
      })
      .promise();
  } catch (err) {
    return err;
  }
};

module.exports = {
  getAllSeminars,
  insertNewSeminar
};
