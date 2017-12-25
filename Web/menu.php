<div class="row">
    <div class="col">
        <nav class="navbar" id="buildNav"></nav>
        <div id="potentiometer" style="display:none">
            <center>
                <input class="knob" data-displayinput="true" data-min="0" data-max="100"
                data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0">
            </center>
            <br>
        </div>
        <form enctype="multipart/form-data" action="/open.php" method="POST">
            <input type="file" name="file" class="fileSVG" hidden onchange="javascript:this.form.submit();"
            accept=".svg">
            <input type="submit" hidden>
        </form>
        <form enctype="multipart/form-data" action="/snapshot.php" method="POST">
            <input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();"
            accept=".txt">
            <input type="submit" hidden>
        </form>
    </div>
</div>