var noise = new SimplexNoise();
var uniforms;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
// |                                                                           | 
// |                         Intialization                                     | 
// |                                                                           | 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function initialize( ) {
  
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var fileLabel = document.querySelector("label.file");
  
  document.onload = function(e){
    fileLabel.classList.add('normal');
    audio.classList.add('active');
    audio.play();
    play();
}
  
  file.onchange = function(){
    fileLabel.classList.add('normal');
    audio.classList.add('active');
    var files = this.files;
    
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();

    play();
  }

function play( ) {

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                           Audio Context                                   | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                               Set Up Scene                                | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt(scene.position);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('out').appendChild(renderer.domElement);

    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = true;

    window.addEventListener( 'resize', function ( ) {
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
    });




    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
    // |                                                                           | 
    // |                           Shader Stuff                                    | 
    // |                                                                           | 
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    uniforms = {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2( ) }
    };
    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;



  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                           Create Mesh                                     | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var planeGeometry = new THREE.PlaneGeometry( 800, 800, 25, 25 );
    // var planeMaterial = new THREE.MeshNormalMaterial({
    //     color: 0x6904ce,
    //     side: THREE.DoubleSide,
    //     wireframe: true
    // });
    var planeMaterialSin = new THREE.ShaderMaterial ({
        uniforms: uniforms,
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShaderSin").textContent,
        transparent: true,
        wireframe: true,
        side: THREE.DoubleSide
    });

    var planeMaterialCos = new THREE.ShaderMaterial ({
        uniforms: uniforms,
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShaderCos").textContent,
        transparent: true,
        wireframe: true,
        side: THREE.DoubleSide
    });
    
    var plane = new THREE.Mesh( planeGeometry, planeMaterialSin );
    plane.rotation.x = 0.5 * Math.PI;
    plane.position.set( 0, 75, 0 );
    group.add( plane );
    
    var plane2 = new THREE.Mesh( planeGeometry, planeMaterialCos );
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.position.set( 0, -75, 0 );
    group.add( plane2 );

    // var ballGeometry = new THREE.IcosahedronGeometry( 10, 4 );
    var sphereGeometry = new THREE.SphereGeometry( 10, 64, 64 );
    var ballMaterial = new THREE.MeshLambertMaterial({
        // color: 0x000000,
        vertexColors: THREE.FaceColors,
        transparent: true,
        wireframe: true
    });

    // var ball = new THREE.Mesh( ballGeometry, ballMaterial );
    var ball = new THREE.Mesh( sphereGeometry, ballMaterial );
    group.add( ball );

    var ambientLight = new THREE.AmbientLight( 0xffffff );
    ambientLight.intensity = 0.1;
    scene.add( ambientLight );

    var intensity_SP = 0.8;

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.intensity = intensity_SP;
    spotLight.position.set(0, 75, 0);
    spotLight.lookAt( ball );
    spotLight.castShadow = true;
    group.add( spotLight );

    var spotLight2 = new THREE.SpotLight( 0xffffff );
    spotLight2.intensity = intensity_SP;
    spotLight2.position.set(0, -75, 0);
    spotLight2.lookAt( ball );
    spotLight2.castShadow = true;
    group.add( spotLight2 );

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.intensity = intensity_SP;
    spotLight.position.set(75, 0, 0);
    spotLight.lookAt( ball );
    spotLight.castShadow = true;
    group.add( spotLight );

    var spotLight2 = new THREE.SpotLight( 0xffffff );
    spotLight2.intensity = intensity_SP;
    spotLight2.position.set(-75, 0, 0);
    spotLight2.lookAt( ball );
    spotLight2.castShadow = true;
    group.add( spotLight2 );

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.intensity = intensity_SP;
    spotLight.position.set(0, 0, 75);
    spotLight.lookAt( ball );
    spotLight.castShadow = true;
    group.add( spotLight );

    var spotLight2 = new THREE.SpotLight( 0xffffff );
    spotLight2.intensity = intensity_SP;
    spotLight2.position.set(0, 0, -75);
    spotLight2.lookAt( ball );
    spotLight2.castShadow = true;
    group.add( spotLight2 );






    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
    // |                                                                           | 
    // |                         Animation Loop                                    | 
    // |                                                                           | 
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    scene.add( group );
    var startTime = Date.now();
    animate();

    function update( ) {
        var elapsedMilliseconds = Date.now() - startTime;
        var elapsedSeconds = elapsedMilliseconds / 1000;
        uniforms.time.value = elapsedSeconds / 2;

    }

    function render( ) {
        analyser.getByteFrequencyData( dataArray );

        var lowerHalfArray = dataArray.slice( 0, (dataArray.length/2) - 1 );
        var upperHalfArray = dataArray.slice( (dataArray.length/2) - 1, dataArray.length - 1 );

        var overallAvg = avg( dataArray );
        var lowerMax = max( lowerHalfArray );
        var lowerAvg = avg( lowerHalfArray );
        var upperMax = max( upperHalfArray );
        var upperAvg = avg( upperHalfArray );

        var lowerMaxFr = lowerMax / lowerHalfArray.length;
        var lowerAvgFr = lowerAvg / lowerHalfArray.length;
        var upperMaxFr = upperMax / upperHalfArray.length;
        var upperAvgFr = upperAvg / upperHalfArray.length;

        makeRoughGround( plane, modulate( upperAvgFr, 0, 1, 0.5, 4 ) );
        makeRoughGround( plane2, modulate( lowerMaxFr, 0, 1, 0.5, 4) );

        makeRoughBall( ball, modulate( Math.pow( lowerMaxFr, 0.8 ), 0, 1, 0, 8 ), modulate( upperAvgFr, 0, 1, 0, 4 ) );

        group.rotation.y += 0.0035;
        renderer.render( scene, camera );
    }

    function animate( ) {
        requestAnimationFrame(animate);
        update( );
        render( );
    }


    function makeRoughBall(mesh, bassFr, treFr) {
        var vertices = mesh.geometry.vertices
        var faces = mesh.geometry.faces;

        var x;
        for ( var i = 0; i < faces.length; i++ ) {
            var vertex;
            if (i % 2 == 0) {
                vertex = vertices[i/2];

                var offset = mesh.geometry.parameters.radius;
                var amp = 7;
                var time = window.performance.now();
                vertex.normalize();
                var rf = 0.00001;
                var distance = (offset + bassFr) + noise.noise3D( vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9 ) * amp * treFr;
                vertex.multiplyScalar( distance );
            }
            

            var face = faces[i];

            x = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
            face.color = new THREE.Color( vertex.x/x, vertex.y/x, vertex.z/x );    
        }

        // corrective for missing vertices
        for ( var j = vertices.length - (faces.length % vertices.length); j < vertices.length; j ++ ) {
            var vertex = vertices[j];
            var offset = mesh.geometry.parameters.radius;
            var amp = 7;
            var time = window.performance.now();
            vertex.normalize();
            var rf = 0.00001;
            var distance = (offset + bassFr) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
            vertex.multiplyScalar(distance);
        }


        mesh.geometry.elementsNeedUpdate = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }


    function makeRoughGround(mesh, distortionFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var amp = 3;
            var time = Date.now();
            var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
            vertex.z = distance;
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    audio.play();
  };
}


// calls main function
window.onload = initialize();

document.body.addEventListener('touchend', function(ev) { context.resume(); });




//some helper functions here
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}

var randomColor = function ( ) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var n_ = 1;

var clockScaler = function ( mesh ) {
    var t = uniforms.time.value/n_;
    mesh.scale.set( Math.abs( Math.cos( t ) ), Math.abs( Math.cos( t ) ), Math.abs( Math.cos( t ) ) );
};

var invClockScaler = function ( mesh ) {
    var t = uniforms.time.value/n_;
    mesh.scale.set( 1/Math.abs( Math.cos( t ) ), 1/Math.abs( Math.cos( t ) ), 1/Math.abs( Math.cos( t ) ) );
    // NOTE: using tan for all three creates a 0 to inf scaling mesh
};

var clockRotatorSin = function ( mesh ) {
    var t = uniforms.time.value/n_;
    mesh.rotation.set( Math.sin( t ), Math.cos( t ), Math.tan( t ) );
};

var clockRotatorCos = function ( mesh ) {
    var t = uniforms.time.value/n_;
    mesh.rotation.set( Math.cos( t ), Math.tan( t ), Math.sin( t ) );
}

var clockRotatorTan = function ( mesh ) {
    var t = uniforms.time.value/n_;
    mesh.rotation.set( Math.tan( t ), Math.sin( t ), Math.cos( t ) );
}

var rotator = function ( mesh ) {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.005;
}