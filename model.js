class game {
  
  size = {x:300,y:600}
  
  vessels = [];
  
  constructor(n){
    for (var i = 0; i < n; i++) {
      this.vessels.push(new vessel(n, "DD", null, 100,40, new weapon(), new radar()));
      
    }
  }
}

class vessel {

  id;
  vclass = "warship";
  
  pos = [{x: 69, y: 69}];
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
    if(weapons)
      this.weapons.push(weapons);
    this.radar=radar||this.radar;
  }
  
  new_course(vec) {
    if(in_range(this.pos[this.pos.length-1], vec, this.speed))
      this.new_pos=vec;
  }
  
  sail(){
    if(this.new_pos)
      this.pos.push(this.new_pos);
  }
  
}

class radar {
  range=200;
}

class weapon {
  range=50;
  radius=10;
  
  damage=25;
  
  ammo=4;
  
  lockon={};
  
  constructor(){}
  
  target(pos, vec){
    if (in_range(pos, vec, this.range)&&this.ammo>0){
      this.lockon = vec;
    }
  }
  
  fire(){
    if (this.ammo>0) {
      let coords=this.lockon;
      this.lockon=undefined;
      this.ammo--;
      return (coords, this.radius, this.damage);
    }
  }
}

function in_range(pos, vec, range) {
  let d_x=pos.x-vec.x;
  let d_y=pos.y-vec.y;
    
  return Math.sqrt(d_x*d_x+d_y*d_y) <= range;
}

window.onload = ()=> {
  
  var battle=new game(1);
  
  document.getElementById('turn').onclick=()=>{
    battle.vessels.forEach(v=>{
      v.sail()
    })
    battle.vessels[0].new_pos=undefined;
    draw_game(battle);
  }
  
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  
  c.addEventListener("touchmove", (e)=>{
  /*  switch (document.getElementById('mode').) {
      case 'maveuver':*/
        battle.vessels[0].weapons[0].target(battle.vessels[0].pos.at(-1),{
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
    /*    break;
        
      case 'fire':
        battle.vessels[0].target({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        break;
    }*/
    draw_game(battle);
  });
  
  function draw_solution(vpos, weapon){
    console.log(vpos)
    console.log(vpos.x)
    ctx.beginPath()
    ctx.strokeStyle = 'orange'
    ctx.moveTo(vpos.x, vpos.y)
    ctx.lineTo(weapon.lockon.x, weapon.lockon.y)
    ctx.stroke()
    
    ctx.beginPath();
    ctx.arc(weapon.lockon.x, weapon.lockon.y, weapon.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red'
    ctx.fill();
  }
  
  function draw_vessel(vessel){
    let p=vessel.pos[vessel.pos.length-1];
    let x=p.x;
    let y=p.y;
    for(let i=0;i<vessel.pos.length;i++){
      let c = vessel.pos[i];
      
      if(i+1==vessel.pos.length){
        ctx.fillStyle = "purple"
        ctx.font = "20px Arial";
        ctx.fillText(vessel.vclass, c.x, c.y);
      
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3, 0, 2 * Math.PI);
      }
      else {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 1.5, 0, 2 * Math.PI);
      }
      ctx.fillStyle = 'blue'
      ctx.fill();
      let m = vessel.pos[i+1]
      if(m){
        ctx.beginPath()
        ctx.strokeStyle = 'black'
        ctx.moveTo(c.x,c.y)
        ctx.lineTo(m.x,m.y)
        ctx.stroke()
      }
    }
    ctx.beginPath();
    ctx.arc(x, y, vessel.speed, 0, 2 * Math.PI);
    ctx.strokeStyle = 'blue'
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, vessel.radar.range, 0, 2 * Math.PI);
    ctx.strokeStyle = 'green'
    ctx.stroke();
    
    //destination 
    let d = vessel.new_pos;
    if (d) {
     ctx.beginPath();
     ctx.arc(d.x, d.y, 2.5, 0, 2 * Math.PI);
     ctx.fillStyle = 'gray'
     ctx.fill();
      ctx.beginPath()
      ctx.strokeStyle = 'orange'
      ctx.moveTo(x, y)
      ctx.lineTo(d.x, d.y)
      ctx.stroke()
          
      ctx.beginPath();
      ctx.arc(d.x, d.y, vessel.speed, 0, 2 * Math.PI);
      ctx.strokeStyle = 'pink'
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(d.x, d.y, vessel.radar.range, 0, 2 * Math.PI);
      ctx.strokeStyle = 'turquoise'
      ctx.stroke();
    }
    
    //weapons
    vessel.weapons.forEach(w=>{
      ctx.beginPath();
      ctx.arc(x, y, w.range, 0, 2 * Math.PI);
      ctx.strokeStyle = 'orange'
      ctx.strokeWidtg = 2
      ctx.stroke();
          
      draw_solution(vessel.pos.at(-1),w)
    });

  }
    
  function draw_game(game) {
    ctx.clearRect(0,0,c.width,c.height);
    game.vessels.forEach(v => {
      draw_vessel(v);
    });
  }
  
}

