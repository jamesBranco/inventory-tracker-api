const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "EquipmentInventory";

exports.handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event));

  const method = event.requestContext?.http?.method;

  try {
    if (method === "GET") {
      return await getAllItems();
    }

    if (method === "POST") {
      const body = JSON.parse(event.body);
      return await createItem(body);
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: `Method ${method} not allowed` }),
    };
  } catch (err) {
    console.error("Error handling request:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

async function getAllItems() {
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.Items),
  };
}

async function createItem(item) {
  if (!item.name || !item.category) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "name and category are required" }),
    };
  }

  const newItem = {
    itemId: crypto.randomUUID(),
    name: item.name,
    category: item.category,
    quantity: item.quantity ?? 0,
    lastChecked: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: newItem,
    })
  );

  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  };
}
