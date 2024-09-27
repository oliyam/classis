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

    //battle.deal_dmg()
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
      ctx.globalAlpha = s.dmg/100
      ctx.beginPath();
      ctx.arc(s.pos.x, s.pos.y, s.rad, 0, 2 * Math.PI);
      ctx.fillStyle = s.active?'orange':'gray'
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
            
      //if last
      if(i+1==vessel.pos.length){
        
        ctx.fillStyle = 'lightgreen'
        ctx.beginPath();
        let t=20;
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x+t/2, c.y+Math.abs(Math.sin(Math.PI/3)*t));
        ctx.lineTo(c.x-t/2, c.y+Math.abs(Math.sin(Math.PI/3)*t));
        ctx.fill()
        
        //info-text
        ctx.fillStyle = "purple"
        ctx.font = "bold 15px monospace";
        ctx.fillText(vessel.vclass, c.x, c.y);
         
        ctx.fillStyle = "red"
        ctx.font = "bold 10px monospace";
        ctx.fillText(vessel.health, c.x, c.y+10);
      }
      
      //every position
      ctx.fillStyle = 'blue'
      ctx.beginPath();
      ctx.arc(c.x, c.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      //if next
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