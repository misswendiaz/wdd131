// ===============================
// Tutor Buddy Shared & Page Logic
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Responsive Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // --- 2. Sessions Page Logic ---
    if (document.getElementById('session-form')) {
        initSessionsPage();
    }
});

// Sessions Page Module
function initSessionsPage() {
    const gradeRates = { elementary: 20, middle: 25, high: 30, college: 35 };
    const form = document.getElementById('session-form');
    const tableBody = document.querySelector('#sessionTable tbody');
    let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');

    function refreshTable() {
        tableBody.innerHTML = '';
        sessions.forEach((s, i) => {
            const duration = ((new Date('1970-01-01T' + s.endTime) - new Date('1970-01-01T' + s.startTime)) / 3600000).toFixed(2);
            const total = (s.rate * duration).toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${s.studentName}</td>
        <td>${s.date}</td>
        <td>${s.startTime}–${s.endTime}</td>
        <td>${duration}</td>
        <td>${s.topic}</td>
        <td>${s.rate}</td>
        <td>${total}</td>
        <td class="${s.isPaid ? 'status-paid' : 'status-unpaid'}">${s.isPaid ? 'Paid' : 'Unpaid'}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>`;
            row.querySelector('.edit-btn').onclick = () => loadSession(i);
            row.querySelector('.delete-btn').onclick = () => { sessions.splice(i, 1); saveAndRefresh(); };
            tableBody.appendChild(row);
        });
    }

    function saveAndRefresh() {
        localStorage.setItem('sessions', JSON.stringify(sessions));
        refreshTable();
        form.reset();
        document.getElementById('submitBtn').textContent = 'Save Session';
    }

    function loadSession(i) {
        const s = sessions[i];
        document.getElementById('studentName').value = s.studentName;
        document.getElementById('subject').value = s.subject;
        document.getElementById('topic').value = s.topic;
        document.getElementById('grade').value = s.grade;
        document.getElementById('startTime').value = s.startTime;
        document.getElementById('endTime').value = s.endTime;
        document.getElementById('feedback').value = s.feedback;
        document.getElementById('isPaid').checked = s.isPaid;
        document.getElementById('editIndex').value = i;
        document.getElementById('submitBtn').textContent = 'Update Session';
    }

    form.onsubmit = e => {
        e.preventDefault();
        const i = document.getElementById('editIndex').value;
        const sessionObj = {
            studentName: document.getElementById('studentName').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            topic: document.getElementById('topic').value.trim(),
            grade: document.getElementById('grade').value,
            rate: gradeRates[document.getElementById('grade').value] || gradeRates.elementary,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            feedback: document.getElementById('feedback').value.trim(),
            isPaid: document.getElementById('isPaid').checked,
            date: new Date().toLocaleDateString()
        };

        if (i !== '') sessions[parseInt(i)] = sessionObj;
        else sessions.push(sessionObj);

        document.getElementById('editIndex').value = '';
        saveAndRefresh();
    };

    refreshTable();
}
