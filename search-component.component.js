'use strict';

const dataSource = {
	meta: {
		results: { total: 26, found: 26 },
		paginator: { pages: 3, page: 1, size: 10 }
	},
	data: [
		{ label: 'Angola', subLabel: 'Africa', value: '1' },
		{ label: 'Ghana', subLabel: 'Africa', value: '2' },
		{ label: 'South Africa', subLabel: 'Africa', value: '3' },
		{ label: 'Mozambique', subLabel: 'Africa', value: '4' },
		{ label: 'Rwanda', subLabel: 'Africa', value: '5' },
		{ label: 'Tanzania', subLabel: 'Africa', value: '6' },

		{ label: 'China', subLabel: 'Asia', value: '11' },
		{ label: 'Japan', subLabel: 'Asia', value: '12' },
		{ label: 'Vietnam', subLabel: 'Asia', value: '13' },
		{ label: 'Mongolia', subLabel: 'Asia', value: '14' },
		{ label: 'Singapore', subLabel: 'Asia', value: '15' },

		{ label: 'Argentina', subLabel: 'South America', value: '21' },
		{ label: 'Brazil', subLabel: 'South America', value: '22' },
		{ label: 'Chile', subLabel: 'South America', value: '23' },
		{ label: 'Colombia', subLabel: 'South America', value: '24' },
		{ label: 'Peru', subLabel: 'South America', value: '25' },
		{ label: 'Ecuador', subLabel: 'South America', value: '26' },
		
		{ label: 'United Stated of America', subLabel: 'North America', value: '31' },
		{ label: 'Canada', subLabel: 'North America', value: '32' },
		{ label: 'Mexico', subLabel: 'North America', value: '33' },

		{ label: 'France', subLabel: 'Europe', value: '41' },
		{ label: 'Italy', subLabel: 'Europe', value: '42' },
		{ label: 'Germany', subLabel: 'Europe', value: '43' },
		{ label: 'Greece', subLabel: 'Europe', value: '44' },
		{ label: 'Bulgaria', subLabel: 'Europe', value: '45' },
		{ label: 'Norway', subLabel: 'Europe', value: '46' },

		{ label: 'Australia', subLabel: 'Oceania', value: '51' },
		{ label: 'New Zealand', subLabel: 'Oceania', value: '52' },
		{ label: 'Samoa', subLabel: 'Oceania', value: '53' },
		{ label: 'Fiji', subLabel: 'Oceania', value: '54' }
	]
};

dataSource.data.sort((a, b) => a.label.localeCompare(b.label));

(function() {

	let THIS, CURRENT, CURRENT_X, CURRENT_HIDDEN, INPUT, INPUT_X, OUTPUT_NO_RESULTS, OUTPUT_LOADING, OUTPUT_RESULTS, PAGE_PREVIOUS, PAGE_NEXT;

	const documentOn = {
		click: (event) => {
			var clickInside = THIS.contains(event.target);
			if (!clickInside) {
				INPUT.parentNode.classList.remove('wide25');
				INPUT.parentNode.classList.remove('wide75');
				CURRENT.parentNode.classList.remove('wide25');
				CURRENT.parentNode.classList.remove('wide75');
				hideLoading();
				hideResults();
				hideNoResults();
			}
		}
	};

	const pagePreviousOn = {
		click: (event) => {
			if (!PAGE_PREVIOUS.classList.contains('off')) {
				dataSource.meta.paginator.page--;
				hideNoResults();
				hideResults();
				showLoading();
				search(INPUT.value);
			}
		}
	};

	const pageNextOn = {
		click: (event) => {
			if (!PAGE_NEXT.classList.contains('off')) {
				dataSource.meta.paginator.page++;
				hideNoResults();
				hideResults();
				showLoading();
				search(INPUT.value);
			}
		}
	};

	const currentOn = {
		focus: (event) => {
			INPUT.focus();
			// INPUT.dispatchEvent(new Event('focus'));
		}
	};

	const currentXOn = {
		click: (event) => {
			dataSource.meta.paginator.page = 1;
			CURRENT.value = '';
			CURRENT_HIDDEN.value = '';
			hideLoading();
			hideResults();
			hideNoResults();
		}
	};

	const inputOn = {
		focus: (event) => {
			INPUT.parentNode.classList.add('wide75');
			INPUT.parentNode.classList.remove('wide25');
			CURRENT.parentNode.classList.add('wide25');
			CURRENT.parentNode.classList.remove('wide75');
			hideNoResults();
			hideResults();
			showLoading();
			search(INPUT.value);
		},
		keyUp: (event) => {
			dataSource.meta.paginator.page = 1;
			hideNoResults();
			hideResults();
			showLoading();
			search(INPUT.value);
		}
	};

	const inputXOn = {
		click: (event) => {
			dataSource.meta.paginator.page = 1;
			INPUT.value = '';
			INPUT.focus();
		}
	};

	const outputOn = {
		click: (event, element, label, subLabel, value) => {
			element.classList.add('current');
			CURRENT.value = label + ( subLabel ? ' (' + subLabel + ')' : '');
			CURRENT.title = CURRENT.value;
			CURRENT_HIDDEN.value = value ?? '';
			INPUT.parentNode.classList.add('wide25');
			INPUT.parentNode.classList.remove('wide75');
			CURRENT.parentNode.classList.add('wide75');
			CURRENT.parentNode.classList.remove('wide25');
			hideNoResults();
			hideLoading();
			hideResults();
		}
	};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	const hideNoResults = (immediate) => {
		OUTPUT_NO_RESULTS.classList.add('hide');
	};
	const hideLoading = (immediate) => {
		OUTPUT_LOADING.classList.add('hide');
	};
	const hideResults = (immediate) => {
		OUTPUT_RESULTS.classList.add('hide');
	};

	const searchEnd = (results) => {
		hideLoading(true);
		showResults(results);
	};

	const showNoResults = () => {
		OUTPUT_NO_RESULTS.classList.remove('hide');
	};
	const showLoading = () => {
		OUTPUT_LOADING.classList.remove('hide');
	};
	const showResults = (results) => {
		const optionsDisplay = OUTPUT_RESULTS.querySelector('section');
		while (optionsDisplay.firstChild) {
			optionsDisplay.removeChild(optionsDisplay.lastChild);
		}
		for (let i = 0 ; i < results.data.length ; i++) {
			const result = results.data[i];
			const newLabel = document.createElement('label');
			newLabel.setAttribute('data-value', result.value);
			if (CURRENT_HIDDEN.value == result.value) {
				newLabel.classList.add('current');
			}
			const newSpan1 = document.createElement('span');
			newSpan1.innerHTML = result.label;
			newLabel.appendChild(newSpan1);
			const newSpan2 = document.createElement('span');
			newSpan2.innerHTML = result.subLabel;
			newLabel.appendChild(newSpan2);
			optionsDisplay.appendChild(newLabel);
		}
		OUTPUT_RESULTS.querySelectorAll('label').forEach(
			element => {
				element.addEventListener('click', (event) => {
					outputOn.click(event, element, element.querySelector('span:first-child').innerHTML, element.querySelector('span:last-child').innerHTML, element.getAttribute('data-value'))
				})
			}
		);

		const foundDisplay = OUTPUT_RESULTS.querySelector('header span.found');
		foundDisplay.innerHTML = results.meta.results.found;

		const totalDisplay = OUTPUT_RESULTS.querySelector('header span.total');
		totalDisplay.innerHTML = results.meta.results.total;

		const startDisplay = OUTPUT_RESULTS.querySelector('footer span.start');
		const startPosition = results.meta.paginator.size * (results.meta.paginator.page - 1) + 1;
		startDisplay.innerHTML = startPosition;

		const endDisplay = OUTPUT_RESULTS.querySelector('footer span.end');
		const endPosition = startPosition + results.data.length - 1;
		endDisplay.innerHTML = endPosition;

		const pageDisplay = OUTPUT_RESULTS.querySelector('footer span.page');
		pageDisplay.innerHTML = results.meta.paginator.page;

		const pagesDisplay = OUTPUT_RESULTS.querySelector('footer span.pages');
		pagesDisplay.innerHTML = results.meta.paginator.pages;

		if (results.meta.paginator.page > 1) {
			PAGE_PREVIOUS.classList.remove('off');
			PAGE_PREVIOUS.setAttribute('href', '#');
		} else {
			PAGE_PREVIOUS.classList.add('off');
			PAGE_PREVIOUS.removeAttribute('href');
		}

		if (results.meta.paginator.page < results.meta.paginator.pages) {
			PAGE_NEXT.classList.remove('off');
			PAGE_NEXT.setAttribute('href', '#');
		} else {
			PAGE_NEXT.classList.add('off');
			PAGE_NEXT.removeAttribute('href');
		}

		if (results.data.length > 0) {
			OUTPUT_RESULTS.classList.remove('hide');
			optionsDisplay.scrollTo(0, 0);
		} else {
			showNoResults();
		}
	};

	const search = (searchTerm) => {
		// console.log(searchTerm)
		const results = {
			data: []
		};
		for (let i = 0 ; i < dataSource.data.length ; i++) {
			const source = dataSource.data[i];
			if (source.label.toLowerCase().includes(searchTerm.toLowerCase())) {
				results.data.push(source);
			}
		}
		results.meta = {
			results: { total: dataSource.data.length, found: results.data.length },
			paginator: { pages: Math.ceil(results.data.length / dataSource.meta.paginator.size), page: dataSource.meta.paginator.page, size: dataSource.meta.paginator.size }
		}
		const startIndex = dataSource.meta.paginator.size * (dataSource.meta.paginator.page - 1);
		const endIndex = startIndex + dataSource.meta.paginator.size;
		results.data = results.data.slice(startIndex, endIndex);
		setTimeout(() => searchEnd(results), 500);
		// searchEnd(results);
	};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	const initListenners = () => {
		CURRENT.addEventListener('focus', currentOn.focus);
		CURRENT_X.addEventListener('click', currentXOn.click);
		INPUT.addEventListener('focus', inputOn.focus);
		INPUT.addEventListener('blur', inputOn.blur);
		INPUT.addEventListener('keyup', inputOn.keyUp);
		INPUT_X.addEventListener('click', inputXOn.click);
		PAGE_PREVIOUS.addEventListener('click', pagePreviousOn.click);
		PAGE_NEXT.addEventListener('click', pageNextOn.click);
		document.addEventListener('click', documentOn.click);
	};

	const init = (event) => {
		THIS = document.querySelector('search-component');
		CURRENT = document.querySelector('search-component input[readonly]');
		CURRENT_HIDDEN = document.querySelector('search-component input[type=hidden]');
		CURRENT_X = document.querySelector('search-component > section > label:first-child > a');
		INPUT = document.querySelector('search-component input:not([readonly]):not([type=hidden])');
		OUTPUT_RESULTS = document.querySelector('search-component output.results');
		OUTPUT_LOADING = document.querySelector('search-component output.loading');
		OUTPUT_NO_RESULTS = document.querySelector('search-component output.no-results');
		INPUT_X = document.querySelector('search-component > section > label:last-child > a');
		PAGE_PREVIOUS = document.querySelector('search-component footer div nav a:first-child');
		PAGE_NEXT = document.querySelector('search-component footer div nav a:last-child');
		initListenners();
		// currentOn.focus();
	};

	window.addEventListener('load', init);

})();
