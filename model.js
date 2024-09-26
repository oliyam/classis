class game {
  
  size = {x:300,y:600}
  
  vessels = [];
  
  constructor(n){
    for (var i = 0; i < n; i++) {
      this.vessels.push(new vessel(n, "destroyer", null, 100,40,[], new radar()));
      
    }
  }
}

class vessel {

  id;
  vclass = "warship";
  
  pos = [{x: 69, y: 69}]
  new_pos;
  
  health = 100;
  speed = 50;
  weapons = [];
  radar = {};
  
  constructor(id, vclass, pos, health, speed, weapons, radar){
    this.id=id;
    this.vclass=vclass||this.vclass;
    this.pos=pos||this.pos;
    this.health=health||this.health;
    this.speed=speed||this.speed;
    this.weapons=weapons||this.weapons;
    this.radar=radar||this.radar;
  }
  
  new_course(vec) {
    let p = this.pos[this.pos.length - 1];
    let d_x = p.x - vec.x;
    let d_y = p.y - vec.y;
    let d = Math.sqrt((d_x * d_x) + (d_y * d_y));
  
    if (d <= this.speed)
      this.new_pos={ x: vec.x, y: vec.y };
  }
  
}

class radar {
  range=80;
}


window.onload = ()=> {
  
  var battle=new game(1);
  
  document.getElementById('turn').onclick=()=>{
    draw_game(battle);
  }
  
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  
  c.addEventListener("touchmove", (e)=>{
    battle.vessels[0].new_course({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    draw_game(battle);
  });
  
  
  function draw_vessel(vessel){
    let p=vessel.pos[vessel.pos.length-1];
    let x=p.x;
    let y=p.y;
    console.log(vessel.pos);
    for(let i=0;i<vessel.pos.length;i++){
      let c = vessel.pos[i];
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue'
      ctx.fill();
      ctx.beginPath()
      let m = vessel.pos[i+1]
      if(m){
        ctx.moveTo(c.x,c.y)
        ctx.lineTo(m.x,m.y)
        ctx.stroke()
      }
    }
    ctx.beginPath();
    ctx.arc(x, y, vessel.speed, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red'
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, vessel.radar.range, 0, 2 * Math.PI);
    ctx.strokeStyle = 'green'
    ctx.stroke();
    
    //destination 
    let d = vessel.new_pos;
    if(d) {
    ctx.moveTo(x, y)
    ctx.lineTo(d.x, d.y)
    ctx.stroke()
          
    ctx.beginPath();
    ctx.arc(d.x, d.y, vessel.speed, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red'
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d.x, d.y, vessel.radar.range, 0, 2 * Math.PI);
    ctx.strokeStyle = 'green'
    ctx.stroke();
    }
  }
    
  function draw_game(game) {
    ctx.clearRect(0,0,c.width,c.height);
    game.vessels.forEach(v => {
      draw_vessel(v);
    });
  }
  
}

