"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Copy, useCopy } from "./site-language";
const roundedBox=(width:number,height:number,depth:number)=>new RoundedBoxGeometry(width,height,depth,3,Math.min(width,height,depth)*0.22);

export type VariantType = "pro_x3" | "cargo" | "commuter";
export type TimeOfDay = "day" | "night";

export interface Eluna3DCanvasProps {
  resetKey?: number;
  variant: VariantType;
  colorHex: string;
  colorName?: string;
  timeOfDay: TimeOfDay;
  targetAngle?: number; // External controlled angle in degrees [0, 360]
  isAutoRotate?: boolean;
  onAngleChange?: (angleDeg: number) => void;
  activeHotspot?: string | null;
  onHotspotClick?: (hotspotId: string) => void;
  onInteracted?: () => void;
}

export interface HotspotScreenPos {
  id: string;
  name: string;
  spec: string;
  x: number;
  y: number;
  visible: boolean;
}

export function Eluna3DCanvas({
  resetKey,
  variant,
  colorHex,
  timeOfDay,
  targetAngle,
  isAutoRotate = false,
  onAngleChange,
  activeHotspot,
  onHotspotClick,
  onInteracted,
}: Eluna3DCanvasProps) {
  const copy = useCopy();
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglError,setWebglError] = useState(false);

  // Hotspots projected 2D coordinates
  const [hotspotPositions, setHotspotPositions] = useState<HotspotScreenPos[]>([]);

  // References to dynamic 3D elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const paintMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cargoGroupRef = useRef<THREE.Group | null>(null);
  const proSeatGroupRef = useRef<THREE.Group | null>(null);
  const commuterGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const headlightSpotRef = useRef<THREE.SpotLight | null>(null);
  const headlightBeamMeshRef = useRef<THREE.Mesh | null>(null);

  // Camera Orbit & Inertia State
  const currentThetaRef = useRef(Math.PI / 3.8); // 45-degree initial studio perspective
  const targetThetaRef = useRef(Math.PI / 3.8);
  const currentPhiRef = useRef(Math.PI / 2.45); // slight eye-level automotive angle
  const targetPhiRef = useRef(Math.PI / 2.45);
  const currentRadiusRef = useRef(3.6);
  const targetRadiusRef = useRef(3.6);
  const panOffsetRef = useRef(new THREE.Vector3(0, 0.48, 0));
  const angularVelocityRef = useRef(0);
  const lastReportedDegRef = useRef(-1);

  // Interaction State
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const isAutoRotateRef = useRef(isAutoRotate);
  isAutoRotateRef.current = isAutoRotate;

  const onAngleChangeRef = useRef(onAngleChange);
  onAngleChangeRef.current = onAngleChange;

  // 3D Hotspot Anchor definitions
  const hotspotAnchorsRef = useRef([
    {
      id: "motor",
      name: "1.2 kW BLDC Hub Motor",
      spec: "50 km/h Peak • Instant Flyover Torque",
      pos: new THREE.Vector3(0.14, 0.38, -0.72),
    },
    {
      id: "battery",
      name: "2.3 kWh Li-ion Battery",
      spec: "IP67 Certified • Portable Home Charge",
      pos: new THREE.Vector3(0, 0.50, -0.05),
    },
    {
      id: "chassis",
      name: "Signature Steel Loop Frame",
      spec: "150 kg Payload • Iconic Kinetic Geometry",
      pos: new THREE.Vector3(0.14, 0.55, 0.05),
    },
    {
      id: "brakes",
      name: "Combi Braking System",
      spec: "Dual Drum CBS • Synchronized Safety",
      pos: new THREE.Vector3(0.1, 0.38, 0.72),
    },
    {
      id: "seat_cargo",
      name: "Dual Split / Cargo Bed",
      spec: "Tool-Free Quick Detach System",
      pos: new THREE.Vector3(0, 0.78, -0.42),
    },
  ]);

  useEffect(()=>{targetThetaRef.current=Math.PI/4;targetPhiRef.current=Math.PI/2.45;targetRadiusRef.current=3.6;angularVelocityRef.current=0;},[resetKey]);

  // Update Paint Material Color on prop change
  useEffect(() => {
    if (paintMaterialRef.current) {
      paintMaterialRef.current.color.set(colorHex);
      paintMaterialRef.current.needsUpdate = true;
    }
  }, [colorHex]);

  // Update Variant Modular Parts visibility
  useEffect(() => {
    if (cargoGroupRef.current) cargoGroupRef.current.visible = variant === "cargo";
    if (proSeatGroupRef.current) proSeatGroupRef.current.visible = variant === "pro_x3";
    if (commuterGroupRef.current) commuterGroupRef.current.visible = variant === "commuter";
  }, [variant]);

  // Update Day / Night Lighting
  useEffect(() => {
    if (sunLightRef.current && ambientLightRef.current && headlightSpotRef.current) {
      if (timeOfDay === "day") {
        sunLightRef.current.intensity = 2.4;
        sunLightRef.current.color.setHex(0xfffaed);
        ambientLightRef.current.intensity = 1.35;
        ambientLightRef.current.color.setHex(0xe0f2fe);
        headlightSpotRef.current.intensity = 0.5;
        if (headlightBeamMeshRef.current) headlightBeamMeshRef.current.visible = false;
      } else {
        sunLightRef.current.intensity = 0.5;
        sunLightRef.current.color.setHex(0x38bdf8);
        ambientLightRef.current.intensity = 0.6;
        ambientLightRef.current.color.setHex(0x1e293b);
        headlightSpotRef.current.intensity = 9.0;
        if (headlightBeamMeshRef.current) headlightBeamMeshRef.current.visible = true;
      }
    }
  }, [timeOfDay]);

  // Handle external targetAngle updates (from range slider or preset buttons)
  useEffect(() => {
    if (typeof targetAngle === "number" && !isDraggingRef.current && Math.abs(targetAngle-lastReportedDegRef.current)>1) {
      const targetRad = (targetAngle * Math.PI) / 180;
      const current = targetThetaRef.current;
      const twoPi = Math.PI * 2;
      const normalizedCurrent = ((current % twoPi) + twoPi) % twoPi;
      const diff = targetRad - normalizedCurrent;
      let adjustedDiff = diff;
      if (adjustedDiff > Math.PI) adjustedDiff -= twoPi;
      if (adjustedDiff < -Math.PI) adjustedDiff += twoPi;
      targetThetaRef.current = current + adjustedDiff;
    }
  }, [targetAngle]);

  // Focus camera when a hotspot is clicked
  useEffect(() => {
    if (activeHotspot) {
      targetRadiusRef.current = 3.1;
    } else {
      targetRadiusRef.current = 3.6;
    }
  }, [activeHotspot]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const fitFov=(w:number,h:number)=>THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(36)/2)/Math.min(1,w/Math.max(h,1))));
    const camera = new THREE.PerspectiveCamera(fitFov(width,height), width / height, 0.1, 50);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "default",
    }); } catch { setWebglError(true); return; }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    const environmentScene=new RoomEnvironment();
    const environmentGenerator=new THREE.PMREMGenerator(renderer);
    const environmentTarget=environmentGenerator.fromScene(environmentScene,0.04);
    scene.environment=environmentTarget.texture;
    scene.environmentIntensity=0.55;
    environmentScene.dispose(); environmentGenerator.dispose();

    container.appendChild(renderer.domElement);

    // ========================================================
    // LIGHTING SETUP
    // ========================================================
    const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.35);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    sunLight.position.set(5, 8, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.camera.left = -2;
    sunLight.shadow.camera.right = 2;
    sunLight.shadow.camera.top = 2;
    sunLight.shadow.camera.bottom = -2;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.85);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Front Headlight Beam (Spotlight)
    const headlightSpot = new THREE.SpotLight(0xffffff, 0.5, 9, Math.PI / 5.5, 0.5, 1);
    headlightSpot.position.set(0, 0.88, 0.85);
    const targetObj = new THREE.Object3D();
    targetObj.position.set(0, 0.1, 4.0);
    scene.add(targetObj);
    headlightSpot.target = targetObj;
    scene.add(headlightSpot);
    headlightSpotRef.current = headlightSpot;

    // Glowing Night Headlight Volumetric Cone
    const beamGeo = new THREE.ConeGeometry(0.8, 3.2, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, 0.8, 2.4);
    beamMesh.rotation.x = -Math.PI / 2.2;
    beamMesh.visible = false;
    scene.add(beamMesh);
    headlightBeamMeshRef.current = beamMesh;

    // ========================================================
    // GROUND CONTACT SHADOW
    // ========================================================
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.38 });
    const groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = 0.001;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    // Subtle Radial Ambient Contact Shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0.3)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const softShadowGeo = new THREE.PlaneGeometry(2.4, 1.2);
    const softShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const softShadow = new THREE.Mesh(softShadowGeo, softShadowMat);
    softShadow.rotation.x = -Math.PI / 2;
    softShadow.position.y = 0.002;
    scene.add(softShadow);

    // ========================================================
    // KINETIC E-LUNA EXACT 3D MODEL GEOMETRY
    // Matching official vehicle reference media_1795293256105_32bbebd8.jpg
    // ========================================================
    const vehicle = new THREE.Group();
    vehicleGroupRef.current = vehicle;

    // --- High-End Materials ---
    const matteBlackMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.65,
      metalness: 0.2,
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.8,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      metalness: 0.95,
      roughness: 0.1,
    });

    const tireRubberMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.92,
      metalness: 0.08,
    });

    const leatherSeatMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.1,
    });

    // Signature Metallic Paint (Ocean Blue, Pearl Yellow, Mulberry Red, etc.)
    const paintMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.65,
      roughness: 0.25,
    });
    paintMaterialRef.current = paintMat;

    const ledLensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.52,
    });

    const amberLightMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      roughness: 0.3,
    });

    // --------------------------------------------------------
    // 1. THE ICONIC WRAP-AROUND TUBULAR CHASSIS LOOP
    // As seen in user reference: curves down step-through, wraps horizontally around seat
    // --------------------------------------------------------
    const tubeRadius = 0.024;
    [-0.14, 0.14].forEach((xSide) => {
      const curvePoints = [
        new THREE.Vector3(xSide * 0.7, 0.82, 0.48), // headstock junction
        new THREE.Vector3(xSide * 0.9, 0.60, 0.32), // down-tube
        new THREE.Vector3(xSide, 0.32, 0.18),       // step-through bottom front
        new THREE.Vector3(xSide, 0.32, -0.10),      // step-through floor rail
        new THREE.Vector3(xSide, 0.48, -0.18),      // curve up behind legs
        new THREE.Vector3(xSide, 0.70, -0.22),      // seat subframe front
        new THREE.Vector3(xSide, 0.70, -0.66),      // under rear pillion seat
      ];
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, tubeRadius, 12, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, paintMat);
      tubeMesh.castShadow = true;
      vehicle.add(tubeMesh);
    });

    // Rear Connecting Loop (Joins left and right frame rails behind seat)
    const rearLoopPoints = [
      new THREE.Vector3(-0.14, 0.70, -0.66),
      new THREE.Vector3(0, 0.70, -0.73),
      new THREE.Vector3(0.14, 0.70, -0.66),
    ];
    const rearLoopCurve = new THREE.CatmullRomCurve3(rearLoopPoints);
    const rearLoopGeo = new THREE.TubeGeometry(rearLoopCurve, 16, tubeRadius, 12, false);
    const rearLoopMesh = new THREE.Mesh(rearLoopGeo, paintMat);
    rearLoopMesh.castShadow = true;
    vehicle.add(rearLoopMesh);

    // Front Crash Guard (Black tubular loop in front of footboard)
    [-0.16, 0.16].forEach((xSide) => {
      const guardCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xSide * 0.5, 0.55, 0.28),
        new THREE.Vector3(xSide * 1.3, 0.50, 0.25),
        new THREE.Vector3(xSide * 0.8, 0.38, 0.20),
      ]);
      const guardGeo = new THREE.TubeGeometry(guardCurve, 16, 0.016, 8, false);
      const guardMesh = new THREE.Mesh(guardGeo, darkSteelMat);
      vehicle.add(guardMesh);
    });

    // --------------------------------------------------------
    // 2. RECTANGULAR HEADLAMP HOUSING & DIGITAL SPEEDOMETER
    // Distinctive square headlamp mask with round projector lens
    // --------------------------------------------------------
    const headlampGroup = new THREE.Group();
    headlampGroup.position.set(0, 0.90, 0.68);

    // Rectangular Matte Black Mask
    const maskGeo = roundedBox(0.19, 0.19, 0.13);
    const maskMesh = new THREE.Mesh(maskGeo, matteBlackMat);
    headlampGroup.add(maskMesh);

    // Central Recessed Round Reflector & Chrome Bezel
    const reflectorGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.03, 24);
    const reflectorMesh = new THREE.Mesh(reflectorGeo, darkSteelMat);
    reflectorMesh.rotation.x = Math.PI / 2;
    reflectorMesh.position.z = 0.065;
    headlampGroup.add(reflectorMesh);

    const bezelGeo = new THREE.TorusGeometry(0.068, 0.007, 12, 24);
    const bezelMesh = new THREE.Mesh(bezelGeo, chromeMat);
    bezelMesh.position.z = 0.078;
    headlampGroup.add(bezelMesh);

    const lensGeo = new THREE.SphereGeometry(0.066, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const lensMesh = new THREE.Mesh(lensGeo, ledLensMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.z = 0.075;
    headlampGroup.add(lensMesh);

    // Sleek Digital LCD Instrument Console mounted above headlamp
    const consoleGeo = roundedBox(0.16, 0.035, 0.08);
    const consoleMesh = new THREE.Mesh(consoleGeo, matteBlackMat);
    consoleMesh.position.set(0, 0.13, -0.01);
    consoleMesh.rotation.x = -Math.PI / 7;
    headlampGroup.add(consoleMesh);

    // Amber Turn Indicators
    [-0.14, 0.14].forEach((xOffset) => {
      const indGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.05, 12);
      const indMesh = new THREE.Mesh(indGeo, amberLightMat);
      indMesh.rotation.z = Math.PI / 2;
      indMesh.position.set(xOffset, 0, 0.03);
      headlampGroup.add(indMesh);
    });

    vehicle.add(headlampGroup);

    // --------------------------------------------------------
    // 3. HANDLEBAR & RECTANGULAR MIRRORS (Matching Reference Photo)
    // --------------------------------------------------------
    const barGroup = new THREE.Group();
    barGroup.position.set(0, 1.05, 0.58);

    // Black / Chrome Handlebar
    const crossbarGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.70, 16);
    const crossbarMesh = new THREE.Mesh(crossbarGeo, darkSteelMat);
    crossbarMesh.rotation.z = Math.PI / 2;
    barGroup.add(crossbarMesh);

    // Rectangular Mirrors (as seen in uploaded photo)
    [-0.26, 0.26].forEach((xSide) => {
      const stemGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.20, 8);
      const stemMesh = new THREE.Mesh(stemGeo, darkSteelMat);
      stemMesh.position.set(xSide * 0.8, 0.15, -0.02);
      stemMesh.rotation.z = xSide > 0 ? 0.35 : -0.35;
      barGroup.add(stemMesh);

      // Rectangular Mirror Glass Housing
      const mirrorGeo = roundedBox(0.09, 0.065, 0.015);
      const mirrorMesh = new THREE.Mesh(mirrorGeo, matteBlackMat);
      mirrorMesh.position.set(xSide * 1.05, 0.24, -0.03);
      mirrorMesh.rotation.x = -0.15;
      barGroup.add(mirrorMesh);
    });

    vehicle.add(barGroup);

    // --------------------------------------------------------
    // 4. STEP-THROUGH APRON, BATTERY COMPARTMENT & COOLING LOUVERS
    // --------------------------------------------------------
    // Front Leg Shield Apron
    const apronGeo = roundedBox(0.24, 0.42, 0.06);
    const apronMesh = new THREE.Mesh(apronGeo, matteBlackMat);
    apronMesh.position.set(0, 0.60, 0.38);
    apronMesh.rotation.x = Math.PI / 8;
    apronMesh.castShadow = true;
    vehicle.add(apronMesh);

    // Flat Footboard
    const deckGeo = roundedBox(0.34, 0.03, 0.48);
    const deckMesh = new THREE.Mesh(deckGeo, matteBlackMat);
    deckMesh.position.set(0, 0.30, 0.05);
    deckMesh.receiveShadow = true;
    vehicle.add(deckMesh);

    // Mid-Mounted Battery Box
    const batteryGeo = roundedBox(0.25, 0.32, 0.34);
    const batteryMesh = new THREE.Mesh(batteryGeo, matteBlackMat);
    batteryMesh.position.set(0, 0.47, -0.06);
    batteryMesh.castShadow = true;
    vehicle.add(batteryMesh);

    // Realistic Horizontal Cooling Louvers on Battery Box Sides
    const louverMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.9,
    });
    for (let i = 0; i < 5; i++) {
      const yOffset = 0.38 + i * 0.04;
      [-0.13, 0.13].forEach((xSide) => {
        const louverGeo = roundedBox(0.01, 0.015, 0.24);
        const louverMesh = new THREE.Mesh(louverGeo, louverMat);
        louverMesh.position.set(xSide, yOffset, -0.06);
        vehicle.add(louverMesh);
      });
    }

    // Rear Swingarm & "Luna" Drive Guard
    const swingarmGeo = roundedBox(0.28, 0.14, 0.45);
    const swingarmMesh = new THREE.Mesh(swingarmGeo, matteBlackMat);
    swingarmMesh.position.set(0, 0.40, -0.52);
    swingarmMesh.castShadow = true;
    vehicle.add(swingarmMesh);

    // Dual Rear Springs
    [-0.15, 0.15].forEach((xSide) => {
      const shockGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.36, 12);
      const shockMesh = new THREE.Mesh(shockGeo, darkSteelMat);
      shockMesh.rotation.x = -Math.PI / 4;
      shockMesh.position.set(xSide, 0.54, -0.58);
      vehicle.add(shockMesh);
    });

    // --------------------------------------------------------
    // 5. 16-INCH WIRE-SPOKE WHEELS & CBS BRAKES
    // --------------------------------------------------------
    const wheelRadius = 0.38;
    const create16InchWheel = (isRear: boolean) => {
      const wheelGroup = new THREE.Group();

      const tireGeo = new THREE.TorusGeometry(wheelRadius, 0.042, 16, 40);
      const tire = new THREE.Mesh(tireGeo, tireRubberMat);
      tire.rotation.y = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rimGeo = new THREE.TorusGeometry(wheelRadius - 0.038, 0.014, 12, 32);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.y = Math.PI / 2;
      wheelGroup.add(rim);

      if (isRear) {
        // 1.2 kW BLDC Integrated Motor Hub
        const motorHubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 24);
        const motorHub = new THREE.Mesh(motorHubGeo, darkSteelMat);
        motorHub.rotation.z = Math.PI / 2;
        motorHub.castShadow = true;
        wheelGroup.add(motorHub);

        const motorRingGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.03, 24);
        const motorRing = new THREE.Mesh(motorRingGeo, chromeMat);
        motorRing.rotation.z = Math.PI / 2;
        wheelGroup.add(motorRing);
      } else {
        const frontHubGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16);
        const frontHub = new THREE.Mesh(frontHubGeo, chromeMat);
        frontHub.rotation.z = Math.PI / 2;
        wheelGroup.add(frontHub);

        const discGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.008, 24);
        const disc = new THREE.Mesh(discGeo, chromeMat);
        disc.rotation.z = Math.PI / 2;
        disc.position.x = 0.045;
        wheelGroup.add(disc);
      }

      // 16 Chrome Wire Spokes
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        const spokeGeo = new THREE.CylinderGeometry(0.002, 0.002, wheelRadius - 0.05, 6);
        const spoke = new THREE.Mesh(spokeGeo, chromeMat);
        spoke.position.set(0, (Math.cos(angle) * (wheelRadius - 0.05)) / 2, (Math.sin(angle) * (wheelRadius - 0.05)) / 2);
        spoke.rotation.x = angle;
        wheelGroup.add(spoke);
      }

      return wheelGroup;
    };

    const frontWheel = create16InchWheel(false);
    frontWheel.position.set(0, 0.38, 0.72);
    vehicle.add(frontWheel);

    const rearWheel = create16InchWheel(true);
    rearWheel.position.set(0, 0.38, -0.72);
    vehicle.add(rearWheel);

    // Front Telescopic Suspension Forks & Black Mudguard
    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.38, 0.72);
    [-0.08, 0.08].forEach((xSide) => {
      const lowerSliderGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.35, 12);
      const lowerSlider = new THREE.Mesh(lowerSliderGeo, darkSteelMat);
      lowerSlider.position.set(xSide, 0.14, 0);
      lowerSlider.rotation.x = -Math.PI / 10;
      forkGroup.add(lowerSlider);

      const stanchionGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.42, 12);
      const stanchion = new THREE.Mesh(stanchionGeo, chromeMat);
      stanchion.position.set(xSide, 0.38, -0.09);
      stanchion.rotation.x = -Math.PI / 10;
      forkGroup.add(stanchion);
    });

    const fenderGeo = new THREE.CylinderGeometry(wheelRadius + 0.02, wheelRadius + 0.02, 0.12, 16, 1, true, -Math.PI / 3, Math.PI / 1.5);
    const fender = new THREE.Mesh(fenderGeo, matteBlackMat);
    fender.rotation.z = Math.PI / 2;
    forkGroup.add(fender);
    vehicle.add(forkGroup);

    // --------------------------------------------------------
    // 6. ERGONOMIC SPLIT SEATS (Matching reference photo)
    // --------------------------------------------------------
    // Front Rider Seat
    const riderSeatGeo = roundedBox(0.26, 0.09, 0.28);
    const riderSeat = new THREE.Mesh(riderSeatGeo, leatherSeatMat);
    riderSeat.position.set(0, 0.76, -0.06);
    riderSeat.castShadow = true;
    vehicle.add(riderSeat);

    // Modular Variant A: PRO X3 (Pillion Seat + Pillion Grab Rail)
    const proSeatGroup = new THREE.Group();
    const pillionSeatGeo = roundedBox(0.24, 0.08, 0.28);
    const pillionSeat = new THREE.Mesh(pillionSeatGeo, leatherSeatMat);
    pillionSeat.position.set(0, 0.77, -0.42);
    pillionSeat.castShadow = true;
    proSeatGroup.add(pillionSeat);

    const grabRailGeo = new THREE.TorusGeometry(0.11, 0.012, 8, 16, Math.PI);
    const grabRail = new THREE.Mesh(grabRailGeo, darkSteelMat);
    grabRail.position.set(0, 0.82, -0.56);
    grabRail.rotation.x = Math.PI / 2;
    proSeatGroup.add(grabRail);

    proSeatGroup.visible = variant === "pro_x3";
    vehicle.add(proSeatGroup);
    proSeatGroupRef.current = proSeatGroup;

    // Modular Variant B: Commercial Cargo (Flatbed + Blue Delivery Crate)
    const cargoGroup = new THREE.Group();
    const carrierBedGeo = roundedBox(0.36, 0.04, 0.58);
    const carrierBed = new THREE.Mesh(carrierBedGeo, darkSteelMat);
    carrierBed.position.set(0, 0.72, -0.46);
    carrierBed.castShadow = true;
    cargoGroup.add(carrierBed);

    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.5,
      metalness: 0.1,
    });
    const crateGeo = roundedBox(0.32, 0.26, 0.42);
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.set(0, 0.87, -0.46);
    crate.castShadow = true;
    cargoGroup.add(crate);

    cargoGroup.visible = variant === "cargo";
    vehicle.add(cargoGroup);
    cargoGroupRef.current = cargoGroup;

    // Modular Variant C: City Commuter (Comfort Split Seat + Protective Saree Guard)
    const commuterGroup = new THREE.Group();
    const comfortSeatGeo = roundedBox(0.25, 0.10, 0.32);
    const comfortSeat = new THREE.Mesh(comfortSeatGeo, leatherSeatMat);
    comfortSeat.position.set(0, 0.76, -0.42);
    comfortSeat.castShadow = true;
    commuterGroup.add(comfortSeat);

    const sareeGuardGeo = new THREE.PlaneGeometry(0.40, 0.30);
    const sareeGuardMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.6,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const sareeGuard = new THREE.Mesh(sareeGuardGeo, sareeGuardMat);
    sareeGuard.rotation.y = Math.PI / 2;
    sareeGuard.position.set(-0.16, 0.46, -0.66);
    commuterGroup.add(sareeGuard);

    commuterGroup.visible = variant === "commuter";
    vehicle.add(commuterGroup);
    commuterGroupRef.current = commuterGroup;

    scene.add(vehicle);
    if(timeOfDay === "night"){
      sunLight.intensity=0.5;sunLight.color.setHex(0x38bdf8);
      ambientLight.intensity=0.6;ambientLight.color.setHex(0x1e293b);
      headlightSpot.intensity=9;beamMesh.visible=true;
    }

    // ========================================================
    // ANIMATION & RENDER LOOP WITH INERTIA DAMPING
    // ========================================================
    let animationFrameId = 0;
    let visible = false;
    let lastFrame = 0;
    let lastHotspots = 0;
    let lastAngle = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateCamera = () => {
      if (isAutoRotateRef.current && !isDraggingRef.current) {
        targetThetaRef.current += 0.0075;
      }

      if (!isDraggingRef.current && Math.abs(angularVelocityRef.current) > 0.0001) {
        targetThetaRef.current += angularVelocityRef.current;
        angularVelocityRef.current *= 0.92;
      }

      currentThetaRef.current += (targetThetaRef.current - currentThetaRef.current) * (reducedMotion ? 1 : 0.18);
      currentPhiRef.current += (targetPhiRef.current - currentPhiRef.current) * 0.12;
      currentRadiusRef.current += (targetRadiusRef.current - currentRadiusRef.current) * 0.12;

      const theta = currentThetaRef.current;
      const phi = currentPhiRef.current;
      const radius = currentRadiusRef.current;

      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      camera.position.set(x + panOffsetRef.current.x, y + panOffsetRef.current.y, z + panOffsetRef.current.z);
      camera.lookAt(panOffsetRef.current);

      const deg = Math.round((((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI));
      if (onAngleChangeRef.current && performance.now()-lastAngle > 100 && Math.abs(deg - lastReportedDegRef.current) >= 1) {
        lastAngle = performance.now();
        lastReportedDegRef.current = deg;
        onAngleChangeRef.current(deg);
      }
    };

    const updateHotspots2D = () => {
      const currentCam = cameraRef.current;
      if (!currentCam || !container) return;

      const halfW = container.clientWidth / 2;
      const halfH = container.clientHeight / 2;

      const screenPositions: HotspotScreenPos[] = [];

      hotspotAnchorsRef.current.forEach((anchor) => {
        const worldPos = anchor.pos.clone();
        worldPos.applyMatrix4(vehicle.matrixWorld);
        worldPos.project(currentCam);

        const isVisible = worldPos.z > -1 && worldPos.z < 1 && Math.abs(worldPos.x)<1 && Math.abs(worldPos.y)<1;
        const screenX = worldPos.x * halfW + halfW;
        const screenY = -(worldPos.y * halfH) + halfH;

        screenPositions.push({
          id: anchor.id,
          name: anchor.name,
          spec: anchor.spec,
          x: screenX,
          y: screenY,
          visible: isVisible,
        });
      });

      setHotspotPositions(previous => previous.length === screenPositions.length && previous.every((p,i)=>p.visible===screenPositions[i].visible && Math.abs(p.x-screenPositions[i].x)<0.5 && Math.abs(p.y-screenPositions[i].y)<0.5) ? previous : screenPositions);
    };

    const animate = (time: number) => {
      if (!visible || document.hidden) { animationFrameId=0; return; }
      animationFrameId=requestAnimationFrame(animate);
      if(time-lastFrame < 32) return;
      lastFrame=time;
      updateCamera(); renderer.render(scene,camera);
      if(time-lastHotspots > 80) { updateHotspots2D(); lastHotspots=time; }
    };
    const resume = () => { if(visible && !document.hidden && !animationFrameId) animationFrameId=requestAnimationFrame(animate); };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(animationFrameId);animationFrameId=0;}else resume();},{threshold:0.01});
    observer.observe(container);
    document.addEventListener("visibilitychange",resume);
    const contextLost=(event:Event)=>{event.preventDefault();setWebglError(true);cancelAnimationFrame(animationFrameId);animationFrameId=0;};
    renderer.domElement.addEventListener("webglcontextlost",contextLost);

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if(newW<=0||newH<=0)return;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.fov = fitFov(newW,newH);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange",resume);
      renderer.domElement.removeEventListener("webglcontextlost",contextLost);
      const geometries=new Set<THREE.BufferGeometry>(); const materials=new Set<THREE.Material>();
      scene.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>materials.add(material));}});
      geometries.forEach(geometry=>geometry.dispose()); materials.forEach(material=>material.dispose());
      sunLight.shadow.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      shadowTex.dispose();
      environmentTarget.dispose();
      renderer.dispose();
      rendererRef.current=null;
    };
  }, []);

  // Pointer & Touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
    angularVelocityRef.current = 0;
    if (onInteracted) onInteracted();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };

    const rotDelta = deltaX * 0.008;
    targetThetaRef.current += rotDelta;
    angularVelocityRef.current = rotDelta * 0.4;

    targetPhiRef.current = Math.max(
      0.18,
      Math.min(Math.PI / 2.05, targetPhiRef.current - deltaY * 0.006)
    );
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Smooth scroll to rotate 360° in 3D
  const handleWheel = (e: React.WheelEvent) => {
    if (!e.shiftKey) return;
    if (onInteracted) onInteracted();
    targetThetaRef.current += e.deltaY * 0.003;
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home"].includes(e.key)) {
      e.preventDefault(); onInteracted?.();
      if(e.key==="ArrowLeft")targetThetaRef.current-=0.25;
      if(e.key==="ArrowRight")targetThetaRef.current+=0.25;
      if(e.key==="ArrowUp")targetRadiusRef.current=Math.max(2.2,targetRadiusRef.current-0.2);
      if(e.key==="ArrowDown")targetRadiusRef.current=Math.min(5,targetRadiusRef.current+0.2);
      if(e.key==="Home"){targetThetaRef.current=Math.PI/4;targetRadiusRef.current=3.6;targetPhiRef.current=Math.PI/2.45;}
    }
  };
  if(webglError)return <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8"><img src="/assets/bikes/studio-yellow-hd.jpg" alt={copy("E-Luna product photograph")} className="max-h-[60%] object-contain"/><p role="status" className="text-sm text-center"><Copy>{"Interactive 3D is unavailable on this device. Use Product Photos above."}</Copy></p></div>;

  return (
    <div
      ref={mountRef}
      tabIndex={0}
      role="group"
      aria-label={copy("Interactive vehicle illustration. Drag horizontally or use left and right arrow keys to rotate. Up and down arrows zoom. Home resets the camera.")}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden touch-pan-y"
    >
      {/* 3D World-Space Projected Hotspots */}
      {hotspotPositions.map(
        (spot) =>
          spot.visible && (
            <button
              key={spot.id}
              onClick={(e) => {
                e.stopPropagation();
                if (onHotspotClick) onHotspotClick(spot.id);
              }}
              style={{
                left: `${spot.x}px`,
                top: `${spot.y}px`,
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group pointer-events-auto transition-transform hover:scale-125"
              title={`${copy(spot.name)} - ${copy(spot.spec)}`}
              aria-label={copy("Explore {part}").replace("{part}", copy(spot.name))}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-7 w-7 rounded-full bg-emerald-400 opacity-25" />
                <div className="relative w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-2xl border-2 border-white">
                  <span className="text-[10px] font-black leading-none">+</span>
                </div>
              </div>
            </button>
          )
      )}
    </div>
  );
}
