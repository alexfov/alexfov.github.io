document.addEventListener('DOMContentLoaded', main);

function main(){
	var lineDrawing = anime({
	  targets: '#lineDrawing .lines path',
	  strokeDashoffset: [anime.setDashoffset, 0],
	  easing: 'easeInOutSine',
	  duration: 700,
	  delay: function(el, i) { return i * 60 },
	  direction: 'alternate',
	  loop: false
	});
}

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
for (key in players){
	request.open('GET', `https://api.opendota.com/api/players/${players[key]}/matches`, false);
	request.send();
	games[key] = JSON.parse(request.responseText);
}
// --------------HEROES ---------------//
		request.open('GET', `https://api.opendota.com/api/heroes`, false);
		request.send();
let heroes = JSON.parse(request.responseText);
let heroes_img = {};

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
	while (convertDate(array[i + count].start_time)[1] == +month) {
		arr.unshift(new PlayerStats(array[i + count]));
		count--
		if(i + count < 0) break;
	}
	return arr;
}

function addElement (element, entrails, ..._class) {
	let newElem = document.createElement(element);
	newElem.classList.add(..._class);
	newElem.innerHTML = entrails;
	return newElem;
}

let table_container = document.querySelector('.table-container')

function drawTable (x, month, year){
	let cur_month = {};
	for(key in games){
		cur_month[key] = map(games[key], month, year);
	}
	table_container.innerHTML = '';
	x += 4;
	let table = addElement('table', '', 'table');
	table_container.appendChild(table);
	let header = 'table__header'; //class for cells

	for (let j = 0; j <= Object.keys(players).length + 1; j++) {
		if(j > 0) header = 'table__cell';
		let currentPlayer = Object.keys(players)[j - 2];

		for(let i = 0; i < x; i++){
			//row
			if(i == 0){
				var row = addElement('tr', '', 'table__row');
				table.appendChild(row);
			} 
			//rows -- end
			//cells
			let cell = addElement('td', '', header);

				//print 2nd row
				if(j == 1 && i > 0 & i < x - 3)	cell.innerHTML = i;
				if(j == 1 && i == x - 3) cell.innerHTML = 'W';
				if(j == 1 && i == x - 2) cell.innerHTML = 'L';
				if(j == 1 && i == x - 1) cell.innerHTML = 'WR';

				//print 1st column
				if(i == 0 && j > 1) cell.innerHTML = currentPlayer;
			row.appendChild(cell);
			//cels -- end
			//spans
			if(j > 1 && i > 0){
				//win
				var spanWin = addElement('span', '', 'table__win');
				cell.appendChild(spanWin);
				//lose
				var spanLose = addElement('span', '', 'table__lose');
				cell.appendChild(spanLose);
				//add data to cell
				//days
				let this_date = 0, wins = 0, loses = 0;
				if(i < x - 3){
					this_date = cur_month[currentPlayer].filter(x => x.date[0] == i);
					wins = this_date.filter(x => x.win);
					loses = this_date.filter(x => !x.win);
				}
				else{
					if(i === x - 3){
						wins = cur_month[currentPlayer].filter(x => x.win);
						loses = [];
					}
					if(i === x - 2){
						wins = [];
						loses = cur_month[currentPlayer].filter(x => !x.win);
					}
					if(i === x - 1){	
						wins = [];
						loses = [];
						cell.innerHTML = ~~(cur_month[currentPlayer].filter(x => x.win).length / cur_month[currentPlayer].length * 100);
					}
				}
				//not for last colum - winrate
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

				if(wins.length != 0 || loses.length != 0){
					let popup = addElement('div', '', 'table__popup');
					cell.appendChild(popup);
					if(wins.length)
						for(let i in wins) drawPopup(i, popup, wins, 'win');

					if(loses.length)
						for(let i in loses)	drawPopup(i, popup, loses, 'lose');
				}
			}
			//spans--end
			//heading
			if(j === 0){
				cell.setAttribute('colspan', x);
				cell.innerHTML = `${monthes[month - 1]} ${year}`;
				break;
			}
			//heading -- end
		}
	}
}
let today = new Date();
drawTable(31, today.getMonth() + 1, today.getFullYear())

let btn = document.querySelector('.btn');

btn.addEventListener('click', function () {
	let month = document.querySelector('#month').value;
	let year = document.querySelector('#year').value;
	drawTable(31, month, year);
});