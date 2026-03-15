const PILLARS = [
  {
    id: "V",
    name: "Vitalidad",
    color: "#10b981",
    desc: "El motor biológico: Sueño, nutrición, ejercicio",
  },
  {
    id: "M",
    name: "Mente",
    color: "#3b82f6",
    desc: "El procesador: Aprendizaje, lectura, pensamiento",
  },
  {
    id: "E",
    name: "Emoción",
    color: "#ec4899",
    desc: "El regulador: Gestión emocional, autoconocimiento",
  },
  {
    id: "S",
    name: "Social",
    color: "#8b5cf6",
    desc: "El soporte: Conexiones humanas, comunidad",
  },
  {
    id: "T",
    name: "Trascendencia",
    color: "#f59e0b",
    desc: "El propósito: Conexión espiritual, sentido",
  },
  {
    id: "O",
    name: "Ocio",
    color: "#f43f5e",
    desc: "La válvula: Creatividad, juego, descanso",
  },
  {
    id: "F",
    name: "Finanzas",
    color: "#6366f1",
    desc: "La seguridad: Estabilidad material",
  },
  {
    id: "W",
    name: "Trabajo",
    color: "#14b8a6",
    desc: "La expresión: Trabajo significativo",
  },
];

const container = document.getElementById("pillars-container");
const liquid = document.getElementById("liquid-container");
const tooltip = document.getElementById("tooltip");
const btnSeal = document.getElementById("btn-seal");
let droppedCount = 0;

// Inicializar Estante
PILLARS.forEach((p) => {
  const el = document.createElement("div");
  el.className = "sphere";
  el.id = p.id;
  el.draggable = true;
  el.innerText = p.id;
  el.style.backgroundColor = p.color;

  el.addEventListener("mouseover", (e) => showTooltip(e, p.desc));
  el.addEventListener("mouseout", hideTooltip);
  el.addEventListener("dragstart", (e) => e.dataTransfer.setData("text", p.id));

  container.appendChild(el);
});

// Lógica de Soltado (Drop)
const testTube = document.getElementById("test-tube");
testTube.addEventListener("dragover", (e) => e.preventDefault());

testTube.addEventListener("drop", (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData("text");
  const pillar = PILLARS.find((p) => p.id === id);
  const original = document.getElementById(id);

  if (pillar && !original.classList.contains("used")) {
    const segment = document.createElement("div");
    segment.className = "liquid-segment";
    segment.style.backgroundColor = pillar.color;
    segment.style.opacity = "0.6";
    liquid.appendChild(segment);

    original.classList.add("used");
    droppedCount++;

    if (droppedCount === 8) btnSeal.classList.remove("hidden");
  }
});

// Funciones Auxiliares
function showTooltip(e, text) {
  tooltip.innerText = text;
  tooltip.classList.remove("hidden");
  tooltip.style.left = e.pageX + 15 + "px";
  tooltip.style.top = e.pageY - 15 + "px";
}

function hideTooltip() {
  tooltip.classList.add("hidden");
}

// Evento del Botón
btnSeal.addEventListener("click", () => {
  const pilaresSeleccionados = Array.from(
    document.querySelectorAll(".used"),
  ).map((el) => el.id);
  sellarExperimento(pilaresSeleccionados);
});

// FUNCIÓN DE CONEXIÓN CON GITHUB ACTIONS
async function sellarExperimento(datosDelDia) {
  // Configuración de tu laboratorio
  const USUARIO = "parracristianc";
  const REPO = "feel-data"; // El repositorio donde está el .yml y data.json

  // Pedimos el token solo en el momento del envío para no guardarlo en el código
  const TOKEN = prompt(
    "Introduce tu llave de laboratorio (GitHub Token) para sellar el registro:",
  );

  if (!TOKEN) return;

  const URL = `https://api.github.com/repos/${USUARIO}/${REPO}/dispatches`;

  // Cambiamos el estado del botón visualmente
  btnSeal.innerText = "Sellar Experimento... 🧪";
  btnSeal.disabled = true;

  const payload = {
    event_type: "nuevo_registro",
    client_payload: {
      date: new Date().toLocaleDateString(),
      data: {
        fecha: new Date().toISOString(),
        timestamp: Math.floor(Date.now() / 1000),
        mezcla: datosDelDia,
      },
    },
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert(
        "✨ ¡Experimento enviado! Tu mezcla de hoy se está procesando en 'feel-data'.",
      );
      location.reload();
    } else {
      const errorData = await response.json();
      console.error("Error de GitHub:", errorData);
      alert(
        "Error: No se pudo conectar con el laboratorio. Verifica tu Token.",
      );
      btnSeal.innerText = "Sellar Experimento 🧪";
      btnSeal.disabled = false;
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Falla de conexión. Inténtalo de nuevo.");
    btnSeal.innerText = "Sellar Experimento 🧪";
    btnSeal.disabled = false;
  }
}
