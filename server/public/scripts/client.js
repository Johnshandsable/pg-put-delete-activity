$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $(document).on('click', '.deleteBtn', deleteBook);
  $(document).on('click', '.updateBtn', updateBook);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit(event) {
  event.preventDefault();
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  })
    .then(function (response) {
      console.log('Response from server.', response);
      refreshBooks();
    })
    .catch(function (error) {
      console.log('Error in POST', error);
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
  })
    .then(function (response) {
      console.log(response);
      renderBooks(response);
    })
    .catch(function (error) {
      console.log('error in GET', error);
    });
}

// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="deleteBtn" data-id="${books[i].id}">DELETE</button></td>
        <td><button class="updateBtn" data-id="${books[i].id}">UPDATE</button></td>
      </tr>
    `);
  }
}

function deleteBook(event) {
  event.preventDefault();
  console.log('CLIENT - inside deleteBook');
  /*
    Makes a DELETE request to the server at /books/delete/id
    Should delete a book in the server if deleteBtn is clicked
  */
  console.log($(this).data('id')); // To identify if what is being clicked is what we want
  const bookId = $(this).data('id');
  $.ajax({
    type: 'DELETE',
    url: `/books/delete/${bookId}`,
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log('error in DELETE', error);
    });
  refreshBooks();
}

function updateBook() {
  /*
  Makes a PUT request to /books/put/id
  Should update a book as isRead on server side
  */
  console.log('CLIENT - inside updateBook');
  const bookId = $(this).data('id');

  $.ajax({
    type: 'PUT',
    url: `/books/put/${bookId}`,
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log('error in PUT', error);
    });
  refreshBooks();
}
