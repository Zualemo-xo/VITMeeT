const PRE = "VIT"
const SUF = "MEET"
var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
function createRoom(counter){

    console.log("Creating Room")
    let room = document.getElementById("room-input").value;
    if(room == " " || room == "")   {
        alert("Please enter room number")
        return;
    }
    room_id = PRE+room+SUF;
    let  peer = new Peer(room_id)
    peer.on('open', (id)=>{
        console.log("Peer Connected with ID: ", id)
        hideModal()
        showMute()

        // var video_button = document.createElement("video_button");
        // video_button.appendChild(document.createTextNode("Toggle hold"));

        getUserMedia({video: true, audio: true}, (stream)=>{
            local_stream = stream;
            setLocalStream(local_stream)
        },(err)=>{
            console.log(err)
        })
        notify("Waiting for peer to join.")
    })
    peer.on('call',(call)=>{
        call.answer(local_stream);
        call.on('stream',(stream)=>{
            setRemoteStream(stream)
        })
    })

    

}

function mute_audio(){
    local_stream.getAudioTracks()[0].enabled = !(local_stream.getAudioTracks()[0].enabled);
}
function mute_video(){
    local_stream.getVideoTracks()[0].enabled = !(local_stream.getVideoTracks()[0].enabled);
}



function setLocalStream(stream){
    
    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = false;
    video.play();
}
function setRemoteStream(stream){
   
    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

function hideModal(){
    document.getElementById("entry-modal").hidden = true
}
function showMute(){
    document.getElementById("showMute").hidden = false;
}

function notify(msg){
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(()=>{
        notification.hidden = true;
    }, 3000)
}

function joinRoom(){
    console.log("Joining Room")
    let room = document.getElementById("room-input").value;
    if(room == " " || room == "")   {
        alert("Please enter room number")
        return;
    }
    room_id = PRE+room+SUF;
    hideModal()
    showMute()
    let peer = new Peer()
    peer.on('open', (id)=>{
        console.log("Connected with Id: "+id)
        getUserMedia({video: true, audio: true}, (stream)=>{
            local_stream = stream;
            setLocalStream(local_stream)
            notify("Joining peer")
            let call = peer.call(room_id, stream)
            call.on('stream', (stream)=>{
                setRemoteStream(stream);
            })
        }, (err)=>{
            console.log(err)
        })

    })
}