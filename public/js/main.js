$(document).ready(function() {

  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hey there, server!' });
  });

  socket.on('greetings', function(data) {
    console.log(data);
  });

  socket.on('response', function(res) {
    console.log(res);
  });

  $('#sendAccessToken').click(function(){
    console.log('sendAccessToken click');
    var atoken = $('#inputAccessToken').val();
    socket.emit('accesstoken', { token: atoken });
    // $('#inputAccessToken').val('');
  });

});
