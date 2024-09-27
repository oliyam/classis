class game {
  
  size = {x:300,y:600}
  
  vessels = [];
  
  splashes = [];
  
  constructor(n){
    for (var i = 0; i < n; i++) {
      this.vessels.push(new vessel(n, "Destroyer", null, 100,40, new weapon(), new radar()));
      
    }
  }
  
  deal_dmg(){
   this.splashes.forEach(s=>{
     this.vessels.forEach(v=>{
       if (in_range(s.pos, v.pos.at(-1), s.rad)&&s.active)
         v.health-=s.dmg;
     })
     s.active=0;
   })
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
    if(in_range(this.pos.at(-1), vec, this.speed))
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
  range=150;
  radius=15;
  
  damage=25;
  
  ammo=4;
  
  lockon;
  
  target(pos, vec){
    if (in_range(pos, vec, this.range)&&this.ammo>0){
      this.lockon = vec;
    }
  }
  
  fire(){
    if (this.ammo>0&&this.lockon) {
      this.ammo--;
      return {pos: this.lockon, rad: this.radius, dmg: this.damage, active: true};
    }
    return 0;
  }
}

function in_range(pos, vec, range) {
  let d_x=pos.x-vec.x;
  let d_y=pos.y-vec.y;
    
  return Math.sqrt(d_x*d_x+d_y*d_y) <= range;
}

window.onload = ()=> {
  
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  
  var battle=new game(1);
  draw_game(battle)
  
  document.getElementById('turn').onclick=()=>{
    battle.vessels.forEach(v=>{
      v.sail()
      v.weapons.forEach(w=>{
        let shot = w.fire()
        if(shot)
          battle.splashes.push(shot)
      })
    })
    battle.deal_dmg()
    battle.vessels[0].weapons[0].lockon=undefined;
    battle.vessels[0].new_pos=undefined;
    draw_game(battle)
  }
  
  document.getElementById('shoot').onclick = () => {
      let shot = battle.vessels[0].weapons[0].fire()
      if (shot)
        battle.splashes.push(shot)

    battle.deal_dmg()
    battle.vessels[0].weapons[0].lockon = undefined;
    draw_game(battle)
  }
  
  document.getElementById('mode').addEventListener("change", () => {
    draw_game(battle)
  })
  
  c.addEventListener("touchmove", (e)=>{
    switch (document.getElementById("mode").value) {
      case 'maneuver':
        battle.vessels[0].new_course({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        break;
        
      case 'fire':
        battle.vessels[0].weapons[0].target(battle.vessels[0].pos.at(-1),{
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        break;
    }
    draw_game(battle);
  });
  
  function draw_splashes(game){
    game.splashes.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.pos.x, s.pos.y, s.rad, 0, 2 * Math.PI);
    ctx.globalAlpha = s.dmg/100
    ctx.fillStyle = s.active?'red':'gray'
    ctx.fill();
    ctx.globalAlpha = 1
    });
  }
  
  function draw_solution(vpos, weapon){
    if (weapon.ammo>0&&weapon.lockon) {
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
  }
  
  function draw_vessel(vessel){
    let p=vessel.pos[vessel.pos.length-1];
    let x=p.x;
    let y=p.y;
    for(let i=0;i<vessel.pos.length;i++){
      let c = vessel.pos[i];
      
      if(i+1==vessel.pos.length){
        ctx.fillStyle = "purple"
        ctx.font = "10px Lucida Console";
        ctx.fillText(vessel.vclass, c.x, c.y);
       
        ctx.fillStyle = "pink"
        ctx.font = "10px Lucida Console";
        ctx.fillText(vessel.health, c.x, c.y+10);
       
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
        ctx.strokeStyle = 'lightgreen'
        ctx.moveTo(c.x,c.y)
        ctx.lineTo(m.x,m.y)
        ctx.stroke()
      }
    }
    
    ctx.beginPath();
    ctx.arc(x, y, vessel.radar.range, 0, 2 * Math.PI);
    ctx.strokeStyle = 'green'
    ctx.stroke();
    switch (document.getElementById("mode").value) {
      case 'maneuver':
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
          ctx.strokeStyle = 'turquoise'
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(d.x, d.y, vessel.radar.range, 0, 2 * Math.PI);
          ctx.strokeStyle = 'lightgreen'
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, vessel.speed, 0, 2 * Math.PI);
        ctx.strokeStyle = 'blue'
        ctx.stroke();
        
        break;
        
        case 'fire':
          //weapons
          vessel.weapons.forEach(w=>{
            ctx.beginPath();
            ctx.arc(x, y, w.range, 0, 2 * Math.PI);
            ctx.strokeStyle = 'orange'
            ctx.strokeWidth = 2
            ctx.stroke();
    
            draw_solution(vessel.pos.at(-1),w)
          });
          
          ctx.beginPath();
          ctx.arc(x, y, vessel.weapons[0].range, 0, 2 * Math.PI);
          ctx.strokeStyle = 'orange'
          ctx.stroke();
          
        break;
    }
  }
    
  function draw_game(game) {
    ctx.clearRect(0,0,c.width,c.height);
    game.vessels.forEach(v => {
      draw_vessel(v);
    });
    draw_splashes(game)
  }
  
}

