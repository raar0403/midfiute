// Menü umschalten
const menu = document.getElementById('menu');
const menuToggle = document.getElementById('menu-toggle');
let menuOpen = false;
let selectedDateTime = new Date();
let selectedType = 'Abfahrt';
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
  let startend = [ {start: start_output.textContent, end: end_output.textContent}, {start: start_output.textContent, end: end_output.textContent}];
  journeyedit(startend)
show("results","Ergebnisse")
});





queryInput.addEventListener('keyup', async () => {
  const query = queryInput.value.trim();
      const endungen = ["","ZOB", "HBF"]
      outputDiv.innerHTML= ""
      endungen.forEach(element =>{
        let btn = document.createElement("button");
        btn.textContent = `${query} ${element}`;
        btn.classList = "choice";
        btn.id = element;
        outputDiv.appendChild(btn);
      })
      

    });
    
    //outputDiv.textContent = JSON.stringify(data, null, 2);
 
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

  journey.forEach((entry, index) => {
    const journeyDiv = document.createElement('div');
    journeyDiv.className = 'journey-entry';

    const title = document.createElement('h2');
    title.textContent = `Route ${index + 1}`;
    btn = document.createElement("button")
    btn.textContent ="Favorit Hinzufügen ♥";
    btn.classList = "choice";
    
    btn.dataset.from = start_output.textContent
    btn.dataset.to = end_output.textContent
  
   // btn.classList = "fav-button"
    btn.addEventListener("click", function(event){
      
      saveFavorite(btn.dataset)
    });

   
    journeyDiv.appendChild(title);
    journeyDiv.appendChild(btn)
    
      const legDiv = document.createElement('div');
      legDiv.className = 'leg';

      const from = entry.start;
      const to = entry.end;

      // Abfahrts- und Ankunftszeiten formatieren
      let start_time;
      let end_time;
      const travel_time = 3*Math.random()
      if(selectedType==="Ankunft"){
        start_time = addHoursToDateString(selectedDateTime,(-travel_time))
        end_time = selectedDateTime
      }else{
        start_time = selectedDateTime
        end_time = addHoursToDateString(selectedDateTime,travel_time)

      }
      const departure = start_time ? new Date(start_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Keine Angabe';
      const arrival = end_time ? new Date(end_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Keine Angabe';

      const line =  'Bus';
      
      legDiv.innerHTML = `
        <div class="leg-detail">Von: ${from}</div>
        <div class="leg-detail">Nach: ${to}</div>
        <div class="leg-detail">Abfahrt: ${departure}</div>
        <div class="leg-detail">Ankunft: ${arrival}</div>
        <div class="leg-detail">Linie: ${line}</div>
      `;

      journeyDiv.appendChild(legDiv);
      console.log(selectedDateTime,selectedType)
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
    const mini_wrapper = document.createElement("div")
    btn.textContent = `${element.from }   →  ${element.to}`
    btn.classList = "choice"
    const rmv_btn = document.createElement("button");
    rmv_btn.classList = "choice";
    rmv_btn.style.backgroundColor = "white"
    rmv_btn.textContent = "❌"
    mini_wrapper.style.display = "flex";
mini_wrapper.style.flexDirection = "row";
rmv_btn.addEventListener("click",()=>{
  deleteFavorite(fav => fav.from === element.from && fav.to === element.to);
});
btn.addEventListener("click",()=>{
start_output.textContent = element.from;
end_output.textContent = element.to;
show("planner","Routenplaner");
});
    
    mini_wrapper.appendChild(btn)
    
    mini_wrapper.appendChild(rmv_btn)

    fav_wrapper.appendChild(mini_wrapper)
  });
}
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  reload_fav()
selectedDateTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }));

});

//Uhrzeit Script

(function(){
  const btn = document.getElementById('dt-btn');
  const overlay = document.getElementById('dt-overlay');
  const yearSel = document.getElementById('dt-year');
  const monthSel = document.getElementById('dt-month');
  const daySel = document.getElementById('dt-day');
  const hourSel = document.getElementById('dt-hour');
  const minSel = document.getElementById('dt-minute');
  const confirm = document.getElementById('dt-confirm');
  const btnMain = document.getElementById('dt-btn');



  
  // Helper: zwei Stellen
  const pad = n => n.toString().padStart(2,'0');

  // ISO mit Offset +02:00
  function toLocalISO(d){
    const tz = -d.getTimezoneOffset();
    const sign = tz >= 0 ? '+' : '-';
    const h = pad(Math.floor(Math.abs(tz)/60));
    const m = pad(Math.abs(tz)%60);
    return d.getFullYear()+'-'
      +pad(d.getMonth()+1)+'-'
      +pad(d.getDate())+'T'
      +pad(d.getHours())+':'
      +pad(d.getMinutes())+':'
      +pad(d.getSeconds())
      +sign+ h +':' + m;
  }

  // Menschlich lesbares Format
  function toHumanReadable(d) {
    return d.toLocaleString('de-DE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Fülle Selects
  function fillSelects(now){
    const y0 = now.getFullYear();
    [y0, y0+1].forEach(y=>{
      let o = new Option(y,y);
      yearSel.add(o);
    });
    for(let m=1; m<=12; m++){
      let o = new Option(pad(m), m);
      monthSel.add(o);
    }
    for(let h=0; h<24; h++){
      let o = new Option(pad(h), h);
      hourSel.add(o);
    }
    for(let m=0; m<60; m+=5){
      let o = new Option(pad(m), m);
      minSel.add(o);
    }
    yearSel.value = now.getFullYear();
    monthSel.value = now.getMonth()+1;
    updateDays();
    daySel.value = now.getDate();
    hourSel.value = now.getHours();
    minSel.value = Math.floor(now.getMinutes()/5)*5;
  }

  // Tage-Select je Monat/Jahr anpassen
  function updateDays(){
    const y = +yearSel.value;
    const m = +monthSel.value;
    const days = new Date(y, m, 0).getDate();
    daySel.innerHTML = '';
    for(let d=1; d<=days; d++){
      let o = new Option(pad(d), d);
      daySel.add(o);
    }
  }

  // Event-Listener
  btn.addEventListener('click', ()=>{
    overlay.classList.add('active');
  });
  overlay.addEventListener('click', e=>{
    if(e.target===overlay) overlay.classList.remove('active');
  });
  yearSel.addEventListener('change', updateDays);
  monthSel.addEventListener('change', updateDays);
  confirm.addEventListener('click', ()=>{
    const d = new Date(
      yearSel.value,
      monthSel.value-1,
      daySel.value,
      hourSel.value,
      minSel.value
    );
    const iso = toLocalISO(d);
    const humanReadable = toHumanReadable(d);
    btn.textContent = humanReadable; // Setze den Button-Text auf das lesbare Format
   
    overlay.classList.remove('active');
  });
// Typ-Switch Logik
const btnArrival   = document.getElementById('dt-arrival');
const btnDeparture = document.getElementById('dt-departure');


const typeButtons = document.querySelectorAll('#dt-type-switch .dt-type');
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // entferne überall .active, setze nur beim geklickten
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedType = btn.textContent;
 
  });
});


// Extend OK-Button handler
confirm.addEventListener('click', () => {
  // bestehende ISO-Erzeugung
  const d = new Date(
    yearSel.value, monthSel.value-1, daySel.value,
    hourSel.value, minSel.value
  );
  selectedDateTime = d;
  const iso = toLocalISO(d);
  // Log Typ + Zeit

  // Schließe Picker
  overlay.classList.remove('active');
});

// Add-Time Buttons Logik (mit Picker-Update)
document.querySelectorAll('.dt-add').forEach(btn => {
  btn.addEventListener('click', () => {
    const mins = parseInt(btn.dataset.minutes, 10);
    // Basis = aktueller Picker-Zustand
    let d = new Date(
      +yearSel.value,
      +monthSel.value - 1,
      +daySel.value,
      +hourSel.value,
      +minSel.value
    );
    // Minuten addieren (handles overflow)
    d.setMinutes(d.getMinutes() + mins);
    // Picker-Selects aktualisieren
    yearSel.value   = d.getFullYear();
    monthSel.value  = d.getMonth() + 1;
    updateDays();           // Tag-Select neu befüllen
    daySel.value    = d.getDate();
    hourSel.value   = d.getHours();
    minSel.value    = d.getMinutes();
    // Oberen Button-Text aktualisieren
    const newIso = toLocalISO(d);
    btnMain.textContent = newIso;  // btnMain = dein dt-btn
 
  });
});


  // Initialisierung
  const now = new Date();
  fillSelects(now);
  btn.textContent = 'Jetzt ⌄'; // Standardtext für die aktuelle Zeit
})();
function addHoursToDateString(dateString, floatHours) {
  const date = new Date(dateString); 
  const addedMilliseconds = floatHours * 60 * 60 * 1000; 
  date.setTime(date.getTime() + addedMilliseconds); 
  return date.toString(); 
}