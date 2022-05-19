import { createEntity, createFirestoreAdapter, createRouteHandler, Operation  } from 'express-oven';
import express, { json, raw, text, urlencoded, Request } from 'express';

const firebaseConfig = {
  apiKey: "AIzaSyBT5HQj-AFhbevXHqzx71Oi6z3yRItEJZ0",
  authDomain: "express-oven-test.firebaseapp.com",
  projectId: "express-oven-test",
  storageBucket: "express-oven-test.appspot.com",
  messagingSenderId: "618707235969",
  appId: "1:618707235969:web:eab802289e2279ef060980"
};

const app = express();

app.use(json(), raw(), text());
app.use(urlencoded({ extended: true }))

const usersAdapter = createFirestoreAdapter(
  firebaseConfig,
  'users',
  {
    idField: "uid",
    shouldUpdateCollection: true,
  })
const userEntity  = createEntity(usersAdapter, { idField: "uid" });
const getQuery = (req: Request) => ({
  age: {
    condition: Operation.SmallerThanOrEqual,
    value: req.query['age']
  }
});

app.get('/users', createRouteHandler(userEntity.readMany, { getQuery }));

const getEntityId = (req: Request) => req.params["id"];
app.get('/users/:id', createRouteHandler(userEntity.read, { getEntityId }));
app.post('/users', createRouteHandler(userEntity.create))
// app.put('/users', createRouteHandler(userEntity.update))
app.put('/users', createRouteHandler(userEntity.patch))
const port = process.env.PORT || 4469;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
