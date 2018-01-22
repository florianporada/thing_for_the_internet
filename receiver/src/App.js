import React, { Component } from "react";
import io from "socket.io-client";
// import { DefaultPlayer as Video } from "react-html5video";
import styled from "styled-components";
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
    filename: "180119_MST_Signal_4.1_Conversational_AI_1280.mp4"
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
    filename: "180119_MST_Signal_4.1_Conversational_AI_1280.mp4"
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

const Box = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  height: 100vh;
  width: 100vh;
  border-radius: 9999px;
  overflow: hidden;
  margin: 0 auto;
`;

const Flash = styled.div`
  position: absolute;
  display: flex;
  text-align: center;
  justify-content: center;
  height: 100vh;
  width: 100vh;
  transition: all ${props => (props.delay ? props.delay : "0.2s")} ease;
  overflow: hidden;
  margin: 0 auto;
  opacity: 0;
  border-radius: 9999px;
  top: 0;
`;

const FlashInner = styled.div`
  position: absolute;
  top: ${props => (props.size ? (100 - props.size) / 2 + "%" : "100%")};
  height: ${props => (props.size ? props.size + "%" : "100%")};
  width: ${props => (props.size ? props.size + "%" : "100%")};
  border-radius: 99999px;
  transition: all ${props => (props.delay ? props.delay : "0.2s")} ease;
`;

const Color = styled.div`
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: opacity 0.6s ease;
  display: block !important;
`;

const initState = {
  // event: "idle",
  videoFile: "",
  polyline: "",
  windowHeight: window.innerHeight,
  windowWidth: window.innerWidth,
  color: "",
  backgroundColor1: "#000",
  backgroundColor2: "#000"
};

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
            ...initState,
            mode: "light"
          });

          break;
        case "blinkStop":
          // console.log("info", "stopBlinking", data);

          this.setState({
            ...initState,
            mode: "dark"
          });

          break;
        case "movement":
          // console.log("info", "movement", data);

          const poly = `${data.payload.data.x / 100 * this.state.windowWidth},
          ${data.payload.data.y / 100 * this.state.windowWidth} `;

          this.setState({
            ...initState,
            posX: data.payload.data.x,
            posY: data.payload.data.y,
            polyline: `${this.state.polyline} ${poly}`.trim()
          });

          break;

        case "color":
          // console.log("info", "color", data);

          this.setState({
            ...initState,
            backgroundColor1: data.payload.data.color1,
            backgroundColor2: data.payload.data.color2,
            color: this.state.event
          });

          break;

        case "animation":
          // console.log("info", "animation", data);

          this.setState({
            ...initState,
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

  renderFlash() {
    return (
      <Flash delay="0.4s" className={[this.state.mode].join(" ")}>
        <FlashInner
          className={[this.state.mode].join(" ")}
          size={80}
          delay="0.3s"
        />
        <FlashInner
          className={[this.state.mode].join(" ")}
          size={60}
          delay="0.2s"
        />
      </Flash>
    );
  }

  renderVideo() {
    if (this.state.event !== "animation" || !this.state.videoFile) return null;
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
        <video autoPlay loop controls>
          <source
            src={`${process.env.PUBLIC_URL}/videos/${this.state.videoFile}`}
            type="video/mp4"
          />
        </video>
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
          strokeWidth="10"
          points={this.state.polyline}
        />
      </svg>
    );
  }

  renderColor() {
    // if (this.state.event !== "color") return null;
    let style = {};

    if (this.state.event === "color") {
      style = {
        background: `linear-gradient(to right, 
          ${this.state.backgroundColor1},
          ${this.state.backgroundColor2})`
      };
    } else {
      style = {
        opacity: 0
      };
    }

    return (
      <Color
        className={[this.state.event ? this.state.event : ""].join(" ")}
        style={style}
      />
    );
  }

  render() {
    return (
      <Box>
        <div className="App-content">
          {this.renderFlash()}
          {this.renderVideo()}
          {this.renderMovement()}
          {this.renderColor()}
        </div>
      </Box>
    );
  }
}

export default App;
