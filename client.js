window.onload = ()=> {
  
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.lineWidth = 1.5;
  
  var battle=new game(10);
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
    battle.vessels[battle.selected_v].weapons[0].lockon=undefined;
    battle.vessels[battle.selected_v].new_pos=undefined;
    draw_game(battle)
  }
  
  document.getElementById('scan').onclick = () => {
    battle.scan()
    document.getElementById('radar').checked=true;
    draw_game(battle)
  }
  
  document.getElementById('selectv').onclick = () => {
    {
      battle.selected_v=battle.selected_v+1%battle.vessels.length;
    }while(battle.vessels[battle.selected_v].faction!=document.getElementById('iff'))
    draw_game(battle)
  }
  
  document.getElementById('shoot').onclick = () => {
    switch (document.getElementById("mode").value) {
      case 'maneuver':
        document.getElementById("mode").value='fire'
        
        break;
    
      case 'fire':
        let shot = battle.vessels[battle.selected_v].weapons[0].fire()
        if (shot)
          battle.splashes.push(shot)
        break;
    }
    battle.vessels[battle.selected_v].weapons[0].lockon = undefined;
    battle.vessels[battle.selected_v].new_pos = undefined;
    draw_game(battle)
  }
  
  document.getElementById('mode').addEventListener("change", () => {
    draw_game(battle)
  })
  document.getElementById('radar').addEventListener("change", () => {
    draw_game(battle)
  })
  document.getElementById('info').addEventListener("change", () => {
    draw_game(battle)
  })

  document.getElementById('iff').addEventListener("change", () => {
    draw_game(battle)
  })

  c.addEventListener("touchmove", (e)=>{
    switch (document.getElementById("mode").value) {
      case 'maneuver':
        battle.vessels[battle.selected_v].new_course({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        break;
        
      case 'fire':
        battle.vessels[battle.selected_v].weapons[0].target(battle.vessels[battle.selected_v].pos.at(-1),{
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
      ctx.strokeStyle = 'red'
      ctx.stroke();
      
      draw_triangle(weapon.lockon, weapon.radius/3, 'red')
      
      //croshair
      let arr = [
        {
          x_s: 0, y_s: 1,
          x_e: 0, y_e: .5
        },
        {
          x_s: 1, y_s: 0,
          x_e: .5, y_e: 0
        },
        {
          x_s: -1, y_s: 0,
          x_e: -.5, y_e: 0
        },
      ];
      
      for (var i = 0; i < arr.length; i++) {
        ctx.beginPath()
        ctx.moveTo(weapon.lockon.x + weapon.radius*arr[i].x_s, weapon.lockon.y + weapon.radius*arr[i].y_s)
        ctx.lineTo(weapon.lockon.x + weapon.radius*arr[i].x_e, weapon.lockon.y + weapon.radius*arr[i].y_e)
        ctx.stroke()
      }
    }
  }
  
  function draw_blips(radar) {
    radar.blips.forEach(b=>{
      //every blip - dot
      ctx.fillStyle = 'red'
      ctx.beginPath();
      ctx.arc(b.pos.x, b.pos.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      //every blip - info
      if(b.sign && document.getElementById('info').checked) {
        ctx.fillStyle = "white"
        ctx.font = "italic 10px monospace";
        ctx.fillText(b.sign, b.pos.x - ctx.measureText(b.sign).width/2, b.pos.y);
      }
    })
  }
  
  function draw_triangle(pos, size, color) {
          ctx.fillStyle = color;
          ctx.beginPath();
          let 
            l=size,
            h=Math.abs(Math.sin(Math.PI/3)*l),
            p={x: pos.x, y: pos.y+l/2}
          ;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x-l/2, p.y-h);
          ctx.lineTo(p.x+l/2, p.y-h);
          ctx.lineTo(p.x, p.y);
          ctx.fill()
  }
  
  function draw_vessel(vessel, selected){
   
    let p=vessel.pos.at(-1);
    let x=p.x;
    let y=p.y;
    
    if (selected)
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
    
            if (document.getElementById('radar').checked) {
              ctx.beginPath();
              ctx.arc(d.x, d.y, vessel.radar.range, 0, 2 * Math.PI);
              ctx.strokeStyle = 'lightgreen'
              ctx.stroke();
            }
          }
          ctx.beginPath();
          ctx.arc(x, y, vessel.speed, 0, 2 * Math.PI);
          ctx.strokeStyle = 'blue'
          ctx.stroke();
    
          break;
    
        case 'fire':
          //weapons
          vessel.weapons.forEach(w => {
            ctx.beginPath();
            ctx.arc(x, y, w.range, 0, 2 * Math.PI);
            ctx.strokeStyle = 'orange'
            ctx.strokeWidth = 2
            ctx.stroke();
    
            draw_solution(vessel.pos.at(-1), w)
    
            //circle - each weapon range
            ctx.beginPath();
            ctx.arc(x, y, w.range, 0, 2 * Math.PI);
            ctx.strokeStyle = 'orange'
            ctx.stroke();
          });
          break;
      }
    
        //draw radar-range and blips
        if (document.getElementById('radar').checked) {
          ctx.beginPath();
          ctx.arc(x, y, vessel.radar.range, 0, 2 * Math.PI);
          ctx.strokeStyle = 'green'
          ctx.stroke();

          draw_blips(vessel.radar)
        }
    
      //loop through past positions
      for(let i=0;i<vessel.pos.length;i++){
        let c = vessel.pos[i];
              
        //if last - current vessel position
        if(i+1==vessel.pos.length){
          
          draw_triangle(c, 20, 'lightgreen')
          ctx.strokeStyle = 'green'
          ctx.stroke()
          
          //info-text
          if (document.getElementById('info').checked) {
            ctx.fillStyle = "yellow"
            ctx.font = "bold 15px monospace";
            ctx.fillText(vessel.vclass, c.x + 10, c.y);
             
            ctx.fillStyle = "red"
            ctx.font = "bold 10px monospace";
            ctx.fillText("♡:"+vessel.health, c.x + 10, c.y + 10);
            
            let nr=1;
            vessel.weapons.forEach(w => {
              ctx.fillStyle = "orange"
              ctx.font = "bold 10px monospace";
              ctx.fillText(nr+"¤:" + w.ammo, c.x + 10, c.y + 10 + 10*nr);
              nr++;
            });
          }
        }
        
        //every position - dot
        ctx.fillStyle = 'blue'
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        //if next - line
        let m = vessel.pos[i+1]
        if(m){
          ctx.beginPath()
          ctx.strokeStyle = 'lightgreen'
          ctx.moveTo(c.x,c.y)
          ctx.lineTo(m.x,m.y)
          ctx.stroke()
        }
      }
  }
    
  function draw_game(game) {
    ctx.clearRect(0,0,c.width,c.height);
    draw_splashes(game)
    game.vessels.forEach(v => {
      if (v.faction==document.getElementById('iff').value){
        draw_vessel(v,game.selected_v==v.id, false);
      }
    });
  }
  
}