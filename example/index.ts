import { createExpressOvenRoutes } from 'express-oven';
import express, { json, raw, text, urlencoded } from 'express';
import { createEntity, createFsAdapter, createRouteHandler } from "../src";

const app = express();

app.use(json(), raw(), text());
app.use(urlencoded({ extended: true }))

// app.use(createExpressOvenRoutes());
const usersAdapter = createFsAdapter(
  './data/users.json',
  {
    idField: "uid",
    idFieldType: "number",
    shouldUpdateFile: true,
  })
const userEntity  = createEntity(usersAdapter, { idField: "uid" });
app.get('/users', createRouteHandler(userEntity.readMany))
app.get('/users/:id', createRouteHandler(() => userEntity.read({ paramMatch: { "uid": "id" } })))
app.post('/users', createRouteHandler(userEntity.create))
// app.put('/users', createRouteHandler(userEntity.update))
app.put('/users', createRouteHandler(userEntity.patch))
const port = process.env.PORT || 4469;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
