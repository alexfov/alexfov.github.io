let isGameFinished = 0;

HTMLAudioElement.prototype.stop = function(){
	this.pause();
	this.currentTime = 0.0;
}

const predators = {
	bars: ['img/predators/bars.jpg', 0, "Барс"],
	bear_brown: ['img/predators/bear-brown.jpg', 1, "Бурый медведь"],
	black_panther: ['img/predators/black-panther.jpg', 2, "Черная пантера"],
	hyena: ['img/predators/hyena.jpg', 3, "Гиена"],
	leopard: ['img/predators/leopard.jpg', 4, "Леопард"],
	lion: ['img/predators/lion.jpg', 5, "Лев"],
	lynx: ['img/predators/lynx.jpg', 6, "Рысь"],
	polar_bear: ['img/predators/polar-bear.jpg', 7, "Белый медвеsдь"],
	puma: ['img/predators/puma.jpg', 8, "Пума"],
	tiger: ['img/predators/tiger.jpg', 9, "Тигр"],
	wolf: ['img/predators/wolf.jpg', 10, "Волк"],
	manus: ['img/predators/manus.jpg', 11, "Манул"],
	result: ['img/predators/result.jpg', 'result']
}

const sea = {
	dolphin: ['img/sea/dolphin.jpg', 0, "Дельфин"],
	killer_whale: ['img/sea/killer_whale.jpg', 1, "Касатка"],
	medusa: ['img/sea/medusa.jpg', 2, "Медуза"],
	marlin: ['img/sea/marlin.jpg', 3, "Рыба-меч"],
	moray_eel: ['img/sea/moray_eel.jpg', 4, "Мурена"],
	navy_seal: ['img/sea/navy_seal.jpg', 5, "Морской лев"],
	octopus: ['img/sea/octopus.jpg', 6, "Осьминог"],
	penguin: ['img/sea/penguin.jpg', 7, "Пингвин"],
	shark: ['img/sea/shark.jpg', 8, "Акула"],
	stingray: ['img/sea/stingray.jpg', 9, "Скат"],
	turtle: ['img/sea/turtle.jpg', 10, "Черепаха"],
	walrus: ['img/sea/walrus.jpg', 11, "Морж"],
	whale: ['img/sea/whale.jpg', 12, "Кит"],
	result: ['img/sea/result.jpg', 'result']
}

const insects = {
	bee: ['img/insects/bee.jpg', 0, 'Пчела', 'sound/insect/bee.mp3'],
	bumblebee: ['img/insects/bumblebee.jpg', 1, 'Шмель', 'sound/insect/bumblebee.mp3'],
	butterfly: ['img/insects/butterfly.jpg', 2, 'Бабочка'],
	chafer: ['img/insects/chafer.jpg', 3, 'Майский жук', 'sound/insect/chafer.mp3'],
	dragonfly: ['img/insects/dragonfly.jpg', 4, 'Стрекоза', 'sound/insect/dragonfly.mp3'],
	fly: ['img/insects/fly.jpg', 5, 'Муха', 'sound/insect/fly.mp3'],
	ladybug: ['img/insects/ladybug.jpg', 6, 'Божья коровка'],
	mole: ['img/insects/mole.jpg', 7, 'Моль'],
	moscuito: ['img/insects/moscuito.jpg', 8, 'Комар', 'sound/insect/moscuito.mp3'],
	wasp: ['img/insects/wasp.jpg', 9, 'Оса', 'sound/insect/wasp.mp3'],
	result: ['img/insects/result.jpg', 'result']
}

const animals_maps = {
	predators: predators,
	sea: sea,
	insects: insects,
}

let slider_pos = 0;
function moveSlider (evt){
	let length = $('.slider__img-wrapper').length;
	if($(this).hasClass('slider__btn-right')){
		slider_pos = (slider_pos + 1) % length;
	}
	else{
		slider_pos--;
		if(slider_pos < 0) slider_pos = length - 1;
	}
	//показать смайлик(кнопка старта теста) на последнем слайде
	if(slider_pos === length - 1)
		$('.game__start-test').addClass('game__start-test_active');
	else $('.game__start-test').removeClass('game__start-test_active');

	$('.slider__wrapper').css('transform', `translateX(-${100 / length * slider_pos}%)`);
}

class Slider{
	constructor(group, game_node){
		this.animals = group;
		this.game_node = $(game_node);

		for(const animal in this.animals){
			if(!this.animals[animal][3]) continue;
			const audio = new Audio;
			audio.src = this.animals[animal][3];
			this.animals[animal].push(audio);
		};
	}

	sound(animal){
		if(!this.animals[animal][3]) return;
		const animal_sound = new Audio;
		animal_sound.src = this.animals[animal][3];
		animal_sound.play();
		$('.slider__btn').on('click', function stop_audio(){
			animal_sound.stop();
			$(this).off('click', stop_audio);
		})
		animal_sound.onended = function (){
			console.log(111)
		}
	}

	makeSlider(){
		// const animals = this.animals[Object.keys(this.animals)]
		// console.log(animals[0])
		$('.slider').remove(); //удалить текущий слайдер с обработчиками
		const length = Object.keys(this.animals).length;
		const slider = $('<div>')
			.addClass('game__slider slider')
			.append($('<div>').addClass('slider__btn slider__btn-left'))
			.append($('<div>').addClass('slider__btn slider__btn-right'))
			.append($('<div>').addClass('game__play').text('?'))
			.append($('<div>').html('<svg viewBox="0 0 436 467" class="game__start-test"><use href="#start-test" /></svg>'))
			.append($('<div>').addClass('slider__overflow')
		);

		const img_container = $('<div>')
			.addClass('slider__wrapper')
			.css('width', `${100 * length}%`)
			.appendTo(slider.children().last());

		for(let animal in this.animals){
			let element = $('<div>', {class: 'slider__img-wrapper'});
			element.append($('<img>', {src: `${this.animals[animal][0]}`, 
																 class: 'slider__img',
																 alt: `${this.animals[animal][2]}`
																 }));
			element.appendTo(img_container);
		}

		slider.appendTo(this.game_node);
		$('.slider__btn').on('click', moveSlider);
		$('.slider__btn').on('click', () =>{

			this.sound(Object.keys(this.animals)[slider_pos]);
		});
		return this;
	}

	play(){
		const this_game_node = this.game_node;
		//Контейнер для задания
		$('.game__test-container').remove();
		const test_container = $('<div>').addClass('game__test-container');
		const test_question = $('<h2>').addClass('test-question');
		const test_body = $('<div>').addClass('game__test test');
		for (let i = 0; i < 4; i++)
			test_body.append($('<div>').addClass('test__img-container reset'));
		test_container.append(test_question).append(test_body);
		//Контейнер для результата теста
		const result = $('<div>').addClass('test__result result').css('background-image', `url(${this.animals.result[0]})`);
		for (let i = 0; i < 3; i++){ //создать 3 звезды
			const svg_star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const use_tag = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			$(svg_star)
				.addClass('result__star')
				.append($(use_tag).attr('href', '#star'))

			if(i === 1) $(svg_star).addClass('result__star_higher');
			result.append($(svg_star));
		}
		this.game_node.append(test_container.append(result));
		
		let index = 0;
		let animals_list = Object.keys(this.animals); //Объект зверей
		let animals_arr =[];	//Текущий набор зверей (4шт) в тесте
		let answers = [0, 0]; //Подсчет верных ответов

		let count_result = (answers) => { //расчет награды за тест
			let wr = answers[1] / answers [0] * 100;
			let prize = 1;
			if(wr > 85) prize = 3;
			else if(wr > 70) prize = 2;
			return prize;
		}

		function randomNumber (arr, i, max) {//генератор зверей для вопроса.
			if(arr[i] == null){
				let random = ~~(Math.random() * max);
				if(arr.includes(random)) 
					randomNumber(arr, i, max);
				else
					arr[i] = random;
			}
			return arr;
		}

		function createBalloon (parent){ //Создание шарика
			for (let i = 0; i < 15; i++) { //15 шариков
				let balloon = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
				let use = $(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
				balloon.addClass('balloon__item')
							 .css({left: `${~~(Math.random() * 87)}%`, //Случайное гориз. полож.
										 fill: `rgb(${~~(Math.random() * 255)}, 
										 						${~~(Math.random() * 255)}, 
										 						${~~(Math.random() * 255)}` //Случ. цвет
									 })
							 .append(use.addClass('balloon__item-path')
							 						.attr('href', '#balloon')
							 				)
				;
				setTimeout(() => 	$(parent).append(balloon), //Разброс по времени появления шариков
													~~(Math.random() * 7000));		
			}
		}

		function getElementsFromPoint(x, y) {
		  let element = 0, elements = []; // массив элементов под курсором
		  let start = performance.now()
		  while (performance.now() - start < 10) {
		    element = document.elementFromPoint(x, y); //Получить эл. под курсором.
		    if (!element || element.classList.contains('result'))
		      break; //если null или дошли до контейнера - остановить цикл
		    element.style.visibility = 'hidden'; //скрыть объект
		    elements.push(element); //добавить эл. в массив
		  }
		  for (const elem of elements)
		    elem.style.visibility = ''; //вернуть видимость объектов
		  return elements;
		}
	
		let timer = 1000; // задержка перед анимацией
		let build_task = (index) => {
			if(index === 1){ //animals_list.length - 1 //все вопросы отвечены
				let prize = count_result(answers); //вызов функции расчета приза
				result.addClass('result_active'); //отображение результата
				//зажечь 1 звезду. Сработает всегда - минимальная награда
				setTimeout(() => $(result.children()[1]).addClass('result__star_active'), timer);
				if(prize > 1) //зажечь две звезды
					setTimeout(() => $(result.children()[0]).addClass('result__star_active'), timer + 500);
				if(prize > 2) //зажечь три звезды
					setTimeout(() => $(result.children()[2]).addClass('result__star_active'), timer + 1000);
				if(!isGameFinished){ //Условие для однократного исполнения блок инструкций
					isGameFinished = 1; 
					setTimeout(() => {
						// Скрыть звезды
						result.children().css({transform: 'scale(0)', transition: '0.4s'});
						//вызов функции создания шаров
						createBalloon(document.querySelector('.result'));
						}, timer + 2500)
				}
				return;
			}

			let cur_animal = this.animals[animals_list[index]][2].toLowerCase();
			test_question.text(`Где ${cur_animal}?`) //Создать вопрос для теста
			//Пустой массив для дальнейшего заполнения
			animals_arr = [null, null, null, null];
			//Добавляем зверя с вопроса в массив.
			let cur_animal_pos = ~~(Math.random() * 4);
			animals_arr[cur_animal_pos] = index;
			//Заполняем массив до конца сулчайными зверями
			animals_arr.forEach((x, i, arr) => randomNumber(arr, i, animals_list.length - 1));
			//Заполнения текущего вопроса
			animals_arr.forEach(function (elem, ind) {
				let cur_animal = animals_list[elem];
				//Определить в какой слот поместить зверя
				let container = $(test_body.children()[ind]);
				//Создать картинку зверя
				let animal_img = $('<img>', {src: `${this.animals[cur_animal][0]}`, 
																		 class: 'test__img',
																		 alt: `${this.animals[cur_animal][2]}`
																		 });
				//добавить зверя. Reset обновляет анимацию нового вопроса.
				container.html(animal_img).removeClass('reset');
				setTimeout(() => container.addClass('reset'), 20)
			}, this);

		}

		build_task(index); //вызов функции построения вопроса
		//transform-origin css property map
		let trans_origin_map = {
			0: '0 0',
			1: '100% 0',
			2: '0 100%',
			3: '100% 100%'
		};
		//обработка событий внутри теста.
		test_body.on('click', function (evt) {
			let target = $(evt.target);
			if(target.prop('tagName') !== 'IMG') return; //только для IMG
			let target_index = $(this).children().index(target.parent());
			//для верного ответа
			if(animals_arr[target_index] === index){
				if(target.hasClass('test__img_active')) return;
				target.addClass('test__img_active')
							.css('transform-origin', trans_origin_map[target_index]);
				console.log(animals_list[index])
				//Проверка, что верный ответ получен с первой попытки.
				if($('.wrong').length === 0)
					answers[1]++;
				answers[0]++;
				//запустить следующий вопрос
				setTimeout(() => {index += 1; build_task(index)}, 3000);
			}
			//для неверного ответа
			else target.addClass('wrong');
		});
		//обработчик взрыва шарика
		result.on('click', function (evt) {
			//получить список элементов под курсором
			const balloons = getElementsFromPoint(evt.clientX, evt.clientY);
			//найти верхний use(сам шарик)
			for(const tag of balloons){
				const $tag = $(tag);
				const parent = $tag.parent()
				if($tag.prop('tagName') === 'use'){
					//анимация взрыва
					parent.html('<image href="img/boom.svg" class="balloon__boom" />');
					//убрать анимацию
					setTimeout(() => parent.html('').remove(), 200);
					//звук взрыва
					const boom = new Audio;
					boom.preload = true;
					boom.src = 'sound/boom.mp3';
					boom.play();
					break; //прервать цикл т.к. нужный шар найден.
				}
			}
			//условие завершения игры и очистки контейнера
			//таймаут т.к. лопнутый шар исчезает через 200мс (281стр);
			setTimeout(() => {
				//3 svg звезды скрыты, поэтому 4 в условии
				if(result.children().length < 4){ 
					//для неповторяемости анимации по клику
					if(!this_game_node.hasClass('active'))
						this_game_node.css('animation', 'none');
					setTimeout(() => {
						this_game_node.css('animation', 'hinge 2s').addClass('active');
					}, 20);
					//очистка по окончанию анимации
					setTimeout(() => {
						this_game_node.html('').removeClass('active');
					}, 2000);
				}
			}, 210);
		});
	}
}

//запуск игры при нажатии на кнопку
$('.animals__sub-btn').on('click', function () {
	$('.game').html('');
	const parent = this.parentNode.parentNode;
	const game_node = parent.querySelector('.game');
	isGameFinished = 0;
	slider_pos = 1;
	moveSlider(); //Показать первый слайд
	const current_class = $(this).attr('data-class');
	const animal_class = 
		new Slider(animals_maps[current_class], game_node)
		.makeSlider()
	;

	$(this).parent().children().removeClass('active');

	$('.game__play, .game__start-test').on('click', function () {
		$('.slider').remove();
		animal_class.play()
	})
});

$("img").on("dragstart", function(event) { event.preventDefault(); });

//звук при нажатии на солнце
let sound_start = performance.now();
$('.main-menu__sun').on('click', function(){
	//Не повторять звук, пока не закончится предыдущий.
	let delay = performance.now()
	if(delay - sound_start < 1300) return;
	sound_start = performance.now();

	var laugh = new Audio();
	laugh.src = './sound/laugh.mp3';
	laugh.play();

	$('.sun').removeClass('sun_pulse');
	setTimeout(() => {$('.sun').addClass('sun_pulse');}, 20);
})