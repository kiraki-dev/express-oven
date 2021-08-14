import { createExpressOvenRoutes } from 'express-oven';
import * as express from 'express';

const app = express();

app.use(createExpressOvenRoutes());

const port = process.env.PORT || 4469;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
