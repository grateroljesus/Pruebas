'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jsyaml = require('js-yaml');

const app = express();

// Health Check Middleware
const probe = require('kube-probe');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let configMap;
var hello= process.env.MESSAGE;
let message = hello+", %s!";


app.use('/api/greeting', (request, response) => {
  const name = (request.query && request.query.name) ? request.query.name : 'World';
  return response.send({content: message.replace(/%s/g, name)});
});


var fs = require('fs'),
configPath = '/opt/app-root/src/configs/config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
var storageConfig=  parsed;

const {MongoClient} = require('mongodb');
const uri = storageConfig.development.database.uri;
const DATABASE_NAME=storageConfig.development.database.database_name;
var collection_name = storageConfig.development.database.collection_name;
var collection="";

app.listen(5000, () => {
    MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        var database = client.db(DATABASE_NAME);
        collection = database.collection(collection_name);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});


app.get("/api/companies", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// set health check
probe(app);



module.exports = app;
