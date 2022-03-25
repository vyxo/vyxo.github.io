import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

var sway = 1
var vel = 0
var drag = {
  x: 0,
  y: 0,
}
var target = {
  x: 0,
  y: 0,
}
var tick = 0

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function nearest(near, num) {
  return Math.round(num/near) * near
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setClearColor( 0x000000, 0 )
document.querySelector('#dimension').appendChild( renderer.domElement )

const make = {
  cube: (a, b, c, mat) => {
    const geometry = new THREE.BoxGeometry(a, b, c)
    const material = new THREE.MeshPhongMaterial(mat)
    const cube = new THREE.Mesh( geometry, material )
    return cube
  },
  sphere: (radius, w, h, mat) => {
    const geometry = new THREE.SphereGeometry(radius, w, h)
    const material = new THREE.MeshBasicMaterial(mat)
    const sphere = new THREE.Mesh( geometry, material )
    return sphere
  },
  tracker: (a, b, c, mat) => {
    const geometry = new THREE.BoxGeometry(a, b, c)
    const material = new THREE.MeshBasicMaterial(mat)
    const cube = new THREE.Mesh( geometry, material )
    return cube
  }
}

function maths(shape, min, max) {
  const d = nearest(0.1, rand(min, max))
  const r = nearest(0.1, rand(0, 2 * Math.PI))
  shape.position.x = Math.cos(r) * d
  shape.position.z = Math.sin(r) * d
}

function flat(shape, distance, flat, up) {
  const d = distance
  const f = flat - Math.PI/2
  const u = up - Math.PI/2
  shape.position.x = Math.cos(f) * d
  shape.position.z = Math.sin(f) * d
  shape.position.y = Math.cos(u) * d
}

function dust(n, min, max, miny, maxy) {
  for (let i = 0; i < n; i++) {
    let shape = make.cube(1, 1, 1, { color: 0x2F3136 })
    shape.position.y = rand(-miny, -maxy)
    maths(shape, min, max)
    shapes.push(shape)
  }
}

function render() {
  for (const shape of shapes) {
    scene.add(shape)
  }
}

let shapes = []

const light = new THREE.PointLight( 0x5865F2, 1, 100 )
light.position.set( 0, 0, 0 )
scene.add( light )

let tracker = make.tracker(1, 1, 1, { color: 0x2F3136 })
tracker.material.opacity = 0
tracker.material.transparent = true
flat(tracker, 16, 0)
scene.add(tracker)

camera.position.z = 0
dust(16, 5, 10, 5, 10)
dust(16, 5, 10, 10, 15)
dust(16, 5, 10, 15, 20)
render()

function follow(e, w, h) {
  target.x = (e.x - w / 2) * -0.25
  target.y = (e.y - h / 2) * -0.25
}

function each() {
  if (tick % 1000 === 0) {
    
  } else {
    for (let shape of shapes) {
      shape.position.y += 0.01
      shape.rotation.y += 0.01
      shape.rotation.x += 0.01
      if (shape.position.y > 10) {
        shape.position.y = -10
        maths(shape, 5, 10)
      }
    }
  }
}

function animate() {
  requestAnimationFrame( animate )
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize( w, h )
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  // vel += (sway - vel)/10
  // camera.rotation.y += vel * 0.01
  drag.x += (target.x - drag.x)/10
  // camera.rotation.y = drag.x * 0.01
  drag.y += (target.y - drag.y)/10
  // camera.rotation.x = drag.y * 0.01
  flat(tracker, 16, drag.x * -0.01, drag.y * 0.01)
  camera.lookAt(tracker.position.x, tracker.position.y, tracker.position.z)
  each()
  renderer.render( scene, camera )
  tick ++
}

window.addEventListener('mousemove', (e) => {
  follow(e, window.innerWidth, window.innerHeight)
})

animate()