<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="/css/bootstrap-slider.css" />
        <script type="text/javascript" src="/js/bootstrap-slider.js"></script>
        <script type="text/javascript" src="/js/chart.js"></script>
        <script type="text/javascript" src="/js/graph.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col" align="center">
                    <table class="table table-active bg-light" id="render">
                        <tr>
                            <td>
                                <div id="buildGraphMenu"></div>
                            </td>
                        </tr>
                    </table>
                    <div id="buildGraphSlider"></div>
                    <div class="chartWrapper bg-light">
                        <div class="chartAreaWrapper">
                            <div class="chartAreaWrapper2">
                                <canvas id="canvas"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col" align="center">
                    <div id="buildGraphFooter"></div>
                </div>
            </div>
        </div>
        <br/>
    </body>
</html>