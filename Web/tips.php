<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
            $(document).ready(function () {
                $.ajax("tips.csv", {
                    success: function success(data)
                    {
                        var row = data.split("\n");
                        var ul = $("#tips");
                        for (var i = 0; i < row.length; i++)
                        {
                            var li = $("<li>").append(row[i]);
                            ul.append(li);
                        }
                    }
                });
            });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
             <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered table-striped" width="100%">
                        <tr>
                            <td><ul id="tips"></ul></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>