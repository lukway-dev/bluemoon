import React, { useRef, useState } from 'react'
import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ObjectControls } from 'threejs-object-controls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import BlueMoonGLB from '../assets/BlueMoon_full.glb'
import AsteroidsGLB from '../assets/Asteroids.glb'
import LightBeamGLB from '../assets/LightBeam_n.glb'

import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import cratersData from '../database/cratersData';
import { useEffect } from 'react';
// import BlueMoonGLB from '../assets/BlueMoon.glb'

const Planet = () => {
  const canvasRef = useRef(null)
  const [ state, setState ] = useState(true)
  const { setModal } = useContext(AppContext)

  // var rayo_luz, rayo_luz_1, rayo_luz_2, rayo_luz_3, rayo_luz_4,son_rayo_luz;
  // var asteroide_1, asteroide_2, asteroide_3, asteroide_4, asteroide_5, asteroide_6;
  // var mat_asteroide_1, mat_asteroide_2, mat_asteroide_3, mat_asteroide_4, mat_asteroide_5, mat_asteroide_6;
  // var geom_asteroide_1, geom_asteroide_2, geom_asteroide_3, geom_asteroide_4, geom_asteroide_5, geom_asteroide_6;

  useEffect(() => {
    if(canvasRef.current && state) {
      let camera;
      let composer, renderer, labelRenderer, moonLabel, scene;
      let model, asteroides, LightBeam, LightBeam_2, LightBeam_3, LightBeam_4, LightBeam_5;
      let textContainer, imgNft, text;
      let poin, poin_1, poin_2, poin_3, poin_4;
      let controls
      const labels = [];
      const elapsedtime = 0.05;
      // let moonControls
      let group = new THREE.Group();
      // let groupHalos = new THREE.Group();
      const params = {
        exposure: 1,
        bloomStrength: 1.2,
        bloomThreshold: 0.085,
        bloomRadius: 0.5,
        rotation: 3.14,
        position: 3
      };
      const mouse = new THREE.Vector2();
      const raycast = new THREE.Raycaster();
      const prueba = new THREE.Group();
      // const clock = new THREE.Clock();

      var targetRotationX = 0.5;
      var targetRotationOnMouseDownX = 0;
      var targetRotationY = 0.2;
      var targetRotationOnMouseDownY = 0;
      var mouseX = 0;
      var mouseXOnMouseDown = 0;
      var mouseY = 0;
      var mouseYOnMouseDown = 0;
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;
      var slowingFactor = 0.25;

      init();

      function init() {
        // const container = document.getElementById( 'container' );

        // stats = new Stats();
        // container.appendChild( stats.dom );

        renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.getElementById('planet')});
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ReinhardToneMapping;
        // container.appendChild( renderer.domElement );
        //render de label html 2D
        labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize( window.innerWidth, window.innerHeight );
        labelRenderer.domElement.style.position = 'absolute';
        // labelRenderer.domElement.style.pointerEvents = 'none';
        document.getElementById('controls').appendChild( labelRenderer.domElement );

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 9000 );
        camera.position.set(-5, 2.5, -2.5);
        camera.layers.enableAll();
        //camera.layers.enable(1);

        controls = new OrbitControls( camera, labelRenderer.domElement );
        // controls.maxPolarAngle = Math.PI * 0.5;
        // controls.minDistance = 1;
        // controls.maxDistance = 10;
        controls.enableZoom=false;
        controls.autoRotate = true;
        // controls.autoRotateSpeed = 0.2;
        controls.autoRotateSpeed = 0.5;
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = -Math.PI/3;
        controls.maxDistance = 5;
        controls.minDistance = 2;
        controls.rotateSpeed = 0.2;
        controls.panSpeed = 2.3;
        controls.screenSpacePanning = true;
        controls.enableDamping = true;
        controls.dampingFactor = 0.6;
        let pr = new THREE.Vector3();
        pr.set(-0.3, 0, -1);
        controls.target = pr;
        // camera.position.set(-0.3, 0.25, -2);
        // let vs = new THREE.Vector3(0,0,0);
        // controls.target= vs;
        // controls.update();

        //directional light
        // var light = new THREE.DirectionalLight(0xffffff, 0.75);
        // light.position.setScalar(100);
        // scene.add(light);
        // const helper = new THREE.CameraHelper( light.shadow.camera );
        // scene.add( helper );
        scene.add( new THREE.AmbientLight( 0x404040, 0.25 ) );
        //scene.background = new THREE.Color(0x075CDF);
        //const pointLight = new THREE.PointLight( 0xffffff, 1 );
        //camera.add( pointLight );

        const renderScene = new RenderPass( scene, camera );

        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;
        bloomPass.renderToScreen = true;

        composer = new EffectComposer( renderer );
        composer.addPass( renderScene );
        composer.addPass( bloomPass );

        //fondo con estrellas
        const vertices = [];
        for(let i=0; i<3000; i++){
          const x = THREE.MathUtils.randFloatSpread( 2000 );
          const y = THREE.MathUtils.randFloatSpread( 2000 );
          const z = THREE.MathUtils.randFloatSpread( 2000 );
          vertices.push( x, y, z );
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        const material = new THREE.PointsMaterial( { size:0.5, color:0xffffff, transparent: true } );
        const estrellas = new THREE.Points( geometry, material );
        scene.add(estrellas);
        //textura
        const textura = new THREE.TextureLoader().load('/examples/textures/planets/moon_1024.jpg');

        var m = new THREE.Vector3(0.2888997963720485,-0.097548587942181,0.9523765960200176);
        var m_1= new THREE.Vector3(-0.6073225261727431, 0.2890031902501969, -0.7400246652837772);
        var m_2 = new THREE.Vector3(-0.7707801703924689, 0.6325620751447861, -0.07591541357510112);
        var m_3 = new THREE.Vector3(-0.9904384997938112, -0.09754758544036858, -0.0975502265550357 );
        var m_4 = new THREE.Vector3(0.607322417164568, 0.2890037594414522, 0.7400245324569269);

        const positions = [m, m_1, m_2, m_3, m_4]

        cratersData.forEach((element, index) => {
          if(index < 5) {
            const moonDiv = document.createElement( 'div' );

            document.body.appendChild(moonDiv);
            moonDiv.className = 'PlanetItem';
            moonDiv.id ='myInput';

            imgNft = document.createElement('img');
            imgNft.className = 'PlanetItem__Image';
            imgNft.src = element.image;

            textContainer = document.createElement('div');
            textContainer.className = 'PlanetItem__Text-Container';

            text = document.createElement('span');
            text.className = 'PlanetItem__Text';
            text.textContent = element.name;

            moonDiv.appendChild(imgNft);
            moonDiv.appendChild(textContainer);
            textContainer.appendChild(text);

            moonDiv.addEventListener('pointerdown', () => {
              setModal({
                open: true,
                itemId: element.id
              })

              labels.forEach(element => {
                model.remove(element)
              })
            })

            moonLabel = new CSS2DObject( moonDiv );

            moonLabel.position.set(positions[index].x, positions[index].y, positions[index].z);
            moonLabel.lookAt(positions[index]);
            moonLabel.scale.set(0.002, 0.002, 0.002)
            moonLabel.up.set(0, 0, 0)
            // scene.add(itemLabel);
            labels.push(moonLabel)

            moonDiv.classList.add("hidden")
          }
        });

        // //segundo elemento nft
        // moonDiv = document.createElement( 'div' );

        // document.body.appendChild(moonDiv);
        // moonDiv.className = 'PlanetItem';
        // moonDiv.id ='myInput';

        // imgNft = document.createElement('img');
        // imgNft.className = 'PlanetItem__Image';
        // imgNft.src = 'https://lh3.googleusercontent.com/ojzA5XN6UO0qTGyiI6lGTJbbn73SQzu5ABVSV2H0AEgfv4gW7QOihhjNM_Q69P2pppTJpdV272yXLHE4vp22O4gPxcD2n9WVNfEkCA=w600';

        // textContainer = document.createElement('div');
        // textContainer.className = 'PlanetItem__Text-Container';

        // text = document.createElement('span');
        // text.className = 'PlanetItem__Text';
        // text.textContent = 'Fishy Fam 1';

        // moonDiv.appendChild(imgNft);
        // moonDiv.appendChild(textContainer);
        // textContainer.appendChild(text);

        // moonLabel = new CSS2DObject( moonDiv );
        // moonLabel.position.set(0.2888997963720485,-0.097548587942181,0.9523765960200176);
        // moonLabel.lookAt(0.2888997963720485,-0.097548587942181,0.9523765960200176);

        // console.log(moonDiv)
        // console.log(moonEspecialDiv)

        // console.log(moonLabel)
        // console.log(labels[0])
        // // // moonLabel.visible = false;

        //light beam LightBeam 1
        new GLTFLoader().load( LightBeamGLB, function ( gltf ) {
          LightBeam = gltf.scene;
          LightBeam.position.set(0.2888997963720485,-0.097548587942181,0.9523765960200176);
          LightBeam.rotation.set(1.67,0,5.97);
          LightBeam.scale.set(2,2,2);
          LightBeam.traverse(function(child){
            if(child.isMesh){
              child.material.emissiveIntensity = 20;
            }
          });
        });
        //light beam LightBeam 2
        new GLTFLoader().load( LightBeamGLB, function ( gltf ) {
          LightBeam_2 = gltf.scene;
          LightBeam_2.position.set(-0.6073225261727431, 0.2890031902501969, -0.7400246652837772);
          LightBeam_2.rotation.set(2.01,0,2.53);
          LightBeam_2.scale.set(2,2,2);
          LightBeam_2.traverse(function(child){
            if(child.isMesh){
              child.material.emissiveIntensity = 20;
            }
          });
        });
        //light beam LightBeam 3
        new GLTFLoader().load( LightBeamGLB, function ( gltf ) {
          LightBeam_3 = gltf.scene;
          LightBeam_3.position.set(-0.7707801703924689, 0.6325620751447861, -0.07591541357510112);
          LightBeam_3.rotation.set(6.31,0,0.84);
          LightBeam_3.scale.set(2,2,2);
          LightBeam_3.traverse(function(child){
            if(child.isMesh){
              child.material.emissiveIntensity = 20;
            }
          });
        });
        //light beam LightBeam 4
        new GLTFLoader().load( LightBeamGLB, function ( gltf ) {
          LightBeam_4 = gltf.scene;
          LightBeam_4.position.set(-0.9904384997938112, -0.09754758544036858, -0.0975502265550357);
          LightBeam_4.rotation.set(0,0,1.67);
          LightBeam_4.scale.set(2,2,2);
          LightBeam_4.traverse(function(child){
            if(child.isMesh){
              child.material.emissiveIntensity = 20;
            }
          });
        });
        //light beam LightBeam 5
        new GLTFLoader().load( LightBeamGLB, function ( gltf ) {
          LightBeam_5 = gltf.scene;
          LightBeam_5.position.set(0.607322417164568, 0.2890037594414522, 0.7400245324569269_2);
          LightBeam_5.rotation.set(1.15,0,5.54);
          LightBeam_5.scale.set(2,2,2);
          LightBeam_5.traverse(function(child){
            if(child.isMesh){
              child.material.emissiveIntensity = 20;
            }
          });
        });
        //meteoritos glb
        new GLTFLoader().load( AsteroidsGLB, function ( gltf ) {
          asteroides = gltf.scene;
          asteroides.position.set(12, -5, -1);
          asteroides.rotation.set(3.14,5.45,0);
          asteroides.scale.set(2,2,2);
          // asteroides.layers.enable(1);
          scene.add(asteroides);
        });
        //bluemoon
        new GLTFLoader().load( BlueMoonGLB, function ( gltf ) {
          model = gltf.scene;
          //anillos de luz
          model.traverse(function(child){
            if(child.isMesh){
              var contenedor = child.geometry.attributes.normal.array;

              poin = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 2 } ));
              poin_1 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
              poin_2 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
              poin_3 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
              poin_4 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
              poin.lookAt(m);
              poin_1.lookAt(m_1);
              poin_2.lookAt(m_2);
              poin_3.lookAt(m_3);
              poin_4.lookAt(m_4);
              poin.receiveShadow=true;
              poin_1.receiveShadow=true;
              poin_2.receiveShadow=true;
              poin_3.receiveShadow=true;
              poin_4.receiveShadow=true;
              poin.scale.set(0.02,0.02,0.02);
              poin_1.scale.set(0.02,0.02,0.02);
              poin_2.scale.set(0.02,0.02,0.02);
              poin_3.scale.set(0.02,0.02,0.02);
              poin_4.scale.set(0.02,0.02,0.02);
              poin.position.set(m.x,m.y,m.z);
              poin_1.position.set(m_1.x,m_1.y,m_1.z);
              poin_2.position.set(m_2.x,m_2.y,m_2.z);
              poin_3.position.set(m_3.x,m_3.y,m_3.z);
              poin_4.position.set(m_4.x,m_4.y,m_4.z);

              model.add(poin, poin_1, poin_2, poin_3, poin_4, LightBeam, LightBeam_2, LightBeam_3, LightBeam_4, LightBeam_5);
              // model.add(LightBeam, LightBeam_2, LightBeam_3, LightBeam_4, LightBeam_5);

              model.position.set(-0.3, 0, -1)
              // model.position.set(0, 0, 0)
              // console.log(model.getWorldPosition())
              // console.log(model.getWorldDirection())
              group.add(model);
            }
          });
          //model.layers.enable(2);
          scene.add(group);
          // moonControls = new ObjectControls(camera, labelRenderer.domElement, model);
          // moonControls.enableVerticalRotation();
          // moonControls.enableHorizontalRotation();
          // moonControls.setRotationSpeed(0.01);
          // moonControls.disableZoom();

          animate();
        } );
        // const gui = new GUI();

        // gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
        //   renderer.toneMappingExposure = Math.pow( value, 4.0 );
        // } );

        // gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
        //   bloomPass.threshold = Number( value );
        // } );

        // gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
        //   bloomPass.strength = Number( value );
        // } );

        // gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
        //   bloomPass.radius = Number( value );
        // } );

        // gui.add(params, 'rotation', 0.0, 20.0).step(0.01).onChange(function (value){
        //   asteroides.rotation.x = Number(value);
        // });
        // gui.add(params, 'rotation', 0.0, 20.0).step(0.01).onChange(function (value){
        //   asteroides.rotation.z = Number(value);
        // });
        // gui.add(params, 'position', 0.0, 20.0).step(0.01).onChange(function (value){
        //   asteroides.position.x = Number(value);
        // });
        // gui.add(params, 'position', 0.0, 20.0).step(0.01).onChange(function (value){
        //   asteroides.position.y = Number(value);
        // });
        // gui.add(params, 'position', 0.0, 20.0).step(0.01).onChange(function (value){
        //   asteroides.position.z = Number(value);
        // });
        renderer.toneMappingExposure = Math.pow(0.96,4);

        // window.addEventListener( 'resize', onWindowResize );
        // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
      }

      // function onDocumentMouseDown( event ) {
      //   event.preventDefault();
      //   document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      //   document.addEventListener( 'mouseup', onDocumentMouseUp, false );
      //   document.addEventListener( 'mouseout', onDocumentMouseOut, false );
      //   mouseXOnMouseDown = event.clientX - windowHalfX;
      //   targetRotationOnMouseDownX = targetRotationX;
      //   mouseYOnMouseDown = event.clientY - windowHalfY;
      //   targetRotationOnMouseDownY = targetRotationY;
      // }
      // function onDocumentMouseMove( event ) {
      //     mouseX = event.clientX - windowHalfX;
      //     targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.00025;
      //     mouseY = event.clientY - windowHalfY;
      //     targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.00025;
      // }
      // function onDocumentMouseUp( event ) {
      //     document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
      //     document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
      //     document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
      // }
      // function onDocumentMouseOut( event ) {
      //     document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
      //     document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
      //     document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
      // }
      // function rotateAroundObjectAxis(object, axis, radians) {
      //     var rotationMatrix = new THREE.Matrix4();
      //     rotationMatrix.makeRotationAxis(axis.normalize(), radians);
      //     object.matrix.multiply(rotationMatrix);
      //     object.rotation.setFromRotationMatrix( object.matrix );
      // }
      // function rotateAroundWorldAxis( object, axis, radians ) {
      //     var rotationMatrix = new THREE.Matrix4();
      //     rotationMatrix.makeRotationAxis( axis.normalize(), radians );
      //     rotationMatrix.multiply( object.matrix );                       // pre-multiply
      //     object.matrix = rotationMatrix;
      //     object.rotation.setFromRotationMatrix( object.matrix );
      // }

      function hoverHalo(event){
        var canv = document.getElementById('planet')
        mouse.x = ( event.clientX / canv.clientWidth ) * 2 - 1;
        mouse.y = -( event.clientY / canv.clientHeight ) * 2 + 1;
        showNft();
      }

      function pickMoon(event){
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        hideNft();
      }

      function navigate(){
        raycast.setFromCamera( mouse, camera );
        // calculate objects intersecting the picking ray
        const intersects = raycast.intersectObject( group );
        if(intersects.length > 0){
          console.log("luna fue intersectado");
        }else{
          //alert("la luna no fue intersectado");
          console.log("la luna no fue intersectado");
        }
      }

      function hideNft(){
        raycast.setFromCamera( mouse, camera );
        // calculate objects intersecting the picking ray
        const interse = raycast.intersectObject( prueba );
        if(interse.length>0){
          var objetoId = interse[0].object.id;
          console.log("Planet")
        }
      }

      function showNft(){
        raycast.setFromCamera( mouse, camera );
        // calculate objects intersecting the picking ray
        const interse = raycast.intersectObject( group )

        if(interse.length>0){
          var objectId = interse[0].object.id

          // if(objectId !== 58) {
          //   console.log(interse[0].object.id)
          //   if(!interse[0].object.position.x == 0){
          //     console.log("Crater: " +interse[0].object.id)
          //   }
          // }
//           switch (objectId) {
//             case objectId = 59:
//               model.add(labels[0])
//               break;
//             case objectId = 45:
//               model.add(labels[0])
//               break;
//             case objectId = 46:
//               model.add(labels[0])
//               break;
// //////////////////////////////////
//             case objectId = 60:
//               model.add(labels[1])
//               break;
//             case objectId = 47:
//               model.add(labels[1])
//               break;
//             case objectId = 48:
//               model.add(labels[1])
//               break;
// ////////////////////////////////////
//             case objectId = 61:
//               model.add(labels[2])
//               break;
//             case objectId = 49:
//               model.add(labels[2])
//               break;
//             case objectId = 50:
//               model.add(labels[2])
//               break;
// ///////////////////////////////////////
//             case objectId = 62:
//               model.add(labels[3])
//               break;
//             case objectId = 51:
//               model.add(labels[3])
//               break;
//             case objectId = 52:
//               model.add(labels[3])
//               break;
// /////////////////////////////////////////////
//             case objectId = 63:
//               model.add(labels[4])
//               break;
//             case objectId = 53:
//               model.add(labels[4])
//               break;
//             case objectId = 54:
//               model.add(labels[4])
//               break;
//             default:
//               break
//           }

          switch (objectId) {
            case objectId = 58:
              model.add(labels[0])
              break;
            case objectId = 27:
              model.add(labels[0])
              break;
            case objectId = 28:
              model.add(labels[0])
              break;
//////////////////////////////////
            case objectId = 59:
              model.add(labels[1])
              break;
            case objectId = 29:
              model.add(labels[1])
              break;
            case objectId = 30:
              model.add(labels[1])
              break;
////////////////////////////////////
            case objectId = 60:
              model.add(labels[2])
              break;
            case objectId = 31:
              model.add(labels[2])
              break;
            case objectId = 32:
              model.add(labels[2])
              break;
///////////////////////////////////////
            case objectId = 61:
              model.add(labels[3])
              break;
            case objectId = 33:
              model.add(labels[3])
              break;
            case objectId = 34:
              model.add(labels[3])
              break;
/////////////////////////////////////////////
            case objectId = 62:
              model.add(labels[4])
              break;
            case objectId = 35:
              model.add(labels[4])
              break;
            case objectId = 36:
              model.add(labels[4])
              break;
            default:
              break
          }
        }
      }

      function ocultarLabels(){
        //vectores temporales
        let v = new THREE.Vector3();
        let vectorPoin = new THREE.Vector3();
        let vectorPoin1= new THREE.Vector3();
        let vectorPoin2 = new THREE.Vector3();
        let vectorPoin3 = new THREE.Vector3();
        let vectorPoin4 = new THREE.Vector3();
        //world direction de la posicion de la camara y los anillos
        let camera_pos = camera.getWorldDirection(v);
        let poin_pos = poin.getWorldDirection(vectorPoin);
        let poin_1_pos = poin_1.getWorldDirection(vectorPoin1);
        let poin_2_pos = poin_2.getWorldDirection(vectorPoin2);
        let poin_3_pos = poin_3.getWorldDirection(vectorPoin3);
        let poin_4_pos = poin_4.getWorldDirection(vectorPoin4);
        //distancia entre la camara y cada anillo
        let dis_poin= camera_pos.distanceTo(poin_pos);
        let dis_poin_1 = camera_pos.distanceTo(poin_1_pos);
        let dis_poin_2 = camera_pos.distanceTo(poin_2_pos);
        let dis_poin_3 = camera_pos.distanceTo(poin_3_pos);
        let dis_poin_4 = camera_pos.distanceTo(poin_4_pos);
        //funcion para ocultar los labels
        // console.log(dis_poin_1);
        if(dis_poin < 1.78){
          model.remove(labels[0]);
        }

        if(dis_poin_1 < 1.70){
          model.remove(labels[1]);
        }

        if(dis_poin_2 < 1.78){
          model.remove(labels[2]);
        }

        if(dis_poin_3 < 1.78){
          model.remove(labels[3]);
        }

        if(dis_poin_4 < 1.78){
          model.remove(labels[4]);
        }
      }

      const loopMoon = () => {
        model.rotation.y += elapsedtime * 0.03;
      }

      const stopMoon = () => {
        model.rotation.y += 0;
      }

      window.addEventListener( 'pointermove', pickMoon );
      window.addEventListener( 'pointermove', hoverHalo, false );

      function onWindowResize() {
        const canvas = renderer.domElement;
        // look up the size the canvas is being displayed
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const itemWidth = document.querySelector(".TopCraters").offsetWidth + 40
        const itemHeight = document.querySelector("header").offsetHeight

        const width = windowWidth - itemWidth
        const height = windowHeight

        // adjust displayBuffer size to match
        if (canvas.width !== width || canvas.height !== height) {
          // you must pass false here or three.js sadly fights the browser
          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          // renderer.domElement.style.marginTop = `${itemHeight}px`
          renderer.setSize( width, height );
          composer.setSize( width, height );
          labelRenderer.setSize(width, height);


          // labelRenderer.setSize(window.innerWidth, window.innerHeight);
          // // labelRenderer.setSize( (window.innerWidth - cratersWidth), (window.innerHeight - headerHeight) );

          // labelRenderer.domElement.style.height = `calc(100vh - ${headerHeight}px)`
          // labelRenderer.domElement.style.top = `${headerHeight}px`
          // labelRenderer.domElement.style.width = `calc(100vw - ${cratersWidth}px)`

          // renderer.domElement.style.height = `calc(100vh - ${headerHeight}px)`
          // renderer.domElement.style.marginTop = `${headerHeight}px`
          // renderer.domElement.style.width = `calc(100vw - ${cratersWidth}px)`

          // update any render target sizes here
        }
      }

      function animate() {
        requestAnimationFrame( animate );

        onWindowResize()

        // raycast.setFromCamera( mouse, camera );
        // calculate objects intersecting the picking ray
        // const interse = raycast.intersectObject( group )

        // if(interse.length>0){
        //   var objectId = interse[0].object.id;
        //   if(objectId === 59) {
        //     stopMoon();
        //   }
        // }
        // else {
        //   loopMoon();
        // }

        // if(!moonControls.isUserInteractionActive() || moonControls.getObjectToMove() != model){                //model auto rotation
        //   model.rotation.y += elapsedtime * 0.03;
        // }
        controls.update();

        ocultarLabels()

        // rotateAroundWorldAxis(model, new THREE.Vector3(0, 1, 0), targetRotationX);
        // targetRotationX = targetRotationX * (1 - 0.99);

        // rotateAroundWorldAxis(model, new THREE.Vector3(0, 0, 1), targetRotationY);
        // targetRotationY = targetRotationY * (1 - 0.99);

        renderer.autoClear = false;
        renderer.clear();

        //camera.layers.set(2);
        composer.render();

        renderer.clearDepth();
        renderer.render( scene, camera );
        labelRenderer.render( scene, camera );

        // const headerHeight = document.querySelector("header").offsetHeight
        // const cratersWidth = document.querySelector(".TopCraters").offsetWidth + 40

        // labelRenderer.setSize(window.innerWidth, window.innerHeight);
        // // labelRenderer.setSize( (window.innerWidth - cratersWidth), (window.innerHeight - headerHeight) );

        // labelRenderer.domElement.style.height = `calc(100vh - ${headerHeight}px)`
        // labelRenderer.domElement.style.top = `${headerHeight}px`
        // labelRenderer.domElement.style.width = `calc(100vw - ${cratersWidth}px)`

        // renderer.domElement.style.height = `calc(100vh - ${headerHeight}px)`
        // renderer.domElement.style.marginTop = `${headerHeight}px`
        // renderer.domElement.style.width = `calc(100vw - ${cratersWidth}px)`

        setState(false)
      }
    }
  }, [canvasRef, state])

  return (
    <>
      <canvas id="planet" ref={canvasRef}></canvas>
      <div id="container"></div>
    </>
  )
}

export default Planet