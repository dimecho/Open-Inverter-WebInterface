<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="/js/moment.js"></script>
        <script type="text/javascript" src="/js/chart.js"></script>
        <script type="text/javascript" src="/js/chartjs-plugin-zoom.js"></script>
        <script type="text/javascript" src="/js/chartjs-plugin-streaming.js"></script>
        <script type="text/javascript" src="/js/graph.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered" id="render">
                        <tr>
                            <td>
                                <div id="buildGraphMenu"></div>
                                <canvas id="canvas"></canvas>
                            </td>
                        </tr>
                    </table>
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