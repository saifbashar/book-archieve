// variable declaration

const searchField = document.getElementById('search-value');
const searchBtn = document.getElementById('search-btn');
const totalResult = document.getElementById('total-result');
const bookList = document.getElementById('book-list');
const invalidInput = document.getElementById('invalid-input');
const noResult = document.getElementById('no-result');
const spinner = document.getElementById('spinner');

// api loader function
const bookLoader = async (url) => {
  showSpinner('show');
  const fetchData = await fetch(url);
  const res = await fetchData.json();
  return res;
};

// show  and hide spinners function

const showSpinner = (state) => {
  if (state.toLowerCase() === 'show') {
    spinner.style.display = 'block';
  } else {
    spinner.style.display = 'none';
  }
};

// clearing display fucntion
const clearDisplay = () => {
  totalResult.textContent = '';
  invalidInput.style.display = 'none';
  bookList.textContent = '';
  noResult.textContent = '';
};

// Display all books function

const displayBooks = (data) => {
  data.docs.forEach((book) => {
    const author = book?.author_name ? book.author_name.join(' , ') : 'unknown';
    const publishedYear = book?.first_publish_year
      ? book.first_publish_year
      : 'unknown';
    const publisher = book?.publisher ? book.publisher.join(' , ') : 'unknown';

    const imgUrl = book?.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : './images/NoImageFoun.png';

    const div = document.createElement('div');
    div.classList.add('col-12');
    div.classList.add('col-md-4');
    div.classList.add('col-lg-3');
    div.classList.add('my-3');

    div.innerHTML = `
          <div class="card h-100"  >
            <img src="${imgUrl}" class="card-img-top" height="400px" alt="...">
           <div class="card-body">
           <h5 class="card-title">${book.title}</h5>
           <p class="car d-text">By <span class="text-small text-danger">${author}</span></p>
           <p>Published in <span>${publishedYear}</span></p>
           <p><span class="fw-bold">Publisher:</span> <span>${publisher}</span></p>
           </div>
          </div>
            `;
    bookList.appendChild(div);
  });
};

// Event listener function
searchBtn.addEventListener('click', () => {
  clearDisplay();
  const searchValue = searchField.value;
  if (searchValue !== '') {
    const url = `https://openlibrary.org/search.json?q=${searchValue}`;
    bookLoader(url).then((data) => {
      showSpinner('hide');
      if (data.docs.length > 0) {
        totalResult.innerHTML = `
            <h6>${data.start + 1}-${data.docs.length} of over ${
          data.numFound
        } results for <span class="text-danger fw-bold">"${searchValue}"</span></h6>
              `;
        displayBooks(data);
      } else {
        showSpinner('hide');
        noResult.innerHTML = `
           <div class="text-danger fw-bold d-flex justify-content-center align-items-center my-auto ">  <h2>No Result Found!</h2></div>
          `;
      }
    });
  } else {
    invalidInput.style.display = 'block';
  }
  searchField.value = '';
});
