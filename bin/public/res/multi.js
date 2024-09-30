class multiplayer {
  
  xhttp;
  url;
  
  constructor(url){
    this.url=url||'/';
    this.xhttp = new XMLHttpRequest();
  }
  
  get_game = new Promise((res) =>{
 
    this.xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        res(JSON.parse(this.xhttp.responseText))
     }
    };
    this.xhttp.open("GET",this.url+"battle_rx", true);
    this.xhttp.send();
  })
  
  send_game = (data) => {
    this.xhttp.open("POST", this.url+"battle_tx");
    this.xhttp.send(JSON.stringify(data));
  }
}