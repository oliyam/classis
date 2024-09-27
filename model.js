
    class game {
      
      size = {x:300,y:600}
      
      vessels = [];
      selected_v = 1;
      
      splashes = [];
      
      constructor(n){
        this.vessels.push(new vessel(0, 'frien', "ROCINANTE", null, 100, 50, null, new radar(100)))
        this.vessels.push(new vessel(1, 'frien', "ENTERPRISE", [{x: 200, y: 500}], 100, 50, new weapon(69, 200), new radar(200,1)))
        for (var i = 2; i < n; i++) {
          this.vessels.push(new vessel(i, null, "DD-0"+i, [{x: i*10+25, y: i*30+20}], 100, 50, new weapon(), new radar()));
        }
      }
      
      scan(){
        this.vessels.forEach(v => {
          v.radar.blips=[];
          this.vessels.forEach(ufo=>{
            if (
              in_range(v.pos.at(-1), ufo.pos.at(-1), v.radar.range) &&  
              ufo.faction!=v.faction && 
              ufo.health>0
            ) {
              v.radar.blips.push({pos: ufo.pos.at(-1), sign: v.radar.id_ufo?ufo.vclass:undefined})
            }
          })
        });
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
      faction = "x";
      
      pos = [{x: 69, y: 69}];
      new_pos;
      
      health = 100;
      speed = 30;
      weapons = [new weapon()];
      radar = {};
      
      constructor(id, faction, vclass, pos, health, speed, weapons, radar){
        this.id=id;
        this.faction=faction||this.faction;
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
      id_ufo=false;
      
      blips=[];
      
      constructor(range, id_ufo){
        this.range=range||this.range;
        this.id_ufo=id_ufo||this.id_ufo;
      }
    }
    
    class weapon {
      range=150;
      radius=20;
      
      damage=25;
      
      ammo=12;
      
      lockon;
      
      constructor(ammo, radius){
        this.ammo=ammo||this.ammo;
        this.radius=radius||this.radius;
      }
      
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