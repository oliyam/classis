window.onload = ()=> {
  
  const faction=prompt('PLS SELECT FACTION! [red/blue]:')
  
  var battle=new game(faction,0);
  
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
      'info'
    ];
    ids.forEach(id => {
      document.getElementById(id).disabled=yes;
    })
  }
  
  disableUI(1)

  document.getElementById('turn').onclick=()=>{
    disableUI(true)
    view.draw_game(battle,1)
    mult.send_game(battle).then( res => {
      if (res.turned){
        battle.turn()
        view.draw_game(battle,1)
      }
      else{
        view.draw_game(battle,0)
      }
    });
  }
  
  document.getElementById('scan').onclick = () => {
    document.getElementById('radar').checked=true;
    view.draw_game(battle)
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
        console.log(battle.splashes)
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
    setTimeout(
    mult.get_game({f:faction}).then(res => {
      if (res.turn) {
        disableUI(false)
        battle=Object.assign(new game(faction,battle.selected_v), res.game);
        view.draw_game(battle)
      }
    })
    , 0);
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