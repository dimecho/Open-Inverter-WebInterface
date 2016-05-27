<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Huebner Inverter</title>
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.css" />
        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/bootstrap.js"></script>
        <script type="text/javascript" src="js/chart.js"></script>
    </head>

    <body>
        <?php include "menu.php" ?>
        <br/><br/>
        <div class="row-fluid">
            <div class="span1"></div>
            <div class="span10">
                <table class="table table-bordered table-striped table-hover" style="clear: both; background-color:#e6e6e6;" id="parameters">
                    <thead class="thead-inverse">
                        <tr>
                            <th class="text-left">Graph</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td ><canvas id="myChart" width="400" height="400"></canvas></td>
                    </tbody>
                </table>
            </div>
        <div class="span1"></div>
        </div>
        <script>
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: 'RPM',
                    data: [12, 19, 3, 5, 2, 3]
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        </script>
    </body>
</html>