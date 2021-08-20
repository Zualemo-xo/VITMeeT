var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fileUpload = require('express-fileupload');
const browser = require('browser-detect');

app.use(fileUpload());
app.use(express.static(__dirname + '/public'));

//*******UPLOAD FILE***************************************************** */
app.post('/upload', function(req, res) {
    if (!req.files)
    return res.status(400).send('No files were uploaded.');

    let file = req.files.file;
    let fileNumber = Math.floor((Math.random() * 10000) + 1);
    let extension = file.name.split('.').pop();
    file.mv('files/'+fileNumber+'.'+extension, function(err) {
    if (err)
        return res.status(500).send(err);

    res.send(
        {
            'file':fileNumber+'.'+extension, 
            'extension' : extension,
            'filename' : file.name,
            'size' : file.data.length
        });
    });
});
//*******END UPLOAD FILE***************************************************** */
//************************************************************************** */
//*******DOWNLOAD FILE***************************************************** */
app.get('/file/:id', function(req, res) {

    let files = 'files/';
    let fs = require('fs');
    var fullfile = '';
    
    fs.readdir(files, (err, files) => {
      files.forEach(file => {
        let name = file.replace(/\.[^/.]+$/, "")
        if(req.params.id == name) {
            fullfile = __dirname +'/files/'+file;
            let extension = file.split('.').pop();
            let data = {
                'file':file,
                'browser' : browser(req.headers['user-agent'])
            };
            io.emit('upload file', data);
            res.download(fullfile);  
        }
      });
    });
});

//*******END DOWNLOAD FILE***************************************************** */

io.on('connection', function(socket){
    socket.on('upload file', function(msg){
      io.emit('upload file', msg);
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.emit('some event', { for: 'everyone' });
