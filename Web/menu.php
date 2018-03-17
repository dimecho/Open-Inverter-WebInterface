<div class="row">
    <div class="col">
        <nav class="navbar" id="buildNav"></nav>
        <form enctype="multipart/form-data" action="/open.php" method="POST">
            <input type="file" name="file" class="fileSVG" hidden onchange="javascript:this.form.submit();" accept=".svg">
            <input type="submit" hidden>
        </form>
        <form enctype="multipart/form-data" action="/snapshot.php" method="POST">
            <input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();" accept=".txt">
            <input type="submit" hidden>
        </form>
    </div>
</div>