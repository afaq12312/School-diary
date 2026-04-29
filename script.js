const fields = {
  class: ["classInput", "classOut"],
  eng: ["engInput", "eng"],
  math: ["mathInput", "math"],
  sci: ["sciInput", "sci"],
  gk: ["gkInput", "gk"],
  sst: ["sstInput", "sst"],
  urdu: ["urduInput", "urdu"],
  isl: ["islInput", "isl"],
  notes: ["notesInput", "notes"]
};

const $ = (id) => document.getElementById(id);

function displayValue(value) {
  return value.trim() || "-";
}

function setToday() {
  const today = new Date();

  $("date").textContent = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  $("day").textContent = today.toLocaleDateString("en-US", {
    weekday: "long"
  });
}

function generateDiary() {
  setToday();

  Object.values(fields).forEach(([inputId, outputId]) => {
    $(outputId).textContent = displayValue($(inputId).value);
  });
}

async function downloadDiary() {
  const diary = $("diary");

  if (!window.html2canvas) {
    window.print();
    return;
  }

  const canvas = await window.html2canvas(diary, {
    backgroundColor: "#ffffff",
    scale: Math.max(2, window.devicePixelRatio || 1)
  });

  const link = document.createElement("a");
  link.download = `daily-homework-diary-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function clearForm() {
  $("diaryForm").reset();
  generateDiary();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("diaryForm").addEventListener("submit", (event) => {
    event.preventDefault();
    generateDiary();
  });

  $("downloadBtn").addEventListener("click", downloadDiary);
  $("clearBtn").addEventListener("click", clearForm);

  Object.values(fields).forEach(([inputId]) => {
    $(inputId).addEventListener("input", generateDiary);
  });

  generateDiary();
  registerServiceWorker();
});
