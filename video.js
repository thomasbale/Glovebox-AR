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
// something to manage current state
current_instruction = instruction_joystick;
var instruction_live = 0;
var responsegiven = 0;

var attempt = 0;
var videos = [...Array(get_data().length).keys()]
shuffle(videos);
var vid_seq = 0;
var randomIndex = videos[vid_seq]
// should we pause?
var paused = 1;
// At what time?
var pausetime = 10; // stop at 2 seconds
// One click or many?
var single_response = 1;


//console.log(videojs.players)
player = videojs('example_video_1')
//update_video();
//sessionStorage.myValue = 'value'
console.log(sessionStorage.email)
console.log(sessionStorage.experience)
player.controls(false);


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
  player.play();
  responsegiven = 1;
  if (instruction_live) {
    submit_response(id,direction,x,y)
    instruction_live = 0;
    current_instruction.parentNode.removeChild(current_instruction);
    set_camera(3)
    if (!single_response) {
      render_instruction()
      instruction_live=1;
    }
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

    // if we don't have a response before the end replay
    //if (responsegiven == 0){
  //player.currentTime(0);
    //  player.play();
    //  attempt = attempt+1;
    //}else {
  update_video()
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
    }
  }

function update_video(){

  console.log(vid_seq)
  console.log(videos.length)
  if (vid_seq==videos.length) {
    window.location.replace("http://www.w3schools.com");
  }
  /// this is the breakpoint where the next video session loads
  randomIndex = videos[vid_seq]
  video = get_data()[randomIndex].asset.video
  console.log(video)
  videomp4 ="assets/videos/mp4/"+video+".mp4";
  videoogg ="assets/videos/ogv/"+video+".ovg";
  videowebm ="assets/videos/webm/"+video+".webm";

  pausetime = get_data()[randomIndex].asset.timestamp;
  // should we pause?
  paused = get_data()[randomIndex].asset.paused;
  // One click or many?
  single_response = get_data()[randomIndex].asset.single_response;

  player.src({type: 'video/mp4', src: videomp4});
  player.src({type: 'video/ogg', src: videoogg});
  player.src({type: 'video/webm', src: videowebm});
  //this moves to the next random video

  responsegiven = 0;
  instruction_live = 0;
  // perhaps this line needs removing
  if (!current_instruction) {
    current_instruction.parentNode.removeChild(current_instruction);
  }
  set_camera(3);
  vid_seq = vid_seq + 1;
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
      "video":"11",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click .",
      "single_response":1,
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
      "id":1,
      "video":"12",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Click .",
      "single_response":0,
      "image":"",
      "camera":4,
      "type":2,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  },
  {
    "asset":{
      "id":12,
      "video":"14",
      "treatment":"NONE",
      "paused":0,
      "timestamp":5,
      "instruction":"Here is a test instructions. Please use Camera 1.",
      "single_response":1,
      "image":"",
      "camera":1,
      "type":1,
      "optimal_direction":1,
      "optimal_x":1,
      "optimal_y":1
    }
  }
]
  return data;
}
