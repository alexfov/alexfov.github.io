'use strict';

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