// ===============================
// Tutor Buddy Unified Script
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));
    }
    if (document.getElementById('form')) initSessionsPage();
});

function initSessionsPage() {
    const form = document.querySelector('#form form');
    const tbody = document.querySelector('#table tbody');
    const summary = document.getElementById('summary');
    const bulkToggleBtn = document.getElementById('mark-all-paid');
    const cancelBtn = document.getElementById('cancel-update');
    const fStudent = document.getElementById('filter-student');
    const fDateFrom = document.getElementById('filter-date-from');
    const fDateTo = document.getElementById('filter-date-to');
    const fTimeFrom = document.getElementById('filter-time-from');
    const fTimeTo = document.getElementById('filter-time-to');

    let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    let lastDeleted = null;

    // 3. Filter Logic
    function applyFilters(data) {
        return data.filter(s => {
            if (fStudent?.value && !s.name.toLowerCase().includes(fStudent.value.toLowerCase())) return false;
            if (fDateFrom?.value && new Date(s.date) < new Date(fDateFrom.value)) return false;
            if (fDateTo?.value && new Date(s.date) > new Date(fDateTo.value)) return false;
            if (fTimeFrom?.value && s.start < fTimeFrom.value) return false;
            if (fTimeTo?.value && s.end > fTimeTo.value) return false;
            return true;
        });
    }

    // 4. Confirm + Undo Delete
    function deleteWithUndo(idx) {
        const session = sessions[idx];
        if (!confirm(`Are you sure you want to delete the session with ${session.name} on ${session.date}?`)) return;

        sessions.splice(idx, 1);
        saveAndRefresh();

        const notif = document.createElement('div');
        notif.className = 'notif';
        notif.textContent = `Deleted "${session.name}"`;

        const undoBtn = document.createElement('button');
        undoBtn.textContent = 'Undo';
        undoBtn.onclick = () => {
            sessions.splice(idx, 0, session);
            saveAndRefresh();
            notif.remove();
        };

        notif.appendChild(undoBtn);
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 8000);
    }

    // 5. Bulk Paid/Unpaid Toggle
    if (bulkToggleBtn) {
        bulkToggleBtn.addEventListener('click', () => {
            const filtered = applyFilters(sessions);
            const allPaid = filtered.every(s => s.isPaid);
            filtered.forEach(session => {
                const idx = sessions.indexOf(session);
                if (idx !== -1) {
                    sessions[idx].isPaid = !allPaid;
                    if (sessions[idx].isPaid) {
                        sessions[idx].balance = 0;
                    } else {
                        const d0 = new Date(`${session.date}T${session.start}`);
                        const d1 = new Date(`${session.date}T${session.end}`);
                        const hrs = (d1 - d0) / 3600000;
                        sessions[idx].balance = session.rate * hrs;
                    }
                }
            });
            saveAndRefresh();
        });
    }

    // 6. Render Sessions Table
    function refreshTable() {
        tbody.innerHTML = '';
        const filtered = applyFilters(sessions);
        let totalIncome = 0, outstanding = 0;

        filtered.forEach(s => {
            const d0 = new Date(`${s.date}T${s.start}`);
            const d1 = new Date(`${s.date}T${s.end}`);
            const duration = (d1 - d0) / 3600000;
            const fee = s.rate * duration;
            const bal = s.isPaid ? 0 : parseFloat(s.balance || 0);
            if (!s.isPaid) outstanding += bal;
            totalIncome += fee;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${s.date}</td>
                <td>${s.start}</td>
                <td>${s.end}</td>
                <td>${s.name}</td>
                <td>${s.grade}</td>
                <td>${s.subject}</td>
                <td>${s.topic}</td>
                <td>${s.feedback}</td>
                <td>${duration.toFixed(2)}</td>
                <td>${s.rate.toFixed(2)}</td>
                <td>${fee.toFixed(2)}</td>
                <td><button class="toggle-paid-btn">${s.isPaid ? 'Unpaid' : 'Paid'}</button></td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;

            const btn = row.querySelector('.toggle-paid-btn');
            btn.classList.add(s.isPaid ? 'paid' : 'unpaid');
            btn.onclick = () => {
                const idx = sessions.indexOf(s);
                const session = sessions[idx];
                session.isPaid = !session.isPaid;
                session.balance = session.isPaid ? 0 : session.rate * duration;
                saveAndRefresh();
            };

            row.querySelector('.edit-btn').onclick = () => {
                if (cancelBtn) cancelBtn.classList.remove('hidden');
                loadSession(sessions.indexOf(s));
            };
            row.querySelector('.delete-btn').onclick = () => deleteWithUndo(sessions.indexOf(s));

            tbody.appendChild(row);
        });

        if (summary) {
            summary.textContent = `Total Income: ₱${totalIncome.toFixed(2)} | Outstanding: ₱${outstanding.toFixed(2)}`;
        }
    }

    // 7. Store and reset
    function saveAndRefresh() {
        localStorage.setItem('sessions', JSON.stringify(sessions));
        refreshTable();
        form.reset();
        form.removeAttribute('data-edit-index');
        document.getElementById('save').textContent = 'Save Session';
        if (cancelBtn) cancelBtn.classList.add('hidden');
    }

    // 8. Load for editing
    function loadSession(i) {
        const s = sessions[i];
        form.setAttribute('data-edit-index', i);
        document.getElementById('date').value = s.date;
        document.getElementById('start').value = s.start;
        document.getElementById('end').value = s.end;
        document.getElementById('name').value = s.name;
        document.getElementById('grade').value = s.grade;
        document.getElementById('subject').value = s.subject;
        document.getElementById('topic').value = s.topic;
        document.getElementById('feedback').value = s.feedback;
        document.getElementById('rate').value = s.rate;
        document.getElementById('mode').value = s.mode;
        document.getElementById('save').textContent = 'Update Session';
    }

    // 9. Form submit handler
    form.onsubmit = e => {
        e.preventDefault();
        const idx = form.getAttribute('data-edit-index');
        const obj = {
            date: form.date.value,
            start: form.start.value,
            end: form.end.value,
            name: form.name.value.trim(),
            grade: form.grade.value,
            subject: form.subject.value,
            topic: form.topic.value.trim(),
            feedback: form.feedback.value.trim(),
            rate: parseFloat(form.rate.value),
            mode: form.mode.value || '',
            isPaid: false,
            balance: 0
        };
        const d0 = new Date(`${obj.date}T${obj.start}`);
        const d1 = new Date(`${obj.date}T${obj.end}`);
        obj.balance = obj.rate * ((d1 - d0) / 3600000);

        if (idx != null) sessions[parseInt(idx)] = obj;
        else sessions.push(obj);

        saveAndRefresh();
    };

    // 10. Cancel edit
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            form.reset();
            form.removeAttribute('data-edit-index');
            document.getElementById('save').textContent = 'Save Session';
            cancelBtn.classList.add('hidden');
        };
    }

    // 11. Filter listeners
    [fStudent, fDateFrom, fDateTo, fTimeFrom, fTimeTo].forEach(el => el?.addEventListener('change', refreshTable));

    // 12. Init render
    refreshTable();
}
