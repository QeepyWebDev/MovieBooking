<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'

class Movie {
    Title: string;
    Price: number;
    Poster: string;

    constructor(Title: string, Price: number, Poster: string) {
    this.Title = Title;
    this.Price = Price;
    this.Poster = Poster;
  }
} 

const selectedSeats = ref<number[]>([]); //Array för valda seats
const movies = ref<Movie[]>([]); //Array för filmerna
const selectedMovie = ref<Movie | null>(null); //Håller koll på vilken film är vald
const seatCount = ref(0); //Visar användaren hur många seats är valda
const totalPrice = ref(0); //Visar användaren totala priset
const selectedPrice = ref<number>(0); //Pris för den valda filmen
const showBooking = ref(false); //Boolean för att visa/dölja bokningsformuläret
const bookingConfirmed = ref(false); //Boolean för att visa/dölja bokningsbekräftelse
const firstName = ref(''); //Håller användarens info
const lastName = ref('');
const phoneNumber = ref('');
const email = ref('');

const route = useRoute()
console.log(route)

const fetchMovies = async () => {
const response = await fetch('https://gist.githubusercontent.com/QeepyWebDev/da4075d9c46edcf00e444d4b4aae78df/raw/df61573e40eeb2b012aa36c60b23692064a1ce8f/my-movies.json'); //Hämtar filmerna
const movieData: Movie[] = await response.json(); //Filmerna lagras i en array

  movies.value = movieData.map(movie => 
    new Movie(
      movie.Title, 
      movie.Price, 
      movie.Poster
    )
  );
};

const resetSelectedSeats = () => {
  selectedSeats.value = []; //Tömmer arrayen

  const seats = document.querySelectorAll<HTMLElement>(".seat.selected"); //Hämtar alla element med klasserna .seat och .selected
  seats.forEach(seat => seat.classList.remove("selected")); //Tar bort "selected"-klaseen från alla seats

  totalPrice.value = 0; //Nollar totalpris och valda seats
  seatCount.value = 0;
}

const updateSelectedMovie = (event: Event) => {
  resetSelectedSeats(); //Kallar på denna metod för att återställa allting när användaren väljer en annan film, annars blir det konstigt.
  bookingConfirmed.value = false;

  selectedPrice.value = Number((event.target as HTMLSelectElement).value); //Uppdaterar den valda filmen när användaren interagerar med select-elementet.
  selectedMovie.value = movies.value.find(movie => movie.Price === selectedPrice.value) || null; //Var tvungen att använda pris istället för titel för att filtrera eftersom jag inte kunde få det att funka med titel.
};

const toggleSeatSelection = (seat: HTMLElement) => { //Funktion som lägger till/tar bort seats från arrayen utifrån data-seat-id
  const seatId = Number(seat.getAttribute("data-seat-id"));

  if (selectedSeats.value.includes(seatId)) {
        selectedSeats.value = selectedSeats.value.filter(id => id !== seatId);
        seat.classList.remove("selected"); //Tar bort "selected"-klassen om användaren klickar på en redan vald seat
        seatCount.value--;
        totalPrice.value = totalPrice.value - selectedPrice.value;
      } else {
        selectedSeats.value.push(seatId);
        seat.classList.add("selected"); //Lägger till "selected klassen" om användaren klickar på en ny seat
        seatCount.value++;
        totalPrice.value = (totalPrice.value + selectedPrice.value);
      }
    };

const closeBooking = () => {
  showBooking.value = false;
};

const handleFormSubmit = () => {
  if (firstName.value && lastName.value && phoneNumber.value && email.value) {
    bookingConfirmed.value = true;
    firstName.value = '';
    lastName.value = '';
    phoneNumber.value = '';
    email.value = '';
  } else {
    alert('Please fill in all fields.');
  }
};

onMounted(() => { //använder onMounted för att låta allting ladda i DOM innan något görs för att undvika null errors
    fetchMovies();    

    const seats = document.querySelectorAll<HTMLElement>(".seat"); //Hämtar alla element med klassen ".seat"

    seats.forEach(seat => { //for-each loop som lägger till on click event till alla seats
      seat.addEventListener("click", () => toggleSeatSelection(seat));
  });
});
</script>

<template>
  <body>
    <div v-if="showBooking" class="booking-overlay" @click.self="closeBooking">
      <div class="booking-content">
        <div class="form-container">
          <p>You chose {{ seatCount }} seats for a total of {{ totalPrice }} SEK for the movie {{ selectedMovie?.Title }}.</p>
          <form @submit.prevent="handleFormSubmit">
            <div class="form-group"> <!-- Enkel form för bokning -->
              <label for="firstName">First Name:</label>
              <input type="text" id="firstName" v-model="firstName" required /> <!-- v-model används för att binda fältet till respektive data -->
            </div>

            <div class="form-group">
              <label for="lastName">Last Name:</label>
              <input type="text" id="lastName" v-model="lastName" required />
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number:</label>
              <input type="tel" id="phoneNumber" v-model="phoneNumber" required />
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email" required />
            </div>

            <button type="submit">Confirm</button>
            <button id="cancelButton" type="button" @click="closeBooking">Cancel</button>
          </form>
    <h3 id="bookingConfirmed" v-if="bookingConfirmed===true"> Thank you for booking, we hope you enjoy the movie! </h3>
    </div>
      </div>
        </div>

    <div class="imageContainer">
      <img v-if="selectedMovie" :src="selectedMovie.Poster" alt="Movie Poster" /> <!-- Om en film är vald kommer filmens affish att visas -->
    </div>
    <div class="movie-container">
      <label for="movie">Pick a movie:</label>
      <select name="movie" id="movie" @change="updateSelectedMovie">
        <!-- Vue använder ":key="movie.title" för att urskilja filmerna genom titel och :value för att binda movie.price till value. Viktigt eftersom value är vad som skickas in med submit -->
        <option :value="null" disabled selected>Select a movie</option>
        <option 
          v-for="movie in movies" 
          :key="movie.Title" 
          :value="movie.Price" 
        >
          {{ movie.Title }} ({{ movie.Price }} kr)
        </option>
      </select>
    </div>
    <ul class="showcase">
      <li>
        <div class="seat"></div>
        <small>N/A</small>
      </li>
      <li>
        <div class="seat selected"></div>
        <small>Selected</small>
      </li>
      <li>
        <div class="seat occupied"></div>
        <small>Occupied</small>
      </li>
    </ul>
    <div class="container">
      <div class="screen"></div>
      <div class="row">
        <div class="seat" data-seat-id="1"></div>
        <div class="seat" data-seat-id="2"></div>
        <div class="seat" data-seat-id="3"></div>
        <div class="seat" data-seat-id="4"></div>
        <div class="seat" data-seat-id="5"></div>
        <div class="seat" data-seat-id="6"></div>
        <div class="seat" data-seat-id="7"></div>
        <div class="seat" data-seat-id="8"></div>
      </div>
      <div class="row">
        <div class="seat" data-seat-id="9"></div>
        <div class="seat" data-seat-id="10"></div>
        <div class="seat" data-seat-id="11"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat" data-seat-id="12"></div>
        <div class="seat" data-seat-id="13"></div>
        <div class="seat" data-seat-id="14"></div>
      </div>
      <div class="row">
        <div class="seat" data-seat-id="15"></div>
        <div class="seat" data-seat-id="16"></div>
        <div class="seat" data-seat-id="17"></div>
        <div class="seat" data-seat-id="18"></div>
        <div class="seat" data-seat-id="19"></div>
        <div class="seat" data-seat-id="20"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
      </div>
      <div class="row">
        <div class="seat" data-seat-id="21"></div>
        <div class="seat" data-seat-id="22"></div>
        <div class="seat" data-seat-id="23"></div>
        <div class="seat" data-seat-id="24"></div>
        <div class="seat" data-seat-id="25"></div>
        <div class="seat" data-seat-id="26"></div>
        <div class="seat" data-seat-id="27"></div>
        <div class="seat" data-seat-id="28"></div>
      </div>
      <div class="row">
        <div class="seat" data-seat-id="29"></div>
        <div class="seat" data-seat-id="30"></div>
        <div class="seat" data-seat-id="31"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat" data-seat-id="32"></div>
        <div class="seat" data-seat-id="33"></div>
        <div class="seat" data-seat-id="34"></div>
      </div>
      <div class="row">
        <div class="seat" data-seat-id="35"></div>
        <div class="seat" data-seat-id="36"></div>
        <div class="seat" data-seat-id="37"></div>
        <div class="seat" data-seat-id="38"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat" data-seat-id="39"></div>
      </div>
    </div>
    <p class="text">
      You have selected <span id="count">{{ seatCount }}</span> seats for a price of SEK <span id="total">{{ totalPrice }}</span>
    </p>
    <button id="bookButton" @click="showBooking = true">Book seats</button>
  </body>

  <RouterView />
</template>
