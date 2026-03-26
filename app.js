// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------
    // Authentication Logic
    // -------------------------
    initAuth();

    // -------------------------
    // Mobile Sidebar Toggle
    // -------------------------
    const sidebar = document.getElementById('sidebar');
    const mobileMenuOpen = document.getElementById('mobile-menu-open');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    mobileMenuOpen.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    mobileMenuClose.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // -------------------------
    // Navigation Routing
    // -------------------------
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Hide all sections
            viewSections.forEach(sec => sec.classList.remove('active'));
            
            // Show target section
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Update Page Title
            pageTitle.textContent = link.textContent.trim();

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // -------------------------
    // Charts Initialization
    // -------------------------
    initCharts();
    initLedgerExport();
    initBankUpload();
    initDashboardMetrics();

    // -------------------------
    // Journal Entry Logic
    // -------------------------
    initJournalForm();

    // -------------------------
    // Data Sync Logic
    // -------------------------
    initDataSync();

    // -------------------------
    // Project Management Logic
    // -------------------------
    initProjectMgmt();

    // -------------------------
    // Report Generator Mock
    // -------------------------
    const generateBtns = document.querySelectorAll('#reports .btn-secondary.w-full');
    const reportViewer = document.getElementById('report-viewer');

    generateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const reportTitle = btn.parentElement.querySelector('h4').textContent;
            document.getElementById('report-active-title').textContent = reportTitle;
            
            reportViewer.classList.remove('hidden');
            // Scroll to report viewer
            reportViewer.scrollIntoView({ behavior: 'smooth' });
        });
    });

    initReportControls();
    initComplianceLogic();
});

function initCharts() {
    // Expense Donut Chart
    const ctxDonut = document.getElementById('expenseDonutChart');
    if (ctxDonut) {
        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: window.APP_CONFIG.expenseBreakdown.labels,
                datasets: [{
                    data: window.APP_CONFIG.expenseBreakdown.data,
                    backgroundColor: [
                        '#0F172A', // Deep Navy
                        '#64748B', // Slate Grey
                        '#3B82F6', // Blue Accent
                        '#10B981', // Green Accent
                        '#F59E0B'  // Yellow Accent
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: "'Inter', sans-serif" },
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Cash Flow Bar Chart
    const ctxBar = document.getElementById('cashflowBarChart');
    if (ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: window.APP_CONFIG.cashFlow.months,
                datasets: [
                    {
                        label: 'Cash In',
                        data: window.APP_CONFIG.cashFlow.inflow,
                        backgroundColor: '#10B981', // Success green
                        borderRadius: 4
                    },
                    {
                        label: 'Cash Out',
                        data: window.APP_CONFIG.cashFlow.outflow,
                        backgroundColor: '#0F172A', // Deep Navy
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { borderDash: [4, 4], color: '#E2E8F0' },
                        ticks: { font: { family: "'Inter', sans-serif" } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: "'Inter', sans-serif" } }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Inter', sans-serif" },
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

function initJournalForm() {
    const tbody = document.getElementById('journal-lines-body');
    const addBtn = document.getElementById('add-journal-line');
    const totalDebitEl = document.getElementById('total-debit');
    const totalCreditEl = document.getElementById('total-credit');

    // Function to calculate totals
    const calculateTotals = () => {
        let totalDebit = 0;
        let totalCredit = 0;

        document.querySelectorAll('.debit-input').forEach(input => {
            if (input.value) totalDebit += parseFloat(input.value);
        });

        document.querySelectorAll('.credit-input').forEach(input => {
            if (input.value) totalCredit += parseFloat(input.value);
        });

        totalDebitEl.textContent = totalDebit.toFixed(2);
        totalCreditEl.textContent = totalCredit.toFixed(2);
        
        // Color coding for balance
        if (Math.abs(totalDebit - totalCredit) > 0.001) {
            totalDebitEl.style.color = 'var(--danger)';
            totalCreditEl.style.color = 'var(--danger)';
        } else {
            totalDebitEl.style.color = 'var(--success)';
            totalCreditEl.style.color = 'var(--success)';
        }
    };

    // Add row function
    const addRow = () => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <select required>
                    <option value="">-- Select Account --</option>
                    <option value="101">101 - Cash in Bank</option>
                    <option value="201">201 - Accounts Payable</option>
                    <option value="401">401 - Sales Revenue</option>
                    <option value="501">501 - Cost of Goods Sold</option>
                    <option value="601">601 - Depreciation Exp</option>
                </select>
            </td>
            <td><input type="text" placeholder="Line description"></td>
            <td><input type="number" class="debit-input" placeholder="0.00" step="0.01"></td>
            <td><input type="number" class="credit-input" placeholder="0.00" step="0.01"></td>
            <td><button type="button" class="btn-icon text-danger remove-line"><i data-lucide="trash-2"></i></button></td>
        `;

        tbody.appendChild(tr);
        lucide.createIcons();
        attachRowEvents(tr);
    };

    // Attach events to a single row
    const attachRowEvents = (row) => {
        const debitInput = row.querySelector('.debit-input');
        const creditInput = row.querySelector('.credit-input');
        const removeBtn = row.querySelector('.remove-line');

        // Toggle disabled state based on input
        debitInput.addEventListener('input', () => {
            if (debitInput.value) {
                creditInput.value = '';
                creditInput.disabled = true;
            } else {
                creditInput.disabled = false;
            }
            calculateTotals();
        });

        creditInput.addEventListener('input', () => {
            if (creditInput.value) {
                debitInput.value = '';
                debitInput.disabled = true;
            } else {
                debitInput.disabled = false;
            }
            calculateTotals();
        });

        removeBtn.addEventListener('click', () => {
            if (tbody.children.length > 2) {
                tbody.removeChild(row);
                calculateTotals();
            } else {
                alert("A journal entry requires at least two lines.");
            }
        });
    };

    // Init existing rows
    tbody.querySelectorAll('tr').forEach(attachRowEvents);

    // Initial calculation
    calculateTotals();

    // Add button listener
    addBtn.addEventListener('click', addRow);
    
    // Form submit
    document.getElementById('journal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        let tD = parseFloat(totalDebitEl.textContent);
        let tC = parseFloat(totalCreditEl.textContent);
        
        if (Math.abs(tD - tC) > 0.001) {
            alert('Debits must equal Credits to post this entry.');
            return;
        }
        
        if (tD === 0) {
            alert('Journal entry cannot be empty.');
            return;
        }

        alert('Journal Entry posted successfully! Audit log updated.');
        
        // Add entries to General Ledger (Simulation)
        const glBody = document.querySelector('#general-ledger .data-table tbody');
        const dateValues = document.querySelector('#journal-form input[type="date"]').value;
        const refValue = document.querySelector('#journal-form input[placeholder="e.g. JE-00124"]').value;
        const auditor = document.querySelector('.user-name').textContent;

        document.querySelectorAll('#journal-lines-body tr').forEach(row => {
            const acc = row.querySelector('select').options[row.querySelector('select').selectedIndex].text;
            const desc = row.querySelector('input[placeholder="Line description"]').value || e.target.querySelector('input[placeholder="Entry description"]').value;
            const debit = row.querySelector('.debit-input').value;
            const credit = row.querySelector('.credit-input').value;

            const newLedgerRow = document.createElement('tr');
            newLedgerRow.innerHTML = `
                <td>${dateValues}</td>
                <td>${acc}</td>
                <td>${desc}</td>
                <td>${refValue}</td>
                <td class="amount-col">${debit ? parseFloat(debit).toFixed(2) : ''}</td>
                <td class="amount-col">${credit ? parseFloat(credit).toFixed(2) : ''}</td>
                <td><span class="audit-tag">${auditor}</span></td>
            `;
            glBody.insertBefore(newLedgerRow, glBody.firstChild);
        });

        // Reset form
        e.target.reset();
        document.querySelectorAll('input:disabled').forEach(input => input.disabled = false);
        calculateTotals();
    });
}

function initDataSync() {
    const fileInput = document.getElementById('import-file');
    const fileNameDisplay = document.getElementById('selected-file-name');
    const startBtn = document.getElementById('btn-start-import');
    const typeSelect = document.getElementById('import-type');
    const progressBar = document.getElementById('import-progress');
    const bar = document.getElementById('import-bar');
    const percentage = document.getElementById('import-percentage');
    const statusText = document.getElementById('import-status-text');
    const historyBody = document.getElementById('import-history-body');

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
            fileNameDisplay.classList.remove('hidden');
        } else {
            fileNameDisplay.classList.add('hidden');
        }
    });

    startBtn.addEventListener('click', () => {
        if (!typeSelect.value) {
            alert("Please select the document type.");
            return;
        }
        if (!fileInput.files || fileInput.files.length === 0) {
            alert("Please upload a CSV or Excel file.");
            return;
        }

        // Reset and show progress
        startBtn.disabled = true;
        progressBar.classList.remove('hidden');
        bar.style.width = '0%';
        bar.style.backgroundColor = 'var(--primary)';
        percentage.textContent = '0%';
        statusText.textContent = 'Validating records...';

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress > 100) progress = 100;
            
            bar.style.width = progress + '%';
            percentage.textContent = progress + '%';

            if (progress > 40 && progress < 80) {
                statusText.textContent = 'Mapping data & importing...';
            }

            if (progress === 100) {
                clearInterval(interval);
                statusText.textContent = 'Import Complete!';
                bar.style.backgroundColor = 'var(--success)';
                
                setTimeout(() => {
                    // Clear empty state if this is first record
                    const emptyRow = historyBody.querySelector('.empty-row');
                    if (emptyRow) emptyRow.remove();

                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${dateStr}</td>
                        <td>${typeText}</td>
                        <td>${Math.floor(Math.random() * 50) + 10}</td>
                        <td><span class="status-badge success">Completed</span></td>
                    `;
                    historyBody.insertBefore(newRow, historyBody.firstChild);

                    // Reset form
                    document.getElementById('import-form').reset();
                    fileNameDisplay.classList.add('hidden');
                    startBtn.disabled = false;
                    
                    setTimeout(() => {
                        progressBar.classList.add('hidden');
                        const isPDF = fileInput.files[0].name.toLowerCase().endsWith('.pdf');
                        alert(isPDF ? 'PDF Document processed and recorded successfully.' : 'Data synchronization completed successfully.');
                    }, 300);
                }, 800);
            }
        }, 300);
    });

    // Handle type change for better icons
    typeSelect.addEventListener('change', () => {
        const icon = document.getElementById('import-icon');
        const title = document.getElementById('import-title');
        if (typeSelect.value === 'invoice' || typeSelect.value === 'quotation') {
            icon.setAttribute('data-lucide', 'file-text');
            title.textContent = "Upload PDF Documents";
        } else {
            icon.setAttribute('data-lucide', 'file-spreadsheet');
            title.textContent = "Upload CSV/Excel Data";
        }
        lucide.createIcons();
    });

    const sampleBtn = document.getElementById('btn-download-sample-csv');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const csvContent = "Date,Project,Description,Account,Debit,Credit,RefID\n2026-03-25,Shah Alam Bungalow,Hardware Supplies,Cost of Goods Sold,500.00,0,PUR-101\n2026-03-25,Shah Alam Bungalow,Payment for Supplies,Cash in Bank,0,500.00,PUR-101";
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', 'Junkho_Import_Template.csv');
            a.click();
        });
    }
}

function initLedgerExport() {
    const exportBtn = document.getElementById('btn-export-ledger');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
        const table = document.querySelector('#general-ledger .data-table');
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const row = [], cols = rows[i].querySelectorAll('td, th');
            for (let j = 0; j < cols.length; j++) {
                row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
            }
            csv.push(row.join(','));
        }

        const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Junkho_General_Ledger.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function initBankUpload() {
    const uploadInput = document.getElementById('bank-csv-upload');
    if (!uploadInput) return;

    uploadInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            alert(`Uploading ${fileName}...`);
            
            // Simulating parsing and adding a new row
            setTimeout(() => {
                const reconTable = document.querySelector('.recon-table tbody');
                const newRow = document.createElement('tr');
                newRow.className = 'unmatched-row';
                newRow.innerHTML = `
                    <td>2026-03-25</td>
                    <td>IMPORTED: ${fileName.toUpperCase()} ENTRY</td>
                    <td class="negative">-1,200.00</td>
                    <td><span class="match-badge none">No Match</span></td>
                    <td><button class="btn-primary btn-sm">Create Rule</button></td>
                `;
                reconTable.insertBefore(newRow, reconTable.firstChild);
                alert("Statement imported! New unmatched transactions added for review.");
                lucide.createIcons();
            }, 1000);
        }
    });
}

function initAuth() {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const appWrapper = document.getElementById('app-wrapper');
    const loginError = document.getElementById('login-error');

    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value.trim().toLowerCase();
        
        // Simple mock authentication
        if (username === 'admin' || username === 'amirul') {
            document.querySelector('.user-name').textContent = 'Amirul';
            document.querySelector('.user-role').textContent = 'Admin';
            document.querySelector('.user-avatar').textContent = 'AM';
            loginSuccess();
        } else if (username === 'auditor') {
            document.querySelector('.user-name').textContent = 'System Auditor';
            document.querySelector('.user-role').textContent = 'View Only';
            document.querySelector('.user-avatar').textContent = 'SA';
            
            // Mock permissions: Disable Data Sync button and Journal Post button
            const postBtn = document.querySelector('#journal-form button[type="submit"]');
            if (postBtn) {
                postBtn.disabled = true;
                postBtn.title = "View Only Mode: Cannot post journals";
            }
            const syncBtn = document.getElementById('btn-start-import');
            if (syncBtn) {
                syncBtn.disabled = true;
                syncBtn.title = "View Only Mode: Cannot sync data";
            }

            loginSuccess();
        } else {
            loginError.style.display = 'block';
        }
    });

    function loginSuccess() {
        loginError.style.display = 'none';
        loginContainer.classList.add('hidden');
        appWrapper.classList.remove('hidden');
        // Initial animation
        appWrapper.style.opacity = '0';
        setTimeout(() => {
            appWrapper.style.transition = 'opacity 0.4s ease-in-out';
            appWrapper.style.opacity = '1';
            
            // Re-draw charts to ensure proper rendering after container un-hide
            Chart.instances.forEach(chart => chart.resize());
        }, 10);
    }
}

function initProjectMgmt() {
    const quickAddBtn = document.getElementById('btn-quick-add-project');
    const mainAddBtn = document.getElementById('btn-add-project');
    const projectSelect = document.getElementById('journal-project-select');
    const projectListBody = document.getElementById('project-list-body');

    const addNewProject = () => {
        const name = prompt("Enter Project Name (e.g., Damansara Attic Design):");
        if (!name) return;

        const location = prompt("Enter Project Location (e.g., Damansara Heights):") || "Unknown";
        const val = prompt("Enter Initial Project Value (MYR):") || "0";

        // Add to dropdown
        const option = document.createElement('option');
        option.value = name.toLowerCase().replace(/\s+/g, '-');
        option.textContent = name;
        projectSelect.appendChild(option);
        
        // Select it automatically
        projectSelect.value = option.value;

        // Add to projects table
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="project-name"><strong>${name}</strong></td>
            <td class="project-location">${location}</td>
            <td class="project-value">MYR ${parseFloat(val).toLocaleString()}</td>
            <td>MYR 0.00</td>
            <td>0%</td>
            <td><span class="status-badge active">Planning</span></td>
            <td class="text-right">
                <div class="flex-gap justify-end">
                    <button class="btn-icon btn-sm edit-project-btn" title="Edit"><i data-lucide="edit-3"></i></button>
                    <button class="btn-icon btn-sm delete-project-btn text-negative" title="Delete"><i data-lucide="trash-2"></i></button>
                </div>
            </td>
        `;

        // Clear empty state if this is first project
        const emptyRow = projectListBody.querySelector('.empty-row');
        if (emptyRow) emptyRow.remove();

        projectListBody.insertBefore(tr, projectListBody.firstChild);

        alert(`Project "${name}" has been created and is now available in your records.`);
        lucide.createIcons();
    };

    if (quickAddBtn) quickAddBtn.addEventListener('click', addNewProject);
    if (mainAddBtn) mainAddBtn.addEventListener('click', addNewProject);

    // Delegate Edit/Delete clicks
    projectListBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const tr = btn.closest('tr');
        if (btn.classList.contains('delete-project-btn')) {
            if (confirm(`Are you sure you want to remove this project?`)) {
                tr.remove();
                if (projectListBody.children.length === 0) {
                    projectListBody.innerHTML = '<tr class="empty-row"><td colspan="7" class="text-center py-8 text-muted">No active projects. Use the button above to add a new project.</td></tr>';
                }
            }
        } else if (btn.classList.contains('edit-project-btn')) {
            const currentName = tr.querySelector('.project-name').textContent;
            const currentLoc = tr.querySelector('.project-location').textContent;
            const currentVal = tr.querySelector('.project-value').textContent;

            const newName = prompt("Edit Project Name:", currentName);
            if (newName) tr.querySelector('.project-name').innerHTML = `<strong>${newName}</strong>`;
            
            const newLoc = prompt("Edit Project Location:", currentLoc);
            if (newLoc !== null) tr.querySelector('.project-location').textContent = newLoc;

            const newVal = prompt("Edit Project Value (MYR):", currentVal.replace(/[^\d.]/g, ''));
            if (newVal !== null) tr.querySelector('.project-value').textContent = `MYR ${parseFloat(newVal).toLocaleString()}`;
        }
    });
}

function initReportControls() {
    const printBtn = document.getElementById('btn-print-report');
    const pdfBtn = document.getElementById('btn-export-pdf');

    const handleOutput = () => {
        const reportContent = document.getElementById('report-viewer');
        if (!reportContent) return;

        // Save current body
        const originalContents = document.body.innerHTML;
        const reportTitle = document.getElementById('report-active-title').textContent;
        
        // Temporarily replace body for clean print
        // Only printing the report panel
        const printContent = reportContent.innerHTML;
        
        // Create a temporary print view
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>' + reportTitle + '</title>');
        printWindow.document.write('<link rel="stylesheet" href="index.css">');
        printWindow.document.write('<style>body{background:white;padding:40px;}.btn-secondary,.btn-primary,.flex-gap{display:none !important;}.hidden{display:block !important;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    if (printBtn) printBtn.addEventListener('click', handleOutput);
    if (pdfBtn) pdfBtn.addEventListener('click', handleOutput);
}

function initDashboardMetrics() {
    if (!window.APP_CONFIG) return;

    const formatMYR = (val) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(val);
    
    // Fill Dashboard Metrics
    document.getElementById('metric-cash').textContent = formatMYR(window.APP_CONFIG.metrics.cashOnHand);
    document.getElementById('metric-profit').textContent = formatMYR(window.APP_CONFIG.metrics.netProfitYTD);
    document.getElementById('metric-payables').textContent = formatMYR(window.APP_CONFIG.metrics.totalPayables);
    document.getElementById('metric-receivables').textContent = formatMYR(window.APP_CONFIG.metrics.totalReceivables);

    // Fill Trends
    document.getElementById('trend-cash').innerHTML = `<i data-lucide="trending-up"></i> ${window.APP_CONFIG.metrics.cashTrend} from last month`;
    document.getElementById('trend-profit').innerHTML = `<i data-lucide="trending-up"></i> ${window.APP_CONFIG.metrics.profitTrend} from last month`;
    document.getElementById('trend-payables').innerHTML = `<i data-lucide="trending-up"></i> ${window.APP_CONFIG.metrics.payablesTrend} from last month`;
    document.getElementById('trend-receivables').innerHTML = `<i data-lucide="trending-up"></i> ${window.APP_CONFIG.metrics.receivablesTrend} from last month`;

    // Fill Sidebar info
    document.getElementById('company-display-name').textContent = window.APP_CONFIG.company.name;
    
    lucide.createIcons();
}

function initComplianceLogic() {
    const payrollBtn = document.getElementById('btn-process-payroll');
    const sstBtn = document.getElementById('btn-download-sst');
    const addEmployeeBtn = document.getElementById('btn-add-employee');
    const payrollBody = document.getElementById('payroll-body');
    const totalNetDisplay = document.getElementById('total-net-payroll');

    const formatCurr = (v) => new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', () => {
            const name = prompt("Enter Employee Name / Position:");
            if (!name) return;
            const gross = parseFloat(prompt("Enter Monthly Gross Salary (MYR):") || "0");
            
            // Basic Statutory Logic (Sdn Bhd Malaysia)
            const epf = gross * 0.11;
            const socso_eis = gross > 5000 ? 25.00 : gross * 0.005; // Mock logic for demo
            let pcb = 0;
            if (gross > 10000) pcb = (gross - 10000) * 0.20 + 500;
            else if (gross > 5000) pcb = (gross - 5000) * 0.10 + 100;

            const net = gross - epf - socso_eis - pcb;

            const emptyRow = payrollBody.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${name}</strong></td>
                <td class="amount-col">${formatCurr(gross)}</td>
                <td class="amount-col text-secondary">${formatCurr(epf)}</td>
                <td class="amount-col text-secondary">${formatCurr(socso_eis)}</td>
                <td class="amount-col text-secondary">${formatCurr(pcb)}</td>
                <td class="amount-col font-bold">MYR ${formatCurr(net)}</td>
                <td class="text-right">
                    <button class="btn-icon btn-sm text-negative remove-emp"><i data-lucide="trash-2"></i></button>
                </td>
            `;
            payrollBody.appendChild(tr);
            lucide.createIcons();
            updateTotalPayroll();
        });
    }

    payrollBody.addEventListener('click', (e) => {
        if (e.target.closest('.remove-emp')) {
            e.target.closest('tr').remove();
            updateTotalPayroll();
            if (payrollBody.children.length === 0) {
                payrollBody.innerHTML = '<tr class="empty-row"><td colspan="7" class="text-center py-8 text-muted">No employees added.</td></tr>';
            }
        }
    });

    function updateTotalPayroll() {
        let total = 0;
        const rows = payrollBody.querySelectorAll('tr:not(.empty-row)');
        rows.forEach(r => {
            const netStr = r.cells[5].textContent.replace('MYR ', '').replace(/,/g, '');
            total += parseFloat(netStr || 0);
        });
        totalNetDisplay.textContent = `MYR ${formatCurr(total)}`;
    }

    if (payrollBtn) {
        payrollBtn.addEventListener('click', () => {
            const total = totalNetDisplay.textContent;
            if (total === 'MYR 0.00') {
                alert("Please add employees before processing payroll.");
                return;
            }
            payrollBtn.disabled = true;
            payrollBtn.innerHTML = '<i data-lucide="refresh-cw" class="spin"></i> Posting to Ledger...';
            lucide.createIcons();

            setTimeout(() => {
                alert(`SUCCESS: Monthly Payroll confirmed.\n\nTotal Net Disbursed: ${total}\nThis has been recorded in your General Ledger as Salary Expenses.`);
                payrollBtn.disabled = false;
                payrollBtn.innerHTML = '<i data-lucide="check-circle"></i> Confirm payroll & Post Journal';
                lucide.createIcons();
            }, 1200);
        });
    }

    if (sstBtn) {
        sstBtn.addEventListener('click', () => {
            const outputTax = document.getElementById('sst-output-tax').value || "0";
            const period = document.getElementById('sst-tax-period').value || "N/A";

            const csvData = [
                ["Taxable Period", period],
                ["SSM Number", window.APP_CONFIG.company.ssm],
                ["", ""],
                ["Category", "Tax Amount (MYR)"],
                ["Total Output Tax (Sales)", outputTax],
                ["Total Input Tax (Credit)", "0.00"],
                ["", ""],
                ["TOTAL SST PAYABLE", outputTax]
            ];

            let csvRows = csvData.map(row => row.join(','));
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `SST_02_${period.replace(/\s+/g, '_')}.csv`);
            a.click();
            
            alert(`SST-02 Filing Report for ${period} generated successfully.`);
        });
    }
}
