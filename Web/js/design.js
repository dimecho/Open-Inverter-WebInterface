var canvas, camera, scene, model, orbit, renderer;
var explodeValue;
var explodeDirection = [];
var renderColor = 0xffffff;
var gridColor = 0xabb2b9;

$(document).ready(function () {
    buildMenu(function () {});
});

function initialize3D(id) {

	if(theme == '.slate') {
		renderColor = 0xabb2b9;
		gridColor = 0xffffff;          
    }

    $('#explode').ionRangeSlider({
        skin: 'big',
        //grid: true,
        min: 0,
        max: 30,
        from: 0,
        step: 1,
        onChange: function (e) {

            var value = e.from;
        
            if (value === 0) {

                scene.traverse (function (mesh) {
                    //if(mesh instanceof THREE.Mesh) {
                    if(mesh.geometry) {
                        //console.log(mesh);
                        mesh.position.x = mesh.original[0];
                        mesh.position.y = mesh.original[1];
                        mesh.position.z = mesh.original[2];
                    }
                });

            }else if(explodeValue < value){

                explode(true,value);

            }else if(explodeValue > value){

                explode(false,value);
            }
            explodeValue = value;
        }
    });

    canvas = document.getElementById('canvas');
	/*
    canvas.addEventListener('webglcontextlost', function(event) {
        event.preventDefault();
    }, false);
    canvas.addEventListener(
    'webglcontextrestored', setupWebGLStateAndResources, false);
    */
    setupWebGLStateAndResources(id);

    window.addEventListener('resize', function() {
        //camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
	    camera.aspect = canvas.clientWidth / canvas.clientHeight;
	    camera.updateProjectionMatrix();
        //renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
	    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	});

    animate();
};

function  setupWebGLStateAndResources(id) {

    scene = new THREE.Scene();

    //var ambient = new THREE.AmbientLight(0xE0E0E0);
    var ambient = new THREE.AmbientLight(0xC1C1C1);
    scene.add(ambient);

    var grid = new THREE.GridHelper(5, 20, gridColor, gridColor);
    grid.position.y = -1;
    scene.add(grid);

    /*
    var light = new THREE.DirectionalLight(0xE0E0E0 , 0.8);
    light.position.set(0, -1, 0);
    //scene.add(light);

    var spotLight = new THREE.SpotLight(0xE0E0E0);
    spotLight.position.set(-1, 20, -1);
    //scene.add(spotLight);

    var hemiLight = new THREE.HemisphereLight(0xE5E5E5, 0xE5E5E5, 0.8);
    hemiLight.position.set(10, 40, 10);
    //scene.add(hemiLight);

    var pointLight = new THREE.PointLight(0xffaa00);
    pointLight.position.set(0, 0, 0);
    //scene.add(pointLight);
    */

    var directionalLight = new THREE.DirectionalLight(0xE5E5E5);
    directionalLight.position.set(0, 10, -1 ).normalize();
    scene.add(directionalLight);


    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(renderColor, 1.0);

    //renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFShadowMap;
    //renderer.state.setBlending(THREE.NoBlending);

    camera = new THREE.PerspectiveCamera(20, canvas.clientWidth/canvas.clientHeight, 0.1, 50);
    scene.add(camera);

    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    orbit.zoomSpeed = 0.5;

    //https://threejs.org/docs/#examples/en/loaders/GLTFLoader
    
    //renderer.physicallyCorrectLights = true;
    //renderer.gammaOutput = true;
    //renderer.gammaFactor = 2.0;
    
    var loader = new THREE.GLTFLoader();
    loader.setResourcePath('js/3d/textures/');

    //Provide a DRACOLoader instance to decode compressed mesh data
    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('js/3d/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    
    loader.load('js/3d/models/' + id + '.glb', function (object) {

        var movementSpeed = 0.1;

        camera.position.set(5, 10, 5);

        //object.rotation.y = -90;

        scene.add(object.scene);

        scene.traverse(function (mesh) {

            //if(mesh instanceof THREE.Mesh) {
            if(mesh.geometry) {
                //console.log(mesh);

                /*
                mesh.geometry.computeFaceNormals();
                mesh.geometry.computeVertexNormals();
                mesh.geometry.computeBoundingBox();
                mesh.geometry.normalsNeedUpdate = true;
                mesh.geometry.verticesNeedUpdate = true;
                */

                /*
                mesh.material.flatShading = THREE.FlatShading;
                //mesh.receiveShadow = false; // or false
                //mesh.material.needsUpdate = true;
                */
                
                mesh.original = [mesh.position.x,mesh.position.y,mesh.position.z];

                //var distance = mesh.geometry.boundingSphere.center.distanceTo(vector) * 1;
                explodeDirection.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
            }
        });
    },undefined, function (error) {
        console.error(error);
    });
    camera.lookAt(scene.position);
};

function fill3DTable() {

    var table = $('#ideaTable');
    var tbody = $('<tbody>');
    var tr = $('<tr>');
    var td = $('<td>',{align:'center'});

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            $.each(xhr.response.list, function () {
                var a = $('<a>', { href: 'design.php?id=' + this.id });
                var img = $('<img>', { src: 'js/3d/models/' + this.id + '.png', class: 'img-thumbnail rounded', style: 'margin:10px;width:400px;height:220px'});
                td.append(a.append(img));
            });
        }else{
            $.notify({ message: xhr.status },{ type: 'danger' });
        }
    };
    xhr.open('GET', 'js/3d/models/index.json', true);
    xhr.send();
    
    table.append(tbody.append(td.append(td)));
};

function explode(outwards, value) {
    /*
    06-particles-postprocessing/06.06-explode-geometry-model.html
    */

    var dir = outwards === true ? 1 : -1;
    var count = 0;

    scene.traverse (function (mesh)
    {
    	//if(mesh instanceof THREE.Mesh) {
        if(mesh.geometry) {
            mesh.position.x += explodeDirection[count].x * value * dir; 
            mesh.position.y += explodeDirection[count].y * value * dir;
            mesh.position.z += explodeDirection[count].z * value * dir;
            //mesh.geometry.verticesNeedUpdate = true;
            count++;
        }
    });
};

function animate() {
	requestAnimationFrame(animate);
    renderer.render(scene,camera);
    orbit.update();
    //camera.lookAt(scene.position);
};