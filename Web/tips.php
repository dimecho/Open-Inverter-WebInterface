<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
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
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
             <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <table class="table table-bordered" width="100%">
                        <tbody>
                            <tr>
                                <td><ul id="tips"></ul></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>