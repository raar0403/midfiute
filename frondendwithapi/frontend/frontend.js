// Menü umschalten
const menu = document.getElementById('menu');
const menuToggle = document.getElementById('menu-toggle');
let menuOpen = false;
menuToggle.addEventListener('click', () => {
  menu.style.transform = menuOpen ? 'translateX(-260px)' : 'translateX(0)';
  menuOpen = !menuOpen;
});

// Alle Screens & Header-Titel
const screens = document.querySelectorAll('.screen');
const headerTitle = document.getElementById('header-title');

// Helper: Screen wechseln
function show(screenId, titleText) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  headerTitle.textContent = titleText;
  if (menuOpen){
    menu.style.transform = 'translateX(-260px)';
    menuOpen = false;
  }
  
}

// Menü-Buttons
document.querySelectorAll('#menu button[data-screen]').forEach(btn => {
  btn.addEventListener('click', () => {
    show(btn.getAttribute('data-screen'), btn.textContent);
  });
});

// Favoriten-Button im Header
document.getElementById('favorites-toggle').addEventListener('click', () => {
  show('favorites', 'Favoriten');
});

// Suche & Planen
document.getElementById('search-button').addEventListener('click', () => {
  show('results', 'Ergebnisse');
});


// Ergebnis → Detail
document.querySelectorAll(' .result-list button').forEach(btn => {
  btn.addEventListener('click', () => {
    const det = btn.getAttribute('data-detail');
    show('detail', 'Fahrplan-Details');
    document.querySelectorAll('#detail .connection-detail').forEach(d => d.style.display = 'none');
    document.getElementById(det).style.display = 'block';
  });
});



document.querySelectorAll(".ticket-list button, button.ticket-list").forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Ticket gekauft!')
  });
});
document.addEventListener("click", function(e){
  if(e.x>261){
    menu.style.transform = 'translateX(-260px)';
    menuOpen = false;
  };
  
});



const searchButton = document.getElementById('search-button');
const queryInput = document.getElementById('query');
const outputDiv = document.getElementById('output');
let outputtext;
const start_output = document.getElementById("start-output");
const end_output = document.getElementById("end-output");
function changeOutput(id){
  outputtext = document.getElementById(id);
}

document.getElementById('plan-button').addEventListener('click', async () => {
  let startend = { start: start_output.textContent, end: end_output.textContent };
  let startendids = [];
  let query;
  for (const element of Object.values(startend)) {
    const query = element; // Beispiel: Zugriff auf den Textinhalt
    if (!query) {
      return;
    }
    try {
      // Anfrage an den Proxy-Server senden
      const response = await fetch(`http://localhost:3000/api/locations?query=${encodeURIComponent(query)}&num=1&id=1`);
      if (!response.ok) {
        throw new Error(`Fehler: ${response.statusText}`);
      }
     
      const data = await response.json();
      startendids.push(data[0].id);

    } catch (err) {
      outputDiv.textContent = `Fehler: ${err.message}`;
    }
  }



  try {
    const from = startendids[0];
    const to = startendids[1];
    // Anfrage an den Proxy-Server senden
    const response = await fetch(`http://localhost:3000/api/route?from=${from}&to=${to}`);
    if (!response.ok) {
      throw new Error(`Fehler: ${response.statusText}`);
    }
    const data = await response.json();
    outputDiv.innerHTML = "";
    journeyedit(data)
  } catch (err) {
    outputDiv.textContent = `Fehler: ${err.message}`;
  }
  
show("results","Ergebnisse")
});





queryInput.addEventListener('keyup', async () => {
  const query = queryInput.value.trim();
  if (!query) {
    outputDiv.textContent = 'Bitte geben Sie eine Suchanfrage ein.';
    return;
  }

  try {
    // Anfrage an den Proxy-Server senden
    const response = await fetch(`http://localhost:3000/api/locations?query=${encodeURIComponent(query)}&num=${4}`);
    if (!response.ok) {
      throw new Error(`Fehler: ${response.statusText}`);
    }
    const data = await response.json();
    outputDiv.innerHTML = "";
    data.forEach(element => {
      let btn = document.createElement("button");
      btn.textContent = element;
      btn.classList = "choice";
      btn.id = element;
      outputDiv.appendChild(btn);

    });
    
    //outputDiv.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    outputDiv.textContent = `Fehler: ${err.message}`;
  }
});
outputDiv.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('choice')) {
     outputtext.textContent= event.target.textContent;
     show("planner","Routenplaner")
     queryInput.value = "";
     outputDiv.innerHTML = "";
  }
});
document.querySelectorAll(".start-input").forEach(input => {
  input.addEventListener("click", function(event) {
    show("search", "Start eingeben");
    changeOutput("start-output");
    
  });
});

document.querySelectorAll(".end-input").forEach(input => {
  input.addEventListener("click", function(event) {
    show("search", "Ziel eingeben");
    changeOutput("end-output");
  });
});
function journeyedit(journeyobj) {
  // Rendering
  const journey = journeyobj;
  const wrapper = document.querySelector('.journey');
  wrapper.innerHTML = ""; // Vorherige Inhalte löschen, um Duplikate zu vermeiden

  journey.journeys.forEach((entry, index) => {
    const journeyDiv = document.createElement('div');
    journeyDiv.className = 'journey-entry';

    const title = document.createElement('h2');
    title.textContent = `Route ${index + 1}`;
    btn = document.createElement("button")
    btn.textContent ="♥";
    btn.dataset.from = start_output.textContent
    btn.dataset.to = end_output.textContent
    const stops = entry.legs.map(leg => ({
      from: leg.origin.id,
      to: leg.destination.id,
      line: leg.line?.name
    }));
    btn.dataset.stops = JSON.stringify(stops) ;
    btn.classList = "fav-button"
    btn.addEventListener("click", function(event){
      console.log(btn.dataset)
      saveFavorite(btn.dataset)
    });


    journeyDiv.appendChild(title);
    journeyDiv.appendChild(btn)
    entry.legs.forEach((leg, i) => {
      const legDiv = document.createElement('div');
      legDiv.className = 'leg';

      const from = leg.origin?.name ?? 'Unbekannt';
      const to = leg.destination?.name ?? 'Unbekannt';

      // Abfahrts- und Ankunftszeiten formatieren
      const departure = leg.departure ? new Date(leg.departure).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Keine Angabe';
      const arrival = leg.arrival ? new Date(leg.arrival).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Keine Angabe';

      const line = leg.line?.name ?? 'Fußweg oder unbekannt';

      legDiv.innerHTML = `
        <div class="leg-detail">Von: ${from}</div>
        <div class="leg-detail">Nach: ${to}</div>
        <div class="leg-detail">Abfahrt: ${departure}</div>
        <div class="leg-detail">Ankunft: ${arrival}</div>
        <div class="leg-detail">Linie: ${line}</div>
      `;

      journeyDiv.appendChild(legDiv);
    });

    wrapper.appendChild(journeyDiv);
  });
}
function saveFavorite(fav) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites.push(fav);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  reload_fav()
}
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function deleteFavorite(matchFn) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => !matchFn(fav));
  localStorage.setItem('favorites', JSON.stringify(favorites));
  reload_fav()
}
function reload_fav(){
  const fav = getFavorites();
  const fav_wrapper = document.getElementById("result-list");
  fav_wrapper.innerHTML = "";
  fav.forEach(element=> {
    
    const btn = document.createElement("button")
    btn.textContent = `${element.from }   →  ${element.to}`
    btn.classList = "choice"
    fav_wrapper.appendChild(btn)
  });
}
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  reload_fav()
});