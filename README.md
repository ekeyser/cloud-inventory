cloud-inventory
========

#### Cloud Infrastructure Inventory ####

This class provides a simple info box that will help you monitor your code performance.

* **FPS** Frames rendered in the last second. The higher the number the better.
* **MS** Milliseconds needed to render a frame. The lower the number the better.
* **MB** MBytes of allocated memory. (Run Chrome with `--enable-precise-memory-info`)
* **CUSTOM** User-defined panel support.


### Installation ###
```bash
npm install cloud-inventory.js
```

### Usage ###

```javascript
var inventory= new CloudInventory();
inventory.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( inventory.dom );

function animate() {

	inventory.init();

	// monitored code goes here

	inventory.end();

	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );
```
