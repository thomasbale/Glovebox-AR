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



var data = {email: sessionStorage.email,experience: sessionStorage.experience,something: "else"};
//data = JSON.stringify(data);

$.ajax({
  url: "https://script.google.com/macros/s/AKfycbzzbTwGnkEsRNVRz7Yr9Vwq75lFnrRR22NOA3oA8r4cQKTKUJ5TAOuJkxpaZi2CpVnaaw/exec",
  type: "POST",
  data: data,
  //contentType: "application/javascript",
  //dataType: 'jsonp'
})
.done(function(res) {
  console.log('success')
})
.fail(function(e) {
  console.log("error")
});

window.receipt = function(res) {
  console.log("function completes")
  // this function will execute upon finish
}

//



console.log(videojs.players)
player = videojs('example_video_1')

var payload;

//sessionStorage.myValue = 'value'
console.log(sessionStorage.email)
console.log(sessionStorage.experience)

player.controls(false)


player.on('pause', function() {
  //player.play();
  // ...so you can do here all the stuff you want while the video is playing
    console.log("Completed video")
    player.src('output.mp4')
});

document.getElementById('example_video_1').onclick = function clickEvent(e) {
      player.play()
      // e = Mouse click event.
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
      console.log("Left : " + x + " ; Top : " + y + ".");
      console.log(player.currentSrc())
      console.log(player.currentTime())
      payload = x;
    }

function show_image(src, width, height, alt) {
    player.src('output.mp4')
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
}

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

	URL.revokeObjectURL(a.href);
};

document.querySelector('#btnSave').addEventListener('click', () => {
  const textArea = document.querySelector('textarea');

  downloadToFile(textArea.value.concat(payload), 'my-new-file.txt', 'text/plain');
});
