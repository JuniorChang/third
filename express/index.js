const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil");
const { Db } = require("mongodb");
const { default: axios } = require("axios");

const MONGO_URL = process.env.MONGO_URL;

let app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json())
app.use(cors())

// add routes here

async function main() {
    let db = await MongoUtil.connect(process.env.MONGO_URL, "playerData");

    app.post('/addplayer', async function (req, res) {

        try {
            let name = req.body.name;
            let role = req.body.role;
            let server = req.body.server;
            let status = req.body.status;
            let items = req.body.items;
            let db = MongoUtil.getDB();
            let result = await db.collection('tesingTwo').insertOne({
                'name': name,
                'role': role,
                'server': server,
                'status': status,
                'items': items
            })
            res.status(200);
            
            res.json({
                'insertedId': result.insertedId
            });
            
            
            

        } catch (e) {
            console.log(e);
            res.status(500);
            res.json({
                'error': e
            })
        }
        // res.redirect('/showplayer');
    })

    app.get('/showplayer', async function (req, res) {
        let db = MongoUtil.getDB();
        let results = await db.collection('tesingTwo').find({}).join("");
        res.json(results);
    })


    app.get('/players/search', async function (req, res) {
        let critera = {};

        if (req.query.description) {
            critera['description'] = { $regex: req.query.description, $options: 'i' };
        }
        if (req.query.playerData) {
            critera[''] = { $regex: req.query.playerData, $options: 'i' }
        }
        console.log(critera);
        let db = MongoUtil.getDB();
        let results = await db.collection('').find(critera).toArray();
        res.json(results);
    })


    //Start of edit Data 
    app.put('/showplayer/:playerid/update', async function(req,res){        
        let db = MongoUtil.getDB();
        let results = await db.collection('tesingTwo').updateOne({
            '_id': ObjectId(req.params.playerid)
        },{
            '$set':{
                'name':req.body.name,
                'role':req.body.role,
                'server':req.body.server,
                'status':req.body.status,
                'items':req.body.items
            }
        })
        res.json(results);
    })
    // End of Edit data

    // Start of Delete
    app.delete('/showplayer/:playerid', async function (req, res) {
        // let id = req.params.playerid;
        let db = MongoUtil.getDB();
        let results = await db.collection('tesingTwo').remove({
            "_id": ObjectId(req.params.playerid)
        })
        res.json(results);
        console.log(results);
        
    })



    app.get('/', function (req, res) {
        res.send("<h1>Hello from Express</h1>");
    })

    app.listen(process.env.PORT || 3000, () => {
        console.log("Server started")
    })
}
main();
