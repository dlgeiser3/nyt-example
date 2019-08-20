const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = 'b2e02612e179494c9f1f57577b582a0a';
let url;

const searchTerm = document.querySelector('.search');     // all these refer to html locations
const startDate = document.querySelector('.start-date');  
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');   
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');
const section = document.querySelector('section');

nav.style.display = 'none';       //sets pagination to hide if no results serched

let pageNumber = 0;
// console.log('PageNumber:', pageNumber);              //sets search page to index 0
let displayNav = false;                                 // sets clean screen before results

searchForm.addEventListener('submit', fetchResults);        // adds event listeners 
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function fetchResults(e) {                      //Search parameters 
    // console.log(e);                          // bringing info to page instead of leaving page
    e.preventDefault();
    url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}`;
    console.log('URL:', url);

    if (startDate.value !== '') {
        console.log(startDate.value)                          //console.logs if there is somethings
        url += '&begin_date=' + startDate.value;              // if there is not something it will work
    }

    if (endDate.value !== '') {                             
        console.log(endDate.value)
        url += '&end_date=' + endDate.value;
    }

    fetch(url)
        .then(function (result) {                         //fetching and returning search 
            console.log(result)
            return result.json();
        })
        .then(function (json) {                         // checking json
            console.log(json);
            displayResults(json);
        })
}

function displayResults(json) {                      //displays JSON to readable
    // console.log('Display Results', json);
    // console.log(json.response.docs);

    while (section.firstChild) {
        section.removeChild(section.firstChild);   //REMOVES 1st child of sections & replaces
    }

    let articles = json.response.docs;   //Setting a variable for articles
    // console.log(articles);

    if (articles.length === 0) {           ///response for no results
        console.log('No results');
    } else {                                              //IF RESULTS START LOOP
        for (let i = 0; i < articles.length; i++) {            //sets variables and creates element in html within html tag
            // console.log(i);
            let article = document.createElement('article');
            let heading = document.createElement('h2');
            let link = document.createElement('a');
            let img = document.createElement('img');
            let para = document.createElement('p');
            let clearfix = document.createElement('div');

            let current = articles[i];                 //console logs current article
            console.log('Current:', current);

            link.href = current.web_url;                        // setting href to current article link      
            link.textContent = current.headline.main;           // setting the headline as the link

            para.textContent = 'Keywords: ';                // adds "keywords: ""


            for (let j = 0; j < current.keywords.length; j++) {         //sets span to be the same length as the word and adds keyword
                let span = document.createElement('span');
                span.textContent += current.keywords[j].value + ' ';
                para.appendChild(span);
            }

            if (current.multimedia.length > 0) {
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;    //If there is an article pull in image from nytimes and add url from current article
                img.alt = current.headline.main;                                    //If there is an article but no image insert headline as alt
            }

            clearfix.setAttribute('class', 'clearfix');         // fixing the margin and padding

            article.appendChild(heading);           // catch all to make sure something shows up if all else fails
            heading.appendChild(link);
            article.appendChild(img);
            article.appendChild(para);
            article.appendChild(clearfix);
            section.appendChild(article);
        }
    }

    if (articles.length === 10) {               //if there are 10 articles block display
        nav.style.display = 'block';
    } else {
        nav.style.display = 'none';           // if not no special display setting
    }
}

function nextPage(e) {
    // console.log('Next button clicked');
    pageNumber++;
    fetchResults(e);
    console.log('Page Number:', pageNumber);
}

function previousPage(e) {
    // console.log('Previous button clicked');
    if (pageNumber > 0) {
        pageNumber--;
        fetchResults(e);
    } else {
        return;
    }
    fetchResults(e);
    console.log('Page:', pageNumber);
}