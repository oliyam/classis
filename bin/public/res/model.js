class game {
      
      size = {x:300,y:600}
      
      vessels = [];
      selected_v = 0;
      faction;
      
      splashes = [];
      
      constructor(faction){
        this.faction=faction;
      }
      
      reset_tmp(){
        this.vessels[this.selected_v].weapons[0].lockon = undefined;
        this.vessels[this.selected_v].new_pos = undefined;
      }
      
      new_course(destination){
        vessel_new_course(this.vessels[this.selected_v], destination)
      }
      
      target(w, coords){
        weapon_target(w, this.vessels[this.selected_v], coords)
      }
      
      select_next(){
        for (var i = 1; i < this.vessels.length; i++) {
          console.log((this.selected_v + i) % this.vessels.length)
          let s = this.vessels[(this.selected_v + i) % this.vessels.length];
          if (s.faction == this.faction) {
            this.selected_v = s.id;
            break;
          }
        }
      }
      
      scan(faction){
        this.vessels.forEach(v => {
          v.radar.blips=[];
          //der ping wird nur von freundlichen nicht zerstören radaranlagen ausgeführt
          if(v.faction==faction&&v.health>0)
            this.vessels.forEach(ufo=>{
              if (
                in_range(v.pos.at(-1), ufo.pos.at(-1), v.radar.range) &&  
                ufo.faction!=v.faction && //wenn das ufo dem horchenden schiffe fremd ist
                ufo.health>0 //wenn das ufo nicht gesunken/zerstört ist 
              ) {
                v.radar.blips.push({pos: ufo.pos.at(-1), sign: v.radar.id_ufo?ufo.vclass:undefined})
              }
            })
        });
      }
      
      fire(){
        if(this.vessels[this.selected_v].health>0){
          let shot = weapon_fire(this.vessels[this.selected_v].weapons[0])
          if (shot)
            this.splashes.push(shot)
        }
      }
      
      turn(){
        this.fire()
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
      
    }
    
    function vessel_new_course(v, vec) {
      if (in_range(v.pos.at(-1), vec, v.speed) && v.health > 0)
        v.new_pos = vec;
    }
    
    function sail(v) {
      if (v.new_pos && v.health > 0)
        v.pos.push(v.new_pos);
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
    }
      
    function weapon_target(w, v, vec){
        if(in_range(v.pos.at(-1), vec, v.weapons[w].range)&&v.weapons[w].ammo>0)
          v.weapons[w].lockon = vec;
    }
      
    function weapon_fire(w){
        if (w.ammo>0&&w.lockon) {
          w.ammo--;
          return {pos: w.lockon, rad: w.radius, dmg: w.damage, active: true};
        }
        return 0;
      }
      
    
    function in_range(pos, vec, range) {
      let d_x=pos.x-vec.x;
      let d_y=pos.y-vec.y;
        
      return Math.sqrt(d_x*d_x+d_y*d_y) <= range;
    }