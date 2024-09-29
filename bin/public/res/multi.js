class multiplayer {
  
  async get_game(){
    await fetch('http://yameogo.ddns.net:50240/battle').then(res=>{
      console.log(res)
       return res
    });
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