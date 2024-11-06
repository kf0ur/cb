document.addEventListener('DOMContentLoaded', function () {


	let SwiperEntrance = new Swiper('.entrance__slider', {
		slidesPerView: 1,
		spaceBetween: 10,
		speed: 800,
		loop: true,

		pagination: {
			el: '.entrance__pagination',
			type: 'bullets',
			clickable: false,
		},

		autoplay: {
			delay: 2000,
		},

		on: {
			slideChangeTransitionStart: function (swiper) {
				let translateWidth = swiper.pagination.bullets[0].offsetWidth + +getComputedStyle(swiper.pagination.el).gap.replace("px", "")

				swiper.pagination.bullets.forEach((bullet, index) => {
					if (index > swiper.realIndex) {
						bullet.style.transform = 'translateX(0px)'
					} else {
						swiper.pagination.bullets[index].style.transform = 'translateX(-' + translateWidth + 'px)'
					}
				})

				swiper.pagination.bullets[0].style.transform = 'translateX(' + translateWidth * swiper.realIndex + 'px)'
			},
		},
	});

	let SwiperMyth
	if (window.innerWidth < 768) {
		SwiperMyth = new Swiper('.myth__slider', {
			slidesPerView: 1,
			spaceBetween: 12,
			speed: 800,
			allowTouchMove: false,
		});
	}


	// autoscroll
	if (window.pageYOffset < 300) {
		setTimeout((e) => {
			document.querySelector('.body-wrapper').classList.add('scrolling')
		}, 1000)
	} else {
		document.querySelector('.body-wrapper').classList.add('scrolling')
	}


	// header menu link active
	let sectionIdArr = []
	let anchorArr = document.querySelectorAll('.anchor')
	anchorArr.forEach(link => {
		sectionIdArr.push(link.getAttribute('href'))
	})
	sectionIdArr.forEach((selector, index) => {
		let section = document.querySelector(selector)

		document.addEventListener('scroll', (e) => {
			if (section && section.getBoundingClientRect().y < window.innerHeight * 0.2) {
				document.querySelectorAll('.anchor_active').forEach(el => {
					el.classList.remove('anchor_active')
				})
				anchorArr[index].classList.add('anchor_active')
			}
		})
	})


	// header menu
	document.querySelectorAll('.header__menu-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			document.querySelector('body').classList.toggle('header-open')
		})
	})

	document.querySelectorAll('.nav__link').forEach(link => {
		link.addEventListener('click', (e) => {
			document.querySelector('body').classList.remove('header-open')
		})
	})

	document.querySelectorAll('.nav__item_has-child').forEach(link => {
		link.addEventListener('click', (e) => {
			link.classList.toggle('nav__item_submenu-open')
		})
	})

	// anchor
	document.querySelectorAll('.anchor').forEach((el => {
		el.addEventListener('click', (e) => {
			e.preventDefault()
			let currentAnchor = e.target.href.split('#').slice(1).join('')
			let blockPosition = document.getElementById(currentAnchor).offsetTop

			window.scrollTo({
				top: blockPosition,
				left: 0,
				behavior: 'smooth'
			});
		})
	}))


	// tab
	document.querySelectorAll('.tab').forEach(wrapper => {
		wrapper.addEventListener('click', (e) => {
			if (e.target.closest('.tab__link')) {
				wrapper.querySelectorAll('.tab__link').forEach(link => {
					link.classList.remove('tab__link_active')
				})
				e.target.classList.add('tab__link_active')

				wrapper.querySelectorAll('.tab__item').forEach(item => {
					item.classList.remove('tab__item_active')
				})
				let index = [...e.target.parentElement.children].indexOf(e.target)
				wrapper.querySelectorAll('.tab__item')[index].classList.add('tab__item_active')
			}
		})
	})


	// accordion
	document.querySelectorAll('.accordion').forEach(accordion => {
		let itemArr = accordion.querySelectorAll('.accordion__item')
		itemArr.forEach((item, index) => {

			let btn = item.querySelector('.accordion__btn')
			let body = item.querySelector('.accordion__body')
			if (!item.closest('.accordion__item_open')) {
				body.style.maxHeight = 0
			}
			btn.addEventListener('click', (e) => {
				if (!item.closest('.accordion__item_open')) {
					accordion.querySelectorAll('.accordion__item_open').forEach(elem => {
						elem.classList.remove('accordion__item_open')
						elem.querySelector('.accordion__body').style.maxHeight = 0
					})
					item.classList.add('accordion__item_open')
					body.style.maxHeight = body.scrollHeight + 'px'
				} else {
					item.classList.remove('accordion__item_open')
					body.style.maxHeight = 0
				}
			})
		})
	})


	// counter
	function counterInit() {
		document.querySelectorAll('.counter').forEach(counter => {
			let btn = counter.querySelector('.counter__btn')
			let result = counter.querySelector('.counter__result')

			let nextCount = +count + 1

			if (nextCount.toString().length != count.length) {
				result.innerHTML +=
					`<div class="counter__num">
						<div class="counter__num-current">0</div>
						<div class="counter__num-toggle">1</div>
					</div>`
			}

			count.split('').forEach(el => {
				result.innerHTML +=
					`<div class="counter__num">
						<div class="counter__num-current">${el}</div>
						<div class="counter__num-toggle">${el == 9 ? 0 : +el + 1}</div>
					</div>`
			})
			let splitedCount = ''
			let compareIndex = 0

			count.split('').forEach((el, index) => {
				splitedCount += el
				nextCount.toString().indexOf(splitedCount)

				if (nextCount.toString().indexOf(splitedCount) != -1) {
					compareIndex = count.length - index - 1
				}
			})

			btn.addEventListener('click', (e) => {
				if (!counterVote) {
					request('POST', requestURL)
						.then(data => {
							if (compareIndex != 0) {
								counter.querySelectorAll(`.counter__num:nth-last-child(-n + ${compareIndex})`).forEach(num => {
									num.classList.add('counter__num_toggle')
								})
							} else {
								counter.querySelectorAll(`.counter__num`).forEach(num => {
									num.classList.add('counter__num_toggle')
								})
							}
							counter.classList.add('counter_active')
						})
						.catch(err => console.log(err))
				}
			})
		})
	}


	// copy link
	document.querySelectorAll('.social__link_copy').forEach(link => {
		let wrapper = link.closest('.social')

		link.addEventListener('click', (e) => {
			e.preventDefault()
			let text = link.getAttribute('href');
			navigator.clipboard.writeText(text).then(function () {
				wrapper.classList.add('social_copied')
				setTimeout(() => {
					wrapper.classList.remove('social_copied')
				}, 1500)
			}, function (err) {
				console.error('Could not copy text: ', err);
			});
		})
	})


	// fancybox defaults
	Fancybox.bind('[data-fancybox]', {
		autoFocus: false,
		Thumbs: false,
		dragToClose: false
	});


	// check
	document.querySelectorAll('.check').forEach(wrapper => {
		let inputArr = wrapper.querySelectorAll('.checkbox__input')
		let resultBtn = wrapper.querySelector('.check__body-btn_result')
		let againBtn = wrapper.querySelector('.check__body-btn_again')
		let selectedNum = wrapper.querySelector('.check__result-num span:first-child')
		let contentArr = wrapper.querySelectorAll('.check__result-text')

		inputArr.forEach(item => {
			item.addEventListener('change', (e) => {
				wrapper.querySelectorAll('.check__result-text_active').forEach(activeContent => {
					activeContent.classList.remove('check__result-text_active')
				})

				if (wrapper.querySelector('[name="check-15"]').checked) {
					inputArr.forEach(checkedItem => {
						checkedItem.checked = false
					})
					item.checked = !item.checked

					contentArr[3].classList.add('check__result-text_active')
					selectedNum.innerHTML = 0
				} else {
					selectedNum.innerHTML = wrapper.querySelectorAll('.checkbox__input:checked').length
					if (wrapper.querySelector('[name="check-9"]').checked
						|| wrapper.querySelector('[name="check-10"]').checked
						|| wrapper.querySelector('[name="check-12"]').checked
						|| wrapper.querySelector('[name="check-13"]').checked
						|| wrapper.querySelector('[name="check-14"]').checked) {

						for (let i = 0; i < inputArr.length; i++) {
							if (inputArr[i].checked
								&& inputArr[i].getAttribute('name') !== 'check-9'
								&& inputArr[i].getAttribute('name') !== 'check-10'
								&& inputArr[i].getAttribute('name') !== 'check-12'
								&& inputArr[i].getAttribute('name') !== 'check-13'
								&& inputArr[i].getAttribute('name') !== 'check-14') {
								contentArr[1].classList.add('check__result-text_active')
								break
							}
						}

						if (!wrapper.querySelector('.check__result-text_active')) {
							contentArr[0].classList.add('check__result-text_active')
						}

					} else {
						contentArr[2].classList.add('check__result-text_active')
					}
				}
			})
		})

		resultBtn.addEventListener('click', (e) => {
			inputArr.forEach(item => {
				if (item.checked) {
					wrapper.classList.add('check_show-result')
				}
			})

			if (window.innerWidth < 768) {
				window.scrollTo({
					top: wrapper.offsetTop + wrapper.querySelector('.check__body').offsetTop - 24,
					left: 0
				});
			}

		})
		againBtn.addEventListener('click', (e) => {
			wrapper.querySelectorAll('.checkbox__input:checked').forEach(item => {
				item.checked = false
				selectedNum.innerHTML = 0
			})
			wrapper.querySelectorAll('.check__result-text_active').forEach(activeContent => {
				activeContent.classList.remove('check__result-text_active')
			})
			wrapper.classList.remove('check_show-result')
		})
	})


	// myth
	document.querySelectorAll('.myth').forEach(wrapper => {
		let slidesArr = wrapper.querySelectorAll('.myth__slide')
		let resetBtn = wrapper.querySelector('.myth__card-btn_reset')

		slidesArr.forEach((slide, index) => {
			let title = slide.querySelector('.myth__card-title')
			let btns = slide.querySelectorAll('.myth__card-btn_answer')
			let nextBtn = slide.querySelector('.myth__card-btn_next')

			slide.style.zIndex = slidesArr.length - index
			slide.querySelector('.myth__pagination span:nth-child(1)').innerHTML = index + 1
			slide.querySelector('.myth__pagination span:nth-child(3)').innerHTML = slidesArr.length


			btns.forEach(btn => {
				btn.addEventListener('click', (e) => {
					slide.classList.add('myth__slide_show-answer')
				})
			})

			if (nextBtn) nextBtn.addEventListener('click', (e) => {
				slide.classList.add('myth__slide_hide')
				slide.classList.remove('myth__slide_show')
				slidesArr[index + 1].classList.add('myth__slide_show')

				if (SwiperMyth) {
					SwiperMyth.slideNext()
				}
			})
		})

		resetBtn.addEventListener('click', (e) => {
			slidesArr.forEach(slide => {
				slide.classList.remove('myth__slide_hide')
				slide.classList.remove('myth__slide_show')
				slide.classList.remove('myth__slide_show-answer')
			})

			slidesArr[0].classList.add('myth__slide_show')

			if (SwiperMyth) {
				SwiperMyth.slideTo(0)
			}
		})
	})


	// phone mask
	document.querySelectorAll('[type="tel"]').forEach(el => {
		let mask = IMask(el, { mask: '+{7} (000) 000-00-00' })
	})


	// story cards
	document.querySelectorAll('.story').forEach(wrapper => {
		let loadBtn = wrapper.querySelector('.story__load-btn')

		loadBtn.addEventListener('click', (e) => {
			wrapper.classList.add('story_show')
		})
	})


	// upload btn
	document.querySelectorAll('.story__upload-col').forEach(wrapper => {
		let field = wrapper.querySelector('.story__upload-btn input')
		let imgCrop = wrapper.querySelector('.story__upload-crop img')
		let img = wrapper.querySelector('.story__upload-img img')
		let uploadBtn = wrapper.querySelector('.story__upload-btn .btn')
		let acceptBtn = wrapper.querySelector('.story__accept-btn')
		let downloadBtn = wrapper.querySelector('.story__download-btn')
		let card = wrapper.querySelector('.story__upload-body')

		let cropWrapper;

		field.addEventListener('input', (e) => {
			for (let i = 0; i < field.files.length; i++) {
				const reader = new FileReader();
				reader.onload = (e) => {
					imgCrop.src = e.target.result
					wrapper.classList.remove('story__upload-col_download')
					wrapper.classList.remove('story__upload-col_croped')
					wrapper.classList.add('story__upload-col_cropping')

					let currentBtnText = uploadBtn.innerHTML
					uploadBtn.innerHTML = uploadBtn.getAttribute('data-toggle-text')
					// uploadBtn.setAttribute('data-toggle-text', currentBtnText)
					uploadBtn.classList.remove('btn_white')

					if (!cropWrapper) {
						cropWrapper = new Croppie(imgCrop, {
							viewport: {
								width: card.offsetWidth,
								height: card.offsetHeight
							},
							showZoomer: false,
							enforceBoundary: true
						});
					}

					cropWrapper.bind({
						url: e.target.result
					});
				}
				reader.readAsDataURL(field.files[i]);
			}
		})

		acceptBtn.addEventListener('click', (e) => {
			wrapper.classList.add('story__upload-col_disable')
			cropWrapper.result({
				type: 'blob',
				size: 'original',
				format: 'jpeg',
				quality: 1,
				circle: false
			}).then(function (blob) {
				img.src = window.URL.createObjectURL(blob)
				wrapper.classList.remove('story__upload-col_cropping')
				wrapper.classList.add('story__upload-col_croped')

				html2canvas(card).then((canvas) => {
					const data = canvas.toDataURL("image/png;base64");
					downloadBtn.download = 'kiberbulling-2024';
					downloadBtn.href = data;

					wrapper.classList.add('story__upload-col_download')

					wrapper.classList.remove('story__upload-col_disable')
				});
			});

		})
	})


	// chat btn
	document.querySelectorAll('.help__btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			if (document.querySelector('.woot-widget-bubble:not(.woot--close)')) {
				document.querySelector('.woot-widget-bubble:not(.woot--close)').click()
			}
		})
	})
});