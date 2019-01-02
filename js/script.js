'use strict';

let players = {
	Neeeeeerf: 102756891,
	JohnGalt: 41528404,
	AlexFov: 313885294,
	Doctor: 254920273,
	Megabit: 84502939,
	BloOdTerrOr: 120491980
};

let monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
let request = new XMLHttpRequest();

let games = {};
for (let key in players){
	request.open('GET', `https://api.opendota.com/api/players/${players[key]}/matches`, false);
	request.send();
	games[key] = JSON.parse(request.responseText);
}
// --------------HEROES ---------------//
		request.open('GET', `https://api.opendota.com/api/heroes`, false);
		request.send();
let heroes = JSON.parse(request.responseText);
let heroes_img = {};
//make hero img Map
for(let hero in heroes){
	heroes_img[heroes[hero]['localized_name']] = `https://api.opendota.com/apps/dota2/images/heroes/${heroes[hero].name.replace('npc_dota_hero_', '')}_full.png?`
}
//------------------------------------//

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

let table_body = document.querySelector('.table__body');

function drawTable (x, month, year){
	function sorting(a, b){
		if(a.hero > b.hero) return 1;
		if(a.hero < b.hero) return -1;
		return 0;
	}

	function count_hero_winrate(arr){
		let obj = {};
		for(let i in arr){
			let hero = arr[i];
			if(!(hero.hero in obj)) {
				if(hero.win) obj[hero.hero] = [1, 0];
				else obj[hero.hero] = [0, 1];
			}
			else{
				if(hero.win) obj[hero.hero][0]++;
				else obj[hero.hero][1]++;
			}
		}
		return obj;
	}

	let cur_month = {}, row, cell;
	for(let key in games){
		cur_month[key] = map(games[key], month, year);
	}
	//clear table
	table_body.innerHTML = '';
	//set current month
	let table_month = document.querySelector('.table__month');
	table_month.innerHTML = `${monthes[month - 1]} ${year}`;
	//go through rows
	for (let j = 0; j < Object.keys(players).length; j++) {
		let currentPlayer = Object.keys(players)[j];
		//go through columns
		for(let i = 0; i <= 34; i++){
			//add row
			if(i === 0){
				row = addElement('tr', '', 'table__row');
				table_body.appendChild(row);
			} 
			//dates
			cell = addElement('td', '', 'table__cell');
			//set player names
			if(i === 0) cell.innerHTML = currentPlayer;
			row.appendChild(cell);
			//spans for win/lose colors
			if(i > 0){
				//win
				var spanWin = addElement('span', '', 'table__win');
				cell.appendChild(spanWin);
				//lose
				var spanLose = addElement('span', '', 'table__lose');
				cell.appendChild(spanLose);
				//add data to cell
				//days
				let this_date = 0, wins = 0, loses = 0, heroes_winrate;
				if(i < 34 - 2){
					this_date = cur_month[currentPlayer].filter(x => x.date[0] == i);
					wins = this_date.filter(x => x.win).sort(sorting);
					loses = this_date.filter(x => !x.win).sort(sorting);
				}
				else{
					cell.classList.add('table__cell_bold');
					wins = cur_month[currentPlayer].filter(x => x.win).sort(sorting);
					loses = cur_month[currentPlayer].filter(x => !x.win).sort(sorting);
					if(i === 34 - 2){ //wins colimn
						loses = [];
					}
					if(i === 34 - 1){ //loses column
						loses = cur_month[currentPlayer].filter(x => !x.win).sort(sorting);
						wins = [];
					}
					if(i === 34){		//winrate column
						let total_games = wins.slice();
						total_games.push(...loses);
						heroes_winrate = count_hero_winrate(total_games);

						wins = [];
						loses = [];
						let winrate = ~~(cur_month[currentPlayer].filter(x => x.win).length / cur_month[currentPlayer].length * 100);
						if(winrate >= 50) cell.classList.add('table__cell_win');
						else cell.classList.add('table__cell_lose');
						cell.innerHTML = winrate;

						let popup = addElement('div', '', 'table__popup');
						cell.appendChild(popup);
						drawWinratePopup(heroes_winrate, popup);
					}
				}

				if(wins.length != 0)	spanWin.innerHTML = wins.length;
				if(loses.length != 0)	spanLose.innerHTML = loses.length;
				//popup
				function drawPopup(i, popup, arr, _class){
					let popup_item = addElement('div', '', 'table__popup-item', `table__popup-item_${_class}`);
					popup.appendChild(popup_item);

					let popup_img = addElement('img', '', 'table__hero-img');
					popup_img.setAttribute('src', heroes_img[arr[i].hero]);
					popup_item.appendChild(popup_img);

					let popup_link = addElement('a');
					popup_link.setAttribute('href', `https://www.dotabuff.com/matches/${arr[i]['id']}`);
					popup_item.appendChild(popup_link);
					popup_link.innerHTML = arr[i].stats;			
				}

				function drawWinratePopup (obj, popup) {
					for(let hero in obj){
						let wins = obj[hero][0];
						let loses = obj[hero][1];
						let winrate = ~~(wins * 100 / (wins + loses));
						let cell_color = 'table__popup-item_win';
						if (winrate < 50) cell_color = 'table__popup-item_lose';

						let popup_item = addElement('div', '', 'table__popup-item', cell_color);
						popup.appendChild(popup_item);

						let popup_img = addElement('img', '', 'table__hero-img');
						popup_img.setAttribute('src', heroes_img[hero]);
						popup_item.appendChild(popup_img);

						let span = addElement('span', wins + ' - ', 'table__win');
						popup_item.appendChild(span);

						span = addElement('span', loses + ' - ', 'table__lose');
						popup_item.appendChild(span);

						winrate < 50 ? cell_color = 'table__lose' : cell_color = 'table__win';
						span = addElement('span', winrate + '%', cell_color);
						popup_item.appendChild(span);
					}
				}

				if(wins.length != 0 || loses.length != 0){
					let popup = addElement('div', '', 'table__popup');
					cell.appendChild(popup);
					if(wins.length)
						for(let i in wins) drawPopup(i, popup, wins, 'win');

					if(loses.length)
						for(let i in loses)	drawPopup(i, popup, loses, 'lose');
				}
			}
		}
	}
}

let today = new Date();

function drawSelectYear (){
	let select_year = document.querySelector('.select-year');
	for (var i = today.getFullYear(); i >= 2014 ; i--) {
		let option = addElement('option', i);
		option.setAttribute('value', i);
		select_year.appendChild(option);
	}
}

drawSelectYear();
drawTable(31, today.getMonth() + 1, today.getFullYear());

let btn = document.querySelector('.btn');

btn.addEventListener('click', function () {
	let month = document.querySelector('#month').value;
	let year = document.querySelector('#year').value;
	drawTable(31, month, year);
});