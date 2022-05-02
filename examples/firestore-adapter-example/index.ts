import { createEntity, createFirestoreAdapter, createRouteHandler  } from 'express-oven';
import express, { json, raw, text, urlencoded } from 'express';
import firebase from 'firebase/compat/app';


// const firebaseConfig = {
//   apiKey: "AIzaSyBT5HQj-AFhbevXHqzx71Oi6z3yRItEJZ0",
//   authDomain: "express-oven-test.firebaseapp.com",
//   projectId: "express-oven-test",
//   storageBucket: "express-oven-test.appspot.com",
//   messagingSenderId: "618707235969",
//   appId: "1:618707235969:web:eab802289e2279ef060980"
// };

// firebase.initializeApp(firebaseConfig);


const app = express();

app.use(json(), raw(), text());
app.use(urlencoded({ extended: true }))

const usersAdapter = createFirestoreAdapter(
  'users',
  {
    idField: "uid",
    ց: true,
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
