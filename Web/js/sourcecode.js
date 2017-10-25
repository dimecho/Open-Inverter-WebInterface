$(document).ready(function() {

    alertify.dialog('compileSourceCode', function () {
        return {
            setup: function setup() {
                return {
                    buttons: [{
                        text: 'Version 1',
                        className: alertify.defaults.theme.ok
                    },{
                        text: 'Version 2',
                        className: alertify.defaults.theme.ok
                    },{
                        text: 'Tesla',
                        className: alertify.defaults.theme.ok
                    }],
                    focus: {
                        //element: 0,
                        select: false
                    },
                    options: {
                        title: 'Source Code',
                        maximizable: false,
                        resizable: false,
                        autoReset: true
                    }
                };
            },
            callback:function(closeEvent){

                var progressBar = $("#progressBar");
                for (i = 0; i < 100; i++) {
                    setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                }
                var notify = $.notify({
                        message: 'Compiling ...',
                    },{
                        allow_dismiss: false,
                        type: 'danger'
                });

                var HWCONFIG = "HWCONFIG_REV1";
                
                if(closeEvent.index === 1) {
                    HWCONFIG = "HWCONFIG_REV2";
                }else if(closeEvent.index === 2) {
                    HWCONFIG = "HWCONFIG_TESLA";
                }

                $.ajax({
                    /*
                    xhr: function()
                    {
                        var xhr = new window.XMLHttpRequest();
                        xhr.addEventListener("progress", function(e){
                            console.log(e.target.responseText);
                        }, false);
                        return xhr;
                    },
                    */
                    //async: false,
                    type: "GET",
                    url: "/sourcecode.php?hw=" + HWCONFIG,
                    data: {},
                    success: function(data){
                        //console.log(data);
                        notify.update({'type': 'success', 'allow_dismiss': true, 'message': 'Compiled'});
                        progressBar.css("width","100%");
                        $("#output").append($("<pre>").append(data));
                    }
                });
            },
            /*
            hooks: {
                onshow: function() {
                    //console.log(this);
                    this.elements.dialog.style.maxWidth = 'none';
                    this.elements.dialog.style.width = '640px';
                }
            }
            */
        };
    }, false, 'confirm');

    alertify.compileSourceCode("<i class='glyphicon glyphicon-modal-window'></i> Compile for the following Hardware:");
});