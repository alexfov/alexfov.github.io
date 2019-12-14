'use strict';

const games = {};
for (let key in players){
	const request = new XMLHttpRequest();
	request.open('GET', `https://api.opendota.com/api/players/${players[key]}/matches`, true);
	request.send();
	request.onreadystatechange = function(){
		if(request.readyState != 4) return;
		//localStorage.setItem(`games_${key}`, request.responseText);
		games[key] = JSON.parse(request.responseText);
		if(Object.keys(games).length === Object.keys(players).length && isHeroesRequestDone){
			drawTable(31, today.getMonth() + 1, today.getFullYear());
		}
	} 
}

//--------------HEROES ---------------//
const heroes_img = {};
let heroes = [];
var isHeroesRequestDone = false;
(function (){
	const request = new XMLHttpRequest();
	request.open('GET', `https://api.opendota.com/api/heroes`, true);
	request.send();

	request.onreadystatechange = function(){
		if(request.readyState != 4) return;
		//localStorage.setItem(`heroes`, request.responseText);
		heroes = JSON.parse(request.responseText);
		//make hero img Map
		for(let hero in heroes){
			heroes_img[heroes[hero]['localized_name']] = `https://api.opendota.com/apps/dota2/images/heroes/${heroes[hero].name.replace('npc_dota_hero_', '')}_full.png?`
		}
		isHeroesRequestDone = true;
	}
})();
//------------------------------------//

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
// drawTable(31, today.getMonth() + 1, today.getFullYear());

let btn = document.querySelector('.btn');

btn.addEventListener('click', function () {
	let month = document.querySelector('#month').value;
	let year = document.querySelector('#year').value;
	drawTable(31, month, year);
});
