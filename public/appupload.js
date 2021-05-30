$(function () {
    var socket = io();
    $('#uploadForm').submit(function(e){

        if(document.getElementById("btnUpload").value == "Uploading...") {
            return;
        }
        var host = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        var url = host + "/upload";
        var formData = new FormData($(this)[0]);
        $('.sk-circle').css('display', 'block');        
        document.getElementById("btnUpload").value= "Uploading...";
        
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            async: false,
            success: function (data) {

                setTimeout(function(){ 
                    $('.sk-circle').css('display', 'none');                    
                    document.getElementById("btnUpload").value= "Generate link";
                    let id = data.file.replace(/\.[^/.]+$/, "")
                    var table = document.getElementById("filesUploadedTable");
                    var rows = table.rows.length;
                    var row = table.insertRow(rows);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    cell1.innerHTML = data.filename;
                    cell2.innerHTML = data.extension.toUpperCase();
                    cell3.innerHTML = data.size;
                    cell4.innerHTML = host + "/file/"+id;
                }, 2000);                                
            },
            error: function (data) {
                $('.sk-circle').css('display', 'none');                
                document.getElementById("btnUpload").value= "Generate link";
                alert('Please choose a file');                
            },
            cache: false,
            contentType: false,
            processData: false
        });
    
        e.preventDefault();
    });
    
    socket.on('upload file', function(data){                
        console.log(data);
        var host = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        var table = document.getElementById("filesDownloadedTable");
        var rows = table.rows.length;
        var row = table.insertRow(rows);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        let name = data.file.replace(/\.[^/.]+$/, "")
        cell1.innerHTML = host + "/file/" + name;
        cell2.innerHTML = data.browser.name;
        cell3.innerHTML = data.browser.os;
    });
});
