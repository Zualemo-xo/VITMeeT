navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var myStream;
var peer = new Peer({key: 'PeerJS key'});

var setOthersStream = function(stream){
  $('#others-video').prop('src', URL.createObjectURL(stream));
};

var setMyStream = function(stream){
  myStream = stream;
  $('#video').prop('src', URL.createObjectURL(stream));
};

peer.on('open', function(id){
  $('#peer-id').text(id);
});

peer.on('call', function(call){
  call.answer(myStream);
  call.on('stream', setOthersStream);
});

$(function(){
  navigator.getUserMedia({audio: true, video: true}, setMyStream, function(){});
  $('#call').on('click', function(){
    var call = peer.call($('#others-peer-id').val(), myStream);
    call.on('stream', setOthersStream);
  });
});

peer.on('error', function(e){
  console.log(e.message);
});

//create button to toggle video
var video_button = document.createElement("video_button");
video_button.appendChild(document.createTextNode("Toggle hold"));

video_button.video_onclick = function(){
  myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
}

var audio_button = document.createElement("audio_button");
video_button.appendChild(document.createTextNode("Toggle hold"));

audio_button.audio_onclick = function(){
  myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);
}