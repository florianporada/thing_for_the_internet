// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('printr', [ 'ionic', 'btford.socket-io', 'LocalStorageModule', 'ngCordova' ]).
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
  const socket = io.connect('https://noiseyairplanes.me:3030/', { secure: true });
  const mySocket = socketFactory({
    ioSocket: socket
  });

  return mySocket;
}).
controller('MainCtrl', ($scope, $rootScope, $ionicModal, socket, localStorageService, $cordovaCamera, $ionicPopup) => {
  let activePrinter = {};
  let clientId;

  const startCamera = function (options) {
    if (ionic.Platform.isWebView() && ionic.Platform.device().platform === 'browser') {
      angular.element(document).find('body').removeClass('modal-open');
    }

    $cordovaCamera.getPicture(options).then(imageData => {
      $rootScope.photo = `data:image/png;base64,${imageData}`;
      if (ionic.Platform.isWebView() && ionic.Platform.device().platform === 'browser') {
        angular.element(document).find('body').addClass('modal-open');
      }
    }, err => {
      console.log(err);
    });
  };

  socket.emit('register', {
    name: localStorageService.get('clientname') ? localStorageService.get('clientname') : 'random client',
    type: 'client'
  });

  socket.on('printerList', data => {
    $scope.printers = data;
  });

  socket.on('printedMessage', data => {
    $ionicPopup.alert({
      title: 'Printed Message',
      template: `sent data to ${data.printerId}`
    });
  });

  socket.on('clientId', data => {
    clientId = data;
  });

  $rootScope.name = '';
  $rootScope.content = '';
  $rootScope.photo = '';
  $scope.printers = [];

  if (localStorageService.get('clientname')) {
    $rootScope.name = localStorageService.get('clientname');
  }

  $scope.removePhoto = function () {
    $rootScope.photo = '';
  };

  $scope.choosePhoto = function () {
    const options = {
      quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    startCamera(options);
  };

  $scope.takePhoto = function () {
    const options = {
      quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    startCamera(options);
  };

  $scope.printMessage = function (isValid) {
    if (isValid) {
      if ($rootScope.photo !== '') {
        $rootScope.photo = $rootScope.photo.split(';base64,')[1];
      }

      const message = {
        meta: new Date(),
        from: $rootScope.name,
        content: $rootScope.content,
        image: $rootScope.photo
      };

      socket.emit('printMessage', {
        clientId,
        printerId: activePrinter.id,
        message
      });

      $scope.printModal.hide();
      $rootScope.content = '';
      $rootScope.photo = '';
    }
  };
  $scope.setName = function (isValid) {
    if (isValid) {
      localStorageService.set('clientname', $rootScope.name);
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
    if (!localStorageService.get('clientname')) {
      $scope.nameModal.show();
    }
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
