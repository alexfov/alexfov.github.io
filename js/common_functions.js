'use strict';

const players = {
	Neeeeeerf: 102756891,
	JohnGalt: 41528404,
	AlexFov: 313885294,
	Doctor: 254920273,
	Megabit: 84502939,
	BloOdTerrOr: 120491980
};

const monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function binSearch(arr, toFind, year){
	if (!arr) return null;
	var first = 0;
	var last = arr.length - 1;
	var date;
	var count = 0;
	while (count < 15){
	  var mid = first + Math.floor((last - first) / 2);
	  date = convertDate(arr[mid].start_time);

	  if (date[2].concat(date[1]) <= year.toString() + toFind.toString()) last = mid;
	  else first = mid + 1;

	  if (+date[2] == +year && +date[1] == +toFind) return last;
	  count++;
	}
	return null;
};

class PlayerStats{
	constructor(game){
		this.date = convertDate(game['start_time']),
		this.win = isPlayerWin(game),
		this.stats = `<span class='table__kill'>${game['kills']}</span> - 
									<span class='table__death'>${game['deaths']}</span> - 
									<span class='table__assist'>${game['assists']}</span>`,
		this.hero = printHeroName(game),
		this.id  = game['match_id']
	}
}

function isPlayerWin (game) {
	if(game['radiant_win'] === true && game['player_slot'] < 6) return true;
	if(game['radiant_win'] === false && game['player_slot'] > 6) return true;
	return false;
}

function printHeroName (game){
	let heroId = game['hero_id'];
	var index = 0;

	if(heroId <= 23) index = heroId - 1;
	else if(heroId <= 114) index = heroId - 2;
	else index = heroId - 6;

	return heroes[index]['localized_name'];
}

function convertDate (date){
	date = new Date(+(date + '000'));
	let day = date.getDate().toString();
	let month = (date.getMonth() + 1).toString();
	let year = date.getFullYear().toString();
	if(day.length < 2) day = '0' + day;
	if(month.length < 2) month = '0' + month;

	date = [day, month, year];
	return date;
}

function map (array, month, year){
	let arr = [];
	let i = binSearch(array, month, year); //первое найденное совпадение в массиве
	if(i == null) return [];
	var count = 0;
	//поиск вперед по массиву
	while (convertDate(array[i + count].start_time)[1] == +month) {
		arr.push(new PlayerStats(array[i + count]));
		count++
	}
	//поиск назад по массиву
	count = -1;
	if(array[i + count] != undefined){
		while (convertDate(array[i + count].start_time)[1] == +month) {
			arr.unshift(new PlayerStats(array[i + count]));
			count--
			if(i + count < 0) break;
		}
	}
	return arr;
}

function addElement (element, entrails, ..._class) {
	let newElem = document.createElement(element);
	if(arguments.length > 1) newElem.innerHTML = entrails;
	if(arguments.length > 2) newElem.classList.add(..._class);
	return newElem;
}

//-------------------------graps-----------------------
const EasingFunctions = {
  linear: function (t) { return t },
  easeInQuad: function (t) { return t*t },
  easeOutQuad: function (t) { return t*(2-t) },
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  easeInCubic: function (t) { return t*t*t },
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  easeInQuart: function (t) { return t*t*t*t },
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  easeInQuint: function (t) { return t*t*t*t*t },
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

function rebuildGraph (svg_class, new_points, speed){
  let svg = document.querySelector('.' + svg_class);
  let polyline = svg.querySelector('.svg-graph__function');
  let text_item = [...svg.querySelectorAll('.text__item')];
  let polyline_nodes = polyline.getAttribute('points');

  if(!polyline_nodes){
    polyline_nodes = [];
    let xSpace = 900 / 12;
    for (let i = 1; i <= 12; i++) {
      polyline_nodes[i - 1] = [xSpace * i , 450];
    }
  }
  else{
    polyline_nodes = polyline_nodes.match(/\d+,\d+/g).map(x => x = x.split(','));;
  }
  
  let new_points_max = new_points.reduce((a,b) =>{
    if(a < b) a = b;
    return Math.ceil(a / 10) * 10;
  });
  //set values on lines
  text_item.forEach((x, i, y) => x.textContent = ~~(new_points_max - new_points_max / (y.length - 1) * i));

  new_points = new_points.map((x, i) => [polyline_nodes[i][0], 450 - ~~(x / new_points_max * 415)]);
  let difference = [];
  new_points.forEach((x, i) => difference.push(polyline_nodes[i][1] - x[1]));

  function drawPoints (polyline_nodes){
    polyline_nodes.forEach(x => {
      let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.classList.add('svg-graph__polyline__point');
      circle.setAttribute('cx', x[0]);
      circle.setAttribute('cy', x[1]);
      circle.setAttribute('r', 9);
      document.querySelector('.circles').appendChild(circle);
    });
  };

  if(svg.querySelectorAll('.svg-graph__polyline__point').length === 0)
    drawPoints(polyline_nodes);
  
  let circles = svg.querySelectorAll('.svg-graph__polyline__point');

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
      let time_fraction = Math.abs((-cur_node + new_points[i][1] + difference[i]) / difference[i]);
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

//-------------player functions-------------
function player_request (what_request) {
	let request = new XMLHttpRequest();
	let obj = {};
	if(arguments[0] === 'player')
		request.open('GET', `https://api.opendota.com/api/players/${player[1]}/matches`, false);
	else request.open('GET', `https://api.opendota.com/api/heroes`, false);
	request.send();
	obj = JSON.parse(request.responseText);
	return obj;
}

function foldArray (arr){
	let obj = [];
	let prev_month = (new Date(games[0].start_time * 1000)).getMonth() + 1;
	let index_start = 0, index_end = 1;

	for (let i = 1; i < games.length; i++) {
		let month = (new Date(games[i].start_time * 1000)).getMonth() + 1;
		if(month !== prev_month){
			index_end = i;
			obj.push(arr.slice(index_start, index_end));
			index_start = i; 
			if(obj.length === 12) break;
		}
		prev_month = month;
	}
	return obj;
}

class PopupData{
	constructor(arr){
		this.games = arr.map(x => x.length);
		this.wr = arr
								.map((x, i) => 
															x.filter((x) => isPlayerWin(x)).length 
															/ this.games[i] * 100)
								.map(x => ~~(x * 10) /10);

		this.heroes = [];
		arr.forEach(x => this.heroes.push(heroesMap(x)));

		this.favourite_hero =  [];
		this.best_hero = [];
		this.worst_hero = [];

		this.heroes.forEach(x => {
			this.favourite_hero.push(favourite_hero(x)[0]);
			this.best_hero.push(favourite_hero(x)[1]);
			this.worst_hero.push(favourite_hero(x)[2]);
		});

		this.date = [];
		arr.forEach(x => this.date.push(convertDate(x[0].start_time)));
	}
}

function heroesMap (arr) {
	let obj = {};
	for (let i = 0; i < arr.length; i++) {
		let cur_hero = printHeroName(arr[i]);
		if(!(cur_hero in obj)){
			obj[cur_hero] = [1, 0];
		}
		else obj[cur_hero][0]++;
		if(isPlayerWin(arr[i]))
			obj[cur_hero][1] ++;
	}
	return obj;
}

function favourite_hero (obj) {
	let max_matches = 0;
	let fav_hero = '';
	let best_hero = null;
	let best_hero_wr = 0;
	let worst_hero = null;
	let worst_hero_wr = 100;

	for(let hero in obj){
		let games_on_hero = obj[hero][0];
		let wins_on_hero = obj[hero][1];
		let wr = wins_on_hero / games_on_hero;

		if(games_on_hero > max_matches){
			max_matches = games_on_hero;
			fav_hero = hero;
		}

		if(games_on_hero >= 4){
			if(wr > best_hero_wr){
				best_hero_wr = wr;
				best_hero = hero;
			}

			if(wr < worst_hero_wr){
				worst_hero_wr = wr;
				worst_hero = hero;
			}
		}
	}
	if(best_hero === worst_hero) worst_hero = null;
	return [fav_hero, best_hero, worst_hero];
}