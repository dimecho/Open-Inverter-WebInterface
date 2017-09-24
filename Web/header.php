<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
<title>Huebner Inverter</title>

<script type="text/javascript" src="/js/jquery.js"></script>
<script type="text/javascript" src="/js/bootstrap.js"></script>
<script type="text/javascript" src="/js/svg-injector.js"></script>
<script type="text/javascript" src="/js/alertify.js"></script>
<script type="text/javascript" src="/js/download.js"></script>
<script type="text/javascript" src="/js/menu.js"></script>
<script type="text/javascript" src="/js/jquery.knob.js"></script>
<script type="text/javascript" src="/js/fancybox.js"></script>
<script type="text/javascript" src="/js/bootstrap-notify.js"></script>

<link rel="stylesheet" type="text/css" href="/css/style.css" />
<link rel="stylesheet" type="text/css" href="/css/alertify.css">
<link rel="stylesheet" type="text/css" href="/css/animate.css" />
<link rel="stylesheet" type="text/css" href="/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="/css/glyphicons.css">
<link rel="stylesheet" type="text/css" href="/css/fancybox.css" media="screen"/>

<script type="text/javascript">
    alertify.defaults.transition = "slide";
    alertify.defaults.theme.ok = "btn btn-primary";
    alertify.defaults.theme.cancel = "btn btn-danger";
    alertify.defaults.theme.input = "form-control";

    var os = "Uknown";
    $(document).ready(function()
    {
        if (navigator.userAgent.indexOf("Macintosh") != -1) {
            os = "Mac";
        }else if (navigator.userAgent.indexOf("Windows") != -1) {
            os = "Windows";
        }else{
            os = "Linux";
        }
    });
</script>
<?php
    include_once("install.php");
?>
