    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let model;

    function loadModel(modelPath) {
        const loader = new THREE.STLLoader();
        loader.load(modelPath, function (geometry) {
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
            model = new THREE.Mesh(geometry, material);

            model.position.set(0, 2, 0);
            model.rotation.x = Math.PI * 1.5;

            scene.add(model);

            model.updateMatrix();
            model.geometry.applyMatrix4(model.matrix);

            model.rotation.set(0, 0, 0);

            const existingGrid = scene.getObjectByName('grid');
            if (existingGrid) {
                scene.remove(existingGrid);
            }

            const boundingBox = new THREE.Box3().setFromObject(model);
            const size = boundingBox.getSize(new THREE.Vector3());
            const maxSize = Math.max(size.x, size.y, size.z);

            const grid = new THREE.GridHelper(maxSize * 2, 10, 0x888888, 0x888888);
            grid.position.copy(boundingBox.getCenter(new THREE.Vector3()));
            grid.position.y = 5;
            grid.name = 'grid';
            scene.add(grid);
        }, undefined, function (error) {
            console.error(error);
        });
    }

    function switchToQutub1Minar() {
        if (model) {
            scene.remove(model);
        }
        loadModel('models/qutub1minar.stl');
    }

    function switchToFrustumQutubMinar() {
        if (model) {
            scene.remove(model);
        }
        loadModel('models/frustumqutubminar.stl');
    }

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.set(100, 100, 10);
    camera.lookAt(0, 0, 0);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ROTATE, RIGHT: THREE.MOUSE.DOLLY };
    controls.enableDamping = false;

    window.addEventListener('resize', function () {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    });

    const animate = function () {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
    };

    animate();
