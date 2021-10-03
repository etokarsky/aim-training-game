const startBtn = document.querySelector('.start')
const screens = document.querySelectorAll('.screen')
const timeList = document.querySelector('.time-list')
const timeLeftHeader = document.querySelector('.time-left-header')
const timerElement = document.querySelector('#time')
const delayLabel = document.querySelector('.delay-label')
const board = document.querySelector('#board')
const resetBtn = document.querySelector('.reset-btn')

let time = 0
let downCounter = 5
let delayTimer = null
let gameTimer = null
let score = 0

startBtn.addEventListener('click', event => {
	event.preventDefault()
	screens[0].classList.add('up')
})

timeList.addEventListener('click', event => {
	const btn = event.target.closest('.time-btn')
	if (!btn) return

	time = +btn.dataset.time

	screens[1].addEventListener('transitionend', delayStart)
	screens[1].classList.add('up')
})

board.addEventListener('click', event => {
	const circle = event.target.closest('.circle')
	if (!circle) return

	score++
	event.target.remove()
	createRandomCircle()
})

resetBtn.addEventListener('click', resetGame)

// логика перед запуском игры >----------------------------------------------------------------------

function delayStart() {
	delayLabel.innerHTML = `Get ready... ${downCounter}`
	delayLabel.classList.remove('hide')
	delayTimer = setInterval(countdown, 1000)
}

function countdown() {
	downCounter--
	if (downCounter === 0) {
		clearInterval(delayTimer)
		delayTimer = null
		startGame()
	} else {
		delayLabel.innerHTML = `Get ready... ${downCounter}`
	}
}

// логика игры >-------------------------------------------------------------------------------------

function startGame() {
	delayLabel.classList.add('hide')
	timeLeftHeader.classList.remove('hide')

	gameTimer = setInterval(decreaseTime, 1000)
	setTime()
	createRandomCircle()
}

function decreaseTime() {
	time--
	if (time === 0) finishGame()
	setTime()
}

function setTime() {
	if (time < 10) {
		if (time < 6) timerElement.classList.add('finish-red')
		timerElement.innerHTML = `00:0${time}`
	} else {
		timerElement.innerHTML = `00:${time}`
	}
}

function finishGame() {
	clearInterval(gameTimer)
	gameTimer = null

	timeLeftHeader.classList.add('hide')
	resetBtn.classList.remove('hide')

	board.innerHTML = `<h1>Score: <span class="primary">${score}</span></h1>`
}

function resetGame(event) {
	event.preventDefault()

	score = 0
	downCounter = 5

	board.innerHTML = ''

	screens[1].removeEventListener('transitionend', delayStart)
	screens[1].classList.remove('up')

	resetBtn.classList.add('hide')
	timerElement.classList.remove('finish-red')
}

// вспомогательные функции для игры >-----------------------------------------------------------------

function createRandomCircle() {
	const circle = document.createElement('div')
	circle.classList.add('circle')

	const size = getRandomNum(10, 60)
	const { width, height } = board.getBoundingClientRect()
	const x = getRandomNum(0, width - size)
	const y = getRandomNum(0, height - size)

	circle.style.width = circle.style.height = `${size}px`
	circle.style.background = getRandomColor()
	circle.style.top = `${y}px`
	circle.style.left = `${x}px`

	board.append(circle)
}

function getRandomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}

function getRandomColor() {
	const r = getRandomNum(0, 256)
	const g = getRandomNum(0, 256)
	const b = getRandomNum(0, 256)
	return `rgb(${r}, ${g}, ${b})`
}