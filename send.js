const amqp = require("amqplib");
require("dotenv").config();

const queue = "job_postings";
const jobTitleAndLocation = "java engineer new york";

const sendMessage = async (queue, message) => {
  let connection;
  try {
    connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(" [x] Sent '%s'", message);
    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
};

exports.sendMessage = sendMessage;
