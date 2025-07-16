import React, { useState } from "react";
import * as XLSX from "xlsx";

const VERSION = "v0.1.1"; // Update as needed

// SC3.com.au theme colours
const SC3_PRIMARY = "#003366";      // Deep blue
const SC3_SECONDARY = "#0099cc";    // Bright blue
const SC3_ACCENT = "#fbc02d";       // Gold/yellow
const SC3_BG = "#f4f8fb";           // Light background
const SC3_GREEN = "#388e3c";        // For impact
const SC3_TABLE_HEADER = "#e5eef5"; // Light blue for table header

// Additional style constants for parametric styling
const SC3_BORDER_RADIUS = 6;
const SC3_FORM_PADDING = 12;
const SC3_SECTION_MARGIN = 16;
const SC3_BTN_RADIUS = 4;
const SC3_BTN_FONT_WEIGHT = "bold";
const SC3_BTN_FONT_SIZE = "1em";
const SC3_BTN_PADDING = "0.6em 1.5em";
const SC3_BTN_BOX_SHADOW = (color) => `0 2px 6px ${color}22`;
const SC3_TABLE_BORDER_RADIUS = 8;
const SC3_TABLE_BG = "#fff";
const SC3_TABLE_HEADER_FONT_SIZE = "1.05em";
const SC3_TABLE_HEADER_FONT_WEIGHT = "bold";
const SC3_TABLE_HEADER_BG = "#e5eef5";
const SC3_TABLE_ROW_HIGHLIGHT = "#e3f2fd";
const SC3_TABLE_TRANSITION = "background 0.2s";
const SC3_INPUT_BORDER_RADIUS = 4;
const SC3_INPUT_PADDING = "0.4em 0.6em";

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const initialForm = {
  processId: "",
  processName: "",
  businessUnit: "",
  owner: "",
  description: "",
  inScopeScenarios: "",      
  outOfScopeScenarios: "",   
  createdBy: "", 
  dateCreated: getToday(), // Default to today
  processImpactScore: "0",
  impactScore: "1",
  impact: "",
  financialImpactScore: "1",
  financialImpact: "",
  financialImpactCurrency: "dollar",
  operationalImpactScore: "1",
  operationalImpact: "",
  ohsImpactScore: "1",
  ohsImpact: "",
  staffImpactScore: "1",
  numberOfStaffImpacted: "",
  sitesImpactScore: "1",
  numberOfSitesImpacted: "", 
  reputationalImpactScore: "1",
  reputationalImpact: "",
  statutoryImpactScore: "1",
  statutoryImpact: "",
  infosecImpactScore: "1",
  infosecImpact: "",
  criticality: "1",
  sla: "90%",
  mtpd: "168",
  recoveryTimeObjective: "72",
  recoveryTimeActual: "",
  recoveryPointObjective: "48",
  recoveryPointActual: "",
  legalObligations: "",
  resources: "",
  dependencies: "",
  itDependencies: "",
  peopleDependencies: "",
  facilitiesDependencies: "",
  processDependencies: ""
};

const BIAForm = () => {
  const [form, setForm] = useState(initialForm);
  const [entries, setEntries] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [fieldsOpen, setFieldsOpen] = useState(true);
  const [criticalityDefaults, setCriticalityDefaults] = useState({
    1: { mtpd: "168", rto: "72", rpo: "48", sla: "90%" },
    2: { mtpd: "120", rto: "48", rpo: "24", sla: "95%" },
    3: { mtpd: "72", rto: "24", rpo: "12", sla: "99%" },
    4: { mtpd: "48", rto: "12", rpo: "6", sla: "99.9%" },
    5: { mtpd: "24", rto: "4", rpo: "1", sla: "99.95%" }
  });

  // Helper function to format impact score display
  const formatImpactScore = (score) => {
    if (!score) return '';
    const impactLabels = {
      '1': 'Negligible Impact',
      '2': 'Low Impact',
      '3': 'Moderate Impact',
      '4': 'High Impact',
      '5': 'Critical Impact'
    };
    return `${score} (${impactLabels[score] || 'Unknown'})`;
  };

  // Helper function to format criticality rating display
  const formatCriticalityRating = (rating) => {
    if (!rating) return '';
    const criticalityLabels = {
      '1': 'None',
      '2': 'Bronze',
      '3': 'Silver',
      '4': 'Gold',
      '5': 'Platinum'
    };
    return `${rating} (${criticalityLabels[rating] || 'Unknown'})`;
  };

  // Helper to calculate process criticality fields
  const calculateCriticalityFields = (f) => {
    const impactSum =
      Number(f.impactScore) +
      Number(f.financialImpactScore) +
      Number(f.operationalImpactScore) +
      Number(f.ohsImpactScore) +
      Number(f.staffImpactScore) +
      Number(f.sitesImpactScore) +
      Number(f.reputationalImpactScore) +
      Number(f.statutoryImpactScore) +
      Number(f.infosecImpactScore);

    let criticality;
    if (impactSum <= 9) criticality = "1";
    else if (impactSum > 9 && impactSum <= 18) criticality = "2";
    else if (impactSum > 18 && impactSum <= 27) criticality = "3";
    else if (impactSum > 27 && impactSum <= 36) criticality = "4";
    else criticality = "5";

    const defaults = criticalityDefaults[criticality] || {};
    return {
      processImpactScore: impactSum.toString(),
      mtpd: defaults.mtpd || "",
      recoveryTimeObjective: defaults.rto || "",
      recoveryPointObjective: defaults.rpo || "",
      criticality,
      sla: defaults.sla || "",
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If an impact score field changes, recalculate criticality fields
    const impactFields = [
      "impactScore",
      "financialImpactScore",
      "operationalImpactScore",
      "ohsImpactScore",
      "staffImpactScore",
      "sitesImpactScore",
      "reputationalImpactScore",
      "statutoryImpactScore",
      "infosecImpactScore",
    ];
    let updatedForm = { ...form, [name]: value };

    // If criticality is changed, update SLA, RTO, and RPO from defaults
    if (name === "criticality") {
      const defaults = criticalityDefaults[value] || {};
      updatedForm = {
        ...updatedForm,
        sla: defaults.sla || "",
        recoveryTimeObjective: defaults.rto || "",
        recoveryPointObjective: defaults.rpo || "",
        mtpd: defaults.mtpd || "",
        criticality: value,
      };
    }

    if (impactFields.includes(name)) {
      updatedForm = {
        ...updatedForm,
        ...calculateCriticalityFields({ ...updatedForm }),
      };
    }

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedEntries = entries.map((entry, idx) =>
        idx === editIndex ? form : entry
      );
      setEntries(updatedEntries);
      setEditIndex(null);
    } else {
      setEntries([...entries, form]);
    }
    setSubmitted(true);
    setFieldsOpen(false); // Collapse form fields after submit
  };

  const handleBack = () => {
    setSubmitted(false);
    setForm(initialForm);
    setEditIndex(null);
    setFieldsOpen(true); // Expand form fields when returning to form
  };

  const handleExport = () => {
    if (entries.length === 0) return;

    // --- BIA Guidance content as an array of arrays (rows) ---
    // Entries for the guidance worksheet
    const guidanceRows = [
      ["BIA Guidance and Preparation"],
      [""],
      ["Also see:"],
      [
        "ISO/TS 22301 - Security and Resilience — Business Continuity Management Systems — Requirements",
      ],
      [
        "ISO/TS 22313 - Security and Resilience — Business Continuity Management Systems — Guidance on the use of ISO 22301",
      ],
      [
        "ISO/TS 22317 - Security and Resilience — Business Continuity Management Systems — Guidelines for Business Impact Analysis",
      ],
      [
        "ISO-TS-22317-2021.pdf: https://cdn.standards.iteh.ai/samples/79000/1c0f02d98ec647a8b1661e6c949a4bc2/ISO-TS-22317-2021.pdf"
      ],
      [""],
      ["Before commencing the BIA process:"],
      ["• Identify the context, scope and objectives of the BIA."],
      ["• Define and communicate the roles and responsibilities of the BIA team:"],
      ["    - BIA Leader: Responsible for overseeing the BIA process and ensuring its alignment with business objectives and obtaining approval of the BIA outcomes from management."],
      ["    - Activity Owner: Responsible for providing detailed information about the business processes and their dependencies."],
      ["    - Subject Matter Experts (SMEs): Provide expertise and insights into specific business areas and processes."],
      ["• Obtain leadership commitment and have adequate resources allocated."],
      ["• Engage stakeholders and subject matter experts."],
      ["• Identify and document the potential impacts of disruptions to the business processes."],
      ["• Assess the impact against the most important period of activity."],
      ["• Consider both quantitative and qualitative factors in the assessment."],
      ["• Engage stakeholders and subject matter experts to validate the assessment."],
      [""],
      ["Impact Score:"],
      ["1: Negligible - no significant impact"],
      ["2: Low - may cause minor disruptions"],
      ["3: Moderate - likely to have a noticeable impact"],
      ["4: High - highly probable to have a significant impact"],
      ["5: Critical - will have a major impact on the organisation"],
      [""],
      [
        "It is important to note that the BIA is an iterative process and should be revisited regularly to ensure it remains aligned with the business objectives and the changing environment. These requirements feed into the overall risk assessment process and the Business Continuity Planning (BCP) process."
      ],
      [""],
      [
        "Set Default MTPD, RTO, RPO, and SLA for Each Criticality Level: These values will be used as defaults when calculating Process Criticality based on impact scores."
      ],
      [
        "Note: These Non-Functional Requirements (NFRs) are naive blunt instruments and do not usually account for the scenarios that they are meant to address and those that they don't address, whether they are applicable equally or not for nodal scoped events, locale scoped events, or regional scoped events, or for outages vs data corruption, etc."
      ],
      [
        "RTOs and RPOs are business objectives. Recovery Time Actuals (RTAs) and Recovery Point Actuals (RPAs) are the actual metrics that are measured and reported against these objectives which may be significantly less than or greater than the stated objectives. RTAs and RPAs are often mistakenly conflated with RTOs and RPOs, but they serve different purposes in the BCP process."
      ],
      [
        "It is important to regularly review and update the NFRs to ensure that they remain relevant and effective in addressing the evolving business landscape."
      ],
      [
        "Disclaimer: The information provided here is for general informational purposes only and will require adaptation for specific businesses and maturity capabilities and is not intended as legal advice. Please consult with a qualified legal professional for specific legal advice tailored to your situation."
      ],
    ];

    // Create the guidance worksheet
    const wsGuidance = XLSX.utils.aoa_to_sheet(guidanceRows);

    // Style the guidance worksheet (optional, basic header style)
    wsGuidance["A1"].s = {
      font: { bold: true, sz: 16, color: { rgb: "003366" } }
    };

    // --- BIA Entries worksheet as before ---
    const data = entries.map((entry) => ({
      "Process ID": entry.processId,
      "Name": entry.processName,
      "Business Unit": entry.businessUnit,
      "Owner": entry.owner,
      "Description": entry.description,
      "In Scope Scenarios": entry.inScopeScenarios,     
      "Out of Scope Scenarios": entry.outOfScopeScenarios,  
      "Created By": entry.createdBy,
      "Date Created": entry.dateCreated,
      "Impact Score": entry.impactScore,
      "Impact": entry.impact,
      "Financial Impact Score": entry.financialImpactScore,
      "Financial":
        (entry.financialImpactCurrency === "dollar" ? "$" :
        entry.financialImpactCurrency === "euro" ? "€" :
        entry.financialImpactCurrency === "pound" ? "£" :
        entry.financialImpactCurrency === "yen" ? "¥" :
        entry.financialImpactCurrency === "rupee" ? "₹" :
        entry.financialImpactCurrency === "peso" ? "₱" :
        entry.financialImpactCurrency === "won" ? "₩" :
        entry.financialImpactCurrency === "lira" ? "₺" :
        entry.financialImpactCurrency === "franc" ? "₣" :
        entry.financialImpactCurrency === "shekel" ? "₪" :
        entry.financialImpactCurrency === "other" ? "¤" : "") + entry.financialImpact,
      "Operational Impact Score": entry.operationalImpactScore,
      "Operational": entry.operationalImpact,
      "OH&S Impact Score": entry.ohsImpactScore,
      "OH&S Impact": entry.ohsImpact,
      "Staff Impact Score": entry.staffImpactScore,
      "# Staff Impacted": entry.numberOfStaffImpacted,
      "Sites Impact Score": entry.sitesImpactScore,
      "# Sites Impacted": entry.numberOfSitesImpacted,
      "Reputational Impact Score": entry.reputationalImpactScore,
      "Reputational Impact": entry.reputationalImpact,
      "Statutory Impact Score": entry.statutoryImpactScore,
      "Statutory": entry.statutoryImpact,
      "InfoSec Impact Score": entry.infosecImpactScore,
      "InfoSec Impact": entry.infosecImpact,
      "Criticality Rating": entry.criticality,
      "SLA": entry.sla,
      "MTPD": entry.mtpd,
      "RTO": entry.recoveryTimeObjective,
      "RTA": entry.recoveryTimeActual,         
      "RPO": entry.recoveryPointObjective,
      "RPA": entry.recoveryPointActual,       
      "Legal": entry.legalObligations,
      "Resources": entry.resources,
      "Dependencies": entry.dependencies,
      "IT": entry.itDependencies,
      "People": entry.peopleDependencies,
      "Facilities": entry.facilitiesDependencies,
      "Process": entry.processDependencies,
    }));

    const wsEntries = XLSX.utils.json_to_sheet(data);

    // Define column keys for each group
    const processCols = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]; 
    const impactCols = ["J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y","Z", "AA"];
    const criticalCols = ["AB", "AC", "AD", "AE", "AF", "AG", "AH"]; 
    const depCols = ["AI", "AJ", "AK", "AL", "AM", "AN", "AO"];

    // Style helpers - Excel colour styling not working with xlsx, requires xlsx-style or SheetJS Pro
    const headerStyle = {
      font: { bold: true, color: { rgb: "003366" } },
      fill: { fgColor: { rgb: "e5eef5" } }
    };
    const processStyle = {
      fill: { fgColor: { rgb: "f5faff" } }
    };
    const impactStyle = {
      fill: { fgColor: { rgb: "f8fff5" } }
    };
    // Updated: Use purple for Process Criticality columns to match UI
    const criticalStyle = {
      fill: { fgColor: { rgb: "ede7f6" } }, // Light purple background
      font: { color: { rgb: "4a148c" }, bold: true } // Dark purple text, bold
    };
    const depStyle = {
      fill: { fgColor: { rgb: "fffbea" } }
    };

    // Apply styles to header row
    for (let col = 0; col < processCols.length + impactCols.length + criticalCols.length + depCols.length; col++) {
      const colLetter = XLSX.utils.encode_col(col);
      const cell = wsEntries[`${colLetter}1`];
      if (cell) {
        cell.s = { ...headerStyle };
        if (processCols.includes(colLetter)) cell.s.fill = { fgColor: { rgb: "f5faff" } };
        if (impactCols.includes(colLetter)) cell.s.fill = { fgColor: { rgb: "f8fff5" } };
        if (criticalCols.includes(colLetter)) {
          cell.s.fill = { fgColor: { rgb: "ede7f6" } };
          cell.s.font = { color: { rgb: "7b1fa2" }, bold: true }; // Deep purple header
        }
        if (depCols.includes(colLetter)) cell.s.fill = { fgColor: { rgb: "fffbea" } };
      }
    }

    // Apply styles to data rows
    for (let row = 2; row <= entries.length + 1; row++) {
      processCols.forEach((col) => {
        const cell = wsEntries[`${col}${row}`];
        if (cell) cell.s = { ...processStyle };
      });
      impactCols.forEach((col) => {
        const cell = wsEntries[`${col}${row}`];
        if (cell) cell.s = { ...impactStyle };
      });
      criticalCols.forEach((col) => {
        const cell = wsEntries[`${col}${row}`];
        if (cell) cell.s = { ...criticalStyle };
      });
      depCols.forEach((col) => {
        const cell = wsEntries[`${col}${row}`];
        if (cell) cell.s = { ...depStyle };
      });
    }

    // Create workbook and append both sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsGuidance, "BIA Guidance");
    XLSX.utils.book_append_sheet(wb, wsEntries, "BIA Entries");

    // Generate filename with current date and time
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `bia-entries-${timestamp}.xlsx`;

    // Export with cell styles (requires xlsx-style or SheetJS Pro)
    XLSX.writeFile(wb, filename, { cellStyles: true });
  };

  const handleRowClick = (idx) => {
    // If clicking on the row that's already being edited, save the changes
    if (editIndex === idx) {
      const updatedEntries = entries.map((entry, entryIdx) =>
        entryIdx === editIndex ? form : entry
      );
      setEntries(updatedEntries);
      setEditIndex(null);
      setSubmitted(true);
      setFieldsOpen(false); // Collapse form fields after save
    } else {
      // If clicking on a different row, load it for editing
      setForm(entries[idx]);
      setEditIndex(idx);
      setSubmitted(false);
      setFieldsOpen(true); // Expand the BIA Form Fields when a row is clicked
    }
  };

  // Move row up handler
  const moveRowUp = (idx) => {
    if (idx === 0) return;
    setEntries((prev) => {
      const newEntries = [...prev];
      [newEntries[idx - 1], newEntries[idx]] = [newEntries[idx], newEntries[idx - 1]];
      return newEntries;
    });
    if (editIndex === idx) setEditIndex(idx - 1);
    else if (editIndex === idx - 1) setEditIndex(idx);
  };

  // Move row down handler
  const moveRowDown = (idx) => {
    if (idx === entries.length - 1) return;
    setEntries((prev) => {
      const newEntries = [...prev];
      [newEntries[idx], newEntries[idx + 1]] = [newEntries[idx + 1], newEntries[idx]];
      return newEntries;
    });
    if (editIndex === idx) setEditIndex(idx + 1);
    else if (editIndex === idx + 1) setEditIndex(idx);
  };

  // Remove entry handler
  const handleRemove = (idx) => {
    setEntries(entries.filter((_, i) => i !== idx));
    if (editIndex === idx) {
      setEditIndex(null);
      setForm(initialForm);
      setSubmitted(false);
    } else if (editIndex > idx) {
      setEditIndex(editIndex - 1);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        background: SC3_BG,
        borderRadius: SC3_TABLE_BORDER_RADIUS,
        boxShadow: "0 2px 12px #00336622",
        padding: 24,
        fontFamily: "Segoe UI, Arial, sans-serif",
        color: SC3_PRIMARY,
      }}
    >
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <h2 style={{
            color: SC3_PRIMARY,
            borderBottom: `3px solid ${SC3_ACCENT}`,
            paddingBottom: 8
          }}>
            Business Impact Assessment Form
          </h2>
          <details style={{ marginBottom: "1rem" }}>
            <summary style={{
              cursor: "pointer",
              fontWeight: SC3_BTN_FONT_WEIGHT,
              color: SC3_SECONDARY
            }}>
              BIA Guidance and Preparation
            </summary>
            <div>
              <p>Also see:</p>
              <ul>
                <li>
                  <em>
                    <a 
                      href="https://www.iso.org/standard/75106.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: SC3_SECONDARY }}
                    >
                      ISO/TS 22301</a>
                    </em>&nbsp;Security and Resilience — Business Continuity Management Systems — Requirements</li>
                  <li><em>
                    <a 
                      href="https://www.iso.org/standard/75107.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: SC3_SECONDARY }}
                    >
                      ISO/TS 22313</a>
                    </em>&nbsp;Security and Resilience — Business Continuity Management Systems — Guidance on the use of ISO 22301</li>
                  <li><em>
                    <a 
                      href="https://www.iso.org/standard/79000.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: SC3_SECONDARY }}
                    >
                      ISO/TS 22317</a>
                    </em>&nbsp;Security and Resilience — Business Continuity Management Systems — Guidelines for Business Impact Analysis</li>
                </ul>
              {/* Primer on BIAs: https://cdn.standards.iteh.ai/samples/79000/1c0f02d98ec647a8b1661e6c949a4bc2/ISO-TS-22317-2021.pdf */}
              <p>Before commencing the BIA process:</p>
              <ul>
                <li>Identify the context, scope and objectives of the BIA.</li>
                <li>
                  Define and communicate the roles and responsibilities of the BIA team.
                  <dl>
                    <dt style={{ color: SC3_PRIMARY }}>BIA Leader</dt>
                    <dd>Responsible for overseeing the BIA process and ensuring its alignment with business objectives and obtaining approval of the BIA outcomes from management.</dd>
                    <dt style={{ color: SC3_PRIMARY }}>Activity Owner</dt>
                    <dd>Responsible for providing detailed information about the business processes and their dependencies.</dd>
                    <dt style={{ color: SC3_PRIMARY }}>Subject Matter Experts (SMEs)</dt>
                    <dd>Provide expertise and insights into specific business areas and processes.</dd>
                  </dl>
                </li>
                <li>Obtain leadership commitment and have adequate resources allocated.</li>
                <li>Engage stakeholders and subject matter experts.</li>
                <li>Identify and document the potential impacts of disruptions to the business processes.</li>
                <li>Assess the impact against the most important period of activity</li>
                <li>Consider both quantitative and qualitative factors in the assessment.</li>
              </ul>
              <p><b>Impact Assessment:</b></p>
              <p>Assess the potential impact of disruptions on business processes using the following scale:</p>
              <ul>
                <li>1: <b>Negligible</b> - no significant impact</li>
                <li>2: <b>Low</b> - may cause minor disruptions</li>
                <li>3: <b>Moderate</b> - likely to have a noticeable impact</li>
                <li>4: <b>High</b> - highly probable to have a significant impact</li>
                <li>5: <b>Critical</b> - will have a major impact on the organisation</li>
              </ul>
              <p>The resultant <b>Impact Score</b> can be used to determine the criticality of the business processes and corresponding recovery priorities.</p>
              <p>It is important to note that the BIA is an iterative process and should be revisited regularly to ensure it remains aligned with the business objectives and the changing environment. 
                These requirements feed into the overall risk assessment process and the Business Continuity Planning (BCP) process.</p>
                            
              {/* Criticality Defaults Settings */}
              <p><b>Process Criticality:</b></p>
              <div style={{ 
                margin: "2em 0", 
                padding: "1em", 
                background: "#ede7f6", // Light purple background to match Process Criticality
                border: "2px solid #7b1fa2", // Deep purple border
                borderRadius: SC3_BORDER_RADIUS 
              }}>
                <h4 style={{ color: "#7b1fa2", marginTop: 0 }}>Set Default SLA, MTPD, RTO, and RPO for Each Criticality Level</h4>
                <table style={{ width: "100%", marginBottom: "1em" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", color: "#7b1fa2" }}>Criticality</th>
                      <th style={{ textAlign: "left", color: "#7b1fa2" }}>SLA</th> 
                      <th style={{ textAlign: "left", color: "#7b1fa2" }}>MTPD (hours)</th>
                      <th style={{ textAlign: "left", color: "#7b1fa2" }}>RTO (hours)</th>
                      <th style={{ textAlign: "left", color: "#7b1fa2" }}>RPO (hours)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(level => (
                      <tr key={level}>
                        <td style={{ color: "#4a148c", fontWeight: "bold" }}>
                          {level === 1 && "1 (None)"}
                          {level === 2 && "2 (Bronze)"}
                          {level === 3 && "3 (Silver)"}
                          {level === 4 && "4 (Gold)"}
                          {level === 5 && "5 (Platinum)"}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={criticalityDefaults[level]?.sla || ""}
                            onChange={e => setCriticalityDefaults(d => ({
                              ...d,
                              [level]: { ...d[level], sla: e.target.value }
                            }))}
                            style={{ width: 80, color: "#4a148c" }}
                            placeholder="SLA"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={criticalityDefaults[level]?.mtpd || ""}
                            onChange={e => setCriticalityDefaults(d => ({
                              ...d,
                              [level]: { ...d[level], mtpd: e.target.value }
                            }))}
                            style={{ width: 80, color: "#4a148c" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={criticalityDefaults[level]?.rto || ""}
                            onChange={e => setCriticalityDefaults(d => ({
                              ...d,
                              [level]: { ...d[level], rto: e.target.value }
                            }))}
                            style={{ width: 80, color: "#4a148c" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={criticalityDefaults[level]?.rpo || ""}
                            onChange={e => setCriticalityDefaults(d => ({
                              ...d,
                              [level]: { ...d[level], rpo: e.target.value }
                            }))}
                            style={{ width: 80, color: "#4a148c" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table> 
                <div style={{ fontSize: "0.95em", color: "#444" }}>
                  <b>Note:</b> These values will be used as defaults when calculating Process Criticality based on impact scores.
                </div>    
                <button
                  type="button"
                  onClick={() =>
                    setCriticalityDefaults({
                      1: { mtpd: "168", rto: "72", rpo: "48", sla: "90%" },
                      2: { mtpd: "120", rto: "48", rpo: "24", sla: "95%" },
                      3: { mtpd: "72", rto: "24", rpo: "12", sla: "99%" },
                      4: { mtpd: "48", rto: "12", rpo: "6", sla: "99.9%" },
                      5: { mtpd: "24", rto: "4", rpo: "1", sla: "99.95%" }
                    })
                  }
                  style={{
                    margin: "0.5em 0 1em 0",
                    background: "#fff",
                    color: "#7b1fa2",
                    border: "2px solid #7b1fa2",
                    borderRadius: SC3_BTN_RADIUS,
                    padding: "0.4em 1.2em",
                    fontWeight: SC3_BTN_FONT_WEIGHT,
                    fontSize: "1em",
                    cursor: "pointer",
                    boxShadow: SC3_BTN_BOX_SHADOW("#7b1fa2")
                  }}
                >
                  Reset to Initial Defaults
                </button>
              </div>
              <p>Service Level Agreements (SLAs) are formal agreements that define the expected level of service between a service provider and a consumer or customer. 
                They typically include Service Level Objectives (SLOs) covering metrics such as availability, throughput, performance, quality, and response times etc. 
                Here the SLA is really just the SLO for the availability objectives of the process. The availability downtime objectives should be defined over a specific time period, 
                such as daily or monthly etc, but they seldom include the relevant time increment that they are applicable to. The following is an example for an availability downtime SLO over different time periods, 
                with each increase in <i>nines</i> being increasingly more expensive and challenging to achieve:</p>
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse", 
                margin: "1rem 0",
                border: "1px solid #ccc"
              }}>
                <thead>
                  <tr>
                    <th style={{ 
                      border: "1px solid #ccc", 
                      padding: "0.5rem", 
                      backgroundColor: "#f5f5f5",
                      textAlign: "left"
                    }}>
                      SLA Percentage
                    </th>
                    <th style={{ 
                      border: "1px solid #ccc", 
                      padding: "0.5rem", 
                      backgroundColor: "#f5f5f5",
                      textAlign: "left"
                    }}>
                      Common Name
                    </th>
                    <th style={{ 
                      border: "1px solid #ccc", 
                      padding: "0.5rem", 
                      backgroundColor: "#f5f5f5",
                      textAlign: "left"
                    }}>
                      Downtime Per Day
                    </th>
                    <th style={{ 
                      border: "1px solid #ccc", 
                      padding: "0.5rem", 
                      backgroundColor: "#f5f5f5",
                      textAlign: "left"
                    }}>
                      Downtime Per Week
                    </th>
                    <th style={{ 
                      border: "1px solid #ccc", 
                      padding: "0.5rem", 
                      backgroundColor: "#f5f5f5",
                      textAlign: "left"
                    }}>
                      Downtime Per Month
                    </th>
                    <th style={{ 
                      border: "1px solid #ccc", 
                      padding: "0.5rem", 
                      backgroundColor: "#f5f5f5",
                      textAlign: "left"
                    }}>
                      Downtime Per Year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>90%</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      <i>"one nine"</i>
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>2.4 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>16.8 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>73 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>36.5 days</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>95%</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      <i>"one nine five"</i>
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>1.2 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>8.4 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>36.5 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>18.3 days</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>99%</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      <i>"two nines"</i>
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>14.4 minutes</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>1.68 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>7.3 hours</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>3.65 days</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>99.9%</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      <i>"three nines"</i>
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>1.44 minutes</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>10.08 minutes</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>43.8 minutes</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>8.77 hours</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>99.95%</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      <i>"three nines five"</i>
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>43.2 seconds</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>5.04 minutes</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>21.92 minutes</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>4.38 hours</td>
                  </tr>
                </tbody>
              </table>
              <p>Maximum Tolerable Period of Disruption (MTPD) is the maximum amount of time that a business process can be disrupted before it causes irreparable harm to the organization. It is a critical metric for business continuity planning.</p>
              <p>Recovery Time Objectives (RTOs) and Recovery Point Objectives (RPOs) are business objectives. Recovery Time Actuals (RTAs) and Recovery Point Actuals (RPAs) are the actual metrics that are measured and reported against these objectives which may be significantly less than or greater than the stated objectives. 
                RTAs and RPAs are often mistakenly conflated with RTOs and RPOs, but they serve different purposes in the BCP process.</p>
              <p>N.B. These Non-Functional Requirements (NFRs) are naive blunt instruments and do not usually account for the scenarios that they are meant to address and those that they don't address, 
                whether they are applicable equally or not for nodal scoped events, locale scoped events, or regional scoped events, or for outages vs data corruption events, etc, and they are usually incorrectly defined.</p>
              <p>It is important to regularly review and update the NFRs to ensure that they remain relevant and effective in addressing the evolving business landscape.</p>
              
              <p><b>Dependencies and Obligations:</b></p>
              <p>Identify and document the dependencies and obligations related to the business processes. These may contribute towards planning and executing effective business continuity strategies and the recovery from any process disruptions.</p>

              <p><b>Disclaimer:</b> The information provided here is for general informational purposes only and will require adaptation for specific businesses and maturity capabilities and is not intended as legal advice. 
                Please consult with a qualified legal professional for specific legal advice tailored to your situation.</p>
            </div>
          </details>
          <details open={fieldsOpen} onToggle={e => setFieldsOpen(e.target.open)}>
            <summary style={{
              cursor: "pointer",
              fontWeight: SC3_BTN_FONT_WEIGHT,
              color: SC3_SECONDARY
            }}>
              BIA Form Fields
            </summary>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1rem"
            }}>
              <tbody>
                {/* Business Process Details */}
                <tr>
                  <td colSpan={2}>
                    <fieldset
                      style={{
                        border: `2px solid ${SC3_PRIMARY}`,
                        borderRadius: SC3_BORDER_RADIUS,
                        padding: SC3_FORM_PADDING,
                        marginBottom: SC3_SECTION_MARGIN,
                        background: "#f5faff",
                      }}
                    >
                      <legend style={{
                        fontWeight: SC3_BTN_FONT_WEIGHT,
                        color: SC3_PRIMARY
                      }}>Business Process Details</legend>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr title="A unique identifier for this business process (e.g. FIN-001, HR-002)">
                            <td style={{ width: "25%" }}><label>Business Process ID:<span style={{color: "#d32f2f"}}>*</span></label></td>
                            <td>
                              <input
                                type="text"
                                name="processId"
                                value={form.processId}
                                onChange={handleChange}
                                required
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem"
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="The name of the business process (e.g. Payroll Processing)"> 
                            <td style={{ width: "25%" }}><label>Business Process Name:<span style={{color: "#d32f2f"}}>*</span></label></td>                            
                            <td>
                              <input
                                type="text"
                                name="processName"
                                value={form.processName}
                                onChange={handleChange}
                                required  
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem"
                                }}                  
                              />
                            </td>
                          </tr>
                          <tr title="The business unit or department responsible for this process">
                            <td style={{ width: "25%" }}><label>Business Unit:</label></td>
                            <td>
                              <input
                                type="text"
                                name="businessUnit"
                                value={form.businessUnit}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem"
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="The person accountable for this process">
                            <td style={{ width: "25%" }}><label>Process Owner:</label></td>
                            <td>
                              <input
                                type="text"
                                name="owner"
                                value={form.owner}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem"
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="Briefly describe the purpose and scope of this process">
                            <td style={{ width: "25%" }}><label>Description:</label></td>
                            <td>
                              <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="List scenarios or events that are considered in-scope for this BIA (e.g. system outage, data loss)">
                            <td style={{ width: "25%" }}><label>In Scope Scenarios:</label></td>
                            <td>
                              <textarea
                                name="inScopeScenarios"
                                value={form.inScopeScenarios}
                                onChange={handleChange}  
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}                              
                              />
                            </td>
                          </tr>
                          <tr title="List scenarios or events that are not considered in-scope for this BIA">
                            <td style={{ width: "25%" }}><label>Out of Scope Scenarios:</label></td>
                            <td>
                              <textarea
                                name="outOfScopeScenarios"
                                value={form.outOfScopeScenarios}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="Name of the person completing this form">
                            <td style={{ width: "25%" }}><label>Created By:</label></td>
                            <td>
                              <input
                                type="text"
                                name="createdBy"
                                value={form.createdBy}
                                onChange={handleChange}  
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem"
                                }}                              
                              />
                            </td>
                          </tr>
                          <tr title="Date this entry was created">
                            <td style={{ width: "25%" }}><label>Date Created:</label></td>
                            <td>
                              <input
                                type="date"
                                name="dateCreated"
                                value={form.dateCreated}
                                onChange={handleChange}   
                                style={{
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                }}                        
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </fieldset>
                  </td>
                </tr>

                {/* Impact Assessment */}
                <tr>
                  <td colSpan={2}>
                    <fieldset
                      style={{
                        border: `2px solid ${SC3_GREEN}`,
                        borderRadius: SC3_BORDER_RADIUS,
                        padding: SC3_FORM_PADDING,
                        marginBottom: SC3_SECTION_MARGIN,
                        background: "#f8fff5",
                      }}
                    >
                      <legend style={{
                        fontWeight: SC3_BTN_FONT_WEIGHT,
                        color: SC3_GREEN
                      }}>Impact Assessment</legend>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr title="The overall impact for this process">
                            <td style={{ width: "40%" }}><label>Impact of Disruption:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                              <select
                                name="impactScore"
                                value={form.impactScore}
                                onChange={handleChange}
                                style={{
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  marginRight: "0.5rem"
                                }}
                              >
                                <option value="1">1 (Neglible Impact)</option>
                                <option value="2">2 (Low Impact)</option>
                                <option value="3">3 (Moderate Impact)</option>
                                <option value="4">4 (High Impact)</option>
                                <option value="5">5 (Critical Impact)</option>
                              </select>
                              <textarea
                                name="impact"
                                value={form.impact}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                              </div>  
                            </td>
                          </tr>
                          <tr title="The financial impact of disruption to this process, which may also be a factor of the duration of the disruption">
                            <td style={{ width: "40%" }}><label>Financial Impact:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <select
                                  name="financialImpactScore"
                                  value={form.financialImpactScore}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="1">1 (Neglible Impact)</option>
                                  <option value="2">2 (Low Impact)</option>
                                  <option value="3">3 (Moderate Impact)</option>
                                  <option value="4">4 (High Impact)</option>
                                  <option value="5">5 (Critical Impact)</option>
                                </select>
                                <select
                                  name="financialImpactCurrency"
                                  value={form.financialImpactCurrency}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="dollar">$ (dollar)</option>
                                  <option value="euro">€ (euro)</option>
                                  <option value="pound">£ (pound)</option>
                                  <option value="yen">¥ (yen)</option>
                                  <option value="rupee">₹ (rupee)</option>
                                  <option value="peso">₱ (peso)</option>
                                  <option value="won">₩ (won)</option>
                                  <option value="lira">₺ (lira)</option>
                                  <option value="franc">₣ (franc)</option>
                                  <option value="shekel">₪ (shekel)</option>
                                  <option value="other">¤ (other)</option>
                                </select>
                                <input
                                  type="number"
                                  name="financialImpact"
                                  value={form.financialImpact}
                                  onChange={handleChange}
                                  min="0"
                                  step="any"
                                  placeholder="Amount"
                                  style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    resize: "vertical",
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr title="The operational impact of disruption to this process, which may also be a factor of the duration of the disruption">
                            <td style={{ width: "40%" }}><label>Operational Impact:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                              <select
                                name="operationalImpactScore"
                                value={form.operationalImpactScore}
                                onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                              >
                                <option value="1">1 (Neglible Impact)</option>
                                <option value="2">2 (Low Impact)</option>
                                <option value="3">3 (Moderate Impact)</option>
                                <option value="4">4 (High Impact)</option>
                                <option value="5">5 (Critical Impact)</option>
                              </select>
                              <textarea
                                name="operationalImpact"
                                value={form.operationalImpact}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                              </div>
                            </td>
                          </tr>
                          <tr title="The impact on employee health and safety due to disruption of this process">
                            <td style={{ width: "40%" }}><label>Occupational Health & Safety Impact:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <select
                                  name="ohsImpactScore"
                                  value={form.ohsImpactScore}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="1">1 (Negligible Impact)</option>
                                  <option value="2">2 (Low Impact)</option>
                                  <option value="3">3 (Moderate Impact)</option>
                                  <option value="4">4 (High Impact)</option>
                                  <option value="5">5 (Critical Impact)</option>
                                </select>
                                <textarea
                                  name="ohsImpact"
                                  value={form.ohsImpact}
                                  onChange={handleChange}
                                  style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    resize: "vertical",
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr title="The impact on staff due to disruption of this process">
                            <td style={{ width: "40%" }}><label>Number of Staff Impacted:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <select
                                  name="staffImpactScore"
                                  value={form.staffImpactScore}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="1">1 (Negligible Impact)</option>
                                  <option value="2">2 (Low Impact)</option>
                                  <option value="3">3 (Moderate Impact)</option>
                                  <option value="4">4 (High Impact)</option>
                                  <option value="5">5 (Critical Impact)</option>
                                </select>
                                <input
                                  type="number"
                                  name="numberOfStaffImpacted"
                                  value={form.numberOfStaffImpacted}
                                  onChange={handleChange}
                                  min="0"
                                  placeholder="Number"
                                  style={{
                                    flex: 1,
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                  }}
                              />
                              </div>
                            </td>
                          </tr>
                          <tr title="The impact on sites due to disruption of this process">
                            <td style={{ width: "40%" }}><label>Number of Sites Impacted:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <select
                                  name="sitesImpactScore"
                                  value={form.sitesImpactScore}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="1">1 (Negligible Impact)</option>
                                  <option value="2">2 (Low Impact)</option>
                                  <option value="3">3 (Moderate Impact)</option>
                                  <option value="4">4 (High Impact)</option>
                                  <option value="5">5 (Critical Impact)</option>
                                </select>
                                <input
                                  type="number"
                                  name="numberOfSitesImpacted"
                                  value={form.numberOfSitesImpacted}
                                  onChange={handleChange}
                                  min="0"
                                  placeholder="Number"
                                  style={{
                                    flex: 1,
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                  }}
                              />
                              </div>
                            </td>
                          </tr>
                          <tr title="The impact on customers and their loyalty to the brand due to disruption of this process">
                            <td style={{ width: "40%" }}><label>Reputational Impact:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <select
                                  name="reputationalImpactScore"
                                  value={form.reputationalImpactScore}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="1">1 (Negligible Impact)</option>
                                  <option value="2">2 (Low Impact)</option>
                                  <option value="3">3 (Moderate Impact)</option>
                                  <option value="4">4 (High Impact)</option>
                                  <option value="5">5 (Critical Impact)</option>
                                </select>
                              <textarea
                                name="reputationalImpact"
                                value={form.reputationalImpact}
                                onChange={handleChange}
                                style={{
                                  flex: 1,
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                              </div>
                            </td>
                          </tr>
                          <tr title="The impact on statutory and regulatory compliance due to disruption of this process">
                            <td style={{ width: "40%" }}><label>Statutory / Regulatory Impact:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <select
                                  name="statutoryImpactScore"
                                  value={form.statutoryImpactScore}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="1">1 (Negligible Impact)</option>
                                  <option value="2">2 (Low Impact)</option>
                                  <option value="3">3 (Moderate Impact)</option>
                                  <option value="4">4 (High Impact)</option>
                                  <option value="5">5 (Critical Impact)</option>
                                </select>
                                <textarea
                                  name="statutoryImpact"
                                  value={form.statutoryImpact}
                                  onChange={handleChange}
                                  style={{
                                    flex: 1,
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    resize: "vertical",
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr title="The impact on information security due to disruption of this process">
                            <td style={{ width: "40%" }}><label>Information Security Impact:</label></td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <select
                                  name="infosecImpactScore"
                                  value={form.infosecImpactScore}
                                  onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  <option value="1">1 (Negligible Impact)</option>
                                  <option value="2">2 (Low Impact)</option>
                                  <option value="3">3 (Moderate Impact)</option>
                                  <option value="4">4 (High Impact)</option>
                                  <option value="5">5 (Critical Impact)</option>
                                </select>
                                <textarea
                                  name="infosecImpact"
                                  value={form.infosecImpact}
                                  onChange={handleChange}
                                  style={{
                                    flex: 1,
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    resize: "vertical",
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </fieldset>
                  </td>
                </tr>

                {/* Process Criticality */}
                <tr>
                  <td colSpan={2}>
                    <fieldset
                      style={{
                        border: `2px solid #7b1fa2`,           // Deep purple border
                        borderRadius: SC3_BORDER_RADIUS,
                        padding: SC3_FORM_PADDING,
                        background: "#ede7f6",                  // Light purple background
                        marginBottom: SC3_SECTION_MARGIN,
                      }}
                    >
                      <legend style={{
                        fontWeight: SC3_BTN_FONT_WEIGHT,
                        color: '#7b1fa2'                        // Deep purple text
                      }}>Process Criticality</legend>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr title="The importance of this process to the organisation">
                            <td style={{ width: "40%" }}><label>Criticality Rating:</label></td>
                            <td>
                              <select
                                name="criticality"
                                value={form.criticality}
                                onChange={handleChange}
                                  style={{
                                    boxSizing: "border-box",
                                    padding: SC3_INPUT_PADDING,
                                    borderRadius: SC3_INPUT_BORDER_RADIUS,
                                    border: `1px solid ${SC3_SECONDARY}`,
                                    fontSize: "1rem",
                                    marginRight: "0.5rem",
                                    color: "#4a148c"
                                  }}
                              >
                                <option value="1">1 (None)</option>
                                <option value="2">2 (Bronze)</option>
                                <option value="3">3 (Silver)</option>
                                <option value="4">4 (Gold)</option>
                                <option value="5">5 (Platinum)</option>
                              </select>
                            </td>
                          </tr>
                          <tr title="The service level agreement for this process (actually the Availability Service Level Objective - SLO), defining the percentage of time this process should be available">
                            <td style={{ width: "40%" }}><label>SLA (%):</label></td>
                            <td>
                              <input
                                type="text"
                                name="sla"
                                value={form.sla}
                                onChange={handleChange}
                                placeholder="e.g. 99.9%"
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  color: "#4a148c"
                                }}          
                              />
                            </td>
                          </tr>
                          <tr title="The maximum tolerable period of disruption for this process">
                            <td style={{ width: "40%" }}><label>MTPD - Maximum Tolerable Period of Disruption (hours):</label></td>
                            <td>
                              <input
                                type="number"
                                name="mtpd"
                                value={form.mtpd}
                                onChange={handleChange}
                                placeholder="Hours"
                                min="0"
                                step="0.01"
                                style={{
                                  flex: 1,
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  color: "#4a148c"
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="The recovery time objective for this process">
                            <td style={{ width: "40%" }}><label>RTO - Recovery Time Objective (hours):</label></td>
                            <td>
                              <input
                                type="number"
                                name="recoveryTimeObjective"
                                value={form.recoveryTimeObjective}
                                onChange={handleChange}
                                placeholder="Hours"
                                min="0"
                                step="0.01"
                                style={{
                                  flex: 1,
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  color: "#4a148c"
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="The actual recovery time achieved for this process">
                            <td style={{ width: "40%" }}><label>RTA - Recovery Time Actual (hours):</label></td>
                            <td>
                              <input
                                type="number"
                                name="recoveryTimeActual"
                                value={form.recoveryTimeActual}
                                onChange={handleChange}
                                placeholder="Hours"
                                min="0"
                                step="0.01"
                                style={{
                                  flex: 1,
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  color: "#4a148c"
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="The recovery point objective for this process">
                            <td style={{ width: "40%" }}><label>RPO - Recovery Point Objective (hours):</label></td>
                            <td>
                              <input
                                type="number"
                                name="recoveryPointObjective"
                                value={form.recoveryPointObjective}
                                onChange={handleChange}
                                placeholder="Hours"
                                min="0"
                                step="0.01"
                                style={{
                                  flex: 1,
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  color: "#4a148c"
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="The actual recovery point achieved for this process">
                            <td style={{ width: "40%" }}><label>RPA - Recovery Point Actual (hours):</label></td>
                            <td>
                              <input
                                type="number"
                                name="recoveryPointActual"
                                value={form.recoveryPointActual}
                                onChange={handleChange}
                                placeholder="Hours"
                                min="0"
                                step="0.01"
                                style={{
                                  flex: 1,
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  color: "#4a148c"
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </fieldset>
                  </td>
                </tr>

                {/* Dependencies and Obligations */}
                <tr>
                  <td colSpan={2}>
                    <fieldset
                      style={{
                        border: `2px solid ${SC3_ACCENT}`,
                        borderRadius: SC3_BORDER_RADIUS,
                        padding: SC3_FORM_PADDING,
                        background: "#fffbea",
                      }}
                    >
                      <legend style={{
                        fontWeight: SC3_BTN_FONT_WEIGHT,
                        color: SC3_ACCENT
                      }}>Dependencies and Obligations</legend>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr title="Legal, regulatory, and contractual obligations that this process must comply with">
                            <td style={{ width: "40%" }}><label>Legal, Regulatory, and Contractual Obligations:</label></td>
                            <td>
                              <textarea
                                name="legalObligations"
                                value={form.legalObligations}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="The resources required to recover this process">
                            <td style={{ width: "40%" }}><label>Resources Required for Recovery:</label></td>
                            <td>
                              <textarea
                                name="resources"
                                value={form.resources}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="Key dependencies, including suppliers and third parties">
                            <td style={{ width: "40%" }}><label>Key Dependencies, including Suppliers and Third Parties:</label></td>
                            <td>
                              <textarea
                                name="dependencies"
                                value={form.dependencies}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="Dependencies on IT Systems and Applications">
                            <td style={{ width: "40%" }}><label>Dependencies on IT Systems and Applications:</label></td>
                            <td>
                              <textarea
                                name="itDependencies"
                                value={form.itDependencies}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="Dependencies on people and skills">
                            <td style={{ width: "40%" }}><label>Dependencies on people and skills:</label></td>
                            <td>
                              <textarea
                                name="peopleDependencies"
                                value={form.peopleDependencies}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="Dependencies on facilities and infrastructure">
                            <td style={{ width: "40%" }}><label>Dependencies on facilities and infrastructure:</label></td>
                            <td>
                              <textarea
                                name="facilitiesDependencies"
                                value={form.facilitiesDependencies}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                          <tr title="Dependencies on other business processes">
                            <td style={{ width: "40%" }}><label>Dependencies on other business processes:</label></td>
                            <td>
                              <textarea
                                name="processDependencies"
                                value={form.processDependencies}
                                onChange={handleChange}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: SC3_INPUT_PADDING,
                                  borderRadius: SC3_INPUT_BORDER_RADIUS,
                                  border: `1px solid ${SC3_SECONDARY}`,
                                  fontSize: "1rem",
                                  resize: "vertical",
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </fieldset>
                  </td>
                </tr>
              </tbody>
            </table>
          </details>
          <button
            type="submit"
            style={{
              background: SC3_SECONDARY,
              color: "#fff",
              border: "none",
              borderRadius: SC3_BTN_RADIUS,
              padding: SC3_BTN_PADDING,
              fontWeight: SC3_BTN_FONT_WEIGHT,
              fontSize: SC3_BTN_FONT_SIZE,
              cursor: "pointer",
              marginTop: 8,
              boxShadow: SC3_BTN_BOX_SHADOW(SC3_SECONDARY)
            }}
          >
            {editIndex !== null ? "Update Entry" : "Submit Process Details"}
          </button>
        </form>
      ) : null}

      {entries.length > 0 && (
        <>
          {/* Header stays inside the background card */}
          <h3 style={{ color: SC3_PRIMARY, marginTop: "2rem", marginLeft: 0, alignSelf: "flex-start" }}>
            BIA Processes
          </h3>
          {/* Table spills out both sides */}
          <div
            style={{
              width: "100vw",
              maxWidth: "100vw",
              position: "relative",
              left: "50%",
              right: "50%",
              marginLeft: "-50vw",
              marginRight: "-50vw",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box"
            }}
          >
            {/* Outer wrapper for horizontal scroll so that scroll bar does not hide the last row - works for Chrome and Edge, not for Firefox */}
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                padding: "0 0.05rem",
                boxSizing: "border-box"
              }}
            >
              {/* Table is now inside the scrollable area */}
              <table
                style={{
                  width: "95vw",
                  minWidth: 1200,
                  borderCollapse: "collapse",
                  background: SC3_TABLE_BG,
                  borderRadius: SC3_TABLE_BORDER_RADIUS,
                  overflow: "hidden",
                  margin: "0 auto"                  
                }}
              >
                <thead>
                  {/* Group titles row with colored lines */}
                  <tr>
                    <th colSpan={9} style={{
                      border: `4px solid ${SC3_PRIMARY}`,
                      background: "#f5faff",
                      color: SC3_PRIMARY,
                      fontWeight: SC3_TABLE_HEADER_FONT_WEIGHT,
                      fontSize: SC3_TABLE_HEADER_FONT_SIZE
                    }}>
                      Business Process Details
                    </th>
                    <th colSpan={18} style={{
                      border: `4px solid ${SC3_GREEN}`,
                      background: "#f8fff5",
                      color: SC3_GREEN,
                      fontWeight: SC3_TABLE_HEADER_FONT_WEIGHT,
                      fontSize: SC3_TABLE_HEADER_FONT_SIZE
                    }}>
                      Impact Assessment
                    </th>
                    <th colSpan={7} style={{
                      border: `4px solid #7b1fa2`, // deep purple
                      background: "#ede7f6",       // Light purple background
                      color: "#7b1fa2",            // Deep purple text
                      fontWeight: SC3_TABLE_HEADER_FONT_WEIGHT,
                      fontSize: SC3_TABLE_HEADER_FONT_SIZE,
                      textAlign: "center"
                    }}>
                      Process Criticality
                    </th>
                    <th colSpan={7} style={{
                      border: `4px solid ${SC3_ACCENT}`,
                      background: "#fffbea",
                      color: "#b38b00",
                      fontWeight: SC3_TABLE_HEADER_FONT_WEIGHT,
                      fontSize: SC3_TABLE_HEADER_FONT_SIZE
                    }}>
                      Dependencies and Obligations
                    </th>
                  </tr>
                  <tr>
                    {/* Column headers */}
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Process ID</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Name</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Business Unit</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Owner</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Description</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>In Scope Scenarios</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Out of Scope Scenarios</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Created By</th>
                    <th style={{ border: `3px solid ${SC3_PRIMARY}`, borderTop: "none", background: "#f5faff", minWidth: "120px" }}>Date Created</th>

                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Impact Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}>Impact</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Financial Impact Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}>Financial Impact</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Operational Impact Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}>Operational Impact</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>OH&S Impact Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}>OH&S Impact</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Staff Impacted Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}># Staff Impacted</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Sites Impacted Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}># Sites Impacted</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Reputational Impact Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}>Reputational Impact</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Statutory Impact Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}>Statutory Impact</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "150px" }}>Information Security Impact Score</th>
                    <th style={{ border: `3px solid ${SC3_GREEN}`, borderTop: "none", background: "#f8fff5", minWidth: "120px" }}>Information Security Impact</th>

                    <th style={{ border: `3px solid #7b1fa2`, borderTop: "none", background: "#ede7f6", color: "#7b1fa2", minWidth: "100px" }}>Criticality Rating</th>
                    <th style={{ border: `3px solid #7b1fa2`, borderTop: "none", background: "#ede7f6", color: "#7b1fa2", minWidth: "50px" }}>SLA</th>
                    <th style={{ border: `3px solid #7b1fa2`, borderTop: "none", background: "#ede7f6", color: "#7b1fa2", minWidth: "50px" }}>MTPD</th>
                    <th style={{ border: `3px solid #7b1fa2`, borderTop: "none", background: "#ede7f6", color: "#7b1fa2", minWidth: "50px" }}>RTO</th>
                    <th style={{ border: `3px solid #7b1fa2`, borderTop: "none", background: "#ede7f6", color: "#7b1fa2", minWidth: "50px" }}>RTA</th>
                    <th style={{ border: `3px solid #7b1fa2`, borderTop: "none", background: "#ede7f6", color: "#7b1fa2", minWidth: "50px" }}>RPO</th>
                    <th style={{ border: `3px solid #7b1fa2`, borderTop: "none", background: "#ede7f6", color: "#7b1fa2", minWidth: "50px" }}>RPA</th>

                    <th style={{ border: `3px solid ${SC3_ACCENT}`, borderTop: "none", background: "#fffbea", minWidth: "120px" }}>Legal</th>
                    <th style={{ border: `3px solid ${SC3_ACCENT}`, borderTop: "none", background: "#fffbea", minWidth: "120px" }}>Resources</th>
                    <th style={{ border: `3px solid ${SC3_ACCENT}`, borderTop: "none", background: "#fffbea", minWidth: "120px" }}>Key Dependencies</th>
                    <th style={{ border: `3px solid ${SC3_ACCENT}`, borderTop: "none", background: "#fffbea", minWidth: "120px" }}>IT</th>
                    <th style={{ border: `3px solid ${SC3_ACCENT}`, borderTop: "none", background: "#fffbea", minWidth: "120px" }}>People</th>
                    <th style={{ border: `3px solid ${SC3_ACCENT}`, borderTop: "none", background: "#fffbea", minWidth: "120px" }}>Facilities</th>
                    <th style={{ border: `3px solid ${SC3_ACCENT}`, borderTop: "none", background: "#fffbea", minWidth: "120px" }}>Process</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr
                      key={idx}
                      style={{
                        cursor: "pointer",
                        outline: editIndex === idx ? `3px solid ${SC3_SECONDARY}` : undefined,
                        background: editIndex === idx ? "#e8f4f8" : (hoveredRowIndex === idx ? "#f0f8ff" : undefined),
                        transition: "all 0.2s ease",
                        boxShadow: editIndex === idx ? `0 0 8px ${SC3_SECONDARY}33` : (hoveredRowIndex === idx ? `0 2px 4px rgba(0,0,0,0.1)` : undefined)
                      }}
                      onClick={() => handleRowClick(idx)}
                      onMouseEnter={() => setHoveredRowIndex(idx)}
                      onMouseLeave={() => setHoveredRowIndex(null)}
                      title={editIndex === idx ? 
                        `Currently editing: ${entry.processId} - ${entry.processName} (click to save changes)` : 
                        `${entry.processId} - ${entry.processName} (click to edit this entry)`
                      }
                    >
                      {/* ...existing <td> cells for entry fields... */}
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.processId}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.processName}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.businessUnit}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.owner}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.description}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.inScopeScenarios}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.outOfScopeScenarios}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.createdBy}</td>
                      <td style={{ border: `2px solid ${SC3_PRIMARY}`, minWidth: "120px" }}>{entry.dateCreated}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{formatImpactScore(entry.impactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.impact}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{formatImpactScore(entry.financialImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>
                        {entry.financialImpact && entry.financialImpactCurrency === "dollar" && "$"}
                        {entry.financialImpact && entry.financialImpactCurrency === "euro" && "€"}
                        {entry.financialImpact && entry.financialImpactCurrency === "pound" && "£"}
                        {entry.financialImpact && entry.financialImpactCurrency === "yen" && "¥"}
                        {entry.financialImpact && entry.financialImpactCurrency === "rupee" && "₹"}
                        {entry.financialImpact && entry.financialImpactCurrency === "peso" && "₱"}
                        {entry.financialImpact && entry.financialImpactCurrency === "won" && "₩"}
                        {entry.financialImpact && entry.financialImpactCurrency === "lira" && "₺"}
                        {entry.financialImpact && entry.financialImpactCurrency === "franc" && "₣"}
                        {entry.financialImpact && entry.financialImpactCurrency === "shekel" && "₪"}
                        {entry.financialImpact && entry.financialImpactCurrency === "other" && "¤"}
                        {entry.financialImpact}
                      </td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "150px" }}>{formatImpactScore(entry.operationalImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.operationalImpact}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "150px" }}>{formatImpactScore(entry.ohsImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.ohsImpact}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "150px" }}>{formatImpactScore(entry.staffImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.numberOfStaffImpacted}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "150px" }}>{formatImpactScore(entry.sitesImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.numberOfSitesImpacted}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "150px" }}>{formatImpactScore(entry.reputationalImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.reputationalImpact}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "150px" }}>{formatImpactScore(entry.statutoryImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.statutoryImpact}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "150px" }}>{formatImpactScore(entry.infosecImpactScore)}</td>
                      <td style={{ border: `2px solid ${SC3_GREEN}`, minWidth: "120px" }}>{entry.infosecImpact}</td>
                      <td style={{ border: `2px solid #7b1fa2`, minWidth: "100px" }}>{formatCriticalityRating(entry.criticality)}</td>
                      <td style={{ border: `2px solid #7b1fa2`, minWidth: "60px" }}>{entry.sla}</td>
                      <td style={{ border: `2px solid #7b1fa2`, minWidth: "60px" }}>{entry.mtpd}</td>
                      <td style={{ border: `2px solid #7b1fa2`, minWidth: "60px" }}>{entry.recoveryTimeObjective}</td>
                      <td style={{ border: `2px solid #7b1fa2`, minWidth: "60px" }}>{entry.recoveryTimeActual}</td>
                      <td style={{ border: `2px solid #7b1fa2`, minWidth: "60px" }}>{entry.recoveryPointObjective}</td>
                      <td style={{ border: `2px solid #7b1fa2`, minWidth: "60px" }}>{entry.recoveryPointActual}</td>
                      <td style={{ border: `2px solid ${SC3_ACCENT}`, minWidth: "120px" }}>{entry.legalObligations}</td>
                      <td style={{ border: `2px solid ${SC3_ACCENT}`, minWidth: "120px" }}>{entry.resources}</td>
                      <td style={{ border: `2px solid ${SC3_ACCENT}`, minWidth: "120px" }}>{entry.dependencies}</td>
                      <td style={{ border: `2px solid ${SC3_ACCENT}`, minWidth: "120px" }}>{entry.itDependencies}</td>
                      <td style={{ border: `2px solid ${SC3_ACCENT}`, minWidth: "120px" }}>{entry.peopleDependencies}</td>
                      <td style={{ border: `2px solid ${SC3_ACCENT}`, minWidth: "120px" }}>{entry.facilitiesDependencies}</td>
                      <td style={{ border: `2px solid ${SC3_ACCENT}`, minWidth: "120px" }}>{entry.processDependencies}</td>
                      {/* Move Up/Down buttons at the end */}
                      <td style={{ background: "#fff", border: "none", padding: 0, minWidth: 32, whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); moveRowUp(idx); }}
                          disabled={idx === 0}
                          style={{
                            background: "none",
                            border: "none",
                            color: idx === 0 ? "#ccc" : SC3_SECONDARY,
                            cursor: idx === 0 ? "not-allowed" : "pointer",
                            fontSize: "1.1em",
                            padding: "0 4px"
                          }}
                          title="Move Up"
                        >▲</button>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); moveRowDown(idx); }}
                          disabled={idx === entries.length - 1}
                          style={{
                            background: "none",
                            border: "none",
                            color: idx === entries.length - 1 ? "#ccc" : SC3_SECONDARY,
                            cursor: idx === entries.length - 1 ? "not-allowed" : "pointer",
                            fontSize: "1.1em",
                            padding: "0 4px"
                          }}
                          title="Move Down"
                        >▼</button>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleRemove(idx); }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c00",
                            cursor: "pointer",
                            fontSize: "1.1em",
                            padding: "0 4px"
                          }}
                          title="Remove Entry"
                        >✖</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p></p> {/* Empty paragraph to ensure the table has some space below */}
            </div>
            {/* Button row: Create New Entry and Export to Excel */}
            <div style={{ display: "flex", gap:  12, margin: "1.5em 0 2em 0" }}>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setEditIndex(null);
                  setSubmitted(false);
                  setFieldsOpen(true);
                }}
                style={{
                  background: "#fff",
                  color: SC3_SECONDARY,
                  border: `2px solid ${SC3_SECONDARY}`,
                  borderRadius: SC3_BTN_RADIUS,
                  padding: SC3_BTN_PADDING,
                  fontWeight: SC3_BTN_FONT_WEIGHT,
                  fontSize: SC3_BTN_FONT_SIZE,
                  cursor: "pointer",
                  boxShadow: SC3_BTN_BOX_SHADOW(SC3_SECONDARY)
                }}
              >
                Add New Process
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to start a new BIA? This will clear all current entries."
                    )
                  ) {
                    setEntries([]);
                    setForm(initialForm);
                    setEditIndex(null);
                    setSubmitted(false);
                    setFieldsOpen(true);
                  }
                  // else do nothing (cancel)
                }}
                style={{
                  background: "#fff",
                  color: SC3_PRIMARY,
                  border: `2px solid ${SC3_PRIMARY}`,
                  borderRadius: SC3_BTN_RADIUS,
                  padding: SC3_BTN_PADDING,
                  fontWeight: SC3_BTN_FONT_WEIGHT,
                  fontSize: SC3_BTN_FONT_SIZE,
                  cursor: "pointer",
                  boxShadow: SC3_BTN_BOX_SHADOW(SC3_PRIMARY)
                }}
              >
                Start New
              </button>
              <button
                type="button"
                onClick={handleExport}
                style={{
                  background: SC3_ACCENT,
                  color: "#fff",
                  border: "none",
                  borderRadius: SC3_BTN_RADIUS,
                  padding: SC3_BTN_PADDING,
                  fontWeight: SC3_BTN_FONT_WEIGHT,
                  fontSize: SC3_BTN_FONT_SIZE,
                  cursor: "pointer",
                  boxShadow: SC3_BTN_BOX_SHADOW(SC3_ACCENT)
                }}
              >
                Export to Excel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function WrappedBIAForm() {
  return (
    <>
      <BIAForm />
      <div
        style={{
          width: "100%",
          textAlign: "center",
          color: "#888",
          fontSize: "0.95em",
          marginTop: "2em",
          marginBottom: "0.5em",
          letterSpacing: "0.03em",
          userSelect: "none"
        }}
      >
        SC3 BIA Form {VERSION}
      </div>
    </>
  );
}

export default WrappedBIAForm;