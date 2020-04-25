var pause = false;
var notify;

$(document).on('click', '.pause', function(){
    $.ajax('download.php?pause=' + this.textContent.toLowerCase(),{
        //async: false,
        success: function(data)
        {
            //console.log(data);
            if(data == 'Pause')
            {
                this.textContent = 'Resume';
            }else{
                this.textContent = 'Pause';
            }
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
});

function confirmDownload(app, crc)
{
    $.ajax('download.php?software=' + app + '&crc=' + crc, {
        //async: false,
        success: function(data)
        {
			console.log(data);
            json = JSON.parse(data);
            //console.log(json);

            $('#software').find('.modal-body').empty().append('Download ' + json.title + ' - ' + json.size + 'MB');
            $('#software').modal();
            $("#software-install").click(function() {
                //window.open(url, '_blank');
                window.location.href = 'download.php?start=' + app + '&crc=' + crc;
            });
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
};

function get_filesize(url, callback) {
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
    
    $.ajax('install.php?app=' + app,{
        //async: false,
        success: function(data)
        {
            //console.log(data);
            notify.update({'type': 'success', 'allow_dismiss': true, 'message': 'Installed'});
            
            //$('#progressBar').css('width','100%');
            $('#output').show().append($('<pre>').append(data));
            
            setTimeout(function ()
            {
                downloadComplete(app)
            },4000);
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
};

function download(app, crc)
{
    notify = $.notify({ message: 'Downloading...',},{ type: 'success'});

    $.ajax({
        xhr: function()
        {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener('progress', function(e){
                var s = e.target.responseText.split(',');
                $('.progress-bar').css('width', s.pop() + '%');
                //if(a === '100')
                    //downloadComplete(app);
                //console.log(s.pop());
            }, false);
            return xhr;
        },
        //async: false,
        type: 'GET',
        url: 'download.php?download=' + app + '&crc=' + crc,
        data: {},
        success: function(data)
        {
            console.log(data);

            if(data.indexOf('Error') != -1)
            {
                $('#checksum-good').append(crc);
                $('#checksum-bad').append(data.replace(' Error', ''));
                $('#continue-install').click(function() { install(app) });
                $('#checksum').modal();
            }else{
                install(app);
            }
        }
    });
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