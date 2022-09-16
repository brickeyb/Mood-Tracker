import './App.css';
import React, {useState} from "react";
import Axios from 'axios';
import axios from 'axios';


///QUESTIONS
/// BEST WAY TO PULL INITIAL DATA (entryDates, previous chess scores)
/// Timing issues - entryDates isn't finished when next line of code runs

function App() {

  //const [timeStamp, setTimeStamp] = useState('0000-00-00 00:00:00')
  
  //variables for user entry
  const [mood, setMood] = useState(2);
  const [sleep, setSleep] = useState(0);
  const [alcohol, setAlcohol] = useState(0);
  const [coffee, setCoffee] = useState(0);
  const [vitamin, setVitamin] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [chessScore, setChessScore] = useState(0);

  //results from database
  const [show, setShow] = useState(false);
  const [feelWorst, setFeelWorst] = useState([]);
  const [feelBest, setFeelBest] = useState([]);
  const [performWorst, setPerformWorst] = useState([]);
  const [performBest, setPerformBest] = useState([]);

  // used to store date of previous entries for data validation
  const [entryDates, setEntryDates] = useState([]);

  //date data 
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  const current = new Date();
  let yesterday = new Date(current);
        yesterday.setDate(yesterday.getDate()-1);
        let month = yesterday.getMonth();
        let year = yesterday.getFullYear();
        let date = yesterday.getDate(); 
  //const year = current.getFullYear();
  //const date = current.getDate();
  //const month = current.getMonth();
  //const time = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

  //const submitDate = `${year}-${month}-${date} ${time}`;
  const displayDate = `${monthNames[month]} ${date} ${year}`;
  const checkDate = `${year}-${month<10?`0${month+1}`:`${month+1}`}-${date<10?`0${date}`:`${date}`}T07:00:00.000Z`;
  
  /*
  //CHESSAPI call - pulls all chess scores for current month and adds to database 
  ////////IS THERE AN ISSUE WITH RUNNING THIS TOO OFTEN???////////////
  const chessURL = `https://api.chess.com/pub/player/bubbasparx666/games/${year}/${month<10?`0${month+1}`:`${month+1}`}`
  //const chessURL = `https://api.chess.com/pub/player/bubbasparx666/games/2022/09`
  axios.get(chessURL).then((response)=> {
    const json = response.data;

    //log my rating, date, & timestamp for all "Bullet" chess games
    for (let i=0; i<json.games.length; i++) {
      if (json.games[i].time_class === 'bullet') {
        
        let timestamp = json.games[i].end_time; //game timestamp
        //convert timestamp to date format
          let date = new Date(timestamp * 1000);
          let month = date.getMonth()+1;
          let year = date.getFullYear();
          let day = date.getDate();
        let dateOutput = `${year}/${month}/${day}` //game date
        
        //get chess rating & add to database
        if (json.games[i].black.username === 'bubbasparx666') {
          let rating = json.games[i].black.rating; // game rating
          //add to database
          Axios.post('http://localhost:3001/addChess', {
            rating: rating, 
            timestamp: timestamp,
            date: dateOutput
          }).then(()=> {console.log("success")}).catch((error) => console.log(error));
          
        } else {
          let rating = json.games[i].white.rating; // game rating
          //add to database
          Axios.post('http://localhost:3001/addChess', {
            rating: rating, 
            timestamp: timestamp,
            date: dateOutput
          }).then(()=> {console.log("success")}).catch((error) => console.log(error));
        }
      }
    }

  }).catch(err=>console.log(err));
 
  */


  //get latest chess score to check performance progress
  const getChessScore = () => {
    //axios get data
    Axios.get('http://localhost:3001/chessScore').then((response)=> {
      setChessScore(response.data);
    });
  }


  // add user inputs to database
  const addEntry = () => {
    console.log("test");

    //REMOVED FROM FUNCTION BECAUSE OF TIMING ISSUE
    //get previous entry dates for data validation
    Axios.get('http://localhost:3001/getEntryDates').then((response)=> {
      setEntryDates(response.data);
      console.log("entrydates: " + entryDates);
    });
    console.log(entryDates);
    //check if today's entry has already been made
    entryDates.forEach(key => {
      if (key.DATE === checkDate) {
        console.log(key.DATE);
        console.log("found");
        alert(`Today's entry has already been made, try again tomorrow`);
      return;
      }
    });
    
    //get today's chess score to add to database
    getChessScore();

    //add user entries to database
    Axios.post('http://localhost:3001/inputData', {
    //timeStamp: timeStamp,
      mood: mood, 
      sleep: sleep,
      alcohol: alcohol,
      coffee: coffee,
      vitamin: vitamin,
      exercise: exercise,
      chessScore: chessScore
    }).then(()=> {
      console.log("success");
    });
    
  };

  //get summary results from database to display to user
  const getResults = () => {
    Axios.get('http://localhost:3001/feelWorst').then((response)=> {
      setFeelWorst(response.data[0]);
      //console.log("feelWorst: " + feelWorst);
    });
    Axios.get('http://localhost:3001/feelBest').then((response)=> {
      setFeelBest(response.data[0]);
    });
    Axios.get('http://localhost:3001/performWorst').then((response)=> {
      setPerformWorst(response.data[0]);
    });
    Axios.get('http://localhost:3001/performBest').then((response)=> {
      setPerformBest(response.data[0]);
    });

    setShow(true); //make results visible to user
  };


  return (
    <div className="App">
      <div className="information">
        <h1>Hey You, Big Mood</h1>
        <h2>Entry for {displayDate}</h2>
      <label>How do you feel? </label>
      <select name = "moods" id = "moods" onChange= {(event) => {setMood(event.target.value);} }>
        <option value = "1">🙁</option>
        <option value = "2">😐</option>
        <option value = "3">😃</option>
      </select>
      <label>How many hours did you sleep last night? </label>
      <input type = "number" name = "sleep" min = "0" onChange= {(event) => {setSleep(event.target.value);} }/>
      <label>How many drinks did you have yesterday? </label>
      <input type = "number" min = "0" onChange= {(event) => {setAlcohol(event.target.value);} }/>
      <label>How many cups of coffee did you have yesterday? </label>
      <input type = "number" min = "0" onChange= {(event) => {setCoffee(event.target.value);} }/>
      <label>Did you take your multivitamin? </label>
      <select name = "vitamin" id = "vitamin" onChange= {(event) => {setVitamin(event.target.value);} }>
        <option value = "0">No</option>
        <option value = "1">Yes</option>
      </select>
      <label>Did you exercise? </label>
      <select name = "exercise" id = "exercise" onChange= {(event) => {setExercise(event.target.value);} }>
        <option value = "0">No</option>
        <option value = "1">Yes</option>
      </select>
      <button onClick={addEntry}>Submit</button>
      </div>

      <div className = "results">
      <button onClick = {getResults}>Show Results</button>
        {show?<div>
            <h3>You feel worst when:</h3>
              <div>Sleep: {feelWorst.sleep}</div>
              <div>Exercise: {feelWorst.exercise}</div>
              <div>Alcohol: {feelWorst.alcohol}</div>
              <div>Coffee: {feelWorst.coffee}</div>
              <div>Vitamin: {feelWorst.vitamin}</div>
            <h3>You feel best when:</h3>
              <div>Sleep: {feelBest.sleep}</div>
              <div>Exercise: {feelBest.exercise}</div>
              <div>Alcohol: {feelBest.alcohol}</div>
              <div>Coffee: {feelBest.coffee}</div>
              <div>Vitamin: {feelBest.vitamin}</div>
            <h3>You perform worst when:</h3>
              <div>Sleep: {performWorst.sleep}</div>
              <div>Exercise: {performWorst.exercise}</div>
              <div>Alcohol: {performWorst.alcohol}</div>
              <div>Coffee: {performWorst.coffee}</div>
              <div>Vitamin: {performWorst.vitamin}</div>
            <h3>You perform best when:</h3>
              <div>Sleep: {performBest.sleep}</div>
              <div>Exercise: {performBest.exercise}</div>
              <div>Alcohol: {performBest.alcohol}</div>
              <div>Coffee: {performBest.coffee}</div>
              <div>Vitamin: {performBest.vitamin}</div>
      </div>:null}
  
      </div>
    </div>
  );
}

export default App;
