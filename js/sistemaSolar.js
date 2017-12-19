var scene, camera, renderer;
var sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune;
var mercuryCurve, venusCurve, earthCurve, marsCurve, jupiterCurve, saturnCurve, uranusCurve, neptuneCurve;
var mercuryOrbitLine, venusOrbitLine, earthOrbitLine, marsOrbitLine, jupiterOrbitLine, saturnOrbitLine, uranusOrbitLine, neptuneOrbitLine;
var mercuryPos, venusPos, earthPos, marsPos, jupiterPos, saturnPos, uranusPos, neptunePos = 0;
var planet = 0;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;

window.onload = function init() {

    scene = new THREE.Scene();

    mainCamera = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    mercuryCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    venusCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    earthCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    marsCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    jupiterCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    saturnCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    uranusCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    neptuneCam = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 30000);
    //scene.add(mainCamera);

    addPlanets();

    mainCamera.position.set(-300,200,300);
    mainCamera.lookAt(sun.position);
    
    // CAMERA ORBIT CONTROLS
    var controls = new THREE.OrbitControls(mainCamera);
    controls.addEventListener('change', function() { 
        renderer.render(scene, mainCamera); 
    });

    // MENU OPTIONS
    var options = new function () {
        this.SpeedMultiplier = 1;
        this.PlanetSize = 10;
        this.OrbitLines = true;
        this.Stars = true;
        this.Sun = true;
        this.AmbientLight = true;
    };
    // MENU
    var menu = new dat.GUI();
    menu.add(options, 'SpeedMultiplier', 0, 1000);
    menu.add(options, 'PlanetSize', 1, 15);
    menu.add(options, 'OrbitLines', true, false);
    menu.add(options, 'Stars', true, false);
    menu.add(options, 'Sun', true, false);
    menu.add(options, 'AmbientLight', true, false);

    // var axis = new THREE.AxisHelper(500);
    // scene.add(axis);



    // AMBIENT LIGHT
    var light = new THREE.AmbientLight( 0xffffff, 0.3 );
    scene.add( light );
    // SUN LIGHT
    var pointLight = new THREE.PointLight("#ccffcc", 1.2, 0, 0);
    pointLight.position.copy(sun.position);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
	pointLight.shadow.mapSize.height = 2048;
    scene.add(pointLight); 

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.shadowMapEnabled = true;

    DrawOrbitLines();

    AddStars();

    animate();

    document.body.appendChild(renderer.domElement);
    document.onkeydown = handleKeyDown;

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'mousedown', onMouseDown, false );

    function animate() {
        // PLANET ROTATION SPEED
        sun.rotation.y += 0.0004 * options.SpeedMultiplier;
        mercury.rotation.y += 0.00017 * options.SpeedMultiplier;
        venus.rotation.y += -0.0000409 * options.SpeedMultiplier;
        earth.rotation.y += 0.01 * options.SpeedMultiplier;
        moon.rotation.y += 0.000339 * options.SpeedMultiplier;
        mars.rotation.y += 0.0097 * options.SpeedMultiplier;
        jupiter.rotation.y += 0.023 * options.SpeedMultiplier;
        saturn.rotation.y += 0.0224 * options.SpeedMultiplier;
        uranus.rotation.y += -0.0138 * options.SpeedMultiplier;
        neptune.rotation.y += 0.0149 * options.SpeedMultiplier;

        // MERCURY ORBIT
        var mercuryOrbitSpeed = 0.0000415 * options.SpeedMultiplier;
        if (mercuryPos <= 1) {
            mercury.position.x = mercuryCurve.getPointAt(mercuryPos).x;
            mercury.position.z = mercuryCurve.getPointAt(mercuryPos).y;
            mercuryPos += mercuryOrbitSpeed;
        } else {
            mercuryPos = 0;
        }

        // VENUS ORBIT
        var venusOrbitSpeed = 0.0000163 * options.SpeedMultiplier;
        if (venusPos <= 1) {
            venus.position.x = venusCurve.getPointAt(venusPos).x;
            venus.position.z = venusCurve.getPointAt(venusPos).y;
            venusPos += venusOrbitSpeed;
        } else {
            venusPos = 0;
        }

        // EARTH ORBIT
        var earthOrbitSpeed = 0.0000100 * options.SpeedMultiplier;
        if (earthPos <= 1) {
            earth.position.x = earthCurve.getPointAt(earthPos).x;
            earth.position.z = earthCurve.getPointAt(earthPos).y;
            earthPos += earthOrbitSpeed;
        } else {
            earthPos = 0;
        }

        // MARS ORBIT
        var marsOrbitSpeed = 0.0000053 * options.SpeedMultiplier;
        if (marsPos <= 1) {
            mars.position.x = marsCurve.getPointAt(marsPos).x;
            mars.position.z = marsCurve.getPointAt(marsPos).y;
            marsPos += marsOrbitSpeed;
        } else {
            marsPos = 0;
        }

        // JUPITER ORBIT
        var jupiterOrbitSpeed = 0.0000008 * options.SpeedMultiplier;
        if (jupiterPos <= 1) {
            jupiter.position.x = jupiterCurve.getPointAt(jupiterPos).x;
            jupiter.position.z = jupiterCurve.getPointAt(jupiterPos).y;
            jupiterPos += jupiterOrbitSpeed;
        } else {
            jupiterPos = 0;
        }

        // SATURN ORBIT
        var saturnOrbitSpeed = 0.0000003 * options.SpeedMultiplier;
        if (saturnPos <= 1) {
            saturn.position.x = saturnCurve.getPointAt(saturnPos).x;
            saturn.position.z = saturnCurve.getPointAt(saturnPos).y;
            saturnPos += saturnOrbitSpeed;
        } else {
            saturnPos = 0;
        }

        // URANUS ORBIT
        var uranusOrbitSpeed = 0.0000001 * options.SpeedMultiplier;
        if (uranusPos <= 1) {
            uranus.position.x = uranusCurve.getPointAt(uranusPos).x;
            uranus.position.z = uranusCurve.getPointAt(uranusPos).y;
            uranusPos += uranusOrbitSpeed;
        } else {
            uranusPos = 0;
        }

        // NEPTUNE ORBIT
        var neptuneOrbitSpeed = 0.00000006 * options.SpeedMultiplier;
        if (neptunePos <= 1) {
            neptune.position.x = neptuneCurve.getPointAt(neptunePos).x;
            neptune.position.z = neptuneCurve.getPointAt(neptunePos).y;
            neptunePos += neptuneOrbitSpeed;
        } else {
            neptunePos = 0;
        }

        // SCALE PLANETS
        mercury.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);
        venus.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);
        earth.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);
        mars.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);
        jupiter.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);
        saturn.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);
        uranus.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);
        neptune.scale.set(options.PlanetSize, options.PlanetSize, options.PlanetSize);

        // ENABLE/DISABLE ORBIT LINES
        if (!options.OrbitLines) {
            mercuryOrbitLine.visible = false;
            venusOrbitLine.visible = false;
            earthOrbitLine.visible = false;
            marsOrbitLine.visible = false;
            jupiterOrbitLine.visible = false;
            saturnOrbitLine.visible = false;
            uranusOrbitLine.visible = false;
            neptuneOrbitLine.visible = false;
        } else {
            mercuryOrbitLine.visible = true;
            venusOrbitLine.visible = true;
            earthOrbitLine.visible = true;
            marsOrbitLine.visible = true;
            jupiterOrbitLine.visible = true;
            saturnOrbitLine.visible = true;
            uranusOrbitLine.visible = true;
            neptuneOrbitLine.visible = true;
        }

        // ENABLE/DISABLE STARS
        if (!options.Stars) {
            scene.traverse(function(obj) {
                if (obj instanceof THREE.Points ) {
                obj.visible = false;
                }
            });
        } else {
            scene.traverse(function(obj) {
                if (obj instanceof THREE.Points ) {
                obj.visible = true;
                }
            });
        }

        // ENABLE/DISABLE SUN AND SUNLIGHT
        if (!options.Sun) {
            sun.visible = false;
            pointLight.visible = false;
        } else {
            sun.visible = true;
            pointLight.visible = true;
        }

        // ENABLE/DISABLE AMBIENT LIGHT
        if (!options.AmbientLight) {
            light.visible = false;
        } else {
            light.visible = true;
        }

        // '0 - 8' - CHANGE PLANET CAM
        switch (planet) {
            case 0: renderer.render(scene, mainCamera);
                break;
            case 1: renderer.render(scene, mercuryCam);
                break;
            case 2: renderer.render(scene, venusCam);
                break;
            case 3: renderer.render(scene, earthCam);
                break;
            case 4: renderer.render(scene, marsCam);
                break;
            case 5: renderer.render(scene, jupiterCam);
                break;
            case 6: renderer.render(scene, saturnCam);
                break;
            case 7: renderer.render(scene, uranusCam);
                break;
            case 8: renderer.render(scene, neptuneCam);
                break;

            default: renderer.render(scene, mainCamera);
        }

        // MERCURY CAM
        mercuryCam.position.x = 0.5 * options.PlanetSize + mercuryCurve.getPointAt(mercuryPos).x;
        mercuryCam.position.y = 0.5 * options.PlanetSize;
        mercuryCam.rotation.x = -0.5;
        mercuryCam.position.z = 1 * options.PlanetSize + mercuryCurve.getPointAt(mercuryPos).y;

        // VENUS CAM
        venusCam.position.x = 1.25 * options.PlanetSize + venusCurve.getPointAt(venusPos).x;
        venusCam.position.y = 1.25 * options.PlanetSize;
        venusCam.rotation.x = -0.5;
        venusCam.position.z = 2.5 * options.PlanetSize + venusCurve.getPointAt(venusPos).y;

        // EARTH CAM
        earthCam.position.x = 1.3 * options.PlanetSize + earthCurve.getPointAt(earthPos).x;
        earthCam.position.y = 1.3 * options.PlanetSize;
        earthCam.rotation.x = -0.5;
        earthCam.position.z = 2.6 * options.PlanetSize + earthCurve.getPointAt(earthPos).y;

        // MARS CAM
        marsCam.position.x = 0.7 * options.PlanetSize + marsCurve.getPointAt(marsPos).x;
        marsCam.position.y = 0.7 * options.PlanetSize;
        marsCam.rotation.x = -0.5;
        marsCam.position.z = 1.4 * options.PlanetSize + marsCurve.getPointAt(marsPos).y;

        // JUPITER CAM
        jupiterCam.position.x = 14.3 * options.PlanetSize + jupiterCurve.getPointAt(jupiterPos).x;
        jupiterCam.position.y = 14.3 * options.PlanetSize;
        jupiterCam.rotation.x = -0.5;
        jupiterCam.position.z = 28.6 * options.PlanetSize + jupiterCurve.getPointAt(jupiterPos).y;

        // SATURN CAM
        saturnCam.position.x = 14.3 * options.PlanetSize + saturnCurve.getPointAt(saturnPos).x;
        saturnCam.position.y = 17.3 * options.PlanetSize;
        saturnCam.rotation.x = -0.5;
        saturnCam.position.z = 34.6 * options.PlanetSize + saturnCurve.getPointAt(saturnPos).y;

        // URANUS CAM
        uranusCam.position.x = 5.2 * options.PlanetSize + uranusCurve.getPointAt(uranusPos).x;
        uranusCam.position.y = 8.2 * options.PlanetSize;
        uranusCam.rotation.x = -0.5;
        uranusCam.position.z = 14.4 * options.PlanetSize + uranusCurve.getPointAt(uranusPos).y;

        // NEPTUNE CAM
        neptuneCam.position.x = 5 * options.PlanetSize + neptuneCurve.getPointAt(neptunePos).x;
        neptuneCam.position.y = 5 * options.PlanetSize;
        neptuneCam.rotation.x = -0.5;
        neptuneCam.position.z = 10 * options.PlanetSize + neptuneCurve.getPointAt(neptunePos).y;

        // PLANET PICKER
        raycaster.setFromCamera( mouse, mainCamera );
        var intersects = raycaster.intersectObjects( scene.children );
    
        if ( intersects.length > 0 ) {
            if (intersects[0].object instanceof THREE.Mesh && planet == 0) {
                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex( 0xff6633 );
            }
        } else {
            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            INTERSECTED = null;
        }

        requestAnimationFrame(animate);
    }

}

function addPlanets() {
    // SUN
    var sphereGeometry = new THREE.SphereGeometry(109, 64, 64);
    var sunTexture = new THREE.TextureLoader().load ('textures/sunmap.jpg');
    var sphereMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    sun = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sun.name = "sun";
    scene.add(sun);

    // MERCURY
    var mercuryGeometry = new THREE.SphereGeometry(0.383,64,64);
    var mercuryTexture = new THREE.TextureLoader().load ('textures/mercurymap.jpg');
    var mercuryBumpMap = new THREE.TextureLoader().load ('textures/mercurybump.jpg');
    var mercuryMaterial = new THREE.MeshPhongMaterial({ map: mercuryTexture, bumpMap: mercuryBumpMap, bumpScale: .005 });
    mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    mercury.name = "mercury";
    mercury.translateX(109 + 57.9);
    mercury.castShadow = true;
    mercury.receiveShadow = true;
    scene.add(mercury);

    // VENUS
    var venusGeometry = new THREE.SphereGeometry(0.949,64,64);
    var venusTexture = new THREE.TextureLoader().load ('textures/venusmap.jpg');
    var venusBumpMap = new THREE.TextureLoader().load ('textures/venusbump.jpg');
    var venusMaterial = new THREE.MeshPhongMaterial({ map: venusTexture, bumpMap: venusBumpMap, bumpScale: .005 });
    venus = new THREE.Mesh(venusGeometry, venusMaterial);
    venus.name = "venus";
    venus.translateX(109 + 108.2);
    venus.castShadow = true;
    venus.receiveShadow = true;
    scene.add(venus);

    // EARTH 
    var earthGeometry = new THREE.SphereGeometry(1,64,64);
    var earthTexture = new THREE.TextureLoader().load ('textures/earthmap.jpg');
    var earthBumpMap = new THREE.TextureLoader().load ('textures/earthbump.jpg');
    var earthMaterial = new THREE.MeshPhongMaterial( { map: earthTexture, bumpMap: earthBumpMap, bumpScale: .005 } );
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.name = "earth";
    // CLOUDS 
    var cloudsGeometry = new THREE.SphereGeometry(1.005,64,64);
    var cloudsTexture = new THREE.TextureLoader().load ('textures/cloudmap.png');
    var cloudsMaterial = new THREE.MeshLambertMaterial( { map: cloudsTexture, transparent: true } );
    var clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    // MOON
    var moonGeometry = new THREE.SphereGeometry(0.272,64,64);
    var moonTexture = new THREE.TextureLoader().load ('textures/moonmap.jpg');
    var moonBumpMap = new THREE.TextureLoader().load ('textures/moonbump.jpg');
    var moonMaterial = new THREE.MeshPhongMaterial( { map: moonTexture, bumpMap: moonBumpMap, bumpScale: .005 } );
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.name = moon;
    earth.translateX(109 + 149.6);
    moon.translateX(1 + 0.384);
    earth.castShadow = true;
    earth.receiveShadow = true;
    moon.castShadow = true;
    moon.receiveShadow = true;
    earth.add(clouds);
    earth.add(moon);
    scene.add(earth);

    // MARS
    var marsGeometry = new THREE.SphereGeometry(0.532,64,64);
    var marsTexture = new THREE.TextureLoader().load ('textures/marsmap.jpg');
    var marsBumpMap = new THREE.TextureLoader().load ('textures/marsbump.jpg');
    var marsMaterial = new THREE.MeshPhongMaterial({ map: marsTexture, bumpMap: marsBumpMap, bumpScale: .005 });
    mars = new THREE.Mesh(marsGeometry, marsMaterial);
    mars.name = "mars";
    mars.translateX(109 + 227.9);
    mars.castShadow = true;
    mars.receiveShadow = true;
    scene.add(mars);

    // JUPITER
    var jupiterGeometry = new THREE.SphereGeometry(11.21,64,64);
    var jupiterTexture = new THREE.TextureLoader().load ('textures/jupitermap.jpg');
    var jupiterMaterial = new THREE.MeshLambertMaterial({ map: jupiterTexture });
    jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    jupiter.name = "jupiter";
    jupiter.translateX(109 + 778.5);
    jupiter.castShadow = true;
    jupiter.receiveShadow = true;
    scene.add(jupiter);

    // SATURN
    var saturnGeometry = new THREE.SphereGeometry(9.45,64,64);
    var saturnTexture = new THREE.TextureLoader().load ('textures/saturnmap.jpg');
    var saturnMaterial = new THREE.MeshLambertMaterial({ map: saturnTexture });
    saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
    saturn.name = "saturn";
    saturn.translateX(109 + 1429);
    // SATURN RING
    var saturnRingGeometry = new THREE.RingGeometry( 12, 24, 64 );
    var saturnRingTexture = new THREE.TextureLoader().load ('textures/saturnringmap.png');
    var saturnRingMaterial = new THREE.MeshBasicMaterial( { map: saturnRingTexture, transparent: true, side: THREE.DoubleSide } );
    saturnRing = new THREE.Mesh( saturnRingGeometry, saturnRingMaterial );
    saturnRing.rotateX(THREE.Math.degToRad(90));
    saturn.castShadow = true;
    saturn.receiveShadow = true;
    saturn.add(saturnRing);
    scene.add(saturn);

    // URANUS
    var uranusGeometry = new THREE.SphereGeometry(4.01,64,64);
    var uranusTexture = new THREE.TextureLoader().load ('textures/uranusmap.jpg');
    var uranusMaterial = new THREE.MeshLambertMaterial({ map: uranusTexture });
    uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
    uranus.name = "uranus";
    uranus.translateX(109 + 2871);
    uranus.rotateX(THREE.Math.degToRad(90));
    uranus.castShadow = true;
    uranus.receiveShadow = true;
    scene.add(uranus);
    // URANUS RING
    var uranusRingGeometry = new THREE.RingGeometry( 5, 8, 64 );
    var uranusRingTexture = new THREE.TextureLoader().load ('textures/uranusringmap.png');
    var uranusRingMaterial = new THREE.MeshBasicMaterial( { map: uranusRingTexture, transparent: true, side: THREE.DoubleSide } );
    uranusRing = new THREE.Mesh( uranusRingGeometry, uranusRingMaterial );
    uranusRing.rotateX(THREE.Math.degToRad(90));
    scene.add(uranus);
    uranus.add(uranusRing);

    // NEPTUNE
    var neptuneGeometry = new THREE.SphereGeometry(3.88,64,64);
    var neptuneTexture = new THREE.TextureLoader().load ('textures/neptunemap.jpg');
    var neptuneMaterial = new THREE.MeshLambertMaterial({ map: neptuneTexture });
    neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
    neptune.name = "neptune";
    neptune.translateX(109 + 4498);
    neptune.castShadow = true;
    neptune.receiveShadow = true;
    scene.add(neptune);
}

function DrawOrbitLines() {
    // MERCURY ORBIT LINE
    mercuryCurve = new THREE.EllipseCurve(0, 0, 109 + 57.9, 109 + 57.9, 0, 2 * Math.PI);
    var path = new THREE.Path(mercuryCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    mercuryOrbitLine = new THREE.Line(geometry, material);
    mercuryOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(mercuryOrbitLine);

    // VENUS ORBIT LINE
    venusCurve = new THREE.EllipseCurve(0, 0, 109 + 108.2, 109 + 108.2, 0, 2 * Math.PI);
    var path = new THREE.Path(venusCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    venusOrbitLine = new THREE.Line(geometry, material);
    venusOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(venusOrbitLine);

    // EARTH ORBIT LINE
    earthCurve = new THREE.EllipseCurve(0, 0, 109 + 149.6, 109 + 149.6, 0, 2 * Math.PI);
    var path = new THREE.Path(earthCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    earthOrbitLine = new THREE.Line(geometry, material);
    earthOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(earthOrbitLine);

    // MARS ORBIT LINE
    marsCurve = new THREE.EllipseCurve(0, 0, 109 + 227.9, 109 + 227.9, 0, 2 * Math.PI);
    var path = new THREE.Path(marsCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    marsOrbitLine = new THREE.Line(geometry, material);
    marsOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(marsOrbitLine);

    // JUPITER ORBIT LINE
    jupiterCurve = new THREE.EllipseCurve(0, 0, 109 + 778.5, 109 + 778.5, 0, 2 * Math.PI);
    var path = new THREE.Path(jupiterCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    jupiterOrbitLine = new THREE.Line(geometry, material);
    jupiterOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(jupiterOrbitLine);

    // SATURN ORBIT LINE
    saturnCurve = new THREE.EllipseCurve(0, 0, 109 + 1429, 109 + 1429, 0, 2 * Math.PI);
    var path = new THREE.Path(saturnCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    saturnOrbitLine = new THREE.Line(geometry, material);
    saturnOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(saturnOrbitLine);

    // URANUS ORBIT LINE
    uranusCurve = new THREE.EllipseCurve(0, 0, 109 + 2871, 109 + 2871, 0, 2 * Math.PI);
    var path = new THREE.Path(uranusCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    uranusOrbitLine = new THREE.Line(geometry, material);
    uranusOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(uranusOrbitLine);

    // NEPTUNE ORBIT LINE
    neptuneCurve = new THREE.EllipseCurve(0, 0, 109 + 4498, 109 + 4498, 0, 2 * Math.PI);
    var path = new THREE.Path(neptuneCurve.getPoints(256));
    var geometry = path.createPointsGeometry(256);
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    neptuneOrbitLine = new THREE.Line(geometry, material);
    neptuneOrbitLine.rotateX(THREE.Math.degToRad(90));
    scene.add(neptuneOrbitLine);
}

function AddStars() {
    for (var i = 0; i < 1500; i++) {

        var starGeometry = new THREE.Geometry();
        starGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        var starMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );
        star = new THREE.Points( starGeometry, starMaterial );
        scene.add( star );

        star.position.x = -6000 + Math.round((Math.random() * 12000));
        star.position.y = -6000 + Math.round((Math.random() * 12000));
        star.position.z = -6000 + Math.round((Math.random() * 12000));
        scene.add(star);
    }
}

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseDown( event ) {
    switch (INTERSECTED.name) {
        case "mercury": planet = 1;
            break;
        case "venus": planet = 2;
            break;
        case "earth": planet = 3;
            break;
        case "mars": planet = 4;
            break;
        case "jupiter": planet = 5;
            break;
        case "saturn": planet = 6;
            break;
        case "uranus": planet = 7;
            break;
        case "neptune": planet = 8;
            break;

        default: planet = 0;
    }
}

function handleKeyDown(event) {
    var key = String.fromCharCode(event.keyCode);
    switch (key) {
        case "1": planet = parseInt(key);
            break;
        case "2": planet = parseInt(key);
            break;
        case "3": planet = parseInt(key);
            break;
        case "4": planet = parseInt(key);
            break;
        case "5": planet = parseInt(key);
            break;
        case "6": planet = parseInt(key);
            break;
        case "7": planet = parseInt(key);
            break;
        case "8": planet = parseInt(key);
            break;

        default: planet = 0;
    }
}

function onWindowResize() {
    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
