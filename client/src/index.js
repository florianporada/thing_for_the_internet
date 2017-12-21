import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import io from 'socket.io-client';

// with ES6 import
const socket = io('http://localhost:3030');
socket.on('connect', () => {
  /*eslint-disable no-console */
  console.log('connected to server');
  socket.emit('getReceivers');
});

socket.on('event', (data) => {
  /*eslint-disable no-console */
  console.log(data);
});

socket.on('receivedToClient', (data) => {
  /*eslint-disable no-console */
  console.log('receivedToClient', data);
});

socket.on('receiverList', (data) => {
  /*eslint-disable no-console */
  console.log(data);
  $('#receiverList').empty();
  data.forEach((el) => {
    $('#receiverList').append(`<li>id: <code>${el.id}</code>, name: ${el.name}</li>`);
  });
});


socket.on('disconnect', () => {
  /*eslint-disable no-console */
  console.log('disconnected');
});

const initButtons = () => {

  $('#signalButton').mousedown(() => {
    const receiverId = $('#receiverId').val();

    socket.emit('signalFromClient', {
      receiverId,
      clientId: socket.id,
      payload: {
        event: 'blinkStart',
      }
    });
  });

  $('#signalButton').mouseup(() => {
    const receiverId = $('#receiverId').val();

    socket.emit('signalFromClient', {
      receiverId,
      clientId: socket.id,
      payload: {
        event: 'blinkStop',
      }
    });
  });
};

initButtons();
