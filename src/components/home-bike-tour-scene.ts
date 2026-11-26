import {
  Box3, DirectionalLight, Group, HemisphereLight, Mesh, MeshStandardMaterial, Object3D,
  OrthographicCamera, Scene, SRGBColorSpace, Texture, Vector3, WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const markerPoints = {
  frame: [new Vector3(-.135, -.105, .02), new Vector3(-.115, .095, -.16)],
  lights: [new Vector3(0, .036, -.48), new Vector3(0, -.055, -.47)],
};

function disposeModel(root: Object3D) {
  const textures = new Set<Texture>();
  const materials = new Set<MeshStandardMaterial>();
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const slots = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of slots) {
      if (!(material instanceof MeshStandardMaterial)) continue;
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof Texture) textures.add(value);
      }
    }
  });
  textures.forEach(texture => texture.dispose());
  materials.forEach(material => material.dispose());
}

export async function createBikeTourScene(
  host: HTMLDivElement,
  markers: HTMLDivElement,
  signal: AbortSignal,
  onContextLost: () => void,
) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const pivot = new Group();
  scene.add(pivot);
  scene.add(new HemisphereLight(0xfff8eb, 0xd4e2d8, 2));
  const key = new DirectionalLight(0xfff8ea, 1.15);
  key.position.set(-2, 3, 4);
  scene.add(key);
  const fill = new DirectionalLight(0xe0f2ff, .5);
  fill.position.set(2.5, .5, -2);
  scene.add(fill);

  const camera = new OrthographicCamera(-1, 1, 1, -1, .1, 10);
  camera.position.set(0, .19, 3);
  camera.lookAt(0, 0, 0);

  let model: Object3D | undefined;
  let lost = false;
  let disposed = false;
  const handleLoss = (event: Event) => {
    event.preventDefault();
    lost = true;
    onContextLost();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    renderer.domElement.removeEventListener("webglcontextlost", handleLoss);
    renderer.domElement.remove();
    if (model) disposeModel(model);
    renderer.dispose();
    if (!lost) renderer.forceContextLoss();
  };

  renderer.domElement.addEventListener("webglcontextlost", handleLoss);
  try {
    const response = await fetch("/3d/sample.glb", { signal });
    if (!response.ok) throw new Error("Unable to load the E-Luna model.");
    model = (await new GLTFLoader().parseAsync(await response.arrayBuffer(), "/3d/")).scene;
    signal.throwIfAborted();
    if (lost) throw new Error("Lost the bike tour WebGL context.");

    const bounds = new Box3().setFromObject(model);
    const centre = bounds.getCenter(new Vector3());
    const { x, y, z } = bounds.getSize(new Vector3());
    const length = Math.max(x, y, z);
    if (!Number.isFinite(length) || length <= 0) throw new Error("The E-Luna model has no visible geometry.");

    model.position.copy(centre).multiplyScalar(-1 / length);
    model.scale.setScalar(1 / length);
    model.traverse(object => {
      if (!(object instanceof Mesh)) return;
      if (!object.geometry.getAttribute("normal")) object.geometry.computeVertexNormals();
      if (object.material instanceof MeshStandardMaterial) {
        // The photo texture already contains reflections and shading.
        object.material.metalness = 0;
      }
    });
    pivot.add(model);
    host.append(renderer.domElement);
  } catch (error) {
    dispose();
    throw error;
  }

  const projected = new Vector3();
  let width = 0;
  let height = 0;
  let framedForMobile = false;
  let previousYaw = NaN;
  let previousPins: keyof typeof markerPoints | undefined;

  function draw(yaw: number, mobile: boolean, pins?: keyof typeof markerPoints) {
    if (lost || disposed) return;
    const nextWidth = host.clientWidth;
    const nextHeight = host.clientHeight;
    if (!nextWidth || !nextHeight) return;
    const resized = nextWidth !== width || nextHeight !== height || framedForMobile !== mobile;
    if (!resized && yaw === previousYaw && pins === previousPins) return;

    if (resized) {
      width = nextWidth;
      height = nextHeight;
      framedForMobile = mobile;
      const aspect = width / height;
      const viewHeight = Math.max(1.04, (mobile ? 1.22 : 2.25) / aspect);
      const viewWidth = viewHeight * aspect;
      camera.left = -viewWidth / 2;
      camera.right = viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
      renderer.setSize(width, height, false);
    }

    previousYaw = yaw;
    previousPins = pins;
    pivot.rotation.y = yaw * Math.PI / 180;
    renderer.render(scene, camera);

    if (pins) {
      markerPoints[pins].forEach((point, i) => {
        projected.copy(point).applyMatrix4(pivot.matrixWorld).project(camera);
        const left = (projected.x + 1) * width / 2;
        const top = (1 - projected.y) * height / 2;
        const marker = markers.children[i] as HTMLElement;
        marker.style.transform = `translate(${left}px, ${top}px) translate(-50%, -50%)`;
      });
    }
  }

  return { draw, dispose, available: () => !lost && !disposed };
}
