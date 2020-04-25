<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>$(document).ready(function(){buildMenu()})</script>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col" align="center">
                    <hr>
                    <div class="container table-active table-bordered">
                        <div class="row p-2">
                            <div class="col">
                                <button type="button" class="btn btn-primary" onclick="eval(checkSoftware('inkscape'))"><i class="icons icon-gear"></i> Inkscape (2D)</button>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-primary" onclick="eval(checkSoftware('openscad'))"><i class="icons icon-gear"></i> OpenSCAD (3D)</button>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <ul>
                                    <li>Use Inkscape to generate 2D vector stencil for laser cuts.</li>
                                    <li>Use OpenSCAD to export shape for 3D printing.</li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active table-bordered">
                        <tr>
                            <td>
                                <a data-fancybox="gallery" href="encoder/img/encoder_2d.png">
                                    <img src="encoder/img/encoder_2d.png" class="img-thumbnail rounded" />
                                </a>
                            </td>
                            <td>
                                <a data-fancybox="gallery" href="encoder/img/encoder_3d.png">
                                    <img src="encoder/img/encoder_3d.png" class="img-thumbnail rounded" />
                                </a>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                 <ul>
                                    <li>TCST2103 is connected with an output at D+</li>
                                    <li>All required resistors are built into the main board.</li>
                                </ul>
                                There are two types of encoders, transmissive (gap type) as TCST2103 and reflective.<br>
                                The larger the gap of encoder wheel the more problems will occur with ambient light.
                                <a href="http://heliosoph.mit-links.info/make-your-own-rotary-encoder/" target="_blank">More Info</a>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active table-bordered">
                        <tr align="center">
                            <td>
                                <img src="encoder/img/TCST2103x1.png" class="img-thumbnail rounded" />
                            </td>
                            <td>
                                <img src="encoder/img/TCST2103.jpg" class="img-thumbnail rounded" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
		<form action="open.php" method="POST" enctype="multipart/form-data">
			<input type="file" name="file" class="fileSVG" hidden onchange="javascript:this.form.submit();" accept=".svg">
			<input type="submit" hidden>
		</form>
    </body>
</html>