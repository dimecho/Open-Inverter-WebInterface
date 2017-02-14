<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
             <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <button type="button" class="btn btn-primary" onClick="<?php checkInkscape(); ?>"><i class="glyphicon glyphicon-cog"></i> Inkscape (2D)</button>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-primary" onClick="<?php checkOpenSCAD(); ?>"><i class="glyphicon glyphicon-cog"></i> OpenSCAD (3D)</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <ul>
                                        <li>Use Inkscape to generate 2D vector stencil for laser cuts.</li>
                                        <li>Use OpenSCAD to export shape for 3D printing.</li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <a href="img/encoder_2d.png" data-lightbox="image-1">
                                        <img src="img/encoder_2d.png" class="img-thumbnail img-rounded" />
                                    </a>
                                </td>
                                <td>
                                    <a href="img/encoder_3d.png" data-lightbox="image-2">
                                        <img src="img/encoder_3d.png" class="img-thumbnail img-rounded" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                     <ul>
                                        <li>TCST2103 is connected with an output at D+</li>
                                        <li>All required resistors are built into the main board.</li>
                                    </ul>
                                    There are two types of encoders, transmissive (gap type) as TCST2103 and reflective.<br/>
                                    The larger the gap of encoder wheel the more problems will occur with ambient light.
                                    <a href="http://heliosoph.mit-links.info/make-your-own-rotary-encoder/" target="_blank">More Info</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <center>
                                        <img src="img/TCST2103.png" class="img-thumbnail img-rounded" />
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        <img src="bom/img/TCST2103.jpg" class="img-thumbnail img-rounded" />
                                    </center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>