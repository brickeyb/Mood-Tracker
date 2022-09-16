//boiler plate code for database calls
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors()); // networking? always need
app.use(express.json()); // don't know this either


// access database
const db = mysql.createConnection({
    user: 'root', 
    host: 'localhost',
    password: 'password',
    database: 'mydb',
    multipleStatements: true
});


// add user input data to database
app.post('/inputData', (req, res) => {
    const mood = req.body.mood;
    const sleep = req.body.sleep;
    const alcohol = req.body.alcohol;
    const coffee = req.body.coffee;
    const vitamin = req.body.vitamin;
    const exercise = req.body.exercise;
    const chessScore = req.body.chessScore;
    //const date = req.body.timeStamp;

    db.query('INSERT INTO Mood_Entry (date, mood, sleep, alcohol, coffee, vitamin, exercise, chessscore) VALUES(CURDATE()-1,?,?,?,?,?,?, ?)', 
    [mood, sleep, alcohol, coffee, vitamin, exercise, chessScore],  (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    }
     );
})

// Summary Results from DB when user's mood is worst
// UPDATE MOOD = 1 ////////////////////////
app.get('/feelWorst', (req,res) => {
    db.query(
        `select
        AVG(sleep) as sleep
        , AVG(exercise) as exercise
        , AVG(alcohol) as alcohol
        , AVG(coffee) as coffee
        , AVG(vitamin) as vitamin
    from mydb.Mood_Entry
    where MOOD = 0`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            //console.log("res: " + result);
            //console.log("stringify: " + JSON.stringify(result))
            res.send(result)
        }
    })
})

// Summary Results from DB when user's mood is best
app.get('/feelBest', (req,res) => {
    db.query(
        `select
        AVG(sleep) as sleep
        , AVG(exercise) as exercise
        , AVG(alcohol) as alcohol
        , AVG(coffee) as coffee
        , AVG(vitamin) as vitamin
    from mydb.Mood_Entry
    where MOOD = 3`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            //console.log("res: " + result);
            //console.log("stringify: " + JSON.stringify(result))
            res.send(result)
        }
    })
})

// Summary Results from DB when user's chess performance is worst
app.get('/performWorst', (req,res) => {
    db.query(
        `select
        AVG(sleep) as sleep
        , AVG(exercise) as exercise
        , AVG(alcohol) as alcohol
        , AVG(coffee) as coffee
        , AVG(vitamin) as vitamin
    from mydb.Mood_Entry
    where CHESSSCORE < 0`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            //console.log("res: " + result);
            //console.log("stringify: " + JSON.stringify(result))
            res.send(result)
        }
    })
})

// Summary Results from DB when user's chess performance is best
app.get('/performBest', (req,res) => {
    db.query(
        `select
        AVG(sleep) as sleep
        , AVG(exercise) as exercise
        , AVG(alcohol) as alcohol
        , AVG(coffee) as coffee
        , AVG(vitamin) as vitamin
    from mydb.Mood_Entry
    where CHESSSCORE > 0`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            //console.log("res: " + result);
            //console.log("stringify: " + JSON.stringify(result))
            res.send(result)
        }
    })
})

//get entry dates from database for data validation
app.get('/getEntryDates', (req,res) => {
    db.query(
        `select DATE from mydb.Mood_Entry`, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("res: " + result);
            //console.log("stringify: " + JSON.stringify(result))
            res.send(result)
        }
    })
})

//add chess data to database
app.post('/addChess', (req, res) => {
    const rating = req.body.rating;
    const timestamp = req.body.timestamp;
    const date = req.body.date;

    db.query('INSERT INTO CHESS_SCORE (rating, timestamp, date) VALUES (?, ?, ?)', [rating, 
    timestamp, date], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Values Inserted")
        }
    })
})

//function get chess score performance metric 
//(the difference between yesterday and previous day's chess scores)
app.get('/chessScore', (req,res) => {
   
    //get yesterday's date to check yesterday's score
    let current = new Date();
       let yesterday = new Date(current);
       yesterday.setDate(yesterday.getDate()-1);
       let month = yesterday.getMonth()+1;
       let year = yesterday.getFullYear();
       let day = yesterday.getDate(); 
    let yesterdaysDate = `${year}/${month}/${day}`

    //get date before yesterday to compare scores
    let previous = new Date(current);
       previous.setDate(previous.getDate()-2);
       let prevMonth = previous.getMonth()+1;
       let prevYear = previous.getFullYear();
       let prevDay = previous.getDate();
    let previousDate = `${prevYear}/${prevMonth}/${prevDay}`

    //query database for difference between chess scores
    db.query(
        `SELECT (SELECT RATING FROM mydb.Chess_Score 
            WHERE TIMESTAMP = 
                (SELECT max(TIMESTAMP)from mydb.Chess_Score 
                where date = ?)) -
            (SELECT RATING FROM mydb.Chess_Score 
            WHERE TIMESTAMP = 
                (SELECT max(TIMESTAMP)from mydb.Chess_Score 
                where date = ?)) as RATING`, [yesterdaysDate, previousDate]
        ,
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("win");
            res.send(result[0].RATING.toString())
        }
    })

})

/*
//chessAPI 
const month = current.getMonth();
const year = current.getFullYear();
const chessURL = 'https://api.chess.com/pub/player/bubbsparx666/games/' + year +
     '/' + month + '';
// results from chess.com
app.get(chessUrl)
*/

app.listen(3001, ()=> {
    console.log("yay, your server is running on port 3001")
})