'use strict';

document.addEventListener('DOMContentLoaded', main);

function main (){
  drawGraph(player);
}

function drawGraph (player){
  let new_points = player_year_stats.games;
  rebuildGraph('svg-graph', new_points, 5);

  let btn_games = document.querySelector('.graph-btns__games');
  let btn_wr = document.querySelector('.graph-btns__wr');
  let line_wr = document.querySelector('.svg-graph__line_wr');
  let max_axis_value = document.querySelector('.text__item_max');

  btn_games.addEventListener('click', function () {
    if(!this.classList.contains('active')){
      let new_points = last_year_games.map(x => x.length);
      rebuildGraph('svg-graph', new_points, 5);

      line_wr.setAttribute('y1', 0);
      line_wr.setAttribute('y2', 0);

      btn_wr.classList.remove('active');
      btn_games.classList.add('active');
    }
  })

  btn_wr.addEventListener('click', function () {
    if(!this.classList.contains('active')){
      let new_points = player_year_stats.wr
      rebuildGraph('svg-graph', new_points, 5);

      let wr_line_pos = 475 - 440 / max_axis_value.textContent * 50;
      line_wr.setAttribute('y1', wr_line_pos);
      line_wr.setAttribute('y2', wr_line_pos);

      btn_wr.classList.add('active');
      btn_games.classList.remove('active');
    }
  })

  let svg = document.querySelector('.svg-container');
  let circles = [...svg.querySelectorAll('.svg-graph__polyline__point')];
  let popup = document.querySelector('.svg-popup');
  let popup_set_data = popup.querySelectorAll('.popup-table__set-data');

  circles.forEach(x => x.addEventListener('mouseenter', function(){
    popup_set_data.forEach(x => x.innerHTML = '');
    let curInd = circles.indexOf(this);
    let favourite_hero = player_year_stats.favourite_hero[curInd];
    let best_hero = player_year_stats.best_hero[curInd];
    let worst_hero = player_year_stats.worst_hero[curInd];

    popup_set_data[0].innerHTML = monthes[player_year_stats.date[curInd][1] - 1] + ' ' + player_year_stats.date[curInd][2];
    popup_set_data[1].innerHTML = player_year_stats.games[curInd];
    popup_set_data[2].innerHTML = player_year_stats.wr[curInd] + '%';
    popup_set_data[3].innerHTML = `<img class='popup-table__img' src=${heroes_img[favourite_hero]}> - ${player_year_stats.heroes[curInd][favourite_hero][0]} игр`;
    if(player_year_stats.best_hero[curInd])
      popup_set_data[4].innerHTML = `<img class='popup-table__img' src=${heroes_img[best_hero]}> - ${~~(player_year_stats.heroes[curInd][best_hero][1] / player_year_stats.heroes[curInd][best_hero][0] * 1000) /10}% побед`;
    else popup_set_data[4].innerHTML = 'нет данных';
    if(player_year_stats.worst_hero[curInd])
      popup_set_data[5].innerHTML = `<img class='popup-table__img' src=${heroes_img[worst_hero]}> - ${~~(player_year_stats.heroes[curInd][worst_hero][1] / player_year_stats.heroes[curInd][worst_hero][0] * 1000) /10}% побед`;
    else popup_set_data[5].innerHTML = 'нет данных';

    popup.style.display = 'block';
    popup.style.bottom = (500 - x.getAttribute('cy') + 25) / 5 + '%';
    popup.style.left = x.getAttribute('cx') / 10 - popup.offsetWidth/2 / svg.offsetWidth * 100 + '%';
  }));

  circles.forEach(x => x.addEventListener('mouseleave', function(){
    popup.style.display = 'none';
  }));
}