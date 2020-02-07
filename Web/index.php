<!DOCTYPE html>
<html>
    <head>
        <script>
            //For ESP8266
            function handleEvent(e) {
                console.log(e);
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "/format");
                xhr.send();
                alert("File System not compressed! Please flash SPIFFS binary.");
                window.location.href = "/update";
            }
            function addListeners(xhr) {
                xhr.addEventListener('error', handleEvent);
            }
            var xhr = new XMLHttpRequest();
            addListeners(xhr);
            xhr.open("GET", "js/menu.js");
            xhr.send();
        </script>
        <?php include "header.php" ?>
        <script src="js/index.js"></script>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row" align="center">
                <div class="col">
                    <hr>
                    <div class="d-none spinner-border text-dark" id="loader-parameters"></div>
                    <i class="d-none icons icon-com display-2" id="com"></i>
                    <div class="d-none container table-active table-bordered" id="saveload">
                        <div class="row p-2">
                            <div class="col">
                                <button type="button" class="btn btn-primary" onclick="downloadSnapshot()"><i class="icons icon-down"></i> Save to File</button>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-success" onclick="uploadSnapshot()"><i class="icons icon-up"></i> Load from File</button>
                            </div>
                        </div>
                    </div>
                    <a class="calculator" data-fancybox data-src="#calculator" href="javascript:;"></a>
                    <div class="d-none fancy-box bg-light" id="calculator"></div>
                    <hr>
                </div>
            </div>
            <div class="row" align="center">
                <div class="col">
                    <table class="table table-active table-bordered bg-light table-striped table-hover" id="parameters"></table>
                </div>
            </div>
        </div>
        <a class="macdrivers" data-fancybox data-src="#macdrivers" href="#"></a>
        <div class="d-none bg-light" id="macdrivers">
            <center>
                <img src="" />
                <br><br>
                <p>Recommended Mac Drivers: <a href="#">mac-usb-serial.com</a></p>
                <br>
                <button class="btn btn-primary" type="button" onClick="$.fancybox.close();window.open('https://www.mac-usb-serial.com','_blank');"><i class="icons icon-download"></i> Download</button>
            </center>
        </div>
        <form action="snapshot.php" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();" accept=".json,.txt">
            <input type="submit" hidden>
        </form>
        <?php include "footer.php" ?>
    </body>
</html>