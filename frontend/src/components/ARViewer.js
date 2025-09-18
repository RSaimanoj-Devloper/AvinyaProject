// frontend/src/components/ARViewer.js

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR } from '@react-three/xr';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

// This is the 3D model component
function Model({ modelPath, scale }) {
  // useGLTF is a hook from drei that makes loading 3D models easy
  const { scene } = useGLTF(modelPath);
  // We scale the scene directly based on the fetched product dimensions
  return <primitive object={scene} scale={scale} />;
}

const ARViewer = ({ modelPath, scale }) => {
  return (
    <div className="ar-container">
      {/* ARButton is a helper that creates the "Start AR" button */}
      <ARButton sessionInit={{ requiredFeatures: ['hit-test'] }} />
      
      {/* Canvas is where the 3D scene is rendered */}
      <Canvas>
        {/* XR wraps the scene to enable AR capabilities */}
        <XR>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          
          {/* Suspense is a React feature that lets us show a fallback while the model is loading */}
          <Suspense fallback={null}>
            <Model modelPath={modelPath} scale={scale} />
            <Environment preset="sunset" />
          </Suspense>
          
          {/* OrbitControls allow you to rotate the model with your mouse/finger for a non-AR preview */}
          <OrbitControls />
        </XR>
      </Canvas>
    </div>
  );
};

export default ARViewer;