class multiplayer {
  get_game(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("sex"+xhttp.responseText);
   }
  };
  xhttp.open("GET","battle", true);
  xhttp.send();
  }
  
  async send_data(data){
    return await fetch('http://yameogo.ddns.net:50240', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }
}