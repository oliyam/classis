class multiplayer {
  get_game= new Promise((res) =>{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        res(JSON.parse(xhttp.responseText))
     }
    };
    xhttp.open("GET","battle", true);
    xhttp.send();
  })
  
  send_game = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.send();
  }
}