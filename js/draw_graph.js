'use strict';

document.addEventListener('DOMContentLoaded', main);

function main (){
  rebuildGraph('svg', "44,200 191,155 316,310 448,111 556,82 666,184 758,222 842,366 948,100 500,215, 500,150 500,300 ", 5);
  let svg = document.querySelector('.svg-container');
  let circles = [...svg.querySelectorAll('.polyline__point')];
  let popup = document.querySelector('.svg-popup');
  let popup_set_data = popup.querySelectorAll('.popup-table__set-data');

  circles.forEach(x => x.addEventListener('mouseenter', function(){
    popup_set_data.forEach(x => x.innerHTML = '');
    let curInd = circles.indexOf(this);
    let favourite_hero = player_year_stats.favourite_hero[curInd];
    let best_hero = player_year_stats.best_hero[curInd];
    let worst_hero = player_year_stats.worst_hero[curInd];

    popup_set_data[0].innerHTML = player_year_stats.games[curInd];
    popup_set_data[1].innerHTML = player_year_stats.wr[curInd] + '%';
    popup_set_data[2].innerHTML = `<img class='popup-table__img' src=${heroes_img[favourite_hero]}> - ${player_year_stats.heroes[curInd][favourite_hero][0]} игр`;
    if(player_year_stats.best_hero[curInd])
      popup_set_data[3].innerHTML = `<img class='popup-table__img' src=${heroes_img[best_hero]}> - ${~~(player_year_stats.heroes[curInd][best_hero][1] / player_year_stats.heroes[curInd][best_hero][0] * 1000) /10}% побед`;
    else popup_set_data[3].innerHTML = 'нет данных';
    if(player_year_stats.worst_hero[curInd])
      popup_set_data[4].innerHTML = `<img class='popup-table__img' src=${heroes_img[worst_hero]}> - ${~~(player_year_stats.heroes[curInd][worst_hero][1] / player_year_stats.heroes[curInd][worst_hero][0] * 1000) /10}% побед`;
    else popup_set_data[4].innerHTML = 'нет данных';

    popup.style.display = 'block';
    popup.style.bottom = (500 - x.getAttribute('cy') + 10) / 5 + '%';
    popup.style.left = x.getAttribute('cx') / 10 - popup.offsetWidth/2 / svg.offsetWidth * 100 + '%';
  }));

  circles.forEach(x => x.addEventListener('mouseleave', function(){
    popup.style.display = 'none';
  }));
}

let EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

function rebuildGraph (svg_class, new_points, speed){
  let svg = document.querySelector('.' + svg_class);
  let polyline = svg.querySelector('.st0');
  let polyline_nodes = [];

  let text_item = [...svg.querySelectorAll('.text__item')];

  let xSpace = 900 / 12;
  for (let i = 1; i <= 12; i++) {
    polyline_nodes[i - 1] = [xSpace * i , 450];
  }

  new_points = last_year_games.map(x => x.length);
  let new_points_max = new_points.reduce((a,b) =>{
    if(a < b) a = b;
    return Math.ceil(a / 10) * 10;
  });

  //set values on lines
  text_item.forEach((x, i, y) => x.textContent = ~~(new_points_max - new_points_max / (y.length - 1) * i));

  new_points = new_points.map((x, i) => [polyline_nodes[i][0], polyline_nodes[i][1] - ~~(x / new_points_max * 415)]);
  let difference = [];
  new_points.forEach((x, i) => difference.push(polyline_nodes[i][1] - x[1]));

  function drawPoints (polyline_nodes){
    polyline_nodes.forEach(x => {
      let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.classList.add('polyline__point');
      circle.setAttribute('cx', x[0]);
      circle.setAttribute('cy', x[1]);
      circle.setAttribute('r', 9);
      svg.appendChild(circle);
    });
  };

  drawPoints(polyline_nodes);
  
  let circles = svg.querySelectorAll('.polyline__point');

  var new_nodes = polyline_nodes.map(x => [...x]);
  function draw (i, progress) {
    new_nodes[i][1] = polyline_nodes[i][1];
    new_nodes[i][1] -= ~~(difference[i] * progress);

    polyline.setAttribute('points', new_nodes);
    circles[i].setAttribute('cy', new_nodes[i][1]);
  }

  function animate(i){
    let cur_node = polyline_nodes[i][1];
    requestAnimationFrame(function animate (time) {
      let time_fraction = (-cur_node + new_points[i][1] + difference[i]) / difference[i]
      cur_node -= speed;
      let progress = EasingFunctions.easeInOutQuart(time_fraction);
      draw(i, progress);
      if(time_fraction > 1){
        time_fraction = 1;
        draw(i, time_fraction);
        return;
      }
      requestAnimationFrame(animate);
    })
  }

  let i = 0;
  function timer () {
    if (i < polyline_nodes.length) {
      animate(i);
      i++;
      setTimeout(timer, 100);
    }
  }

  timer();
};