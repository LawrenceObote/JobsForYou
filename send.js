const amqp = require("amqplib");
require("dotenv").config();

const queue = "job_postings";
const jobTitleAndLocation = "java engineer new york";

const sendMessage = async (message) => {
  let connection;
  console.log(" [x] Sent '%s'", message);
  try {
    connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue("job_postings", { durable: false });
    await channel.sendToQueue(
      "job_postings",
      Buffer.from(JSON.stringify(message))
    );
    console.log(" [x] Sent '%s'", message);
    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
};

exports.sendMessage = sendMessage;
