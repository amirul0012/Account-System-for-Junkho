/**
 * Junkho Studio Accounting System - Central Configuration
 * Use this file to edit the main numbers, chart data, and company settings.
 */

window.APP_CONFIG = {
    // 1. MAIN DASHBOARD METRICS
    metrics: {
        cashOnHand: 0.00,
        netProfitYTD: 0.00,
        totalPayables: 0.00,
        totalReceivables: 0.00,
        
        // Trends (set as percentage string like "+5.2%")
        cashTrend: "0%",
        profitTrend: "0%",
        payablesTrend: "0%",
        receivablesTrend: "0%"
    },

    // 2. EXPENSE DONUT CHART DATA
    expenseBreakdown: {
        labels: ['No Data'],
        data: [1] // Initial placeholder to show empty donut
    },

    // 3. CASH FLOW BAR CHART DATA
    cashFlow: {
        months: ['Jan', 'Feb', 'Mar'],
        inflow: [0, 0, 0],
        outflow: [0, 0, 0]
    },

    // 4. STATUTORY COMPLIANCE SETTINGS
    compliance: {
        sstRate: 0.06, // 6%
        sstPayable: 0.00,
        taxablePeriod: "Not Set",
        
        fye: "2026-12-31",
        hardLockDate: "2026-03-01",
        sstNumber: "---"
    },

    // 5. COMPANY DETAILS
    company: {
        name: "Junkho Studio",
        ssm: "202503225958 (003764803-T)",
        address: "No 41-1 Jalan Nuetron U16/Q, Seksyen U16, Denai Alam, 40160 Shah Alam Selangor"
    }
};
