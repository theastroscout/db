# DB
Work with MongoDB and MySQL through the simple connector.

## Installation
```
npm install @hqdaemon/db
```

## Usage
```js
let hqDB = require("@hqdaemon/db");
let options = {};
let db = await hqDB(options);
```

## Options
Field | Value
-- | --
type | string "mongo" or "mysql"
database | string "DB_NAME"
host | string (default "localhost")
port | int (MongoDB default 27017)
connectionLimit | int (MySQL default 5)
user | string
password | string

<br/>
<br/>

# Mongo
```js
let options = {
	type: "mongo"
};

let mongo = await hqDB(options);
// Return MongoClient
```

### Base methods
See full documentation on [MongoDB](https://www.npmjs.com/package/mongodb)
```js
let db = await mongo.db("DB_NAME");
let collection = await db.collection("COLLECTION_NAME");
let resultOn = await collection.findOne({});
let result = await collection.find({});
mongo.close();
```

<br/>
<br/>

# MySQL
Connection pools help reduce the time spent connecting to the MySQL server by reusing a previous connection, leaving them open instead of closing when you are done with them.

See full documentation on [MySQL2](https://www.npmjs.com/package/mysql2)

```js
let mysql = await hqDB({
	type: "mysql",
	database: "DB_NAME",
	user: "USER_NAME",
	password: "PASSWORD",
	connectionLimit: 2
});
```

### Return
```js
{
	"type": "mysql",
	"database": "DB_NAME",
	"user": "USER_NAME",
	"connectionLimit": 2,
	"pool": Pool
}
```

### Base methods
```js
let result = await mysql.query("YOUR_QUERY",[]); // Sync
mysql.query("YOUR_QUERY", [], function(err,result){}); // Async
mysql.pool.end();
```


<br />
<br />
<br />
<br />

## MIT License

Copyright (c) HQ • [hqmode.com](https://hqmode.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.