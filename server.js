var http= require('http');
var express= require('express');
var mysql=require('mysql');
const fs = require('fs');
var bodyParser =require('body-parser');
const fetch = require('node-fetch');
const url = require('url');
var module = require('module');
const axios = require("axios");
module.Module._extensions['.js'] = function(module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  module._compile(content, filename);
};


var dateFormat= require('dateformat');
var now= new dateFormat();

//include validation package 
const {check, validationResult}= require('express-validator');


//instaiting a node js ap
var app= express();

const con= mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'chatting'
});


app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

const siteTitle= 'Simple Application';
const baseURL='http://localhost:3000';

app.use('/js',express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname+'/node_modules/tether/dist/js'));
app.use('/js',express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'));

// list of all capsules
app.get("/", async (req, res) => {
    try {
      const result = await axios.get(
        `https://api.spacexdata.com/v3/capsules`
      );
      const repos = result.data.map((repo) => ({
        capsule_serial: repo.capsule_serial,
        capsule_id: repo.capsule_id,
        status: repo.status,
      }));
      res.render("pages/index", {
        siteTitle : siteTitle,
        pageTitle : 'Users List',
        items : repos
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("Error while getting list of repositories");
    }
});

// details of each capsule
app.get("/capsule/:id", async (req, res) => {
    let item;
    try {
      const result = await axios.get(`https://api.spacexdata.com/v3/capsules/C101`).then((Response)=>{
        item = Response.data;
      });
      res.render("pages/capsule", {
        siteTitle : siteTitle,
        pageTitle : 'Capsule Details',
        item
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("Error while getting list of repositories");
    }
});

// running the node server
var server = app.listen(3000,function(){
   console.log('your Application has been started!');
});

