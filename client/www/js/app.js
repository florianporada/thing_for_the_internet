// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('printr', [ 'ionic', 'btford.socket-io', 'LocalStorageModule' ]).
config(localStorageServiceProvider => {
  localStorageServiceProvider.setPrefix('printr');
}).
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
  const socket = io.connect('http://192.168.2.101:3030/');

  const mySocket = socketFactory({
    ioSocket: socket
  });

  return mySocket;
}).
controller('MainCtrl', ($scope, $ionicModal, socket, localStorageService) => {
  let activePrinter = {};

  socket.emit('register', {
    name: 'Phonie McPhoneface',
    type: 'client'
  });

  socket.on('printerlist', data => {
    $scope.printers = data;
  });

  $scope.name = '';
  $scope.printers = [];
  $scope.message = {};

  if (localStorageService.get('clientname')) {
    $scope.name = localStorageService.get('clientname');
  }

  $scope.printMessage = function (form) {
    if (form.$valid) {
      const message = {
        meta: new Date(),
        from: $scope.name,
        content: form.content
      };

      socket.emit('printMessage', {
        id: activePrinter.id,
        message: message
      });
      $scope.printModal.hide();
    }
  };
  $scope.setName = function (form) {
    if (form.$valid) {
      localStorageService.set('clientname', form.name);
      $scope.name = form.name;
      $scope.nameModal.hide();
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
    $scope.printModal = modal;
  });

  $ionicModal.fromTemplateUrl('name-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(modal => {
    $scope.nameModal = modal;
  });

  $scope.openPrintModal = item => {
    $scope.printModal.show();
    activePrinter = item;
  };

  $scope.closePrintModal = () => {
    $scope.printModal.hide();

    activePrinter = {};
  };

  $scope.openNameModal = () => {
    $scope.nameModal.show();
  };

  $scope.closeNameModal = () => {
    $scope.nameModal.hide();

    activePrinter = {};
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', () => {
    $scope.printModal.remove();
    $scope.nameModal.remove();
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
