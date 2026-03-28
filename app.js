let data = JSON.parse(localStorage.getItem("pallets")) || [];

function opslaan() {
  let aantal = document.getElementById("aantal").value;
  let type = document.getElementById("type").value;
  let locatie = document.getElementById("locatie").value;

  if (!aantal) return alert("Vul aantal in");

  data.push({
    aantal: parseInt(aantal),
    type,
    locatie
  });

  localStorage.setItem("pallets", JSON.stringify(data));

  document.getElementById("aantal").value = "";

  update();
}

function update() {
  let lijst = document.getElementById("lijst");
  lijst.innerHTML = "";

  let totaal = 0;
  let epal = 0;
  let dpb = 0;

  data.forEach((item, index) => {
    totaal += item.aantal;

    if (item.type === "EPAL") epal += item.aantal;
    if (item.type === "DPB") dpb += item.aantal;

    let li = document.createElement("li");
    li.innerHTML = `
      ${item.aantal} - ${item.type} (${item.locatie})
      <button onclick="verwijder(${index})">❌</button>
    `;
    lijst.appendChild(li);
  });

  document.getElementById("totaal").textContent = totaal;
  document.getElementById("epal").textContent = epal;
  document.getElementById("dpb").textContent = dpb;
}

function verwijder(index) {
  data.splice(index, 1);
  localStorage.setItem("pallets", JSON.stringify(data));
  update();
}

update();
