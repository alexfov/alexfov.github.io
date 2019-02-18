const test = $('.game__test');
const question = $('.test-question');
const result = $('.result');
const game_node = $('.game');
let isGameFinished = 0;

const predators = {
	bars: ['img/predators/bars.jpg', 0, "Барс"],
	bear_brown: ['img/predators/bear-brown.jpg', 1, "Бурый медведь"],
	black_panther: ['img/predators/black-panther.jpg', 2, "Черная пантера"],
	hyena: ['img/predators/hyena.jpg', 3, "Гиена"],
	leopard: ['img/predators/leopard.jpg', 4, "Леопард"],
	lion: ['img/predators/lion.jpg', 5, "Лев"],
	lynx: ['img/predators/lynx.jpg', 6, "Рысь"],
	polar_bear: ['img/predators/polar-bear.jpg', 7, "Белый медведь"],
	puma: ['img/predators/puma.jpg', 8, "Пума"],
	tiger: ['img/predators/tiger.jpg', 9, "Тигр"],
	wolf: ['img/predators/wolf.jpg', 10, "Волк"],
	manus: ['img/predators/manus.jpg', 11, "Манул"],
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
}

const insects = {
	bee: ['img/insects/bee.jpg', 0, 'Пчела'],
	bumblebee: ['img/insects/bumblebee.jpg', 1, 'Шмель'],
	butterfly: ['img/insects/butterfly.jpg', 2, 'Бабочка'],
	chafer: ['img/insects/chafer.jpg', 3, 'Майский жук'],
	dragonfly: ['img/insects/dragonfly.jpg', 4, 'Стрекоза'],
	fly: ['img/insects/fly.jpg', 5, 'Муха'],
	ladybug: ['img/insects/ladybug.jpg', 6, 'Божья коровка'],
	mole: ['img/insects/mole.jpg', 7, 'Моль'],
	moscuito: ['img/insects/moscuito.jpg', 8, 'Комар'],
	wasp: ['img/insects/wasp.jpg', 9, 'Оса'],
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
	$('.slider__wrapper').css('transform', `translateX(-${100 / length * slider_pos}%)`);
}

class Slider{
	constructor(test_node, question_node, result_node, group, game_node){
		this.test_node = test_node;
		this.question_node = question_node;
		this.result_node = result_node;
		this.animals = group;
		this.game_node = game_node;
	}
	makeSlider(){
		$('.slider').remove(); //удалить текущий слайдер с обработчиками
		const length = Object.keys(this.animals).length;
		const slider = $('<div>')
			.addClass('game__slider slider')
			.append($('<div>').addClass('slider__btn slider__btn-left'))
			.append($('<div>').addClass('slider__btn slider__btn-right'))
			.append($('<div>').addClass('play'))
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

		slider.appendTo(game_node);
		$('.slider__btn').on('click', moveSlider);
		return this;
	}

	play(){
		//Контейнер для задания
		const test_container = $('<div>').addClass('game__test-container');
		const test_question = $('<div>').addClass('test-question');
		const test_body = $('<div>').addClass('game__test test');
		for (let i = 0; i < 4; i++)
			test_body.append($('<div>').addClass('test__img-container reset'));
		test_container.append(test_question).append(test_body);
		//Контейнер для результата теста
		const result = $('<div>').addClass('test__result result');

		for (let i = 0; i < 3; i++){ //создать 3 звезды
			const svg_star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const use_tag = document.createElementNS('http://www.w3.org/2000/svg', 'use');

			$(svg_star)
				.addClass('result__star')
				.append($(use_tag).attr('href', '#star'))

			if(i === 1) $(svg_star).addClass('result__star_higher');
			result.append($(svg_star));
		}
		console.log(result.children())

		this.test_node.innerHTML = '';
		this.question_node.innerHTML = '';
		this.result_node.innerHTML = '';
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
		  while (true) {
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
			if(index === animals_list.length){ //animals_list.length //все вопросы отвечены
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
			this.question_node.text(`Где ${cur_animal}?`) //Создать вопрос для теста
			//Пустой массив для дальнейшего заполнения
			animals_arr = [null, null, null, null];
			//Добавляем зверя с вопроса в массив.
			let cur_animal_pos = ~~(Math.random() * 4);
			animals_arr[cur_animal_pos] = index;
			//Заполняем массив до конца сулчайными зверями
			animals_arr.forEach((x, i, arr) => randomNumber(arr, i, animals_list.length));
			//Заполнения текущего вопроса
			animals_arr.forEach(function (elem, ind) {
				let cur_animal = animals_list[elem];
				//Определить в какой слот поместить зверя
				let container = $(this.test_node.children()[ind]);
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
		this.test_node.on('click', function (evt) {
			let target = $(evt.target);
			if(target.prop('tagName') !== 'IMG') return; //только для IMG

			let target_index = $(this).children().index(target.parent());
			//для верного ответа
			if(animals_arr[target_index] === index){
				if(target.hasClass('test__img_active')) return;
				target.addClass('test__img_active')
							.css('transform-origin', trans_origin_map[target_index])
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
		this.result_node.on('click', function (evt) {
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
					break; //прервать цикл т.к. нужный шар найден.
				}
			}
		});
	}
}

$('.main-menu__sub-btn').on('click', function () {
	isGameFinished = 0;
	slider_pos = 1;
	moveSlider(); //Показать первый слайд
	const current_class = $(this).attr('data-class');
	const animal_class = 
		new Slider(test, question, result, animals_maps[current_class], game_node)
		.makeSlider()
		.play()
	;
	$(this).parent().children().removeClass('active');
})