  class view_ {  
  
  ctx;
  size;
  
  constructor(canvas){
    this.size = {x: canvas.width, y: canvas.height};
    this.ctx=canvas.getContext('2d');
    this.ctx.lineWidth = 1.5;
  }
  
  draw_splashes(game){
    game.splashes.forEach(s=>{
      let tmp = this.ctx.globalAlpha;
      this.ctx.globalAlpha = s.dmg/100
      this.ctx.beginPath();
      this.ctx.arc(s.pos.x, s.pos.y, s.rad, 0, 2 * Math.PI);
      this.ctx.fillStyle = s.active?'orange':'gray'
      this.ctx.fill();
      this.ctx.globalAlpha = tmp;
      if(s.active)
        this.draw_crosshair(s.pos, crosshairs.lockon, s.rad, 45, 'darkred')
    });
  }
  
  draw_solution(vpos, weapon){
    if (weapon.ammo>0&&weapon.lockon) {
      
      this.ctx.beginPath()
      this.ctx.strokeStyle = 'orange'
      this.ctx.moveTo(vpos.x, vpos.y)
      this.ctx.lineTo(weapon.lockon.x, weapon.lockon.y)
      this.ctx.stroke()
      
      this.draw_triangle(weapon.lockon, weapon.radius/3, 'red')
      this.draw_crosshair(weapon.lockon, crosshairs.aim, weapon.radius, 0, 'red')
    }
  }
  
  draw_blips(radar) {
    radar.blips.forEach(b=>{
      //every blip - dot
      this.ctx.fillStyle = 'red'
      this.ctx.beginPath();
      this.ctx.arc(b.pos.x, b.pos.y, 4, 0, 2 * Math.PI);
      this.ctx.fill();
      
      //every blip - info
      if(b.sign && document.getElementById('info').checked) {
        this.ctx.fillStyle = "white"
        this.ctx.font = "bold italic 10px monospace";
        this.ctx.fillText(b.sign, b.pos.x - this.ctx.measureText(b.sign).width/2, b.pos.y);
      }
    })
  }
  
  draw_triangle(pos, size, color) {
          this.ctx.fillStyle = color;
          this.ctx.beginPath();
          let 
            l=size,
            h=Math.abs(Math.sin(Math.PI/3)*l),
            p={x: pos.x, y: pos.y+l/2}
          ;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p.x-l/2, p.y-h);
          this.ctx.lineTo(p.x+l/2, p.y-h);
          this.ctx.lineTo(p.x, p.y);
          this.ctx.fill()
  }
  
  rotate_vec(vec, center, rot){
    rot*=Math.PI/180;
    let 
      cos=Math.cos(rot),
      sin=Math.sin(rot)
    ;
    
    return {
      x: center.x+(vec.x-center.x)*cos-(vec.y-center.y)*sin,
      y: center.y+(vec.x-center.x)*sin+(vec.y-center.y)*cos
    }
  }
  
  draw_crosshair(pos, mtrx, radius, rot, color){
      let final_pos = [];
    
      for (var i = 0; i < mtrx.length; i++)
        final_pos.push({
            s: this.rotate_vec({x: pos.x + radius*mtrx[i].x_s, y: pos.y + radius*mtrx[i].y_s}, pos, rot),
            e: this.rotate_vec({x: pos.x + radius*mtrx[i].x_e, y: pos.y + radius*mtrx[i].y_e}, pos, rot),
        });
      
      this.ctx.strokeStyle = color;
      final_pos.forEach(p => {
        this.ctx.beginPath()
        this.ctx.moveTo(p.s.x, p.s.y)
        this.ctx.lineTo(p.e.x, p.e.y)
        this.ctx.stroke()
      });
      
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  
  draw_vessel(vessel, selected){
   
    var ded = !vessel.health;
   
    let p=vessel.pos.at(-1);
    let x=p.x;
    let y=p.y;
    
    //destination 
    let d = vessel.new_pos;
    if (d) {
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, 2.5, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'gray'
      this.ctx.fill();
      this.ctx.beginPath()
      this.ctx.strokeStyle = 'orange'
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(d.x, d.y)
      this.ctx.stroke()
    }
    
    if (selected && !ded)
      switch (document.getElementById("mode").value) {
        case 'maneuver':
          
          if (d) {
            this.ctx.beginPath();
            this.ctx.arc(d.x, d.y, vessel.speed, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'turquoise'
            this.ctx.stroke();

            if (document.getElementById('radar').checked) {
              this.ctx.beginPath();
              this.ctx.arc(d.x, d.y, vessel.radar.range, 0, 2 * Math.PI);
              this.ctx.strokeStyle = 'lightgreen'
              this.ctx.stroke();
            }
          }
          this.ctx.beginPath();
          this.ctx.arc(x, y, vessel.speed, 0, 2 * Math.PI);
          this.ctx.strokeStyle = 'blue'
          this.ctx.stroke();
    
          break;
    
        case 'fire':
          //weapons
          vessel.weapons.forEach(w => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, w.range, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'orange'
            this.ctx.strokeWidth = 2
            this.ctx.stroke();
    
            this.draw_solution(vessel.pos.at(-1), w)
    
            //circle - each weapon range
            this.ctx.beginPath();
            this.ctx.arc(x, y, w.range, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'orange'
            this.ctx.stroke();
          });
          break;
      }
    
      //loop through past positions
      for(let i=0;i<vessel.pos.length;i++){
        let c = vessel.pos[i];
        
        //if next - line
        let m = vessel.pos[i+1]
        if(m){
          this.ctx.beginPath()
          this.ctx.strokeStyle = 'lightgreen'
          this.ctx.moveTo(c.x,c.y)
          this.ctx.lineTo(m.x,m.y)
          this.ctx.stroke()
        }
        //every position - dot
        this.ctx.fillStyle = 'blue'
        this.ctx.beginPath();
        this.ctx.arc(c.x, c.y, 3, 0, 2 * Math.PI);
        this.ctx.fill();
      }
        if(!ded){
          this.draw_triangle(p, 20, 'lightgreen')
          this.ctx.strokeStyle = 'green'
          this.ctx.stroke()
          
         this.ctx.fillStyle = 'blue'
         this.ctx.beginPath();
         this.ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
         this.ctx.fill();
          
          //info-text
          if (document.getElementById('info').checked) {
            this.ctx.fillStyle = "yellow"
            this.ctx.font = "bold 15px monospace";
            this.ctx.fillText(vessel.vclass, p.x + 10, p.y);
             
            this.ctx.fillStyle = "red"
            this.ctx.font = "bold 10px monospace";
            this.ctx.fillText("♡:"+vessel.health, p.x + 10, p.y + 10);
            
            let nr=1;
            vessel.weapons.forEach(w => {
              this.ctx.fillStyle = "orange"
              this.ctx.font = "bold 10px monospace";
              this.ctx.fillText("¤"+nr+":" + w.ammo, p.x + 10, p.y + 10 + 10*nr);
              nr++;
            });
          }
          
          //draw radar-range and blips
          if (document.getElementById('radar').checked) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, vessel.radar.range, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'green'
            this.ctx.stroke();
        
            this.draw_blips(vessel.radar)
          }
        }
          else {
             this.draw_triangle(p, 20, 'black')
             this.ctx.strokeStyle = 'green'
             this.ctx.stroke()
          
             this.ctx.fillStyle = 'blue'
             this.ctx.beginPath();
             this.ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
             this.ctx.fillStyle = "red"
             this.ctx.font = "30px monospace";
             this.ctx.fillText('×', p.x-this.ctx.measureText('×').width/2, p.y+10);
          
             //info-text
             if (document.getElementById('info').checked) {
               this.ctx.fillStyle = "white"
               this.ctx.font = "bold 15px monospace";
               this.ctx.fillText(vessel.vclass, p.x + 10, p.y);
          
               this.ctx.fillStyle = "purple"
               this.ctx.font = "bold 10px monospace";
               this.ctx.fillText("CASUALTY", p.x + 10, p.y + 10);
             }
          }
  }
  
  loading;
    
  draw_game(game, inactive) {
    
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    if (inactive) {
      var 
        x=20,
        y=40,
        
        px=10
      ;
      var i=0
      var txt="PRESS 'REQ' "
      var sym="○";
      var sym_l=this.ctx.measureText(sym).width;
      var txt_l=this.ctx.measureText(txt).width+sym_l;
      
      this.ctx.fillStyle = "white"
      this.ctx.font = "bold "+px+"px monospace";
      this.ctx.fillText("PLS REQUEST NEW GAME-UPDATE:", x, y);
      this.ctx.fillText(txt, x, y+px);
      
      
      this.loading = setInterval(()=>{
        if (i%4==0)
            this.ctx.clearRect(x+txt_l+sym_l,y,4*sym_l,px);
        else{
            this.ctx.fillStyle = "white"
            this.ctx.font = "bold " + px + "px monospace";
            this.ctx.fillText(sym, x + txt_l + i % 4 * sym_l, y + px)
        }
        i++;
      }, 500)
      this.ctx.globalAlpha = .25;
    }
    else if (this.loading) {
      clearInterval(this.loading)
    }
    
    this.draw_splashes(game)
    game.vessels.forEach(v => {
      if (v.faction == document.getElementById('iff').value)
        this.draw_vessel(v, game.selected_v == v.id, false);
    });
    
    this.ctx.globalAlpha=1;
  }
}