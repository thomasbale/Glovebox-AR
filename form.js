
var id;

function id(){
  return id;
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function submit(){
  id = makeid(5);
  var email = document.getElementById("email").value;
  var experience = document.getElementById('experience').value;
  var start = document.getElementById("start");
  var submit = document.getElementById("submit");

  var data = {uid: id,email:email,experience: experience};

  $.ajax({
    url: "https://script.google.com/macros/s/AKfycbxgyo4a3jsVQK76o2wNbU5j_qTbNDWnDI2Vc09vK8CE7651dST70-siVuf90X86-GiH/exec",
    type: "POST",
    data: data,
    //contentType: "application/javascript",
    //dataType: 'jsonp'
  })
  .done(function(res) {
    console.log('success')
    start.disabled = false;
    submit.disabled = true;
  })
  .fail(function(e) {
    console.log("error")
  });

  return id;
}



/*
document.querySelector('#btnSubmit').addEventListener('click', () => {
  //console.log(email)
  sessionStorage.email = email;
  sessionStorage.experience = experience;

  //downloadToFile(textArea.value.concat(payload), 'my-new-file.txt', 'text/plain');
});*/
