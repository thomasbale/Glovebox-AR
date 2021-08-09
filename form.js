
var id;

mobile = document.getElementById('mobilewarn');
validation = document.getElementById('experience-select');
mobile_c = mobile.parentNode;
validation_c = validation.parentNode;
mobile.parentNode.removeChild(mobile);
validation.parentNode.removeChild(validation);


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
  if (document.getElementById('experience').value == "0 - please select") {
    console.log("error");
    validation_c.appendChild(validation);
  }else{
    if (window.innerWidth < 800) {
        mobile_c.appendChild(mobile);
    }
    id = makeid(5);
    var email = "noemail"//document.getElementById("email").value;
    var experience = document.getElementById('experience').value;
    var name = document.getElementById('experience').value;
    var start = document.getElementById("start");
    var submit = document.getElementById("submit");
    var loading = document.getElementById("loading");
    var scr_w = window.innerWidth;
    var scr_h = window.innerHeight;

    var data = {uid: id,email:email,experience: experience,name:name,scr_w:scr_w,scr_h,scr_h};

    submit.parentNode.removeChild(submit);

    loading.setAttribute("class","spinner-grow");
    loading.setAttribute("role","status");


    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbxgyo4a3jsVQK76o2wNbU5j_qTbNDWnDI2Vc09vK8CE7651dST70-siVuf90X86-GiH/exec",
      type: "POST",
      data: data,
      //contentType: "application/javascript",
      //dataType: 'jsonp'
    })
    .done(function(res) {
      console.log('success')
      loading.removeAttribute("class","spinner-grow");
      loading.removeAttribute("role","status");
      start.disabled = false;
      submit.disabled = true;

    })
    .fail(function(e) {
      console.log("error")
    });

    return id;
  }
}

function detectMob() {
    return ( ( window.innerWidth <= 800 ) && ( window.innerHeight <= 600 ) );
}

/*
document.querySelector('#btnSubmit').addEventListener('click', () => {
  //console.log(email)
  sessionStorage.email = email;
  sessionStorage.experience = experience;

  //downloadToFile(textArea.value.concat(payload), 'my-new-file.txt', 'text/plain');
});*/
