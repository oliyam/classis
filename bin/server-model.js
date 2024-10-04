//import {game} from './public/res/model.js';

exports.run = () => {
  
  class turn_system {
    active_f;
    
    factions = [];
    fleets = [];
    
    server_game;
    
    constructor(){
      this.factions = []
      this.active_f=0;
      this.server_game=new game();
    }
    
    req_turn(data){
      this.server_game.splashes=data.splashes
      data.vessels.forEach(cv=>{
        for(var i=0;i<this.server_game.vessels.length;i++){
          if(this.server_game.vessels[i].id==cv.id&&cv.faction==this.server_game.vessels[i].faction)
            this.server_game.vessels[i]=cv;
        }
      })
      this.server_game.turn()
      //next player - next game
      //this.active_f=f++%this.factions.length;
      console.log("game updated - turn ended")
    }
    
    req_game(data){
      this.server_game.scan(data.f)
      var cg = JSON.parse(JSON.stringify(this.server_game))

      cg.vessels.forEach(v => {
        console.log(data.f+" !== "+v.faction+" = "+ (v.faction!==data.f) )
        if (v.faction!==data.f) 
          cg.vessels.splice(cg.vessels.indexOf(v), 1);
      })

      return cg;
    }
    
  }
  
  class game {
      
      size = {x:300,y:600}
      
      vessels = [];
      
      splashes = [];
      
      constructor(faction){
        for (var i = 0; i < 4; i++)
          this.vessels.push(new vessel(i, 'r', "ROCINANTE-0"+i, [{x:50*i+50,y:100}], 100, 50, null, new radar(100)))
        for (var i = 0; i < 4; i++)
          this.vessels.push(new vessel(i, 'b', "ENTERPRISE-0"+i, [{ x: 50*i+50, y: 500 }], 100, 50, new weapon(69, 200), new radar(200, 1)))
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
      
      sail(v) {
        if (v.new_pos && v.health > 0)
          v.pos.push(v.new_pos);
      }
      
      fire(v){
        if(v.health>0){
          let shot = fire_(v.weapons[0])
          if (shot)
            this.splashes.push(shot)
        }
      }
      
      deal_dmg(){
       this.splashes.forEach(s=>{
         this.vessels.forEach(v=>{
           if (
             in_range(s.pos, v.pos.at(-1), s.rad) && //in reichweite
             s.active //waffe gerade abgeschossen
           ){
             v.health<s.dmg?v.health=0:v.health-=s.dmg;
           }
         })
         s.active=0;
       })
      }
      
      turn(){
        this.vessels.forEach(v => {
          this.sail(v)
          this.fire(v)
        })
        this.deal_dmg()
      }
    }
    
    function fire_(w) {
      if (w.ammo > 0 && w.lockon) {
        w.ammo--;
        return { pos: w.lockon, rad: w.radius, dmg: w.damage, active: true };
      }
      return 0;
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
    
    function in_range(pos, vec, range) {
      let d_x=pos.x-vec.x;
      let d_y=pos.y-vec.y;
        
      return Math.sqrt(d_x*d_x+d_y*d_y) <= range;
    }
    
    return new turn_system()
}