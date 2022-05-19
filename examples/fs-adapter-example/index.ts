import { createEntity, createFsAdapter, createRouteHandler, Operation } from 'express-oven';
import express, { json, raw, Request, Response, text, urlencoded } from 'express';

const app = express();

app.use(json(), raw(), text());
app.use(urlencoded({ extended: true }))

const usersAdapter = createFsAdapter(
  './data/users.json',
  {
    idField: "uid",
    idFieldType: "number",
    shouldUpdateFile: true,
  })
const userEntity  = createEntity(usersAdapter, { idField: "uid" });

const getQuery = (req: Request) => ({
  age: {
    condition: Operation.GreaterThan,
    value: req.query['age']
  }
});

app.get('/users', createRouteHandler(userEntity.readMany, { getQuery }));

const getEntityId = (req: Request) => req.params["id"];
app.get('/users/:id', createRouteHandler(userEntity.read, { getEntityId }));
app.post('/users', createRouteHandler(userEntity.create));
// app.put('/users', createRouteHandler(userEntity.update));
app.put('/users', createRouteHandler(userEntity.patch));

const port = process.env.PORT || 4469;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
