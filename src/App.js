import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './App.css';

function App() {
  const attach = useRef();
  const [day, setDay] = useState(0);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    attach.current.appendChild( renderer.domElement );
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;
    const animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      setDay(prevState => prevState + 0.1);
      renderer.render( scene, camera );
    };
    animate();
  }, []);

  return (
    <>
      <p>Day: {Math.floor(day)}</p>
    <div className="App" ref={attach}/>
    </>
  );
}

export default App;
