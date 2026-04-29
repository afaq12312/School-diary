const CLASS_GROUPS = {
  nursery: {
    label: "Nursery",
    subjects: [
      { key: "eng", label: "English" },
      { key: "math", label: "Math" },
      { key: "urdu", label: "اردو", urdu: true },
      { key: "gk", label: "General Knowledge" },
      { key: "notes", label: "نوٹس اور یاددہانی", urdu: true, isNotes: true }
    ]
  },
  prep: {
    label: "Prep",
    subjects: [
      { key: "eng", label: "English" },
      { key: "math", label: "Math" },
      { key: "urdu", label: "اردو", urdu: true },
      { key: "gk", label: "General Knowledge" },
      { key: "notes", label: "نوٹس اور یاددہانی", urdu: true, isNotes: true }
    ]
  },
  one_to_four: {
    label: "One to Four",
    subjects: [
      { key: "eng", label: "English" },
      { key: "math", label: "Math" },
      { key: "urdu", label: "اردو", urdu: true },
      { key: "sci", label: "Science" },
      { key: "isl", label: "اسلامیات", urdu: true },
      { key: "sst", label: "Social Study" },
      { key: "notes", label: "نوٹس اور یاددہانی", urdu: true, isNotes: true }
    ]
  },
  five: {
    label: "Five",
    subjects: [
      { key: "eng", label: "English" },
      { key: "math", label: "Math" },
      { key: "urdu", label: "اردو", urdu: true },
      { key: "sci", label: "Science" },
      { key: "isl", label: "اسلامیات", urdu: true },
      { key: "sstu", label: "سوشل اسٹڈی", urdu: true },
      { key: "notes", label: "نوٹس اور یاددہانی", urdu: true, isNotes: true }
    ]
  },
  six_seven: {
    label: "Six and Seven",
    subjects: [
      { key: "eng", label: "English" },
      { key: "math", label: "Math" },
      { key: "urdu", label: "اردو", urdu: true },
      { key: "sci", label: "Science" },
      { key: "isl", label: "اسلامیات", urdu: true },
      { key: "tq", label: "ترجمۃ القرآن", urdu: true },
      { key: "notes", label: "نوٹس اور یاددہانی", urdu: true, isNotes: true }
    ]
  },
  pre9: {
    label: "Pre-9th",
    subjects: [
      { key: "eng", label: "English" },
      { key: "math", label: "Math" },
      { key: "urdu", label: "اردو", urdu: true },
      { key: "sci", label: "Science" },
      { key: "cs", label: "Computer Science" },
      { key: "isl", label: "اسلامیات", urdu: true },
      { key: "tq", label: "ترجمۃ القرآن", urdu: true },
      { key: "notes", label: "نوٹس اور یاددہانی", urdu: true, isNotes: true }
    ]
  },
  nine_ten: {
    label: "9th and 10th",
    subjects: [
      { key: "eng", label: "English" },
      { key: "math", label: "Math" },
      { key: "urdu", label: "اردو", urdu: true },
      { key: "sciu", label: "سائنس", urdu: true },
      { key: "cs", label: "Computer Science" },
      { key: "edu", label: "ایجوکیشن", urdu: true },
      { key: "isl", label: "اسلامیات", urdu: true },
      { key: "tq", label: "ترجمۃ القرآن", urdu: true },
      { key: "notes", label: "نوٹس اور یاددہانی", urdu: true, isNotes: true }
    ]
  }
};

const $ = (id) => document.getElementById(id);

function displayValue(value) {
  return value.trim() || "-";
}

function setToday() {
  const today = new Date();
  $("date").textContent = today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  $("day").textContent = today.toLocaleDateString("en-US", { weekday: "long" });
}

function populateClassGroups() {
  const select = $("classGroup");
  Object.entries(CLASS_GROUPS).forEach(([value, group]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = group.label;
    select.append(option);
  });
}

function createInputField(subject) {
  const label = document.createElement("label");
  const title = document.createElement("span");
  title.textContent = subject.label;

  const input = document.createElement(subject.isNotes ? "textarea" : "input");
  input.id = `input-${subject.key}`;
  input.dataset.subjectKey = subject.key;
  if (!subject.isNotes) {
    input.type = "text";
    input.placeholder = subject.urdu ? "کام کی تفصیل" : "Homework details";
  } else {
    input.rows = 4;
    input.placeholder = subject.urdu ? "نوٹس یا یاددہانی" : "Notes or reminders";
  }

  if (subject.urdu) {
    input.classList.add("urdu-input");
  }

  label.append(title, input);
  return label;
}

function renderSubjectEditors() {
  const groupKey = $("classGroup").value;
  const subjects = CLASS_GROUPS[groupKey].subjects;
  const subjectFields = $("subjectFields");
  subjectFields.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "field-grid";

  subjects.forEach((subject) => {
    if (subject.isNotes) {
      const wrap = document.createElement("div");
      wrap.className = "notes-field";
      wrap.append(createInputField(subject));
      subjectFields.append(wrap);
      return;
    }

    grid.append(createInputField(subject));
  });

  subjectFields.prepend(grid);

  subjectFields.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", generateDiary);
  });
}

function generateDiary() {
  setToday();

  $("classOut").textContent = displayValue($("classInput").value);

  const groupKey = $("classGroup").value;
  const subjects = CLASS_GROUPS[groupKey].subjects;
  const tbody = $("subjectsTableBody");
  tbody.innerHTML = "";

  subjects.forEach((subject) => {
    if (subject.isNotes) {
      const noteVal = $("input-notes").value || "";
      $("notes").textContent = displayValue(noteVal);
      $("notesHeading").textContent = subject.label;
      $("notes").className = subject.urdu ? "urdu" : "";
      return;
    }

    const tr = document.createElement("tr");
    const tdSubject = document.createElement("td");
    const tdHomework = document.createElement("td");

    tdSubject.textContent = subject.label;
    tdHomework.textContent = displayValue($("input-" + subject.key).value);

    if (subject.urdu) {
      tdSubject.classList.add("urdu");
      tdHomework.classList.add("urdu");
    }

    tr.append(tdSubject, tdHomework);
    tbody.append(tr);
  });
}

async function downloadDiary() {
  const diary = $("diary");
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
  renderSubjectEditors();
  generateDiary();
}

document.addEventListener("DOMContentLoaded", () => {
  populateClassGroups();
  renderSubjectEditors();

  $("classGroup").addEventListener("change", () => {
    renderSubjectEditors();
    generateDiary();
  });

  $("diaryForm").addEventListener("submit", (event) => {
    event.preventDefault();
    generateDiary();
  });

  $("classInput").addEventListener("input", generateDiary);
  $("downloadBtn").addEventListener("click", downloadDiary);
  $("clearBtn").addEventListener("click", clearForm);

  generateDiary();
});
