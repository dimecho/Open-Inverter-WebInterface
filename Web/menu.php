<div class="row">
    <div class="col">
        <nav class="navbar" id="buildNav"></nav>
        <form action="open.php" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" class="fileSVG" hidden onchange="javascript:this.form.submit();" accept=".svg">
            <input type="submit" hidden>
        </form>
        <form action="snapshot.php" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();" accept=".txt">
            <input type="submit" hidden>
        </form>
    </div>
</div>