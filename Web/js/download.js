var pause = false;

$(document).on('click', '.pause', function(){
    $.ajax("download.php?pause=" + this.textContent.toLowerCase(),{
        //async: false,
        success: function(data)
        {
            console.log(data);
            if(data == "Pause")
            {
                this.textContent = "Resume";
            }else{
                this.textContent = "Pause";
            }
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
});

function confirmDownload(app)
{
    var title = "";
    var msg = "";
    var url = "";

    if(app === "inkscape"){
        title = "Inkscape is a Vector Graphics Software.";
        msg = "Install Inkscape - Download 70MB";
        url = "https://inkscape.org/en/gallery/item/";
        if(os === "Mac"){
            url += "3896/Inkscape-0.91-1-x11-10.7-x86_64.dmg";
        }else if(os === "Windows"){
            url += "3956/inkscape-0.91-x64.msi";
        }
    }else if(app === "openscad"){
        title = "OpenSCAD is for creating solid 3D CAD objects.";
        msg = "Install OpenSCAD - Download 25MB";
        url = "http://files.openscad.org/";
        if(os === "Mac"){
            url += "OpenSCAD-2015.03-3.dmg";
        }else if(os === "Windows"){
            url += "OpenSCAD-2015.03-x86-64-Installer.exe";
        }
    }else if(app === "xquartz"){
        title = "X Window System that runs on OS X.";
        msg = "Install XQuartz - Download 80MB";
        url = "https://dl.bintray.com/xquartz/downloads/XQuartz-2.7.11.dmg";
    }else if(app === "gcc"){
        title = "Compiler";
        msg = "Install GCC Compiler - Download 100MB";
        if(os === "Windows"){
            url = "http://sysprogs.com/files/gnutoolchains/mingw32/mingw32-gcc4.8.1.exe";
        }
    }else if(app === "python"){
        title = "Python";
        msg = "Install Python - Download 15MB";
        if(os === "Windows"){
            url = "https://www.python.org/ftp/python/3.6.0/python-3.6.0b3.exe";
        }
    }else if(app === "attiny"){
        title = "Atmel single-chip microcontroller.";
        msg = "Install AVR Compiler - Download 40MB";
        if(os === "Mac"){
            url = "https://www.obdev.at/downloads/crosspack/CrossPack-AVR-20131216.dmg";
        }else if(os === "Windows"){
            url = "http://heanet.dl.sourceforge.net/project/winavr/WinAVR/20100110/WinAVR-20100110-install.exe";
        }
    }else if(app === "openocd"){
        title = "OpenOCD";
        msg = "Install OpenoCD Debugger - Download 2.5MB";
        url = "https://github.com/gnuarmeclipse/openocd/releases/download/gae-0.10.0-20160110/";
        if(os === "Mac"){
            url += "gnuarmeclipse-openocd-osx-0.10.0-201601101000-dev.pkg";
        }else if(os === "Windows"){
            url += "gnuarmeclipse-openocd-win64-0.10.0-201601101000-dev-setup.exe";
        }
    }else if(app === "eagle"){
        title = "CadSoft EAGLE PCB Design Software.";
        msg = "Install EAGLE - Download 80MB";
        url = "http://trial2.autodesk.com/NET17SWDLD/2017/EGLPRM/ESD/";
        if(os === "Mac"){
            url += "Autodesk_EAGLE_8.0.2_English_Mac_64bit.pkg"
        }else if(os === "Windows"){
            url += "Autodesk_EAGLE_8.0.2_English_Win_64bit.exe"
        }else if(os === "Linux"){
            url += "Autodesk_EAGLE_8.0.2_English_Linux_64bit.tar.gz"
        }
    }else if(app === "arm"){
        title = "arm-none-eabi-gcc";
        msg = "Install GCC-ARM Compiler - Download 100MB";
        url = "https://launchpadlibrarian.net/";
        if(os === "Mac"){
            url += "287101378/gcc-arm-none-eabi-5_4-2016q3-20160926-mac.tar.bz2";
        }else if(os === "Windows"){
            url += "287101671/gcc-arm-none-eabi-5_4-2016q3-20160926-win32.exe";
        }
    }else if(app === "arduino"){
        title = "Arduino 1.8.1";
        msg = "Install Arduino IDE - Download 150MB";
        url = "https://downloads.arduino.cc/";
        if(os === "Mac"){
            url += "arduino-1.8.1-macosx.zip";
        }else if(os === "Windows"){
            url += "arduino-1.8.1-windows.exe";
        }
    }else if(app === "source"){
        title = "Inverter Source Code";
        url = "https://github.com/tumanako/tumanako-inverter-fw-motorControl/archive/master.zip";
        filename = "tumanako-inverter-fw-motorControl-master.zip";
        //get_filesize(url, function(size) {
            msg = "Source Code - Download 1MB";
        //});
    }

    if (typeof filename === 'undefined')
    {
        filename = url.split(/(\\|\/)/g).pop();
    }

    alertify.confirm(title, msg, function()
    {
        //window.open(url, '_blank');
        window.location.href = "download.php?url=" + url.replace('&', '|') + "&filename=" + filename + "&app=" + app;

    }, function(){});
};

function get_filesize(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", to get only the header
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4 && xhr.status==200){
        //if (this.readyState == this.DONE) {
            callback(parseInt(xhr.getResponseHeader("Content-Length")));
        }
    };
    xhr.send();
};

function download(url,filename,app)
{
    var notify = $.notify({
            message: 'Downloading...',
        },{
            type: 'success'
    });
    
    $.ajax({
        xhr: function()
        {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function(e){
                var s = e.target.responseText.split(",");
                $("#progressBar").css("width", s.pop() + "%");
                //if(a === "100")
                    //downloadComplete(app);
                //console.log(s.pop());
            }, false);
            return xhr;
        },
        //async: false,
        type: "GET",
        url: "download.php?download=1&url=" + url.replace('&', '|') + "&filename=" + filename,
        data: {},
        success: function(data){
            
            notify.update({'type': 'success', 'allow_dismiss': false, 'message':'Installing ...'});
            
            $.ajax("install.php?app=" + app,{
                //async: false,
                success: function(data)
                {
                    //console.log(data);
                    notify.update({'type': 'success', 'allow_dismiss': true, 'message': 'Installed'});
                    
                    //$("#progressBar").css("width","100%");
                    $("#output").show().append($("<pre>").append(data));
                    
                    setTimeout(function ()
                    {
                        downloadComplete(app)
                    },4000);
                },
                error: function(xhr, textStatus, errorThrown){
                }
            });
        }
    });
};

function downloadComplete(app) {
	
	$("#progressBar").css("width", "100%");
	
	if (app === "openscad") {
		window.location.href = "/encoder.php";
    }else if (app === "eagle") {
        window.location.href = "/components.php";
        openExternalApp(app);
	}else{
		openExternalApp(app);
	}
}