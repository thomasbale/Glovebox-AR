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




var videos = [...Array(get_data().length).keys()]
shuffle(videos);
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
// something to manage current state
current_instruction = instruction_joystick;
var instruction_live = 0;
var responsegiven = 0;
var vid_seq = 0;


function render_instruction(){

  set_camera(get_data()[randomIndex].asset.camera);
  if (get_data()[randomIndex].asset.type == 1) {
    current_instruction = instruction_joystick;
  }else {
    current_instruction = instruction_locate;
  }
  current_instruction.innerHTML = current_instruction.innerHTML.replace('**INSTRUCTION**',get_data()[randomIndex].asset.instruction);
  instruction_container.appendChild(current_instruction);
  instruction_live = 1;
}


function instruction_response(direction,x,y){
  // 1=up, 2=right,3=down,4=left,5=grip
  if (instruction_live) {
    responsegiven = 1;
    submit_response(id,direction,x,y)
    // clear up
    instruction_live = 0;
    player.play();
    set_camera(3);
    current_instruction.parentNode.removeChild(current_instruction);
  }
}

function submit_response(uid,direction,x,y){
  if (instruction_live) {
    var data = {uid:uid,video: player.src(),req_ts:pausetime,sub_ts: player.currentTime(), camera: 1,direction: direction,x:x,y:y};
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzzbTwGnkEsRNVRz7Yr9Vwq75lFnrRR22NOA3oA8r4cQKTKUJ5TAOuJkxpaZi2CpVnaaw/exec",
      type: "POST",
      data: data
    })
    .done(function(res) {
      console.log('success')
    })
    .fail(function(e) {
      console.log("error")
    });
  }
}

//console.log(videojs.players)
player = videojs('example_video_1')


//sessionStorage.myValue = 'value'
console.log(sessionStorage.email)
console.log(sessionStorage.experience)

player.controls(false)

var pausetime = 10; // stop at 2 seconds
var stop_flag = 1;
var attempt = 0;


// there will be a single pause
player.on('timeupdate', function(e) {
    if (player.currentTime() >= pausetime) {
      randomIndex = videos[vid_seq]

      if (responsegiven == 0) {
        if (get_data()[randomIndex].asset.paused) {
          player.pause();
        }
        render_instruction();
      }
    }
});

player.on('ended', function() {

    // if we don't have a response before the end replay
    if (responsegiven == 0){
      player.currentTime(0);
      player.play();
      attempt = attempt+1;
    }else {
      set_camera(3)
      /// this is the breakpoint where the next video session loads
      video ="assets/videos/"+get_data()[randomIndex].asset.video;
      pausetime = get_data()[randomIndex].asset.timestamp;
      stop_flag = 1;

      player.src(video)
      vid_seq = vid_seq + 1;
      responsegiven = 0;
    }
});

document.getElementById('example_video_1').onclick = function clickEvent(e) {
    if ((player.paused()) && (player.currentTime() <= 1)){
      player.play();
    }else {
      player.play();

      // e = Mouse click event.
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
      instruction_response(0,x,y)
    }
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
      "video":"0001_grip_alignment.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 1.",
      "image":"",
      "camera":1,
      "type":1,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  },
  {
    "asset":{
      "id":2,
      "video":"0002_plate_alignment.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 1.",
      "image":"",
      "camera":1,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  },
  {
    "asset":{
      "id":3,
      "video":"0003_tray_locate_and_move.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":4,
      "video":"0004_tray_position_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":5,
      "video":"0005_target_object.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":6,
      "video":"0006_rotate_slot.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":7,
      "video":"0007_place_slot.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":8,
      "video":"0008_find_radtin.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":9,
      "video":"0009_target_radtin.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":10,
      "video":"0010_grip_radtin_horiz.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":11,
      "video":"0011_palce_radtin_rack.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":12,
      "video":"0012_grip_plate_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":13,
      "video":"0013_lower_plate_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":14,
      "video":"0014_collision_sponge_radjar.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":15,
      "video":"0015_joint_limits_arm.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":16,
      "video":"0016_joint_limits_arm.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":17,
      "video":"0017_grip_plate.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":18,
      "video":"0018_target_plate.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":19,
      "video":"0019_pick_slot.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":20,
      "video":"0020_pick_slot.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":21,
      "video":"0021_collision_jar.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":22,
      "video":"0022_grip_plate.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":23,
      "video":"0023_lower_plate_witherror.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":24,
      "video":"0024_move_tray_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":25,
      "video":"0101_grip_alignment.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":26,
      "video":"0101_grip_alignment.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":27,
      "video":"0102_plate_alignment.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":28,
      "video":"0112_grip_plate_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":29,
      "video":"0113_lower_plate_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":30,
      "video":"0201_grip_alignment.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":31,
      "video":"0202_plate_alignment.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":32,
      "video":"0212_grip_plate_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
,
  {
    "asset":{
      "id":33,
      "video":"0213_lower_plate_target.mp4",
      "treatment":"AR",
      "paused":1,
      "timestamp":10,
      "instruction":"Here is a test instructions. Please use Camera 2.",
      "image":"",
      "camera":2,
      "type":0,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }

  ]
  return data;
}
