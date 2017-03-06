// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('printr', [ 'ionic', 'btford.socket-io' ]).
run($ionicPlatform => {
  $ionicPlatform.ready(() => {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).
factory('socket', socketFactory => {
  //Create socket and connect to http://chat.socket.io
  const socket = io.connect('http://127.0.0.1:3030/');

  const mySocket = socketFactory({
    ioSocket: socket
  });

  return mySocket;
}).
controller('MainCtrl', ($scope, $ionicModal, socket) => {
  let activePrinter = {};

  socket.emit('register', {
    name: 'Phonie McPhoneface',
    type: 'client'
  });

  socket.on('printerlist', data => {
    $scope.printers = data;
  });

  $scope.printers = [];

  $scope.message = {};

  $scope.printMessage = function (form) {
    if (form.$valid) {
      $scope.message.meta = new Date();

      socket.emit('printMessage', {
        id: activePrinter.id,
        message: $scope.message
      });

      $scope.message = {};
      $scope.modal.hide();
    }
  };

  $scope.doRefresh = () => {
    socket.emit('getPrinters');
    $scope.$broadcast('scroll.refreshComplete');
  };

  $ionicModal.fromTemplateUrl('print-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(modal => {
    $scope.modal = modal;
  });

  $scope.openModal = item => {
    $scope.modal.show();
    activePrinter = item;
  };

  $scope.closeModal = () => {
    $scope.modal.hide();

    activePrinter = {};
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', () => {
    $scope.modal.remove();
  });

  // Execute action on hide modal
  $scope.$on('modal.hidden', () => {
    // Execute action
    activePrinter = {};
  });

  // Execute action on remove modal
  $scope.$on('modal.removed', () => {
    // Execute action
    activePrinter = {};
  });
});
