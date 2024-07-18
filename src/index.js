document.addEventListener('DOMContentLoaded', () => {
  fetchToys();
  setupFormToggle();
  setupFormSubmission();
});

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    });
}

function renderToy(toy) {
  const toyCollection = document.getElementById('toy-collection');

  const toyCard = document.createElement('div');
  toyCard.className = 'card';

  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  const likeButton = toyCard.querySelector('.like-btn');
  likeButton.addEventListener('click', () => {
    likeToy(toy);
  });

  toyCollection.appendChild(toyCard);
}

function setupFormToggle() {
  const newToyBtn = document.getElementById('new-toy-btn');
  const toyFormContainer = document.querySelector('.container');

  newToyBtn.addEventListener('click', () => {
    toyFormContainer.style.display = toyFormContainer.style.display === 'block' ? 'none' : 'block';
  });
}

function setupFormSubmission() {
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    addNewToy();
  });
}

function addNewToy() {
  const toyName = document.querySelector('[name="name"]').value;
  const toyImage = document.querySelector('[name="image"]').value;

  const newToy = {
    name: toyName,
    image: toyImage,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(toy => {
    renderToy(toy);
  });

  // Clear the form fields
  toyForm.reset();
}

function likeToy(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    const toyCard = document.getElementById(updatedToy.id).closest('.card');
    toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
  });
}
