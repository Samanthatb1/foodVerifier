const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT ;
app.listen(port, () => console.log("listening"));
app.use(express.static('public'));
app.use(express.json()); // Parses the JSON

// Loading the database
const database = new Datastore('foodDatabase.db');
database.loadDatabase();

// Adding the food searched into a database 
app.post('/foodData', (request, response) => {
    const data = request.body; 
    console.log(data);
    const timeStamp = Date.now();
    data.timestamp = timeStamp ;
    database.insert(data);
    response.send("Success");
}); 

// Sending the database to the client
app.get('/foodData', (request, response) => { 
    database.find({}, (err, docs) => {
        if (err){
            response.end();
            return;
        }
        response.json(docs); // Sending back
    })
});