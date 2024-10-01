window.onload = ()=> {
  
  var battle=undefined;
  
  var mult = new multiplayer();
    
  var c = document.getElementById("myCanvas");

  var view=new view_(c)
  view.draw_game(battle)

  document.getElementById('turn').onclick=()=>{
    battle.turn()
    mult.send_game(battle)
    view.draw_game(battle)
    battle=undefined;
  }
  
  document.getElementById('scan').onclick = () => {
    battle.scan(document.getElementById('iff').value)
    document.getElementById('radar').checked=true;
    view.draw_game(battle)
  }
  
  document.getElementById('selectv').onclick = () => {
    battle.select_next(document.getElementById('iff').value)
    view.draw_game(battle)
  }
  
  document.getElementById('shoot').onclick = () => {
    switch (document.getElementById("mode").value) {
      case 'maneuver':
        document.getElementById("mode").value='fire'
        break;
    
      case 'fire':
        battle.fire();
        break;
    }
    battle.reset_tmp()
    view.draw_game(battle)
  }
  
  document.getElementById('mode').addEventListener("change", () => {
    view.draw_game(battle)
  })
  document.getElementById('radar').addEventListener("change", () => {
    view.draw_game(battle)
  })
  document.getElementById('info').addEventListener("change", () => {
    view.draw_game(battle)
  })

  document.getElementById('iff').addEventListener("change", () => {
    battle.select_next(document.getElementById('iff').value)
    view.draw_game(battle)
  })
  
  document.getElementById('req').onclick = () => {
    mult.get_game.then(server_data => {
        battle=Object.assign(new game(), server_data);
        view.draw_game(battle)
    });
  }

  c.addEventListener("touchmove", (e)=>{
    switch (document.getElementById("mode").value) {
      case 'maneuver':
        battle.new_course({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        break;
        
      case 'fire':
        battle.target(0, {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
        break;
    }
    view.draw_game(battle);
  });

      
    }
    
