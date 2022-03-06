import React, { useRef } from 'react'
import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
// import BlueMoonGLB from '../assets/BlueMoon.glb'

const Planet = () => {
  const canvasRef = useRef(null)
  const { references } = useContext(AppContext)

  if(canvasRef.current) {
    let camera, stats;
    let composer, renderer, mixer, clock, labelRenderer, moonLabel, scene, moonLabel_2, moonLabel_3, moonLabel_4, moonLabel_5;
    var model, asteroides, LightBeam, LightBeam_2, LightBeam_3, LightBeam_4, LightBeam_5;
    let moonDiv, textContainer, imgNft, text;
    let moonDiv_2, textContainer_2, imgNft_2, text_2;
    let group = new THREE.Group();
    let groupHalos = new THREE.Group();
    const params = {
      exposure: 1,
      bloomStrength: 0.35,
      bloomThreshold: 0.085,
      bloomRadius: 0.74,
      rotation: 3.14,
      position: 3
    };
    let mouse = new THREE.Vector2();
    let raycast = new THREE.Raycaster();
    var rayo_luz, rayo_luz_1, rayo_luz_2, rayo_luz_3, rayo_luz_4,son_rayo_luz;
    var asteroide_1, asteroide_2, asteroide_3, asteroide_4, asteroide_5, asteroide_6;
    var mat_asteroide_1, mat_asteroide_2, mat_asteroide_3, mat_asteroide_4, mat_asteroide_5, mat_asteroide_6;
    var geom_asteroide_1, geom_asteroide_2, geom_asteroide_3, geom_asteroide_4, geom_asteroide_5, geom_asteroide_6;

    init();

    function init() {

      // const container = document.getElementById( 'container' );

      // stats = new Stats();
      // container.appendChild( stats.dom );

      clock = new THREE.Clock();

      renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.getElementById('planet') } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.toneMapping = THREE.ReinhardToneMapping;
      // container.appendChild( renderer.domElement );
      //render de label html 2D
      labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize( window.innerWidth, window.innerHeight );
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0px';
      document.body.appendChild( labelRenderer.domElement );

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 9000 );
      camera.position.set( - 5, 2.5, - 2.5 );
      camera.layers.enableAll();
      //camera.layers.enable(1);

      const controls = new OrbitControls( camera, labelRenderer.domElement );
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.minDistance = 1;
      controls.maxDistance = 10;

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
      //asteroides
      /*geom_asteroide_1 = new THREE.SphereGeometry( 0.10, 12, 6 ); 
      mat_asteroide_1 = new THREE.MeshPhongMaterial( {map: textura, shininess:40, reflectivity:1, emissive:0x001219  } ); 
      asteroide_1 = new THREE.Mesh(geom_asteroide_1, mat_asteroide_1); 
      geom_asteroide_2 = new THREE.SphereGeometry( 0.10, 12, 6 ); 
      mat_asteroide_2 = new THREE.MeshPhongMaterial( {map: textura, shininess:40, reflectivity:1, emissive:0x001219  } ); 
      asteroide_2 = new THREE.Mesh(geom_asteroide_2, mat_asteroide_2);  
      geom_asteroide_3 = new THREE.SphereGeometry( 0.10, 12, 6 ); 
      mat_asteroide_3 = new THREE.MeshPhongMaterial( {map: textura, shininess:40, reflectivity:1, emissive:0x001219  } ); 
      asteroide_3 = new THREE.Mesh(geom_asteroide_3, mat_asteroide_3); 
      geom_asteroide_4 = new THREE.SphereGeometry( 0.10, 12, 6 ); 
      mat_asteroide_4 = new THREE.MeshPhongMaterial( {map: textura, shininess:40, reflectivity:1, emissive:0x001219  } ); 
      asteroide_4 = new THREE.Mesh(geom_asteroide_4, mat_asteroide_4); 
      geom_asteroide_5 = new THREE.SphereGeometry( 0.10, 12, 6 ); 
      mat_asteroide_5 = new THREE.MeshPhongMaterial( {map: textura, shininess:40, reflectivity:1, emissive:0x001219  } ); 
      asteroide_5 = new THREE.Mesh(geom_asteroide_5, mat_asteroide_5); 
      geom_asteroide_6 = new THREE.SphereGeometry( 0.10, 12, 6 ); 
      mat_asteroide_6 = new THREE.MeshPhongMaterial( {map: textura, shininess:40, reflectivity:1, emissive:0x001219  } ); 
      asteroide_6 = new THREE.Mesh(geom_asteroide_6, mat_asteroide_6);  
      //posiciones de asteroides
      asteroide_1.position.set(-4,1.8,0); 
      asteroide_2.position.set(-3.1,1.2,0); 
      asteroide_3.position.set(-3,-1.8,-2); 
      asteroide_4.position.set(3.6,1.4,0); 
      asteroide_5.position.set(2,-1,0); 
      asteroide_6.position.set(3,-1.4,0);   
      //escala  
      asteroide_1.scale.set(3,3,3); 
      asteroide_3.scale.set(2,2,2);
      asteroide_4.scale.set(3,3,3); 
      scene.add(asteroide_1,asteroide_2,asteroide_3,asteroide_4,asteroide_5,asteroide_6);*/

      //labels html 2D  
      //primer elemento nft
      // let referencias = [ itemRef_1, itemRef_2, itemRef_3 ]
      // let label = []

      // const create2D = () => {

      // }
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
      // text.textContent = 'Fishy Fam';

      // moonDiv.appendChild(imgNft);
      // moonDiv.appendChild(textContainer);
      // textContainer.appendChild(text);
      var m = new THREE.Vector3(0.2888997963720485,-0.097548587942181,0.9523765960200176);
      var m_1= new THREE.Vector3(-0.6073225261727431, 0.2890031902501969, -0.7400246652837772);
      var m_2 = new THREE.Vector3(-0.7707801703924689, 0.6325620751447861, -0.07591541357510112);
      var m_3 = new THREE.Vector3(-0.9904384997938112, -0.09754758544036858, -0.0975502265550357 );
      var m_4 = new THREE.Vector3(0.607322417164568, 0.2890037594414522, 0.7400245324569269);

      // const labels = []
      // const positions = [m, m_1, m_2, m_3, m_4]

      // for (const item in references) {
      //   const itemLabel = new CSS2DObject( references[item] );
      //   itemLabel.position.set(positions[item]);
      //   itemLabel.lookAt(positions[item]);
      //   itemLabel.visible = true;
      //   // scene.add(itemLabel);

      //   labels.push(itemLabel)
      // }

      // moonLabel = new CSS2DObject( moonDiv );
      // moonLabel.position.set( 0.2888997963720485,-0.097548587942181,0.9523765960200176);
      // moonLabel.lookAt(0.2888997963720485,-0.097548587942181,0.9523765960200176);
      // moonLabel.visible = false;

      //segundo elemento nft
      moonDiv = document.createElement( 'div' );

      document.body.appendChild(moonDiv);
      moonDiv.className = 'PlanetItem';
      moonDiv.id ='myInput';

      imgNft = document.createElement('img');
      imgNft.className = 'PlanetItem__Image';
      imgNft.src = 'https://lh3.googleusercontent.com/ojzA5XN6UO0qTGyiI6lGTJbbn73SQzu5ABVSV2H0AEgfv4gW7QOihhjNM_Q69P2pppTJpdV272yXLHE4vp22O4gPxcD2n9WVNfEkCA=w600';

      textContainer = document.createElement('div');
      textContainer.className = 'PlanetItem__Text-Container';

      text = document.createElement('span');
      text.className = 'PlanetItem__Text';
      text.textContent = 'Fishy Fam 1';

      moonDiv.appendChild(imgNft);
      moonDiv.appendChild(textContainer);
      textContainer.appendChild(text);

      moonLabel = new CSS2DObject( moonDiv );
      moonLabel.position.set(3.2888997963720485,-0.097548587942181,0.9523765960200176);
      moonLabel.lookAt(0.2888997963720485,-0.097548587942181,0.9523765960200176);
      // moonLabel.visible = false;

      //

      moonDiv_2 = document.createElement( 'div' );

      document.body.appendChild(moonDiv_2);
      moonDiv_2.className = 'PlanetItem';
      moonDiv_2.id ='myInput';

      imgNft_2 = document.createElement('img');
      imgNft_2.className = 'PlanetItem__Image';
      imgNft_2.src = 'https://lh3.googleusercontent.com/ojzA5XN6UO0qTGyiI6lGTJbbn73SQzu5ABVSV2H0AEgfv4gW7QOihhjNM_Q69P2pppTJpdV272yXLHE4vp22O4gPxcD2n9WVNfEkCA=w600';

      textContainer_2 = document.createElement('div');
      textContainer_2.className = 'PlanetItem__Text-Container';

      text_2 = document.createElement('span');
      text_2.className = 'PlanetItem__Text';
      text_2.textContent = 'Fishy Fam 2';

      moonDiv_2.appendChild(imgNft_2);
      moonDiv_2.appendChild(textContainer_2);
      textContainer_2.appendChild(text_2);

      moonLabel_2 = new CSS2DObject( moonDiv_2 );
      moonLabel_2.position.set(-0.6073225261727431, 0.2890031902501969, -0.7400246652837772);
      moonLabel_2.lookAt(-0.6073225261727431, 0.2890031902501969, -0.7400246652837772);
      // moonLabel_2.visible = false;

      //

      let moonDiv_3 = document.createElement( 'div' );

      document.body.appendChild(moonDiv_3);
      moonDiv_3.className = 'PlanetItem';
      moonDiv_3.id ='myInput';

      let imgNft_3 = document.createElement('img');
      imgNft_3.className = 'PlanetItem__Image';
      imgNft_3.src = 'https://lh3.googleusercontent.com/ojzA5XN6UO0qTGyiI6lGTJbbn73SQzu5ABVSV2H0AEgfv4gW7QOihhjNM_Q69P2pppTJpdV272yXLHE4vp22O4gPxcD2n9WVNfEkCA=w600';

      let textContainer_3 = document.createElement('div');
      textContainer_3.className = 'PlanetItem__Text-Container';

      let text_3 = document.createElement('span');
      text_3.className = 'PlanetItem__Text';
      text_3.textContent = 'Fishy Fam 3';

      moonDiv_3.appendChild(imgNft_3);
      moonDiv_3.appendChild(textContainer_3);
      textContainer_3.appendChild(text_3);

      moonLabel_3 = new CSS2DObject( moonDiv_3 );
      moonLabel_3.position.set(-0.7707801703924689, 0.6325620751447861, -0.07591541357510112);
      moonLabel_3.lookAt(-0.7707801703924689, 0.6325620751447861, -0.07591541357510112);
      // moonLabel_3.visible = false;

      //

      let moonDiv_4 = document.createElement( 'div' );

      document.body.appendChild(moonDiv_4);
      moonDiv_4.className = 'PlanetItem';
      moonDiv_4.id ='myInput';

      let imgNft_4 = document.createElement('img');
      imgNft_4.className = 'PlanetItem__Image';
      imgNft_4.src = 'https://lh3.googleusercontent.com/ojzA5XN6UO0qTGyiI6lGTJbbn73SQzu5ABVSV2H0AEgfv4gW7QOihhjNM_Q69P2pppTJpdV272yXLHE4vp22O4gPxcD2n9WVNfEkCA=w600';

      let textContainer_4 = document.createElement('div');
      textContainer_4.className = 'PlanetItem__Text-Container';

      let text_4 = document.createElement('span');
      text_4.className = 'PlanetItem__Text';
      text_4.textContent = 'Fishy Fam 4';

      moonDiv_4.appendChild(imgNft_4);
      moonDiv_4.appendChild(textContainer_4);
      textContainer_4.appendChild(text_4);

      moonLabel_4 = new CSS2DObject( moonDiv_4 );
      moonLabel_4.position.set(-0.9904384997938112, -0.09754758544036858, -0.0975502265550357 );
      moonLabel_4.lookAt(-0.9904384997938112, -0.09754758544036858, -0.0975502265550357 );
      // moonLabel_4.visible = false;

      //

      let moonDiv_5 = document.createElement( 'div' );

      document.body.appendChild(moonDiv_5);
      moonDiv_5.className = 'PlanetItem';
      moonDiv_5.id ='myInput';

      let imgNft_5 = document.createElement('img');
      imgNft_5.className = 'PlanetItem__Image';
      imgNft_5.src = 'https://lh3.googleusercontent.com/ojzA5XN6UO0qTGyiI6lGTJbbn73SQzu5ABVSV2H0AEgfv4gW7QOihhjNM_Q69P2pppTJpdV272yXLHE4vp22O4gPxcD2n9WVNfEkCA=w600';

      let textContainer_5 = document.createElement('div');
      textContainer_5.className = 'PlanetItem__Text-Container';

      let text_5 = document.createElement('span');
      text_5.className = 'PlanetItem__Text';
      text_5.textContent = 'Fishy Fam 5';

      moonDiv_5.appendChild(imgNft_5);
      moonDiv_5.appendChild(textContainer_5);
      textContainer_5.appendChild(text_5);

      moonLabel_5 = new CSS2DObject( moonDiv_5 );
      moonLabel_5.position.set(0.607322417164568, 0.2890037594414522, 0.7400245324569269);
      moonLabel_5.lookAt(0.607322417164568, 0.2890037594414522, 0.7400245324569269);
      // moonLabel_5.visible = false;

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
        asteroides.position.set(8,-3,4.35);
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
            // var m = new THREE.Vector3(0.2888997963720485,-0.097548587942181,0.9523765960200176);
            // var m_1= new THREE.Vector3(-0.6073225261727431, 0.2890031902501969, -0.7400246652837772);
            // var m_2 = new THREE.Vector3(-0.7707801703924689, 0.6325620751447861, -0.07591541357510112);
            // var m_3 = new THREE.Vector3(-0.9904384997938112, -0.09754758544036858, -0.0975502265550357 );
            // var m_4 = new THREE.Vector3(0.607322417164568, 0.2890037594414522, 0.7400245324569269);
            var poin = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 2 } ));
            var poin_1 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
            var poin_2 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
            var poin_3 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
            var poin_4 = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, emissive:0xffffff, emissiveIntensity: 20 } ));
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

            //rayo_luz_4.rotation.y = Math.PI/4;
            /*poinLight.position.set((m.x-0.30),(m.y+0.3),(m.z-0.9));
            rayo_luz.add(poinLight);
            const sphereSize = 0.2;
            const pointLightHelper = new THREE.PointLightHelper( poinLight, sphereSize );
            scene.add( pointLightHelper );*/
           //scene.add(moonLabel_2);
            // model.add(poin, poin_1, poin_2, poin_3, poin_4, moonLabel, moonLabel_2, moonLabel_3, moonLabel_4, moonLabel_5, LightBeam, LightBeam_2, LightBeam_3, LightBeam_4, LightBeam_5);
            model.add(poin, poin_1, poin_2, poin_3, poin_4, moonLabel, LightBeam, LightBeam_2, LightBeam_3, LightBeam_4, LightBeam_5);

            // for (const label in labels) {
            //   model.add(labels[label])

            //   console.log(labels[label])
            // }
            console.log(model.position)
            model.position.set(1.4, 0, -1)
            group.add(model);
            //model.layers.enable(1);
            //groupHalos.add(rayo_luz, rayo_luz_1, rayo_luz_2, rayo_luz_3, rayo_luz_4);
            //groupHalos.add(poin, poin_1, poin_2, poin_3, poin_4);
          }
        });
        //model.layers.enable(2);
        scene.add( group);
        animate();
      } );
      const gui = new GUI();

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

      // gui.add(params, 'rotation', 0.0, 7.0).step(0.01).onChange(function (value){
      //   LightBeam_5.rotation.x = Number(value);
      // });
      // gui.add(params, 'rotation', 0.0, 7.0).step(0.01).onChange(function (value){
      //   LightBeam_5.rotation.z = Number(value);
      // });
      gui.add(params, 'position', 0.0, 7.0).step(0.01).onChange(function (value){
        model.position.x = Number(value);
      });
      gui.add(params, 'position', 0.0, 7.0).step(0.01).onChange(function (value){
        model.position.y = Number(value);
      });
      gui.add(params, 'position', 0.0, 7.0).step(0.01).onChange(function (value){
        model.position.z = Number(value);
      });
          renderer.toneMappingExposure = Math.pow(0.96,4);

      window.addEventListener( 'resize', onWindowResize );

    }
    function hoverHalo(event){
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
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
        //alert("luna fue intersectado"); 
        //window.open('https://www.legionnetwork.io/');  
        /*const n = new THREE.Vector3();  
        console.log(n);
        n.copy((intersects[0].face).normal);  
        console.log((intersects[0].face).normal);
        //console.log(intersects[0].face.normal);
        n.transformDirection(intersects[0].object.matrixWorld); 
        console.log(intersects[0].object.matrixWorld);
        var draw_point = new THREE.Mesh(new THREE.CircleGeometry( 3.1,30 ),  new THREE.MeshBasicMaterial( { color: 0xD2F330, side: THREE.DoubleSide } ));
        draw_point.lookAt(n);
        draw_point.scale.set(0.02,0.02,0.02); 
        draw_point.position.set(n.x,n.y,n.z);  
        draw_point.position.addScaledVector(n, 0.1); 
        group.add(draw_point); 
        console.log(n.x, n.y, n.z);*/
        console.log("luna fue intersectado");
      }else{
        //alert("la luna no fue intersectado");
        console.log("la luna no fue intersectado");
      }
    }
    function hideNft(){
      raycast.setFromCamera( mouse, camera );
      // calculate objects intersecting the picking ray
      const interse = raycast.intersectObject( group );
      if(interse.length>0){
        var objetoId = interse[0].object.id;
        var objeto = interse[0].object;
        function esconder(){
          moonLabel.visible = true;
        }
        function label_2(){
          moonLabel_2.visible = true;
        }
        // console.log(interse[0].object.id);
        switch (objetoId){
        //42
        case objetoId = 43:
          esconder();
          break;

        case objetoId = 50:
          label_2();
          break;

        case objetoId = 48:
          console.log("hola");
          break;

        case objetoId = 46:
          console.log("hi 5");
          break;

        case objetoId = 44:
          console.log("wireframe");
          break;

        default:
          break;
        }
      }
    }
    function showNft(){
      raycast.setFromCamera( mouse, camera );
      // calculate objects intersecting the picking ray
      const interse = raycast.intersectObject( group );
      if(interse.length>0){
        var objetoId = interse[0].object.id;
        // var objeto = interse[0].object;

        // if(!interse[0].object.position.x == 0){
        console.log("Id: " + interse[0].object.id + " posición: " + interse[0].object.position.x);
        // }

        switch (objetoId){
        case objetoId = 59:
          model.add(moonLabel)
          break;

        case objetoId = 60:
          model.add(moonLabel_2)
          break;

        case objetoId = 61:
          model.add(moonLabel_3)
          break;

        case objetoId = 62:
          model.add(moonLabel_4)
          break;

        case objetoId = 63:
          model.add(moonLabel_5)
          break;

        default:
          break;
        }
      }
    }
    window.addEventListener( 'click', pickMoon );
    window.addEventListener( 'pointermove', hoverHalo );

    function onWindowResize() {

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize( width, height );
      composer.setSize( width, height );
              labelRenderer.setSize(width, height);
    }

    function animate() {

      requestAnimationFrame( animate );
      const elapsedtime = clock.getElapsedTime();
      //asteroides.position.y = Math.cos(0.56*elapsedtime);
      //model.rotation.y = elapsedtime*0.06;
      //const delta = clock.getDelta();
//animacion de rotacion
/*asteroide_1.rotation.x = Math.cos(elapsedtime*0.2); 
asteroide_1.rotation.y = Math.sin(elapsedtime*0.2); 
asteroide_2.rotation.x = Math.cos(elapsedtime*0.2); 
asteroide_2.rotation.y = Math.sin(elapsedtime*0.2); 
asteroide_3.rotation.x = Math.cos(elapsedtime*0.5); 
asteroide_3.rotation.y = Math.sin(elapsedtime*0.5);  
asteroide_4.rotation.x = Math.cos(elapsedtime*0.2); 
asteroide_4.rotation.y = Math.sin(elapsedtime*0.2);   
asteroide_4.rotation.z = Math.sin(elapsedtime*0.3);
asteroide_5.rotation.x = Math.cos(elapsedtime*0.4); 
asteroide_5.rotation.z = Math.sin(elapsedtime*0.4);
asteroide_6.rotation.x = Math.cos(elapsedtime*0.4); 
asteroide_6.rotation.y = Math.sin(elapsedtime*0.4);  */
      //mixer.update( delta );
//rayo_luz.rotation.x += elapsedtime*0.006;
      // stats.update(); 
      renderer.autoClear = false;
      renderer.clear();
      
      //camera.layers.set(2);
      composer.render();


      renderer.clearDepth();
      //camera.layers.set(0);
      renderer.render( scene, camera );
      //camera.layers.set(0);
      labelRenderer.render( scene, camera );

    }
  }

  return (
    <>
      <div id="container"></div>
      <canvas id="planet" ref={canvasRef}></canvas>
    </>
  )
}

export default Planet