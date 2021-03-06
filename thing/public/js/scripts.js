'use strict';

(function () {
  const initSite = function () {
    const pattern = Trianglify({
      width: $('.trianglify-bg').outerWidth(),
      height: $('.trianglify-bg').outerHeight()
    });

    $('.trianglify-bg').css('background-image', `url(${pattern.png()}`);
  };

  const initGetConfig = function () {
    $.getJSON('api/getConfig', data => {
      $.each(data.serialports, function (i, item) {
        $('#serialport').append($('<option>', {
          value: item,
          text: item
        }));
      });

      $('#name').val(data.name);
      $('#passcode').val(data.passcode);
      $('#protocol').val(data.protocol);
      $('#socketurl').val(data.socketurl);
      $('#socketport').val(data.socketport);
      $('#serialport').val(data.serialport);
      $('#baudrate').val(data.baudrate);
      $('#ssid').val(data.ssid);
      $('#psk').val(data.psk);
    });
  };

  const initUpdateConfig = function () {
    $('#submitButton0,#submitButton1').click(() => {
      const form = $('#printerConf')[0];

      if (form.checkValidity()) {
        const formData = $('#printerConf').serializeArray();
        const data = {
          protocol: formData[0].value,
          socketurl: formData[1].value,
          socketport: formData[2].value,
          name: formData[3].value,
          passcode: formData[4].value,
          serialport: formData[5].value,
          baudrate: formData[6].value
        };

        $.post('api/updateConfig', data).
          done(res => {
            $('#info1').
              empty().
              append(`<div class="alert alert-success"><strong>Yeah!</strong> Updated configuration successfully. ${res}</div>`);
          });
      }
    });

    $('#submitButton2').click(() => {
      const form = $('#wifiConf')[0];

      if (form.checkValidity()) {
        const formData = $('#wifiConf').serializeArray();
        const data = {
          ssid: formData[0].value,
          psk: formData[1].value
        };

        $.post('api/updateWifiConfig', data).
          done(res => {
            $('#info2').
              empty().
              append(`<div class="alert alert-success"><strong>Yeah!</strong> Added WiFi configuration successfully to /etc/wpa_supplicant/wpa_supplicant.conf. ${res}</div>`);
          });
      }
    });
  };

  const initResetConfig = function () {
    $('#resetButton').click(() => {
      if (confirm("Are you sure?")) {
        $.post('api/resetConfig', {}).
          done(res => {
            $('#info1').
              empty().
              append(`<div class="alert alert-success"><strong>Yeah!</strong> Reset configuration successfully. ${res}</div>`);
          });
      }
    });
  };

  const initScript = function () {
    initSite();
    initGetConfig();
    initUpdateConfig();
    initResetConfig();
  };

  initScript();
})();
