
import React, {useEffect, useRef, useState} from 'react';

import './App.css';

import * as tf from  "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from 'react-webcam';
import {drawMesh} from "./utilities";


function App(props) {
  //setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  

  //load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: {width: 640, height:480},
      scale:0.8,
    });
    setInterval(() =>{
      detect(net)
    }, 100)
  };
  
  //API STUFF
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
        .then((res) => res.json())
        .then((json) => {
          setItems(json)
        })
    })

  //detect function
  const detect = async(net) =>{
    if (typeof webcamRef.current !== "undefined" && //checking cam is defined
    webcamRef.current !== null && //cam is not null
    webcamRef.current.video.readyState === 4) //cam receiving data 
    { 
      //get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      //set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      //set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      //Make detections
      const face = await net.estimateFaces(video);
      console.log(face);

      //get canvas context for drawing

      const ctx = canvasRef.current.getContext("2d"); //ctx is our canvas drawing context
      drawMesh(face,ctx); //drawMesh is from ulilities.js

    }
  };

  

  runFacemesh();
  //putting in camera
  return (
    <div className="App">
      


      <header className='App Header'>
      <Webcam ref = {webcamRef}
      style = {{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480
        }} />

      <canvas ref = {canvasRef}
      style = {{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480
        }} />
        </header>
        <h1> Fetch data from an api in react </h1>  {
            items.map((item) => ( 
            <ol key = { item.id } >
                User_Name: { item.username }, 
                Full_Name: { item.name }, 
                User_Email: { item.email } 
                </ol>
            ))
            }
    </div>
  );
}

export default App;