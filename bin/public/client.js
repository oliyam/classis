window.onload = ()=> {
  
  var battle=new game();
  
  var mult = new multiplayer();
    
  var c = document.getElementById("myCanvas");

  var view=new view_(c)
  view.draw_game(battle,1)

  function disableUI(yes){
    var ids=[
      'turn',
      'radar',
      'scan',
      'selectv',
      'shoot',
      'mode',
      'iff',
      'info'
    ];
    ids.forEach(id => {
      document.getElementById(id).disabled=yes;
    })
  }
  
  disableUI(1)

  document.getElementById('turn').onclick=()=>{
    battle.turn()
    mult.send_game(battle)
    disableUI(true)
    view.draw_game(battle,1)
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
      disableUI(false)
      battle=Object.assign(new game(), mult.get_game());
      view.draw_game(battle)
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
    
