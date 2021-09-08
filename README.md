# express-oven

An easy mock API generator with express.js

[![NPM][npm-image]][npm-link]
[![Minzipped Bundle Size][bundlephobia-image]][bundlephobia-link]

## Install

with npm
```
npm i -s express-oven
```

with yarn
```
yarn add express-oven
```

## Usage

In the main file (JavaScript/TypeScript)
```javascript
import { createExpressOvenRoutes } from 'express-oven';
import express, { json, raw, text, urlencoded } from 'express';

const app = express();

// this is done to parse the requst body
app.use(json(), raw(), text());
app.use(urlencoded({ extended: true }))

// either pass the config object or config json path or have oven.configs.json5 file in the directory
// this example is with the last option
app.use(createExpressOvenRoutes());

const port = process.env.PORT || 4469;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

```

oven.configs.json5
```json5
{
  "defaultConfigs": { // this will be used in case some configs were not provide in the method config
    "save": false, 
    "returnEntity": false,
    "delay": 300, // response is delayed by that much ms
  },
  "apis": {
    "/api/users": {
      "get": { // method config
        "dataJsonPath": "./data/users.json", // the given file in the given directory needs to be existed with some data in it otherwise this will raise an error.
        "operation": "read", // this is to specify the operation. Can be one of these: create, read, update, path, delete
        "readOne": false, // this flag is to tell oven how many items to read. If true will read one, otherwise multiple
        "delay": 300, // can be provided here for separate delays, if not provided will be delayed by the number in the defaultConfigs
      },
      "post": {
        "operation": "create",
        "dataJsonPath": "./data/users.json",
        "uidField": { // tell the oven what is the key of the uidField for the creating item.
          "name": "uid",
          "type": "number"
        },
        "save": true, // if true the file given in the dataJsonPatch will be overwritten.
        "returnEntity": true // if true the server will return the changed item
      }
    },
    "/api/users/:userUid": {
      "get": {
        "operation": "read",
        "dataJsonPath": "./data/users.json",
        "readOne": true, // this flag is to tell oven how many items to read. If true will read one, otherwise multiple
        "paramMatch": { // this tells oven which param in the request to match with what property in the item.
          "userUid": "uid"
        }
      },
      "put": {
        "operation": "update",
        "dataJsonPath": "./data/users.json",
        "returnEntity": true,
        "save": true,
        "paramMatch": {
          "userUid": "uid"
        }
      },
      "delete": {
        "operation": "delete",
        "dataJsonPath": "./data/users.json",
        "save": true,
        "paramMatch": {
          "datasetId": "id"
        }
      }
    }
  }
}

```

## License

MIT © [kiraki.dev][github-kiraki-dev]

[npm-image]: https://img.shields.io/npm/v/express-oven.svg
[npm-link]: https://www.npmjs.com/package/express-oven
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/express-oven
[bundlephobia-link]: https://bundlephobia.com/result?p=express-oven
[github-kiraki-dev]: https://github.com/kiraki-dev
