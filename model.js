
    class game {
      
      size = {x:300,y:600}
      
      vessels = [];
      selected_v = 0;
      
      splashes = [];
      
      constructor(n){
        for (var i = 0; i < n; i++) {
          this.vessels.push(new vessel(i, "DD-0"+i, [{x: i*50, y: i*30}], 100, 50, new weapon(), new radar()));
          
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
      speed = 30;
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
      
      ammo=12;
      
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