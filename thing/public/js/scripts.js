'use strict';

(function () {
  const initSite = function () {
    const pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight
    });
    $('body').css('background-image', `url(${pattern.png()}`);
  };

  const initGetConfig = function () {
    $.getJSON('api/getConfig', data => {
      $('#name').val(data.name);
      $('#passcode').val(data.passcode);
      $('#protocol').val(data.protocol);
      $('#socketurl').val(data.socketurl);
      $('#socketport').val(data.socketport);
    });
  };

  const initUpdateConfig = function () {
    $('#submitButton').click(() => {
      const form = $('form')[0];

      if (form.checkValidity()) {
        const formData = $('form').serializeArray();
        const data = {
          name: formData[0].value,
          passcode: formData[1].value,
          protocol: formData[2].value,
          socketurl: formData[3].value,
          socketport: formData[4].value
        };

        $.post('api/updateConfig', data).
          done(res => {
            $('#info').
              empty().
              append('<div class="alert alert-success"><strong>Yeah!</strong> Updated configuration successfully.</div>');
          });
      }
    });
  };

  const initScript = function () {
    initSite();
    initGetConfig();
    initUpdateConfig();
  };

  initScript();
})();
