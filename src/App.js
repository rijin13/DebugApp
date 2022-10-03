import logo from './logo.svg';
import './App.css';
import { Button, Avatar, Switch } from '@mui/material';
import { useState, useEffect } from 'react';
import Alert from "react-bootstrap/Alert";
import { Grid } from '@mui/material';

function App() {

  var [checked, setChecked] = useState(false);
  var [speech, setSpeech] = useState("Say Something!");



  function init_connection() {
    var ros = new window.ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    ros.on('connection', function () {
      console.log('Connected to websocket server.');
    });

    ros.on('error', function (error) {
      console.log('Connected to websocket server.', error);
    });

    ros.on('close', function () {
      console.log('Connection to websocket server closed.');

      setTimeout(() => {
        try {
          ros.connect(`ws://localhost:9090`);

        }
        catch (error) {
          console.log("connection problem");
        }

      }, 1000);
    });

    // Subscribing to the topic
    var listener = new window.ROSLIB.Topic({
      ros: ros,
      name: '/speech',
      messageType: 'std_msgs/String'
    });

    listener.subscribe((message) => {
      console.log('Received message on ' + listener.name + ':' + message.data);

      var str = new String();
      str = message.data;
      if (str.length > 45) {
        str = str.substring(0, 45);
        str = str + '..'
      }
      setSpeech(str);
    });

    var listener2 = new window.ROSLIB.Topic({
      ros: ros,
      name: '/status',
      messageType: 'std_msgs/Bool'
    });

    listener2.subscribe((message) => {
      console.log('Received message on ' + listener2.name + ':' + message.data);

      setChecked(message.data);
    });

  }

  useEffect(
    () => {
      init_connection();

    }, []

  )


  return (
    <div className="App">

      {/* <h1>ROS message(/speech "std_msgs/String")</h1>
      

      <div className="line-border">
     <div>
      <h1 className="speech" ></h1>{speech}</div>
      </div>


       <div className='statuso'>

       <Alert 
       className="text-center m-3 "
       variant={checked?"success":"danger"}
       >Module status(/status "std_msgs/Bool")</Alert>
       </div>

       <div className='statuso'>
       <Alert 
       className="text-center m-3 "
       variant={checked?"success":"danger"}
       >Module status(/status "std_msgs/Bool")</Alert>
       </div> */}

      <Grid container spacing={8} >

        <Grid item xs={6} >
          <div className="line-border ">
            <h1>Speech Message (/speech "std_msgs/String")</h1>
          </div>
        </Grid>
        <Grid item xs={6} >
          <div className="line-border" >
            <h1>{speech}</h1>
          </div>
        </Grid>

        <Grid item xs={3} >

          <Alert
            className="text-center m-3 "
            variant={checked ? "success" : "danger"}
          >Touch Interface (/status "std_msgs/Bool")</Alert>
        </Grid>
        <Grid item xs={3} >

          <Alert
            className="text-center m-3 "
            variant={checked ? "success" : "danger"}
          >Module status(/status "std_msgs/Bool")</Alert>
        </Grid>
        <Grid item xs={3} >

          <Button
            variant='text' style={{ maxWidth: '20vw', maxHeight: '10vh', minHeight: '10vh', minWidth: '20vw', background: "lightblue" }}
          >Button</Button>
        </Grid>

      </Grid>



    </div>
  );
}

export default App;
