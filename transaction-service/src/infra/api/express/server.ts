import dotenv from "dotenv";
import { app } from "./app";
import { assertQueues } from "./queues/AssertQueues";

dotenv.config();

const port = Number(process.env.PORT) || 3000;

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}.`);
  await assertQueues();
});
