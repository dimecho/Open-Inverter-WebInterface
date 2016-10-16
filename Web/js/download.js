function confirmDownload(app)
{
    var title = "";
    var msg = "";
    var url = "";

    if(app === "inkscape"){
        title = "Inkscape is a Vector Graphics Software.";
        msg = "Install Inkscape - Download 70MB";
        if(os === "Mac"){
            url = "https://inkscape.org/en/gallery/item/3896/Inkscape-0.91-1-x11-10.7-x86_64.dmg";
        }else if(os === "Windows"){
            url = "https://inkscape.org/en/gallery/item/3956/inkscape-0.91-x64.msi";
        }
    }else if(app === "openscad"){
        title = "OpenSCAD is for creating solid 3D CAD objects.";
        msg = "Install OpenSCAD - Download 25MB";
        if(os === "Mac"){
            url = "http://files.openscad.org/OpenSCAD-2015.03-3.dmg";
        }else if(os === "Windows"){
            url = "http://files.openscad.org/OpenSCAD-2015.03-x86-64-Installer.exe";
        }
    }else if(app === "xquartz"){
        title = "X Window System that runs on OS X.";
        msg = "Install XQuartz - Download 40MB";
        url = "https://dl.bintray.com/xquartz/downloads/XQuartz-2.7.9.dmg";
    }else if(app === "gcc"){

    }else if(app === "attiny"){
        title = "Atmel single-chip microcontroller.";
        msg = "Install AVR Compiler - Download 40MB";
        if(os === "Mac"){
            url = "https://www.obdev.at/downloads/crosspack/CrossPack-AVR-20131216.dmg";
        }else if(os === "Windows"){
            url = "https://downloads.sourceforge.net/project/winavr/WinAVR/20100110/WinAVR-20100110-install.exe";
        }
    }else if(app === "openocd"){
        title = "OpenOCD";
        msg = "Install OpenoCD Debugger - Download 2.5MB";
        if(os === "Mac"){
            url = "https://github.com/gnuarmeclipse/openocd/releases/download/gae-0.10.0-20160110/gnuarmeclipse-openocd-osx-0.10.0-201601101000-dev.pkg";
        }else if(os === "Windows"){
            url = "https://github.com/gnuarmeclipse/openocd/releases/download/gae-0.10.0-20160110/gnuarmeclipse-openocd-win64-0.10.0-201601101000-dev-setup.exe";
        }
    }else if(app === "eagle"){
        title = "CadSoft EAGLE PCB Design Software.";
        msg = "Install EAGLE - Download 50MB";
        if(os === "Mac"){
            url = "http://web.cadsoft.de/ftp/eagle/program/7.7/eagle-mac64-7.7.0.zip";
        }else if(os === "Windows"){
            url = "http://web.cadsoft.de/ftp/eagle/program/7.7/eagle-x64-7.7.0.zip";
        }
    }else if(app === "arm"){
        title = "arm-none-eabi-gcc";
        msg = "Install GCC ARM Compiler - Download 100MB";
        if(os === "Mac"){
            url = "http://launchpadlibrarian.net/268330406/gcc-arm-none-eabi-5_4-2016q2-20160622-mac.tar.bz2";
        }else if(os === "Windows"){
            url = "http://launchpadlibrarian.net/268330693/gcc-arm-none-eabi-5_4-2016q2-20160622-win32.exe";
        }
    }else if(app === "schematics"){

    }else if(app === "source"){
        title = "Inverter Source Code";
        url = "http://johanneshuebner.com/quickcms/files/inverter.zip";
        //get_filesize(url, function(size) {
            msg = "Source Code - Download 1MB";
        //});
    }

    alertify.confirm(title, msg, function()
    {
        window.location.href = "download.php?url=" + url+ "&app=" + app;
    }, function(){});
}

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
}

function downloadComplete(app)
{
    //console.log(app);

    td = $(".progress").parent().empty();
    img = $("<img>", {src:"img/loading.gif"});
    td.append($("<div>").append($("<h2>").append(img).append(" Installing ...")));
    
    $.ajax("install.php?app=" + app,{
        //async: false,
        success: function(data)
        {
            console.log(data);
            
            td.empty();
            if(data === "done"){
                img = $("<img>", {class:"svg-inject", src:"img/ok.svg"});
                td.append($("<div>").append($("<h2>").append(img).append(" Installation Successful.")));
            }else{
                img = $("<img>", {class:"svg-inject", src:"img/error.svg"});
                td.append($("<div>").append($("<h2>").append(img).append(" Installation Failed.")));
            }
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
}

function download(url,app)
{
    if(!url)
        return;

    var progressBar = $("#progressBar");
    $.ajax({
        xhr: function()
        {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function(e){
                var s = e.target.responseText.split(",");
                progressBar.css("width", s.pop() + "%");
                //if(a === "100")
                    //downloadComplete(app);
                //console.log(s.pop());
            }, false);
            return xhr;
        },
        //async: false,
        type: "GET",
        url: "download.php?download=1&url=" + url,
        data: {},
        success: function(data){
            downloadComplete(app);
        }
    });
}