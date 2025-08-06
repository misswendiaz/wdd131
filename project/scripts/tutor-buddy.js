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
    // -------------------------------
    // 1. DOM References (must be declared first)
    // -------------------------------
    const form = document.querySelector('#form form');
    const tbody = document.querySelector('#table tbody');
    const summary = document.getElementById('summary');
    const cancelBtn = document.getElementById('cancel-update');
    const bulkToggleBtn = document.getElementById('mark-all-paid');
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');
    const fStudent = document.getElementById('filter-student');
    const fDateFrom = document.getElementById('filter-date-from');
    const fDateTo = document.getElementById('filter-date-to');
    const fTimeFrom = document.getElementById('filter-time-from');
    const fTimeTo = document.getElementById('filter-time-to');
    let sessions = JSON.parse(localStorage.getItem('sessions') || '[]');

    // -------------------------------
    // 3. Filter Logic
    // -------------------------------
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

    // -------------------------------
    // 4. Confirm + Undo Delete
    // -------------------------------
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

    // -------------------------------
    // 6. Render Sessions Table (with inline payment inputs)
    // -------------------------------
    function refreshTable() {
        tbody.innerHTML = '';
        const filtered = applyFilters(sessions);
        let totalIncome = 0, outstanding = 0;

        filtered.forEach(s => {
            const d0 = new Date(`${s.date}T${s.start}`);
            const d1 = new Date(`${s.date}T${s.end}`);
            const duration = (d1 - d0) / 3600000;
            let fee = s.rate * duration;
            if (s.discount) fee -= fee * (s.discount / 100);
            const bal = s.isPaid ? 0 : parseFloat(s.balance || 0);
            if (!s.isPaid) outstanding += bal;
            totalIncome += fee;

            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${s.date}</td><td>${s.start}</td><td>${s.end}</td><td>${s.name}</td>
        <td>${s.grade}</td><td>${s.subject}</td><td>${s.topic}</td>
        <td class="feedback-cell"><div>${s.feedback}</div></td>
        <td>${duration.toFixed(2)}</td><td>${s.rate.toFixed(2)}</td><td>${fee.toFixed(2)}</td>
        <td><button class="toggle-paid-btn">${s.isPaid ? 'Unpaid' : 'Paid'}</button></td>
        <td class="paid-date-cell">${s.datePaid || ''}</td>
        <td class="paid-mode-cell">${s.paidMode || ''}</td>
        <td><button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button></td>
      `;

            const btn = row.querySelector('.toggle-paid-btn');
            btn.classList.add(s.isPaid ? 'paid' : 'unpaid');
            btn.onclick = () => editPaymentInline(s, row);

            row.querySelector('.edit-btn').onclick = () => loadSession(sessions.indexOf(s));
            row.querySelector('.delete-btn').onclick = () => deleteWithUndo(sessions.indexOf(s));

            tbody.appendChild(row);
        });

        if (summary) summary.textContent = `Total Income: ₱${totalIncome.toFixed(2)} | Outstanding: ₱${outstanding.toFixed(2)}`;
    }

    // -------------------------------
    // Inline payment editor (date picker + dropdown)
    // -------------------------------
    function editPaymentInline(s, row) {
        const dateCell = row.querySelector('.paid-date-cell');
        const modeCell = row.querySelector('.paid-mode-cell');
        const toggleBtn = row.querySelector('.toggle-paid-btn');

        if (!s.isPaid) {
            dateCell.innerHTML = `<input type="date" class="inline-date" value="${new Date().toISOString().split('T')[0]}">`;
            modeCell.innerHTML = `<select class="inline-mode">
        <option value="">--Select--</option>
        <option>Cash</option><option>Cheque</option><option>e‑Wallet</option><option>Bank Transfer</option>
      </select>`;
            toggleBtn.textContent = 'Confirm';
            toggleBtn.onclick = () => {
                const dpInput = dateCell.querySelector('.inline-date');
                const pmSelect = modeCell.querySelector('.inline-mode');
                s.datePaid = dpInput.value;
                s.paidMode = pmSelect.value;
                s.isPaid = true;
                s.balance = 0;
                saveAndRefresh();
            };
        } else {
            delete s.datePaid;
            delete s.paidMode;
            s.isPaid = false;
            const d0 = new Date(`${s.date}T${s.start}`);
            const d1 = new Date(`${s.date}T${s.end}`);
            const hours = (d1 - d0) / 3600000;
            s.balance = s.rate * hours;
            saveAndRefresh();
        }
    }

    // -------------------------------
    // 7. Store and reset
    // -------------------------------
    function saveAndRefresh() {
        localStorage.setItem('sessions', JSON.stringify(sessions));
        refreshTable();
        form.reset();
        form.removeAttribute('data-edit-index');
        document.getElementById('save').textContent = 'Save Session';
        if (cancelBtn) cancelBtn.classList.add('hidden');
    }

    // -------------------------------
    // 8. Load for editing
    // -------------------------------
    function loadSession(i) {
        const s = sessions[i];
        form.setAttribute('data-edit-index', i);
        form.date.value = s.date;
        form.start.value = s.start;
        form.end.value = s.end;
        form.name.value = s.name;
        form.grade.value = s.grade;
        form.subject.value = s.subject;
        form.topic.value = s.topic;
        form.feedback.value = s.feedback;
        form.rate.value = s.rate;
        form.discount.value = s.discount || 0;
        document.getElementById('save').textContent = 'Update Session';
    }

    // -------------------------------
    // Filter apply / clear buttons logic
    // -------------------------------
    if (applyBtn) applyBtn.onclick = refreshTable;
    if (clearBtn) clearBtn.onclick = () => {
        [fStudent, fDateFrom, fDateTo, fTimeFrom, fTimeTo].forEach(el => { if (el) el.value = ''; });
        refreshTable();
    };

    // -------------------------------
    // 5. Bulk Paid/Unpaid Toggle
    // (note: still uses prompt for bulk – optional inline modal later)
    // -------------------------------
    if (bulkToggleBtn) {
        bulkToggleBtn.addEventListener('click', () => {
            const filtered = applyFilters(sessions);
            const allPaid = filtered.every(s => s.isPaid);
            filtered.forEach(session => {
                const idx = sessions.indexOf(session);
                if (idx === -1) return;
                if (!session.isPaid) {
                    const dp = prompt('Date Paid (YYYY‑MM‑DD):', new Date().toISOString().split('T')[0]);
                    const pm = prompt('Mode of Payment (Cash, Cheque, e‑Wallet, Bank):', '');
                    if (dp) session.datePaid = dp;
                    if (pm) session.paidMode = pm;
                } else {
                    delete session.datePaid;
                    delete session.paidMode;
                }
                session.isPaid = !allPaid;
                const hours = (new Date(`${session.date}T${session.end}`) - new Date(`${session.date}T${session.start}`)) / 3600000;
                session.balance = session.isPaid ? 0 : session.rate * hours;
                sessions[idx] = session;
            });
            saveAndRefresh();
        });
    }

    // -------------------------------
    // 9. Form submit handler
    // -------------------------------
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
            discount: parseFloat(form.discount.value) || 0,
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

    // -------------------------------
    // 10. Cancel edit
    // -------------------------------
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            form.reset();
            form.removeAttribute('data-edit-index');
            document.getElementById('save').textContent = 'Save Session';
            cancelBtn.classList.add('hidden');
        };
    }

    // -------------------------------
    // 11. Filter input change listeners
    // -------------------------------
    [fStudent, fDateFrom, fDateTo, fTimeFrom, fTimeTo].forEach(el => el?.addEventListener('change', refreshTable));

    // -------------------------------
    // 12. Initial table render
    // -------------------------------
    refreshTable();
}
