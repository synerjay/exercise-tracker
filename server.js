const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const crypto = require("crypto");
const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const registeredUsers = [];

app.post('/api/exercise/new-user', urlencodedParser, function(req, res) {
  const newUser = { "username": null, "_id": null };
  newUser["username"] = req.body["username"];
  newUser["_id"] = crypto.randomBytes(16).toString("hex");
  console.log(newUser);
  registeredUsers.push(newUser);
  console.log(registeredUsers);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(newUser));
})

app.get('/api/exercise/users', (req, res) => {
  res.send(registeredUsers);
});

const userLogArray = [];


app.post('/api/exercise/add', urlencodedParser, function(req, res) {
  console.log(req.body)
  const newLog = {
    "_id": null,
    "username": null,
    "date": null,
    "duration": null,
    "description": null
  };

const findUsername = (user) => {
  return user["_id"] === req.body["userId"];
}

  newLog["_id"] = req.body["userId"]
  newLog["username"] = registeredUsers.find(findUsername)["username"];
  if (req.body["date"] === undefined || req.body["date"] === "") {
    newLog["date"] = new Date().toDateString();
  } else {
    newLog["date"] = new Date(req.body["date"]).toDateString();
  }
  newLog["duration"] = parseInt(req.body["duration"], 10)
  newLog["description"] = req.body["description"]

  console.log(newLog)
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(newLog));

  //storing the data log

const findId = (user) => user["_id"] === req.body["userId"];

if(userLogArray.findIndex(findId) >= 0 ) {
  const logObject2 = {
  "description": null,
  "duration": null,
  "date": null
  }

  logObject2["description"] = req.body["description"]
  logObject2["duration"] = parseInt(req.body["duration"], 10)
  if (req.body["date"] === undefined || req.body["date"] === "") {
    logObject2["date"] = new Date().toDateString();
  } else {
    logObject2["date"] = new Date(req.body["date"]).toDateString();
  }

  userLogArray[userLogArray.findIndex(findId)]["log"].push(logObject2);
  userLogArray[userLogArray.findIndex(findId)]["count"] = userLogArray[userLogArray.findIndex(findId)]["log"].length;
  console.log(userLogArray)
  console.log(logObject2)
} else {

const newUserLog = {
  "_id": null,
  "username": null,
  "count": null,
  "log": []
}

newUserLog["_id"] = req.body["userId"];
  newUserLog["username"] = registeredUsers.find(findUsername)["username"];

const logObject = {
  "description": null,
  "duration": null,
  "date": null
  }

  logObject["description"] = req.body["description"]
  logObject["duration"] = parseInt(req.body["duration"], 10)
  if (req.body["date"] === undefined || req.body["date"] === "") {
    logObject["date"] = new Date().toDateString();
  } else {
    logObject["date"] = new Date(req.body["date"]).toDateString();
  }

  
newUserLog["log"].push(logObject);
newUserLog["count"] = newUserLog["log"].length;
userLogArray.push(newUserLog);

console.log(newUserLog);
console.log(userLogArray);

}

})



app.get('/api/exercise/log', (req, res) => {

const logData = userLogArray.find((user) => {
  return user["_id"] === req.query["userId"];
});

  if (Object.keys(req.query).length === 1) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(logData));
  } else {
    const logDataCopy = {
      "_id":null,
      "username": null,
      "from": null,
      "to": null,
      "count": null,
      "log":[]
    }
    const fromDate = new Date(req.query["from"]).toDateString();
    const toDate = new Date(req.query["to"]).toDateString();
    const limit = parseInt(req.query["limit"], 10);

    logDataCopy["_id"] = logData["_id"];
    logDataCopy["username"] = logData["username"];
    logDataCopy["log"] = logData["log"];
    logDataCopy["from"] = fromDate;
    logDataCopy["to"] = toDate;

    const arrayLogUser = logDataCopy["log"];

    const newarrayLogUser = arrayLogUser.filter((log)=> log.date === fromDate || toDate);

    console.log(logDataCopy);

    if (req.query.hasOwnProperty('limit')) {
       const limitedArray = newarrayLogUser.slice(0, limit);
       logDataCopy["log"] = limitedArray;
       logDataCopy["count"] = logDataCopy["log"].length;
       
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(logDataCopy));
        console.log(logDataCopy);
    } else {
      logDataCopy["log"] = newarrayLogUser;
      logDataCopy["count"] = logDataCopy["log"].length
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(logDataCopy));
      console.log(logDataCopy);
    //new Date(req.query["from"]).toDateString()
    }

  }

});

// /api/exercise/log?userId=4bc99b58f1debfc741a0c05965326a8c&from=2021-01-31&to=2021-01-31&limit=2

// /log?userId=6013db730aa40e05f2b89957&from=1995-09-09&to=1995-09-09&limit=2

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
