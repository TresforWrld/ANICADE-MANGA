const API = "https://api.jikan.moe/v4/manga";

const results = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");

const detailsPage = document.getElementById("detailsPage");
const readerPage = document.getElementById("readerPage");

let currentResults = [];
let currentManga = null;

/* ===== SEARCH ===== */

async function searchManga(query="action"){

loading.style.display="flex";
results.innerHTML="";

try{

const res = await fetch(`${API}?q=${query}&limit=20`);
const data = await res.json();

currentResults = data.data;

renderManga(currentResults);

}catch(e){

toast("Error loading manga");

}

loading.style.display="none";
}

/* ===== RENDER MANGA ===== */

function renderManga(list){

results.innerHTML="";

list.forEach(manga=>{

const card = document.createElement("div");
card.className="manga-card";

card.innerHTML=`

<img src="${manga.images.jpg.image_url}">

<div class="manga-info">
<div class="manga-title">${manga.title}</div>
<div class="manga-genre">${manga.type || "Manga"}</div>
</div>

`;

card.onclick = ()=>openDetails(manga);

results.appendChild(card);

});

}

/* ===== DETAILS PAGE ===== */

function openDetails(manga){

currentManga = manga;

document.getElementById("mangaDetailsWrapper").innerHTML = `

<h1>${manga.title}</h1>

<img src="${manga.images.jpg.large_image_url}" style="width:200px;margin:20px 0">

<p>${manga.synopsis || "No description available."}</p>

<button class="back-button" onclick="openReader()">Read Manga</button>

<button class="back-button" onclick="bookmarkManga()">Bookmark</button>

`;

document.querySelector(".main-container").style.display="none";
detailsPage.style.display="block";

}

/* ===== READER ===== */

function openReader(){

detailsPage.style.display="none";
readerPage.style.display="block";

document.getElementById("readerTitle").innerText=currentManga.title;

const body = document.getElementById("readerBody");

body.innerHTML="";

for(let i=0;i<10;i++){

const img=document.createElement("img");

img.src=currentManga.images.jpg.large_image_url;

body.appendChild(img);

}

}

/* ===== BACK BUTTONS ===== */

document.getElementById("backFromDetails").onclick=()=>{

detailsPage.style.display="none";
document.querySelector(".main-container").style.display="block";

};

document.getElementById("backFromReader").onclick=()=>{

readerPage.style.display="none";
detailsPage.style.display="block";

};

/* ===== SEARCH BUTTON ===== */

searchBtn.onclick=()=>{

const q = searchInput.value;

if(q.trim()==="") return;

searchManga(q);

};

/* ===== GENRE FILTER ===== */

document.querySelectorAll(".filter-btn").forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

const genre=btn.dataset.genre;

if(genre==="all"){

renderManga(currentResults);

}else{

const filtered=currentResults.filter(m=>
m.genres?.some(g=>g.name.toLowerCase().includes(genre))
);

renderManga(filtered);

}

};

});

/* ===== BOOKMARK ===== */

function bookmarkManga(){

let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

bookmarks.push(currentManga);

localStorage.setItem("bookmarks",JSON.stringify(bookmarks));

toast("Added to bookmarks");

}

/* ===== TOAST ===== */

function toast(msg){

const container=document.getElementById("toastContainer");

const t=document.createElement("div");

t.className="toast";
t.innerText=msg;

container.appendChild(t);

setTimeout(()=>{

t.remove();

},3000);

}

/* ===== INITIAL LOAD ===== */

searchManga("manga");