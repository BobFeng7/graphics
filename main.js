
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
camera.position.z = 15;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
// |                                                                           | 
// |                           Shader Stuff                                    | 
// |                                                                           | 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// const canvas = document.querySelector("#glCanvas");
// // Initialize the GL context
// const gl = canvas.getContext("webgl");
const gl = renderer.domElement.getContext("webgl");


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var uniforms, material, mesh;
var mouseX = 0,
  mouseY = 0,
  lat = 0,
  lon = 0,
  phy = 0,
  theta = 0;

var aspectRatio = window.innerWidth / window.innerHeight;
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


var shaderMaterial = new THREE.ShaderMaterial (
{
  uniforms: uniforms,
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  transparent: true,
  wireframe: true
});
shaderSphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 7, 32, 32 ), shaderMaterial );
scene.add( shaderSphere );

var shaderMaterial = new THREE.ShaderMaterial (
{
  uniforms: uniforms,
  vertexShader: document.getElementById("vertexShader2").textContent,
  fragmentShader: document.getElementById("fragmentShader2").textContent,
  transparent: true,
  wireframe: true
});
shaderSphere2 = new THREE.Mesh( new THREE.SphereBufferGeometry( 7, 32, 32 ), shaderMaterial );
scene.add( shaderSphere2 );




var sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 )
var sphereGeometry2 = new THREE.SphereGeometry( 5, 32, 32 )
var sphereMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
var sphereMaterial2 = new THREE.MeshNormalMaterial( { wireframe: true } );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
var sphere2 = new THREE.Mesh( sphereGeometry2, sphereMaterial2 );
scene.add( sphere );
scene.add( sphere2 );



// var torusKnotGeometry = new THREE.TorusKnotGeometry(  5, 0.5, 128, 32 );
// var torusKnotMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
// var torusKnot1 = new THREE.Mesh( torusKnotGeometry, torusKnotMaterial );
// scene.add( torusKnot1 );




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
// |                                                                           | 
// |                           Helper Functions                                | 
// |                                                                           | 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// set interval function structure
var setTimer = function ( time ) 
{
  var timer = setInterval( function ( ) 
  {
    // Do something here
  }, time);
};

// sphere shrinking
var clockScaler = function ( obj ) 
{
  var t = uniforms.time.value;
  
  obj.scale.x = Math.abs(Math.cos(t));
  obj.scale.y = Math.abs(Math.cos(t));
  obj.scale.z = Math.abs(Math.cos(t));
  
};

var clockRotator = function ( obj ) 
{
  var t = uniforms.time.value;
  obj.rotation.set( Math.sin( t ), Math.cos( t ) , Math.tan( t ) );
};

var rotator = function ( obj ) 
{
  obj.rotation.x += 0.005;
  obj.rotation.y += 0.005;
  obj.rotation.z += 0.005;
}

var sphereHandler = function ( ) 
{
  clockScaler( sphere );
  clockRotator( sphere2 );
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
  // meshClockRotator( torusKnot1 );
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
