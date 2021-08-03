/*
let events = [];

rrweb.record({
  emit(event) {
    // push event into the events array
    events.push(event);
  },
});

// this function will send events to the backend and reset the events array
function save() {
  const body = JSON.stringify({ events });
  events = [];
  console.log(body);
}

// save events every 10 seconds
setInterval(save, 10 * 1000);
*/
//player = videojs('example_video_1')


//  ============================================================
// Your clientside script should actually look like this (jquery example):
//  ============================================================





//update_video();
// Adapted from examples on the Querystring homepage.

id = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
id = id.replace('?','');
//data = JSON.stringify(data);


// where the instructions are located
instruction_container = document.getElementById('instruction_container');
// instruction-joystick
// instruction-locate/hazard
instruction_locate = document.getElementById('instruction_locate');
instruction_joystick = document.getElementById('instruction_joystick');
instruction_locate.parentNode.removeChild(instruction_locate);
instruction_joystick.parentNode.removeChild(instruction_joystick);
//instruction_container.removeChild(instruction_locate);
//instruction_container.removeChild(instruction_joystick);

// something to manage current state
current_instruction = instruction_locate;

var instruction_live = 0;
var responsegiven = 0;
//where are the video files located
var host = "https://glovebox-ar.fra1.cdn.digitaloceanspaces.com/a_"

var attempt = 0;
var videos = [...Array(get_data().length).keys()]
shuffle(videos);
var vid_seq = 0;
var randomIndex = videos[vid_seq]
// should we pause?
var paused = 1;
// At what time?
var pausetime = 78; // stop at 2 seconds
// One click or many?
var single_response = 1;
var videoid = "intro";
var treatment = "intro";
var camera = 1;
var optimalx = "intro";
var optimaly = "intro";
var optimaldir = "intro";
var optimalts = "intro";
var instruction = "This is where questions will appear"
var type = 2;


//console.log(videojs.players)
player = videojs('example_video_1')
//update_video();
//sessionStorage.myValue = 'value'
console.log(sessionStorage.email)
console.log(sessionStorage.experience)

function render_instruction(){
	console.log("instruction:"+instruction);
	console.log("videoid"+videoid);
  set_camera(camera);
  if (type == 1) {
    current_instruction = instruction_joystick;
  }else {
    current_instruction = instruction_locate;
  }
  current_instruction.innerHTML = current_instruction.innerHTML.replace('**INSTRUCTION**',instruction);
  instruction_container.appendChild(current_instruction);
  instruction_live = 1;
}


function instruction_response(direction,x,y){
  // 1=up, 2=right,3=down,4=left,5=grip


  player.play();
  if (instruction_live) {
		responsegiven = 1;
    submit_response(id,direction,x,y)
		//player.currentTime((player.duration()-0.5));
    instruction_live = 0;
    if (current_instruction) {
			//player.currentTime((player.duration()-0.5));
      current_instruction.parentNode.removeChild(current_instruction);
    }
    set_camera(3)
    if (!single_response) {
      render_instruction()
      instruction_live=1;
    }
		//player.currentTime((player.duration()-1));
		//player.play();
  }
}

function submit_response(uid,direction,x,y){
  if (instruction_live) {
    var data = {
      uid:uid,
      video: player.src(),
      req_ts:pausetime,
      sub_ts: player.currentTime(),
      direction: direction,x:x,y:y,
      videoid:videoid,
      treatment:treatment,
      camera:camera,
      optimalx:optimalx,
      optimaly:optimaly,
      optimaldir:optimaldir,
      optimaldir:optimaldir};
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzzbTwGnkEsRNVRz7Yr9Vwq75lFnrRR22NOA3oA8r4cQKTKUJ5TAOuJkxpaZi2CpVnaaw/exec",
      type: "POST",
      data: data
    })
    .done(function(res) {
      console.log('success')
			current_instruction.innerHTML = current_instruction.innerHTML.replace(instruction,'**INSTRUCTION**');
			randomIndex = videos[vid_seq]

			if (videoid != "intro") {
				update_video()
				vid_seq = vid_seq + 1;
			}

    })
    .fail(function(e) {
      console.log("error")
    });
  }
}
// there will be a single pause
player.on('timeupdate', function(e) {

    if (player.currentTime() >= pausetime) {
      //randomIndex = videos[vid_seq]
      if (responsegiven == 0) {
        if (paused) {
          player.pause();
        }
        render_instruction();
      }
    }
});

player.on('ended', function() {
	current_instruction.innerHTML = current_instruction.innerHTML.replace(instruction,'**INSTRUCTION**');

    // if we don't have a response before the end replay
    //if (responsegiven == 0){
  //player.currentTime(0);
    //  player.play();
    //  attempt = attempt+1;
    //}else {
  randomIndex = videos[vid_seq]
  update_video()
  vid_seq = vid_seq + 1;
  //player.play()
    //}
});

document.getElementById('example_video_1').onclick = function clickEvent(e) {
    if ((player.paused()) && (player.currentTime() <= 1)){
      player.play();
      //set_camera(2)
    }else {
      player.play();
      // e = Mouse click event.
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
			instruction_response(0,x,y)
			/*
			if (videoid != "intro") {
				instruction_response(0,x,y)
			}else {
				// In this case we must be watching the intro video which is an execption
				responsegiven = responsegiven + 1;
				current_instruction.parentNode.removeChild(current_instruction);
				set_camera(3);
			}*/

    }
  }

function update_video(){

  console.log(vid_seq)
  console.log(videos.length)
	player.controls(false);
	player.preload(true);
  if (vid_seq==videos.length) {
    window.location.replace("complete.html");
  }
  /// this is the breakpoint where the next video session loads

  video = get_data()[randomIndex].asset.video
  console.log(video)
  // improve browser compatibility
  videomp4 =host+video+".mp4";
  videoogg =host+video+".ovg";
  videowebm =host+video+".webm";

  pausetime = get_data()[randomIndex].asset.timestamp;
  // should we pause?
  paused = get_data()[randomIndex].asset.paused;
  // One click or many?
  single_response = get_data()[randomIndex].asset.single_response;
  videoid = get_data()[randomIndex].asset.video;
  treatment = get_data()[randomIndex].asset.treatment;
  camera = get_data()[randomIndex].asset.camera;
  optimalx = get_data()[randomIndex].asset.optimal_x;
  optimaly = get_data()[randomIndex].asset.optimal_y;
  optimaldir = get_data()[randomIndex].asset.optimal_direction;
  optimalts = get_data()[randomIndex].asset.optimal_ts;
  instruction = get_data()[randomIndex].asset.instruction;
	type = get_data()[randomIndex].asset.type;

  player.src({type: 'video/mp4', src: videomp4});
  player.src({type: 'video/ogg', src: videoogg});
  player.src({type: 'video/webm', src: videowebm});
  player.currentTime(0);
	player.poster("assets/play.png")
  //this moves to the next random video

  responsegiven = 0;
  instruction_live = 0;
  // perhaps this line needs removing
  if (current_instruction.parentNode) {
    current_instruction.parentNode.removeChild(current_instruction);
  }
  set_camera(3);

}

function set_camera(c){

  c1 = document.getElementById('c1');
  c2 = document.getElementById('c2');

  c1.setAttribute("class", "p-3 border bg-light");
  c2.setAttribute("class", "p-3 border bg-light");

  if (c == 1) {
    c1.setAttribute("class", "p-3 border bg-warning");
  }
  if (c == 2) {
    c2.setAttribute("class", "p-3 border bg-warning");
  }
  if (c == 4) {
    c2.setAttribute("class", "p-3 border bg-warning");
    c1.setAttribute("class", "p-3 border bg-warning");
  }
}

function show_image(src, width, height, alt) {
    player.src('0001_grip_alignment.mp4')
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
}



function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

	URL.revokeObjectURL(a.href);
};

function get_data(){

  var data =
  [
  {
    "asset":{
      "id":1,
      "video":"1",
      "treatment":"NONE",
      "paused":0,
      "timestamp":4,
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":23
    }
  },
{
    "asset":{
      "id":2,
      "video":"2",
      "treatment":"NONE",
      "paused":1,
      "timestamp":59,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":3,
      "video":"3",
      "treatment":"NONE",
      "paused":0,
      "timestamp":8,
      "instruction":"Select a suitable grip point",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":498,
      "optimal_y":191,
      "optimal_ts":9
    }
  },
{
    "asset":{
      "id":5,
      "video":"5",
      "treatment":"NONE",
      "paused":0,
      "timestamp":43,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":426,
      "optimal_y":216,
      "optimal_ts":44
    }
  },
{
    "asset":{
      "id":7,
      "video":"7",
      "treatment":"NONE",
      "paused":0,
      "timestamp":12,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":517,
      "optimal_y":179,
      "optimal_ts":13
    }
  },
{
    "asset":{
      "id":8,
      "video":"8",
      "treatment":"NONE",
      "paused":0,
      "timestamp":6,
      "instruction":"Click on the Tin you need to pickup",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":266,
      "optimal_y":151,
      "optimal_ts":6.5
    }
  },
{
    "asset":{
      "id":9,
      "video":"9",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click where you think the Tin should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":287,
      "optimal_y":246,
      "optimal_ts":6
    }
  },
{
    "asset":{
      "id":10,
      "video":"10",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":224,
      "optimal_y":43,
      "optimal_ts":7
    }
  },
{
    "asset":{
      "id":11,
      "video":"11",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click where you think the Tin should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":20,
      "optimal_y":268,
      "optimal_ts":7
    }
  },
{
    "asset":{
      "id":12,
      "video":"12",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":30
    }
  },
{
    "asset":{
      "id":13,
      "video":"13",
      "treatment":"NONE",
      "paused":0,
      "timestamp":14,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":15
    }
  },
{
    "asset":{
      "id":14,
      "video":"14",
      "treatment":"NONE",
      "paused":0,
      "timestamp":19,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":1,
      "optimal_x":168,
      "optimal_y":183,
      "optimal_ts":130
    }
  },
{
    "asset":{
      "id":15,
      "video":"15",
      "treatment":"NONE",
      "paused":0,
      "timestamp":2,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":222,
      "optimal_y":31,
      "optimal_ts":4
    }
  },
{
    "asset":{
      "id":16,
      "video":"16",
      "treatment":"NONE",
      "paused":1,
      "timestamp":11,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":17,
      "video":"17",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
			  // 1=up, 2=right,3=down,4=left,5=grip
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":18
    }
  },
{
    "asset":{
      "id":18,
      "video":"18",
      "treatment":"NONE",
      "paused":0,
      "timestamp":8,
      "instruction":"Click where you think the Plate should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1,
      "optimal_ts":1
    }
  },
{
    "asset":{
      "id":19,
      "video":"19",
      "treatment":"NONE",
      "paused":1,
      "timestamp":5,
      "instruction":"Click on slot hole nearest to the gripper",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":502,
      "optimal_y":154,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":20,
      "video":"20",
      "treatment":"NONE",
      "paused":1,
      "timestamp":10,
      "instruction":"Click where you think the Slot should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":308,
      "optimal_y":165,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":21,
      "video":"21",
      "treatment":"NONE",
      "paused":0,
      "timestamp":9,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":132,
      "optimal_y":178,
      "optimal_ts":13
    }
  },
{
    "asset":{
      "id":22,
      "video":"22",
      "treatment":"NONE",
      "paused":0,
      "timestamp":2,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":51
    }
  },
{
    "asset":{
      "id":23,
      "video":"23",
      "treatment":"NONE",
      "paused":1,
      "timestamp":58,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":24,
      "video":"24",
      "treatment":"NONE",
      "paused":0,
      "timestamp":2,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":268,
      "optimal_y":154,
      "optimal_ts":7
    }
  },
{
    "asset":{
      "id":1,
      "video":"25",
      "treatment":"NONE/AR1",
      "paused":0,
      "timestamp":4,
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":23
    }
  },
{
	    "asset":{
	      "id":2,
	      "video":"26",
	      "treatment":"NONE/AR1",
	      "paused":1,
	      "timestamp":59,
	      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
	      "single_response":1,
	      "image":"",
	      "camera":2,
	      "type":1,
	      "optimal_direction":5,
	      "optimal_x":null,
	      "optimal_y":null,
	      "optimal_ts":null
	    }
	  },
{
		 "asset":{
		  "id":5,
		  "video":"27",
		      "treatment":"NONE/AR1",
		      "paused":0,
		      "timestamp":43,
		      "instruction":"Click on a suitable location to place the Plate",
		      "single_response":1,
		      "image":"",
		      "camera":1,
		      "type":2,
		      "optimal_direction":null,
		      "optimal_x":426,
		      "optimal_y":216,
		      "optimal_ts":44
		    }
		  },
{
    "asset":{
      "id":12,
      "video":"28",
      "treatment":"NONE/AR1",
      "paused":0,
      "timestamp":5,
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":30
    }
  },
{
	    "asset":{
	      "id":13,
	      "video":"29",
	      "treatment":"NONE/AR1",
	      "paused":0,
	      "timestamp":14,
	      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
	      "single_response":1,
	      "image":"",
	      "camera":4,
	      "type":1,
	      "optimal_direction":2,
	      "optimal_x":null,
	      "optimal_y":null,
	      "optimal_ts":15
	    }
	  },{
    "asset":{
      "id":16,
      "video":"30",
      "treatment":"NONE/AR1",
      "paused":1,
      "timestamp":11,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":17,
      "video":"31",
      "treatment":"NONE/AR1",
      "paused":0,
      "timestamp":5,
			  // 1=up, 2=right,3=down,4=left,5=grip
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":18
    }
  },
{
    "asset":{
      "id":22,
      "video":"32",
      "treatment":"NONE/AR1",
      "paused":0,
      "timestamp":2,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":51
    }
  },
{
    "asset":{
      "id":23,
      "video":"33",
      "treatment":"NONE/AR1",
      "paused":1,
      "timestamp":58,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":1,
      "video":"34",
      "treatment":"NONE/AR2",
      "paused":0,
      "timestamp":4,
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":23
    }
  },
{
    "asset":{
      "id":2,
      "video":"35",
      "treatment":"NONE/AR2",
      "paused":1,
      "timestamp":59,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":5,
      "video":"36",
      "treatment":"NONE/AR2",
      "paused":0,
      "timestamp":43,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":426,
      "optimal_y":216,
      "optimal_ts":44
    }
  },
{
    "asset":{
      "id":12,
      "video":"37",
      "treatment":"NONE/AR2",
      "paused":0,
      "timestamp":5,
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":30
    }
  },
{
    "asset":{
      "id":13,
      "video":"38",
      "treatment":"NONE/AR2",
      "paused":0,
      "timestamp":14,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":15
    }
  },
{
    "asset":{
      "id":16,
      "video":"39",
      "treatment":"NONE/AR2",
      "paused":1,
      "timestamp":11,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":17,
      "video":"40",
      "treatment":"NONE/AR2",
      "paused":0,
      "timestamp":5,
			  // 1=up, 2=right,3=down,4=left,5=grip
      "instruction":"Click middle button when gripper is aligned to gripper block",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":18
    }
  },
{
    "asset":{
      "id":22,
      "video":"41",
      "treatment":"NONE/AR2",
      "paused":0,
      "timestamp":2,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":51
    }
  },
{
    "asset":{
      "id":23,
      "video":"42",
      "treatment":"NONE/AR2",
      "paused":1,
      "timestamp":58,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":2,
      "video":"43",
      "treatment":"AR1/NONE",
      "paused":1,
      "timestamp":59,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":3,
      "video":"44",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":8,
      "instruction":"Select a suitable grip point",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":498,
      "optimal_y":191,
      "optimal_ts":9
    }
  },
	{
    "asset":{
      "id":5,
      "video":"45",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":43,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":426,
      "optimal_y":216,
      "optimal_ts":44
    }
  },
{
    "asset":{
      "id":7,
      "video":"47",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":12,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":517,
      "optimal_y":179,
      "optimal_ts":13
    }
  },
{
    "asset":{
      "id":8,
      "video":"48",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":6,
      "instruction":"Click on the Tin you need to pickup",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":266,
      "optimal_y":151,
      "optimal_ts":6.5
    }
  },
{
    "asset":{
      "id":9,
      "video":"49",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click where you think the Tin should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":287,
      "optimal_y":246,
      "optimal_ts":6
    }
  },
	{
    "asset":{
      "id":10,
      "video":"50",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":224,
      "optimal_y":43,
      "optimal_ts":7
    }
  },
{
    "asset":{
      "id":11,
      "video":"51",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click where you think the Tin should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":20,
      "optimal_y":268,
      "optimal_ts":7
    }
  },
{
    "asset":{
      "id":13,
      "video":"52",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":14,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":15
    }
  },
{
    "asset":{
      "id":14,
      "video":"53",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":19,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":1,
      "optimal_x":168,
      "optimal_y":183,
      "optimal_ts":130
    }
  },
{
    "asset":{
      "id":15,
      "video":"54",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":2,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":222,
      "optimal_y":31,
      "optimal_ts":4
    }
  },
{
    "asset":{
      "id":19,
      "video":"55",
      "treatment":"AR1/NONE",
      "paused":1,
      "timestamp":5,
      "instruction":"Click on slot hole nearest to the gripper",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":502,
      "optimal_y":154,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":20,
      "video":"56",
      "treatment":"AR1/NONE",
      "paused":1,
      "timestamp":10,
      "instruction":"Click where you think the Slot should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":308,
      "optimal_y":165,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":21,
      "video":"57",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":9,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":132,
      "optimal_y":178,
      "optimal_ts":13
    }
  },
{
    "asset":{
      "id":5,
      "video":"58",
      "treatment":"AR2/AR1",
      "paused":0,
      "timestamp":43,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":426,
      "optimal_y":216,
      "optimal_ts":44
    }
  },
{
    "asset":{
      "id":13,
      "video":"59",
      "treatment":"AR2/AR1",
      "paused":0,
      "timestamp":14,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":15
    }
  },
{
    "asset":{
      "id":2,
      "video":"60",
      "treatment":"AR2/NONE",
      "paused":1,
      "timestamp":59,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":3,
      "video":"61",
      "treatment":"AR1/NONE",
      "paused":0,
      "timestamp":8,
      "instruction":"Select a suitable grip point",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":498,
      "optimal_y":191,
      "optimal_ts":9
    }
  },
{
    "asset":{
      "id":5,
      "video":"62",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":43,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":426,
      "optimal_y":216,
      "optimal_ts":44
    }
  },
{
    "asset":{
      "id":7,
      "video":"64",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":12,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":517,
      "optimal_y":179,
      "optimal_ts":13
    }
  },
{
    "asset":{
      "id":8,
      "video":"65",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":6,
      "instruction":"Click on the Tin you need to pickup",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":266,
      "optimal_y":151,
      "optimal_ts":6.5
    }
  },
{
    "asset":{
      "id":9,
      "video":"66",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click where you think the Tin should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":287,
      "optimal_y":246,
      "optimal_ts":6
    }
  },
{
    "asset":{
      "id":10,
      "video":"67",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":224,
      "optimal_y":43,
      "optimal_ts":7
    }
  },
{
    "asset":{
      "id":11,
      "video":"68",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click where you think the Tin should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":20,
      "optimal_y":268,
      "optimal_ts":7
    }
  },
{
    "asset":{
      "id":13,
      "video":"69",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":14,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":15
    }
  },
{
    "asset":{
      "id":14,
      "video":"70",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":19,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":1,
      "optimal_x":168,
      "optimal_y":183,
      "optimal_ts":130
    }
  },
{
    "asset":{
      "id":15,
      "video":"71",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":2,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":222,
      "optimal_y":31,
      "optimal_ts":4
    }
  },
{
    "asset":{
      "id":19,
      "video":"72",
      "treatment":"AR2/NONE",
      "paused":1,
      "timestamp":5,
      "instruction":"Click on slot hole nearest to the gripper",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":502,
      "optimal_y":154,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":20,
      "video":"73",
      "treatment":"AR2/NONE",
      "paused":1,
      "timestamp":10,
      "instruction":"Click where you think the Slot should go",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":308,
      "optimal_y":165,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":21,
      "video":"74",
      "treatment":"AR2/NONE",
      "paused":0,
      "timestamp":9,
      "instruction":"Click if and where you see a likely collision",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":null,
      "optimal_x":132,
      "optimal_y":178,
      "optimal_ts":13
    }
  },
{
    "asset":{
      "id":2,
      "video":"75",
      "treatment":"AR1/AR2",
      "paused":1,
      "timestamp":59,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":5,
      "video":"76",
      "treatment":"AR1/AR2",
      "paused":0,
      "timestamp":43,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":426,
      "optimal_y":216,
      "optimal_ts":44
    }
  },
{
    "asset":{
      "id":13,
      "video":"77",
      "treatment":"AR1/AR2",
      "paused":0,
      "timestamp":14,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":15
    }
  },
{
    "asset":{
      "id":2,
      "video":"78",
      "treatment":"AR2/AR2",
      "paused":1,
      "timestamp":59,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":2,
      "type":1,
      "optimal_direction":5,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":null
    }
  },
{
    "asset":{
      "id":5,
      "video":"79",
      "treatment":"AR2/AR2",
      "paused":0,
      "timestamp":43,
      "instruction":"Click on a suitable location to place the Plate",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":2,
      "optimal_direction":null,
      "optimal_x":426,
      "optimal_y":216,
      "optimal_ts":44
    }
  },
{
    "asset":{
      "id":13,
      "video":"80",
      "treatment":"AR2/AR2",
      "paused":0,
      "timestamp":14,
      "instruction":"Select rotation required to connect plate to slot. Middle button for no rotation.",
      "single_response":1,
      "image":"",
      "camera":4,
      "type":1,
      "optimal_direction":2,
      "optimal_x":null,
      "optimal_y":null,
      "optimal_ts":15
    }
  }
];

delete data[21];
delete data[22];
delete data[23];
delete data[40];
delete data[41];
delete data[72];
delete data[73];

/*
	delete data[3];
	delete data[4];
	delete data[5];
	delete data[13];
	delete data[21];
	delete data[22];
	delete data[23];
	delete data[26];
	delete data[31];
	delete data[32];
	delete data[33];
	delete data[34];
	delete data[35];
	delete data[36];
	delete data[37];
	delete data[38];
	delete data[39];
	delete data[40];
	delete data[41];
	delete data[44];
	delete data[45];
	delete data[52];
	delete data[57];
	delete data[58];
	delete data[59];
	delete data[60];
	delete data[61];
	delete data[62];
	delete data[63];
	delete data[64];
	delete data[65];
	delete data[66];
	delete data[67];
	delete data[68];
	delete data[69];
	delete data[70];
	delete data[71];
	delete data[72];
	delete data[73];
	delete data[74];
	delete data[75];
	delete data[76];
	delete data[77];
	delete data[78];
	delete data[79];*/

  return data;
}
