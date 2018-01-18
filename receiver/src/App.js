import React, { Component } from "react";
import io from "socket.io-client";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";

import { SOCKET_URL, SOCKET_PORT, RECEIVER_ID, RECEIVER_NAME } from "./config";
import "./App.css";

const animationList = [
  {
    key: 0,
    name: "Identifikation",
    filename: "General_Signal_1_1_BlauesAtmen_02.mp4"
  },
  {
    key: 1,
    name: "Moovel Logo",
    filename: "171229_Signal01_MoovelLogo_weiß_01.mov"
  },
  {
    key: 2,
    name: "Timer Füllstand",
    filename: "171229_Signal02_TimerFüllstand_01.mov"
  },
  {
    key: 3,
    name: "Rotes Stoppen",
    filename: "180103_General_Signal_3.1_RotesStoppen_vertärkt_WalkOn_01.mov"
  },
  {
    key: 4,
    name: "Timer rotierend",
    filename: "180107_General_Signal_2.1_Timer_rotierend_01.mov"
  },
  {
    key: 5,
    name: "Konversation Hey",
    filename: "180107_Signal_4.1_AI_Conversation_Hey_01.mov"
  },
  {
    key: 6,
    name: "Blaues Atmen",
    filename: "General_Signal_1.1_BlauesAtmen_02.mov"
  },
  {
    key: 7,
    name: "Weißes Atmen",
    filename: "General_Signal_1.1_WeißesAtmen_01.mov"
  },
  {
    key: 8,
    name: "Rotes Stoppen",
    filename: "General_Signal_2.2_RotesStoppen_01.mov"
  },
  {
    key: 9,
    name: "Abbremsen",
    filename: "General_Signal_5.1_Abbremsen_dynamisch_GrößenAnpassung_01.mov"
  },
  {
    key: 10,
    name: "Anfahren",
    filename: "General_Signal_5.1_AnfahrenBeschleunigen_dynamisch_02.mov"
  },
  { key: 11, name: "Winken", filename: "Signal_3.1_2.mov" },
  {
    key: 12,
    name: "Konversation OK",
    filename: "Signal_4.4_AI_conversation_Ok_jumpIn_01.mov"
  }
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: "idle",
      videoFile: "",
      polyline: "",
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
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

    this.socket.on("sendAnimationsToClient", data => {
      this.socket.emit("animationsFromReceiver", {
        clientId: data.clientId,
        receiverId: data.receiverId,
        animationList
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
          // console.log("info", "startBlinking", data);

          this.setState({
            mode: "light",
            polyline: ""
          });

          break;
        case "blinkStop":
          // console.log("info", "stopBlinking", data);

          this.setState({
            mode: "dark",
            polyline: ""
          });

          break;
        case "movement":
          // console.log("info", "movement", data);

          const poly = `${data.payload.data.x / 100 * this.state.windowWidth},
          ${data.payload.data.y / 100 * this.state.windowWidth} `;

          this.setState({
            backgroundColor1: "#000",
            backgroundColor2: "#000",
            posX: data.payload.data.x,
            posY: data.payload.data.y,
            polyline: `${this.state.polyline} ${poly}`.trim()
          });

          break;

        case "color":
          // console.log("info", "color", data);

          this.setState({
            backgroundColor1: data.payload.data.color1,
            backgroundColor2: data.payload.data.color2,
            polyline: ""
          });

          break;

        case "animation":
          // console.log("info", "animation", data);

          this.setState({
            videoFile: "wait",
            backgroundColor1: "#000",
            backgroundColor2: "#000",
            newVideoFile: data.payload.data.filename,
            polyline: ""
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
      }, 10);

      return <p>wait</p>;
    }

    return (
      <div className="video-wrapper">
        <Video autoPlay loop muted>
          <source
            src={`${process.env.PUBLIC_URL}/videos/${this.state.videoFile}`}
          />
        </Video>
      </div>
    );
  }

  renderMovement() {
    if (this.state.event !== "movement") return null;

    return (
      <svg
        width={this.state.windowWidth}
        height={this.state.windowHeight}
        viewBox={`0 0 ${this.state.windowWidth} ${this.state.windowHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          fill="none"
          stroke="#11dbc2"
          strokeWidth="5"
          points={this.state.polyline}
        />
      </svg>
    );
  }

  render() {
    const style = {
      background: `linear-gradient(to right, 
        ${this.state.backgroundColor1}, 
        ${this.state.backgroundColor2})`
    };

    return (
      <div style={style} className={[this.state.mode, "App"].join(" ")}>
        <div className="App-content">
          {this.renderVideo()}
          {this.renderMovement()}
        </div>
      </div>
    );
  }
}

export default App;
