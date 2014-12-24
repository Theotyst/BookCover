var socket = io.connect('https://bookcover-thibaultlinglain.c9.io/');

socket.emit('access', '9191');
socket.on('msg', function (data) {
   $('.msg').append(" | "+data);
});

var sceneJSON;
var objects = [];
var mouse = new THREE.Vector2(),
offset = new THREE.Vector3();

window.onload = function(){
	
		var canvas = document.getElementById("myCanvas");
	 	console.log(canvas);
	    var context = canvas.getContext("2d");
	    var imageObj = new Image();
	    imageObj.onload = function(){
	        context.drawImage(imageObj, 0, 0, 1024, 1024);
	        context.font = "20pt Calibri";
	        context.fillStyle='yellow';
	        context.fillText("My TEXT!", 150, 550);
	    };
	    imageObj.src = "textures/basic_cover_0.png";
};

socket.on('connected', function(){

	$(".testUpdate").click(function(){
		var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
		for(var i in ids){
			updateTexture(ids[i]);
		}
	});

	var updateTexture = function(id){
		console.log("test");
		scene.traverse (function (object){
			if(object.uuid == id){
				/*for(var i in sceneJSON){
					if(sceneJSON[i].id == id){

					}
				}*/
				var canvas = document.getElementById("myCanvas");
				var texture = new THREE.Texture(canvas);
				texture.needsUpdate = true;
				console.log(object);
				object.children[0].material.map = texture;
				console.log(object);
			}
		});
	}

    var selectObject = function(){ 
    	var idCheckbox = this.id;
    	if(this.checked){
        	scene.traverse (function (object){
				if (object.uuid === idCheckbox){
	  				var boundingBox = new THREE.BoundingBoxHelper(object, 0x0000ff);
					boundingBox.update();
					boundingBox.name=idCheckbox;
					scene.add(boundingBox);
					if($(".objects input[type='checkbox']:checked").size() == 1){
						$(".sliderPosX").slider("value", object.position.x);
						$(".sliderPosY").slider("value", object.position.y);
						$(".sliderPosZ").slider("value", object.position.z);
						$(".sliderRotX").slider("value", object.rotation.x*180/Math.PI);
						$(".sliderRotY").slider("value", object.rotation.y*180/Math.PI);
						$(".sliderRotZ").slider("value", object.rotation.z*180/Math.PI);
						$(".sliderSizeX").slider("value", object.scale.x);
						$(".sliderSizeY").slider("value", object.scale.y);
						$(".sliderSizeZ").slider("value", object.scale.z);
					}
				}
			});
    	}
    	else{

    		scene.traverse (function (object){
				if (object.name == idCheckbox){
 					scene.remove(object);
				}
		//		console.log(object);
			});
			if($(".objects input[type='checkbox']:checked").size() == 1){
				var id = $(".objects input[type='checkbox']:checked").attr("id");
				scene.traverse (function (object){
					if(object.uuid == id){
						$(".sliderPosX").slider("value", object.position.x);
						$(".sliderPosY").slider("value", object.position.y);
						$(".sliderPosZ").slider("value", object.position.z);
						$(".sliderRotX").slider("value", object.rotation.x);
						$(".sliderRotY").slider("value", object.rotation.y);
						$(".sliderRotZ").slider("value", object.rotation.z);
						$(".sliderSizeX").slider("value", object.scale.x);
						$(".sliderSizeY").slider("value", object.scale.y);
						$(".sliderSizeZ").slider("value", object.scale.z);
					}
				});
			}	
    	}
	};

	$(".colorpicker").colpick({
		flat:true,
		layout:'hex',
		submit:0,
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changeColor(ids[i], hex);
			}
		}
	});

	$(".sliderPosX").slider({
		value:0,
		max:5,
		min:-5,
		step:0.01,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changePos(ids[i], "x", ui.value);	
			}
		}
	});

	$(".sliderPosY").slider({
		value:0,
		max:5,
		min:-5,
		step:0.01,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changePos(ids[i], "y", ui.value);
			}
		}
	});

	$(".sliderPosZ").slider({
		value:0,
		max:5,
		min:-5,
		step:0.01,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changePos(ids[i], "z", ui.value);
			}
		}
	});
	$(".sliderRotX").slider({
		value:0,
		max:180,
		min:-180,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changeRot(ids[i], "x", ui.value*Math.PI/180);
			}
		}
	});

	$(".sliderRotY").slider({
		value:0,
		max:180,
		min:-180,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changeRot(ids[i], "y", ui.value*Math.PI/180);
			}
		}
	});

	$(".sliderRotZ").slider({
		value:0,
		max:180,
		min:-180,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changeRot(ids[i], "z", ui.value*Math.PI/180);
			}
		}
	});
	$(".sliderSizeX").slider({
		value:1,
		max:2,
		min:0.5,
		step:0.05,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changeDim(ids[i], "x", ui.value);
			}
		}
	});

	$(".sliderSizeY").slider({
		value:1,
		max:2,
		min:0.5,
		step:0.05,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changeDim(ids[i], "y", ui.value);
			}
		}
	});

	$(".sliderSizeZ").slider({
		value:1,
		max:2,
		min:0.5,
		step:0.05,
		change:function(event, ui){
			var ids = $(".objects input[type='checkbox']:checked").map(function() { return this.id; }).get();
			for(var i in ids){
				changeDim(ids[i], "z", ui.value);
			}
		}
	});


	$(".testAdd").click(function(){
		scene.traverse (function (object)
		{
			if (object.name === "book0"){
				
				var newBook = new THREE.Mesh(object.geometry, object.material);
				
				scene.add(newBook);
				console.log(scene);
				newBook.position.set(newBook.position.x+1, newBook.position.y+1, newBook.position.z);
			}
		});
	});

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, $(".zone").width() / $(".zone").height(), 0.1, 1000 );
	var renderer = new THREE.WebGLRenderer({antialias: true});
	var JSONloader = new THREE.JSONLoader();
	renderer.setSize( $(".zone").width(), $(".zone").height() );
	$(".zone").append( renderer.domElement );
	camera.position.z = 3;
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	var projector = new THREE.Projector();


	function onDocumentMouseDown( event ) {
				console.log("click");
				event.preventDefault();
				console.log("x: "+(((event.clientX - $('.zone').offset().left)/$('.zone').width()) * 2 - 1));
				// $(".zone").clientWidth );
				console.log("y: "+ (-(((event.clientY - $('.zone').offset().top)/$('.zone').height()) * 2) + 1));
				 var mouse3D = new THREE.Vector3( (((event.clientX - $('.zone').offset().left)/$('.zone').width()) * 2 - 1),   //x
                                    (-(((event.clientY - $('.zone').offset().top)/$('.zone').height()) * 2) + 1),  //y
                                    0.5 );                                            //z
				 console.log(camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
				 mouse3D.sub( camera.position );                
    			mouse3D.normalize();
    			 var raycaster = new THREE.Raycaster( camera.position, mouse3D );
    var intersects = raycaster.intersectObjects( objects );
    console.log(intersects);
    // Change color if hit block
    if ( intersects.length > 0 ) {
       	console.log("YES");
       	 //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
    }

	}



	var controls = new THREE.OrbitControls(camera, renderer.domElement);
  	controls.addEventListener( 'change', render );

	function render(){
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}


	var changeColor = function(id, color){
		//console.log(scene);
		scene.traverse (function (object)
		{
			if (object.uuid == id){
				if(object.children.length > 0){
					for(var i in object.children){
						if(object.children[i].material.name=="cover"){
							object.children[i].material.color.set("#"+color);
						}
					}
				}
    		}		
		});
	}

	var changeDim = function(id, coord, value){
		scene.traverse (function (object)
		{
			if (object.uuid == id){
				switch(coord){
					case "x":object.scale.set(value, object.scale.y, object.scale.z);
					break;
					case "y":object.scale.set(object.scale.x, value, object.scale.z);
					break;
					case "z":object.scale.set(object.scale.x, object.scale.y, value);
					break;
				}
				scene.traverse (function (object){
					if (object.name == id){
						object.update();
					}
				});
    		}		
		});
	}

	var changePos = function(id, coord, value){
		scene.traverse (function (object)
		{
			if (object.uuid == id){
				switch(coord){
					case "x":object.position.set(value, object.position.y, object.position.z);
					break;
					case "y":object.position.set(object.position.x, value, object.position.z);
					break;
					case "z":object.position.set(object.position.x, object.position.y, value);
					break;
				}
				scene.traverse (function (object){
					if (object.name == id){
						object.update();
					}
				});
    		}		
		});
	}

	var changeRot = function(id, coord, value){
		scene.traverse (function (object){
			if (object.uuid == id){
				switch(coord){
					case "x":object.rotation.set(value, object.rotation.y, object.rotation.z);
					break;
					case "y":object.rotation.set(object.rotation.x, value, object.rotation.z);
					break;
					case "z":object.rotation.set(object.rotation.x, object.rotation.y, value);
					break;
				}
				scene.traverse (function (object){
					if (object.name == id){
						object.update();
					}
				});
		
    		}
		});
	}
	/////////////////////////////////
	/*
	var light = new THREE.AmbientLight( 0xC2C2C2 ); // soft white light 
	scene.add( light );

	JSONloader.load("models/basic.js", function(geometry) {
     
	 var texture = THREE.ImageUtils.loadTexture('textures/basic_cover_0.png',null, function(){
	 	 var texture2 = THREE.ImageUtils.loadTexture('textures/basic_pages_0.png',null, function(){
			
			var material1 = new THREE.MeshPhongMaterial({map:texture,transparent:true, color:0xff0000});
			material1.color.set(0xff0000);
			var material2 = new THREE.MeshPhongMaterial({map:texture2, transparent:true});

			var materials = [material1, material2];
		     //var mesh = new THREE.Mesh(geometry, material);
		     var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, materials);

		     scene.add(mesh);

		    render();
		   });
	 	});
	});

	*/
	//////////////////////////////////


	socket.on('loadScene', function(data){
		loadScene(data);
	});


	var loadScene = function(data){

		sceneJSON = data;
		
		function doSynchronousLoop(data, processData, done, params) {
			if (data.length > 0) {
				var loop = function(data, i, processData, done, params) {
					processData(data[i], i, params, function() {
						if (++i < data.length) {
							loop(data, i, processData, done, params);
						} else {
							done(params);
						}
					});
				};
				loop(data, 0, processData, done, params);
			} else {
				done(params);
			}
		}


		var loadObject = function(object, i, params, callback){
			switch(object.type){
				case "mesh":
					console.log("mesh");
					var materialLoads = 0;
					JSONloader.load("models/"+object.model, function(geometry) {
						var materialsArray = new Array();
						doSynchronousLoop(object.materials, loadMaterial, materialsLoaded, {"object":object, "materialsArray":materialsArray, "geometry":geometry, "callback":callback});			
					});
					
					
				break;
				case "light":
					console.log("light");
					switch(object.kind){
						case "ambient":
							var light = new THREE.AmbientLight(object.color);
							scene.add(light);
							callback();
						break;
						case "directional":
							var light = new THREE.DirectionalLight(object.color);
							light.position.set(object.position[0], object.position[1], object.position[2]).normalize();
							scene.add(light);
							callback();
						break;
					}
				break;
			}
		}

		var materialsLoaded = function(params){
			params.geometry.computeFaceNormals();
			var mesh = THREE.SceneUtils.createMultiMaterialObject(params.geometry, params.materialsArray);
			mesh.name = params.object.name;
			mesh.position.set(params.object.position[0], params.object.position[1], params.object.position[2]);
			mesh.rotation.set(params.object.rotation[0], params.object.rotation[1], params.object.rotation[2]);
			scene.add(mesh);
			
			objects.push(mesh);

			console.log(mesh)
			var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.id = mesh.uuid;
			var newCheckbox = $(".objects").append(checkbox);
			$(".objects #"+checkbox.id).change(selectObject);
			
			
			params.callback();
		}


		var loadMaterial = function(material, j, params, callback){
			var texture = THREE.ImageUtils.loadTexture('textures/'+material.texture, null, function(){
				params.materialsArray[j] = new THREE.MeshPhongMaterial({map:texture, transparent:true});
				if(material.color){
					params.materialsArray[j].color.set(material.color);
				}
				params.materialsArray[j].name=material.name;

				if(material.bumpMap){
					var bumpTexture = THREE.ImageUtils.loadTexture('textures/'+material.bumpMap, null, function(){
						params.materialsArray[j].bumpMap=bumpTexture;
						params.materialsArray[j].bumpScale=material.bumpScale;
						callback();
					});
				} else {
					callback();	
				}
			});
		}

		var doneLoading = function(){
			console.log(scene);
			console.log("done");
			render();
		} 

		doSynchronousLoop(data, loadObject, doneLoading);


	};
	//socket.emit('test');
});