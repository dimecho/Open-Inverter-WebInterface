function optimizeMobile() {

   $("body div").removeClass("container");
   //$("#warning").addClass("display-4");
   $("body").attr("style","font-size: 200%;");
   $(".btn").attr("style","font-size: 150%;");
   $(".glyphicon").addClass("display-3");
   $("select").attr("style","font-size: 110%; width: 80%; height: 2.0em;");
   $("input").attr("style","font-size: 110%; width: 100%; height: 1.5em;");
   $(".badge").attr("style","font-size: 110%;");
   $(".nav-tabs li a").attr("style","font-size: 140%;");
   $("#warning").attr("style","display:none;width:90%;border-radius:5px;");
   $("#warning p").attr("style","font-size: 150%;");
};