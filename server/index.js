require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const urlAddress = require('./models/urlAddress');
const path = require("path");
const port = process.env.PORT;
const app = express();

mongoose.connect('mongodb://localhost:27017/url', {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(cors());

app.use(express.json());


/////////////////////////////////////////////////////deployment///////////////////////////////////////////////////////////
__dirname = path.resolve("../");
console.log("dirname is " + __dirname);
console.log("process.env.NODE_ENV is " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "production"){
    console.log("heyyyyyyyyyyyyy");
    app.use(express.static(path.join(__dirname, '/client/build')));

    app.get('*', (req, res)=>{
        //res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        res.sendFile(path.join(__dirname, '/client/build/index.html'));
    });
}
else {
    /*"heroku-postbuild": "NPM_CONFIG_PRODUCTION=FALSE npm install --prefix client && npm run build && --prefix client"*/
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/db', async (req, res) => {

    const userid = req.body.userid;
    console.log("userId is " + userid);
    try {
        const foundDocuments = await urlAddress.find({
            userId : userid
        });
        console.log(foundDocuments);
        console.log("foundDocuments[1] is " + foundDocuments[1]);
        if (foundDocuments.length > 0){
            //console.log("foundDocuments is " + foundDocuments);
            return res.send([...foundDocuments]);
        }
        else {
            return res.send(["null"]);
        }

    }
    catch(error){
        console.log(error);
    }
})

app.post('/api/url', async (req, res)=> {
    console.log("in post req");
    const originalURL = req.body.originalUrl;
    const shortURL = req.body.shortUrl;
    const date = req.body.date;
    const time = req.body.currTime;
    const userId = req.body.userId;
    console.log("in /api/url: userId is " + req.body.userId);
    try {
        const addressDocument = await urlAddress.findOne({
            originalUrl : originalURL
        });
        if (addressDocument === null){

            const newAdress = new urlAddress({
                originalUrl : originalURL,
                shortUrl : shortURL,
                date : date,
                currTime : time,
                userId : userId
            });
            try {
                await newAdress.save();
                console.log("document was saved.");
                res.json({success : true, message : "document was successfully created in DB."})
            }
            catch (error){
                console.log("failed to save this document: " + error);
            }
        }
        else {
            res.json({success : true, message : "Document is already in DB"});
        }
    
    }
    catch (err){
        console.log(err);
    }
});

app.get('/:shortUrl', async (req, res)=> {
    console.log("i am here");
    try {
        const foundDoc = await urlAddress.findOne({
            shortUrl : req.params.shortUrl
        });
        if (foundDoc){
            console.log("doc was found");
            res.redirect(foundDoc.originalUrl);
        }
        else {
            res.send("404! Page not found!");
        }
        
    }
    catch (err){
        console.log("This url was not found in the database");
    }    
});

app.listen(port, (req, res)=> {
    console.log(`Hello! You are listening to port ${port}.`);
});