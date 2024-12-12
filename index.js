import { app } from "./src/app.js";
import { connectToBroker } from "./src/mqtt/mqttHelper.js";

const PORT = process.env.PORT ?? 3000

connectToBroker()

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
