import generateOvenExpress from 'express-oven';
import * as express from 'express';
const config = require("./example.config.json5");

const app = express();

app.use(generateOvenExpress(config));

const port = process.env.PORT || 4469;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
