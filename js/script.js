// Utility functions
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Admin Login Validation
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (role === "admin" && username === "admin" && password === "1234") {
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials!");
  }
});

// Render Students
function renderStudents() {
  const table = document.getElementById("studentsTable")?.querySelector("tbody");
  if (!table) return;
  table.innerHTML = "";
  const students = loadData("students");

  students.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>
        <button onclick='editStudent(${JSON.stringify(s)})'>Edit</button>
        <button onclick='deleteStudent(${s.id})'>Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Edit Student
function editStudent(student) {
  document.getElementById("studentId").value = student.id;
  document.getElementById("studentName").value = student.name;
  document.getElementById("studentClass").value = student.class;
  openModal();
}

// Add/Update Student
document.getElementById("studentForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById("studentId").value);
  const name = document.getElementById("studentName").value;
  const className = document.getElementById("studentClass").value;

  let students = loadData("students");
  if (id) {
    const index = students.findIndex(s => s.id === id);
    students[index] = { id, name, class: className };
  } else {
    students.push({ id: Date.now(), name, class: className });
  }

  saveData("students", students);
  closeModal();
  renderStudents();
});

// Delete Student
function deleteStudent(id) {
  let students = loadData("students");
  students = students.filter(s => s.id !== id);
  saveData("students", students);
  renderStudents();
}

// Render Teachers
function renderTeachers() {
  const table = document.getElementById("teachersTable")?.querySelector("tbody");
  if (!table) return;
  table.innerHTML = "";
  const teachers = loadData("teachers");

  teachers.forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.subject}</td>
      <td>
        <button onclick='editTeacher(${JSON.stringify(t)})'>Edit</button>
        <button onclick='deleteTeacher(${t.id})'>Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Edit Teacher
function editTeacher(teacher) {
  document.getElementById("teacherId").value = teacher.id;
  document.getElementById("teacherName").value = teacher.name;
  document.getElementById("teacherSubject").value = teacher.subject;
  openModal();
}

// Add/Update Teacher
document.getElementById("teacherForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById("teacherId").value);
  const name = document.getElementById("teacherName").value;
  const subject = document.getElementById("teacherSubject").value;

  let teachers = loadData("teachers");
  if (id) {
    const index = teachers.findIndex(t => t.id === id);
    teachers[index] = { id, name, subject };
  } else {
    teachers.push({ id: Date.now(), name, subject });
  }

  saveData("teachers", teachers);
  closeModal();
  renderTeachers();
});

// Delete Teacher
function deleteTeacher(id) {
  let teachers = loadData("teachers");
  teachers = teachers.filter(t => t.id !== id);
  saveData("teachers", teachers);
  renderTeachers();
}

// Mark Attendance
function renderAttendance() {
  const list = document.getElementById("attendanceList");
  if (!list) return;
  list.innerHTML = "";
  const students = loadData("students");

  students.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${s.name} (${s.class})
      <button onclick='toggleAttendance(${s.id})'>
        ${s.present ? "Present" : "Absent"}
      </button>
    `;
    list.appendChild(li);
  });
}

function toggleAttendance(id) {
  const students = loadData("students");
  const index = students.findIndex(s => s.id === id);
  students[index].present = !students[index].present;
  saveData("students", students);
  renderAttendance();
}

function saveAttendance() {
  alert("Attendance saved locally.");
}

// Show Notices
function showNotices() {
  const noticesDiv = document.getElementById("notices");
  if (!noticesDiv) return;

  const notices = [
    "Exam schedule announced.",
    "PTM on 10th April.",
    "School closed on Monday."
  ];

  notices.forEach(n => {
    const div = document.createElement("div");
    div.className = "notice";
    div.textContent = n;
    noticesDiv.appendChild(div);
  });
}

// Modal Functions
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("studentForm")?.reset();
  document.getElementById("teacherForm")?.reset();
}

// Filter Function
function filterList(type) {
  const term = document.getElementById(`search${type.charAt(0).toUpperCase() + type.slice(1)}`).value.toLowerCase();
  const key = `${type}s`;
  const data = loadData(key);

  const filtered = data.filter(item => item.name.toLowerCase().includes(term));

  if (type === "student") {
    const table = document.getElementById("studentsTable").querySelector("tbody");
    table.innerHTML = "";
    filtered.forEach(s => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${s.id}</td><td>${s.name}</td><td>${s.class}</td>`;
      table.appendChild(row);
    });
  } else if (type === "teacher") {
    const table = document.getElementById("teachersTable").querySelector("tbody");
    table.innerHTML = "";
    filtered.forEach(t => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${t.id}</td><td>${t.name}</td><td>${t.subject}</td>`;
      table.appendChild(row);
    });
  }
}

// Initial Load
window.onload = () => {
  renderStudents();
  renderTeachers();
  renderAttendance();
  showNotices();
};