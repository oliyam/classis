class multiplayer {
  
  get_game = (data) => new Promise((res) =>{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        res(JSON.parse(xhttp.responseText))
     }
    };
    xhttp.open("POST", "battle_rx", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(data);
  })
  
  send_game = (data) => {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "battle_tx");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
  }
}