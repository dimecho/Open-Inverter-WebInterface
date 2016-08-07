<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
            $(document).on('click', '.browse', function(){
                var file = $(this).parent().parent().find('.file');
                file.trigger('click');
            });

            $(document).on('change', ':file', function() {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val(); //.replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);
            });
            
            $(document).ready( function() {
                $(':file').on('fileselect', function(event, numFiles, label) {
                    $(this).parent().find('.form-control').val($(this).val()); //.replace(/C:\\/i, ''));
                    console.log(numFiles);
                    console.log(label);
                });
            });
            
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/><br/>
            <div class="row">
                <div class="span1"></div>
                <div class="span10">
                    <center>
                        <table class="table table-bordered" style="background-color:#e6e6e6;">
                            <tbody>
                                <tr>
                                    <td>Firmware Flash</td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="file" name="firmware" class="file">
                                        <div class="input-append">
                                            <input type="text" class="form-control" disabled placeholder="Upload Firmware">
                                            <button class="browse btn btn-primary" type="button"><i class="icon-search"></i> Browse</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </div>
                <div class="span1"></div>
            </div>
        </div>
    </body>
</html>