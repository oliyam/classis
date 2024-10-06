window.onload = ()=> {
  
  const faction=prompt('PLS SELECT FACTION! [red/blue]:')
  
  var battle=new game(faction,0);
  
  var mult = new multiplayer();
    
  var c = document.getElementById("myCanvas");

  var view=new view_(c)
  

  function disableUI(yes){
    var ids=[
      'turn',
      'radar',
      'selectv',
      'shoot',
      'mode',
      'info'
    ];
    ids.forEach(id => {
      document.getElementById(id).disabled=yes;
    })
  }
    
  disableUI(1)

  document.getElementById('turn').onclick=()=>{
    turn();
  }
  
  var turned=false;
  function turn() {
    turned=true;
    disableUI(true)
    document.getElementById('req').disabled = false;
    view.draw_game(battle, 1)
    mult.send_game(battle)

  }
  
  document.getElementById('selectv').onclick = () => {
    battle.select_next()
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
  
  document.getElementById('req').onclick = () => {
    req_game();
  }

  function req_game() {
    mult.get_game({ f: faction }).then(res => {
      if (res.turn) {
        turned=false;
        document.getElementById('req').disabled=true;
        disableUI(false)
        battle = Object.assign(new game(faction, battle.selected_v), res.game);
        view.draw_game(battle)
      }
      else {
        alert("Mace Windu voice: 'Not yet!' - req again later!")
      }
    })
  }

  c.addEventListener("touchmove", (e)=>{
    if(!turned){
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
    }
    view.draw_game(battle, turned)
  });
}