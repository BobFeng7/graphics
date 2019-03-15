$(document).ready(function () {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                               Set Up                                      | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Create Scene, Camera, and Renderer
  var scene = new THREE.Scene( );
  var aspect = window.innerWidth / window.innerHeight;
  var camera = new THREE.PerspectiveCamera( 50, aspect, 0.1, 1000 );
  var renderer = new THREE.WebGLRenderer( );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Adjust aspect ratio
  window.addEventListener( 'resize', function ( ) 
  {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
  });

  // Move camera to initial orientation
  camera.position.set( 25, 0, 0 );

  controls = new THREE.OrbitControls( camera, renderer.domElement );



  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                               Audio Stuff                                 | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //get the audio context
  var audioContext = new AudioContext();

  //create the javascript node
  var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  javascriptNode.connect(audioContext.destination);

  //create the source buffer
  var sourceBuffer = audioContext.createBufferSource();

  //create the analyser node
  var analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 512;

  //connect source to analyser
  sourceBuffer.connect( analyser );

  //analyser to speakers
  analyser.connect( javascriptNode );

  //connect source to analyser
  sourceBuffer.connect( audioContext.destination );

  //this is where we animates the bars
  javascriptNode.onaudioprocess = function () {

      // get the average for the first channel
      var array = new Uint8Array( analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);

      //render the scene and update controls
      renderer.render( scene, camera );
      controls.update( );

      // var step = Math.round(array.length / visualizer.numberOfBars);

      //Iterate through the bars and scale the z axis
      // for (var i = 0; i < visualizer.numberOfBars; i++) {
      //     var value = array[i * step] / 4;
      //     value = value < 1 ? 1 : value;
      //     visualizer.bars[i].scale.z = value;
      // }
      var value = array[0];
      console.log(value);
      sphere.scale.x = value/150;
      sphere.scale.y = value/150;
      sphere.scale.z = value/150;
  }
  var start = function ( buffer ) 
  {
    audioContext.decodeAudioData(buffer, decodeAudioDataSuccess, decodeAudioDataFailed);

    function decodeAudioDataSuccess(decodedBuffer) {
        sourceBuffer.buffer = decodedBuffer
        sourceBuffer.start(0);
    }

    function decodeAudioDataFailed() {
        debugger
    }
  }
  

  //drag Enter
  document.body.addEventListener("dragenter", function () {
     
  }, false);

  //drag over
  document.body.addEventListener("dragover", function (e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
  }, false);

  //drag leave
  document.body.addEventListener("dragleave", function () {
     
  }, false);

  //drop
  document.body.addEventListener("drop", function (e) {
      e.stopPropagation();

      e.preventDefault();

      //get the file
      var file = e.dataTransfer.files[0];
      var fileName = file.name;

      $("#guide").text("Playing " + fileName);

      var fileReader = new FileReader();

      fileReader.onload = function (e) {
          var fileResult = e.target.result;
          start(fileResult);
      };

      fileReader.onerror = function (e) {
        debugger
      };
     
      fileReader.readAsArrayBuffer(file);
  }, false);


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                           Shader Stuff                                    | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  var uniforms = {
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
  var shaderMaterial = new THREE.ShaderMaterial (
  {
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    transparent: true,
    wireframe: true
  });
  shaderSphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 7, 36, 36 ), shaderMaterial );
  scene.add( shaderSphere );

  var shaderMaterial2 = new THREE.ShaderMaterial (
  {
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader2").textContent,
    fragmentShader: document.getElementById("fragmentShader2").textContent,
    transparent: true,
    wireframe: true
  });
  shaderSphere2 = new THREE.Mesh( new THREE.SphereBufferGeometry( 7, 36, 36 ), shaderMaterial2 );
  scene.add( shaderSphere2 );


  var sphereGeometry = new THREE.SphereGeometry( 5, 30, 30 )
  var sphereGeometry2 = new THREE.SphereGeometry( 5, 30, 30 )
  var sphereMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
  var sphereMaterial2 = new THREE.MeshNormalMaterial( { wireframe: true } );
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  var sphere2 = new THREE.Mesh( sphereGeometry2, sphereMaterial2 );
  var sphere3 = new THREE.Mesh( sphereGeometry2, sphereMaterial2 );
  scene.add( sphere );
  scene.add( sphere2 );
  scene.add( sphere3 );



  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                           Helper Functions                                | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  var randomColor = function ( ) 
  {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  var clockScaler = function ( obj ) 
  {
    var t = uniforms.time.value/2;
    obj.scale.set( Math.abs( Math.cos( t ) ), Math.abs( Math.cos( t ) ), Math.abs( Math.cos( t ) ) );
  };

  var invClockScaler = function ( obj ) 
  {
    var t = uniforms.time.value/2;
    obj.scale.set( 1/Math.abs( Math.cos( t ) ), 1/Math.abs( Math.cos( t ) ), 1/Math.abs( Math.cos( t ) ) );
    // NOTE: using tan for all three creates a 0 to inf scaling obj
  };

  var clockRotatorSin = function ( obj ) 
  {
    var t = uniforms.time.value/2;
    obj.rotation.set( Math.sin( t ), Math.cos( t ), Math.tan( t ) );
  };

  var clockRotatorCos = function ( obj ) 
  {
    var t = uniforms.time.value/2;
    obj.rotation.set( Math.cos( t ), Math.tan( t ), Math.sin( t ) );
  }

  var clockRotatorTan = function ( obj ) 
  {
    var t = uniforms.time.value/2;
    obj.rotation.set( Math.tan( t ), Math.sin( t ), Math.cos( t ) );
  }

  var rotator = function ( obj ) 
  {
    obj.rotation.x += 0.005;
    obj.rotation.y += 0.005;
    obj.rotation.z += 0.005;
  }

  var sphereHandler = function ( ) 
  {
    // clockRotatorSin( sphere );
    // clockScaler( sphere );
    
    clockRotatorCos( sphere2 );
    invClockScaler( sphere2 );

    clockRotatorTan( sphere3 );
  }


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  // |                                                                           | 
  // |                           Animation Loops                                 | 
  // |                                                                           | 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Called every frame at anything you're checking, if you're moving something etc.
  var update = function ( ) 
  {
    var elapsedMilliseconds = Date.now() - startTime;
    var elapsedSeconds = elapsedMilliseconds / 1000;
    uniforms.time.value = elapsedSeconds / 2;
    sphereHandler( );
  };

  // Called every frame to draw the scene
  var render = function ( ) 
  {
    
    renderer.render( scene, camera );
  };

  // called every animation frame as the master game loop, calls UPDATE and RENDER
  var Animate = function ( ) 
  {
    requestAnimationFrame( Animate );
    update( );
    render( );
  };

  var startTime = Date.now();
  Animate( );
});