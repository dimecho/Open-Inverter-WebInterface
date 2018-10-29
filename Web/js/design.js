var camera, scene, renderer;
var explodeValue;
var explodeDirection = [];

function initialize3D(id) {

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xE0E0E0, 0.02);

    camera = new THREE.PerspectiveCamera(20, window.innerWidth*0.7 / window.innerHeight*0.9, 0.1, 50);
    scene.add(camera);

    //var ambient = new THREE.AmbientLight( 0xE0E0E0 );
    var ambient = new THREE.AmbientLight( 0xC1C1C1);
    scene.add(ambient);

    var grid = new THREE.GridHelper( 5, 20, 0xffffff, 0xffffff);
    grid.position.y = -1;
    scene.add(grid);
    
    var light = new THREE.DirectionalLight(0xE0E0E0 , 0.8);
    light.position.set( 0, -1, 0 );
    scene.add(light);

    var spotLight = new THREE.SpotLight(0xE0E0E0);
    spotLight.position.set(-1, 20, -1);
    //scene.add(spotLight);

    var hemiLight = new THREE.HemisphereLight( 0xE5E5E5, 0xE5E5E5, 0.8);
    hemiLight.position.set( 10, 40, 10 );
    //scene.add(hemiLight);

    var directionalLight = new THREE.DirectionalLight( 0xE5E5E5);
    directionalLight.position.set(0, 10, -1 ).normalize();
    scene.add( directionalLight );

    var pointLight = new THREE.PointLight( 0xffaa00 );
    pointLight.position.set( 0, 0, 0 );
    //scene.add( pointLight );

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth*0.7, window.innerHeight*0.9);
    //renderer.setClearColor(scene.fog.color);
    renderer.setClearColor( scene.fog.color, 1 );
    document.getElementById('container').appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.zoomSpeed = 0.5;

    var manager = new THREE.LoadingManager();
    //var loader = new THREE.JSONLoader(manager);
    var loader = new THREE.ObjectLoader(manager);

    loader.setTexturePath("3d/textures/");

    /*
    loader.load("3d/" + id + ".json", function( geometry, materials ) {
        for ( var i = 0; i < materials.length; i ++ ) {
            var m = materials[ i ];
             m.morphTargets = true;
             console.log(m);
        }
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add( mesh );
    } );
    */
    
    loader.load("3d/" + id + ".json", function (object) {
    
        object.rotation.y = -90;
        scene.add(object);
        camera.position.set(5, 10, 5);

        var movementSpeed = 0.1;
        
        /*
        object.traverse( function(child) {
            if( child instanceof THREE.Mesh ) {
            child.material = new THREE.MeshBasicMaterial( { color: 0x009900, wireframe: true, vertexColors: THREE.VertexColors } ); 
            //child.scale.set(20,20,20);
                object.add( child );
            }
        });
        */
        
        scene.traverse(function (mesh) {

            if(mesh instanceof THREE.Mesh) {
        
                //mesh.geometry.computeFaceNormals();
                //mesh.geometry.computeVertexNormals();
                mesh.geometry.computeBoundingBox();

                //Blender Exporter Fix
                if(mesh.name.indexOf("Cube") !== -1)
                    mesh.material.opacity = 0.6;

                mesh.material.shading = THREE.FlatShading;
                
                mesh.original = [mesh.position.x,mesh.position.y,mesh.position.z];

                //var distance = mesh.geometry.boundingSphere.center.distanceTo(vector) * 1;
                explodeDirection.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
            }
        });
    });
    
    window.addEventListener( 'resize', onWindowResize, false );

    animate();

    $("#explode").slider({
        min: 0,
        max: 100,
        value: 0,
        step: 1
    }).on('slide', function() {
        
        var value = $("#explode").slider('getValue');
        
        if (value === 0) {

            scene.traverse (function (object) {
                if(object.geometry)
                {
                    object.position.x = object.original[0];
                    object.position.y = object.original[1];
                    object.position.z = object.original[2];
                }
            });

        }else if(explodeValue < value){

            explode(true,value);

        }else if(explodeValue > value){

            explode(false,value);
        }
        explodeValue = value;
    });
};

function fill3DTable() {

    var table = $("#ideaTable");
    var tbody = $("<tbody>");
    var tr = $("<tr>");
    var td = $("<td>",{align:"center"});

    $.ajax("3d/index.json", {
        contentType: "application/json",
        dataType: "json",
        success: function success(data) {
            $.each(data.list, function () {
                var a = $("<a>", { href: "design.php?id=" + this.id });
                var img = $("<img>", { src: "3d/" + this.id + ".png", class: "rounded", style: "margin:10px;width:400px;height:220px"});
                td.append(a.append(img));
            });
        },
        error: function error(request, status, error) {
            $.notify({ message: error },{ type: 'danger' });
        }
    });

    table.append(tbody.append(td.append(td)));
};

function explode(outwards, value) {
    
    var dir = outwards === true ? 1 : -1;
    var i = 0;

    scene.traverse (function (object)
    {
        if(object.geometry){

            object.position.x += explodeDirection[i].x * dir; 
            object.position.y += explodeDirection[i].y * dir;
            object.position.z += explodeDirection[i].z * dir;
            
            //object.geometry.verticesNeedUpdate=true;
            i++;
        }
    });
};

function onWindowResize() {

    camera.aspect = window.innerWidth*0.7 / window.innerHeight*0.9;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth*0.7, window.innerHeight*0.9);
};

function animate() {

    requestAnimationFrame(animate);
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
};