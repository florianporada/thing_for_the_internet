import React, { Component } from "react";
import io from "socket.io-client";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";

import { SOCKET_URL, SOCKET_PORT, RECEIVER_ID, RECEIVER_NAME } from "./config";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: "idle",
      videoFile: ""
    };

    this.initSocket();
  }

  initSocket() {
    this.socket = io.connect(`${SOCKET_URL}:${SOCKET_PORT}`, {
      transports: ["websocket"]
    });
    this.socket.on("connect", () => {
      console.log("info", "Connected");
      this.socket.emit("register", {
        name: RECEIVER_NAME,
        type: "receiver",
        uid: RECEIVER_ID
      });
    });

    this.socket.on("signalToReceiver", data => {
      // winston.log('info', 'recieved: ', { data });
      this.socket.emit("received", {
        clientId: data.clientId,
        receiverId: data.receiverId
      });

      this.setState({
        event: data.payload.event
      });

      switch (data.payload.event) {
        case "blinkStart":
          console.log("info", "startBlinking", data);

          this.setState({
            backgroundColor1: "#fff",
            backgroundColor2: "#fff"
          });

          break;
        case "blinkStop":
          console.log("info", "stopBlinking", data);

          this.setState({
            backgroundColor1: "#000",
            backgroundColor2: "#000"
          });

          break;
        case "movement":
          console.log("info", "movement", data);

          this.setState({
            backgroundColor1: "#000",
            backgroundColor2: "#000",
            posX: data.payload.data.x,
            posY: data.payload.data.y
          });

          break;

        case "color":
          console.log("info", "color", data);

          this.setState({
            backgroundColor1: data.payload.data.color1,
            backgroundColor2: data.payload.data.color2
          });

          break;

        case "animation":
          console.log("info", "animation", data);

          this.setState({
            videoFile: "wait",
            newVideoFile: data.payload.data.filename
          });

          break;

        default:
      }
    });

    this.socket.on("disconnect", () => {
      console.log("info", "Connection closed");
    });
  }

  renderVideo() {
    if (this.state.event !== "animation") return null;
    if (!this.state.videoFile) return null;
    if (this.state.videoFile !== this.state.newVideoFile) {
      setTimeout(() => {
        this.setState({
          videoFile: this.state.newVideoFile
        });
      }, 100);

      return <p>wait</p>;
    }

    return (
      <div className="video-wrapper">
        <Video autoPlay loop muted>
          <source src={this.state.videoFile} type="video/webm" />
        </Video>
      </div>
    );
  }

  renderMovement() {
    if (this.state.event !== "movement") return null;

    const style = {
      background: "#11dbc2",
      borderRadius: 75,
      height: 150,
      width: 150,
      position: "absolute",
      top: 0,
      left: 0,
      transform: `translate(${this.state.posX}vw, ${this.state.posY}vh)`
    };

    return <span style={style} />;
  }

  render() {
    const style = {
      background: `linear-gradient(to right, 
        ${this.state.backgroundColor1}, 
        ${this.state.backgroundColor2})`
    };

    return (
      <div className="App" style={style}>
        <div className="App-content">
          {this.renderVideo()}
          {this.renderMovement()}
        </div>
      </div>
    );
  }
}

export default App;
