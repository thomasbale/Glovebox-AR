
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

document.getElementById("id").value = makeid(5);

document.getElementById("submit").addEventListener("click", function () {
  console.log("button clicked")
  var id = document.getElementById("id").value;
  var email = document.getElementById("email").value;
  var experience = document.getElementById('experience').value;




});
/*
document.querySelector('#btnSubmit').addEventListener('click', () => {
  //console.log(email)
  sessionStorage.email = email;
  sessionStorage.experience = experience;

  //downloadToFile(textArea.value.concat(payload), 'my-new-file.txt', 'text/plain');
});*/
