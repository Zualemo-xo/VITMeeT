const express = require('express')
const app = express()
const http = require('http').createServer(app)


var fileUpload = require('express-fileupload');
const browser = require('browser-detect');
app.use(fileUpload());


const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/public/files.html'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})

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
