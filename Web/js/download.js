var pause = false;
var notify;

$(document).on('click', '.pause', function()
{
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(xhr.responseText);
            if(data == 'Pause')
            {
                this.textContent = 'Resume';
            }else{
                this.textContent = 'Pause';
            }
        }
    };
    xhr.open('GET', 'download.php?pause=' + this.textContent.toLowerCase(), true);
    xhr.send();
});

function confirmDownload(app, crc)
{
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.response);
            $('#software').find('.modal-body').empty().append('Download ' + xhr.response.title + ' - ' + xhr.response.size + 'MB');
            var softwareModal = new bootstrap.Modal(document.getElementById('software'), {});
            softwareModal.show();
            $("#software-install").click(function() {
                //window.open(url, '_blank');
                window.location.href = 'download.php?start=' + app + '&crc=' + crc;
            });
        }
    };
    xhr.open('GET', 'download.php?software=' + app + '&crc=' + crc, true);
    xhr.send();
};

function get_filesize(url, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true); // Notice 'HEAD' instead of 'GET', to get only the header
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4 && xhr.status==200){
        //if (this.readyState == this.DONE) {
            callback(parseInt(xhr.getResponseHeader('Content-Length')));
        }
    };
    xhr.send();
};

function install(app)
{
    notify.update({'type': 'success', 'allow_dismiss': false, 'message':'Installing ...'});

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(data);
            notify.update({'type': 'success', 'allow_dismiss': true, 'message': 'Installed'});
            
            //$('#progressBar').css('width','100%');
            $('#output').show().append($('<pre>').append(xhr.responseText));
            
            setTimeout(function ()
            {
                downloadComplete(app)
            },4000);
        }
    };
    xhr.open('GET', 'install.php?app=' + app, true);
    xhr.send();
};

function download(app, crc)
{
    notify = $.notify({ message: 'Downloading...',},{ type: 'success'});

    var xhr = new XMLHttpRequest();
    //xhr.overrideMimeType('text\/plain; charset=x-user-defined');
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.responseText);

            if(xhr.responseText.indexOf('Error') != -1)
            {
                $('#checksum-good').append(crc);
                $('#checksum-bad').append(xhr.responseText.replace(' Error', ''));
                $('#continue-install').click(function() { install(app) });
                $('#checksum').modal();
            }else{
                install(app);
            }
        }
    };
    xhr.addEventListener('progress', function(e){
        var s = e.target.responseText.split(',');
        $('.progress-bar').css('width', s.pop() + '%');
        //if(a === '100')
            //downloadComplete(app);
        //console.log(s.pop());
    }, false);
    /*
    xhr.addEventListener('error', function(e) {
      console.log('error: ' + e);
    });
    */
    xhr.open('GET', 'download.php?download=' + app + '&crc=' + crc);
    xhr.send();
};

function downloadComplete(app) {
	
	$('#progressBar').css('width', '100%');
	
	if (app === 'openscad') {
		window.location.href = 'encoder.php';
    }else if (app === 'eagle') {
        window.location.href = 'pcb.php';
        openExternalApp(app);
	}else{
		openExternalApp(app);
	}
};