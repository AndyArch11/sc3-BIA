import * as XLSX from "xlsx";

/**
 * Excel Export Utility for BIA (Business Impact Assessment) data
 * Exports entries to a structured Excel file with guidance and data sheets
 */

export const exportBIAToExcel = (entries) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add a worksheet for BIA Guidance
    const guidanceData = createGuidanceWorksheet();
    const guidanceWorkSheet = XLSX.utils.aoa_to_sheet(guidanceData);
    XLSX.utils.book_append_sheet(workbook, guidanceWorkSheet, "BIA Guidance");

    // Add a worksheet for BIA Entries
    const entriesData = createEntriesWorksheet(entries);
    const entriesWorkSheet = XLSX.utils.aoa_to_sheet(entriesData);
        
    // Set column widths for entries worksheet - make them wider for better readability
    const entriesColWidths = Array(entriesData[0]?.length || 0).fill({ width: 30 });
    entriesWorkSheet['!cols'] = entriesColWidths;
    XLSX.utils.book_append_sheet(workbook, entriesWorkSheet, "BIA Entries");

    // Generate timestamp for filename
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // Format: YYYY-MM-DDTHH-MM-SS
    const filename = `SC3_BIA_Export_${timestamp}.xlsx`;

    // Export the workbook
    XLSX.writeFile(workbook, filename);
        
    console.log(`Excel file "${filename}" has been generated and downloaded successfully.`);

  } catch (error) {
    console.error('Error creating Excel export:', error);
        alert('An error occurred while creating the Excel file. Please try again.');
  }
}

const createGuidanceWorksheet = () => {
  return [
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
    [""],
    ["Dependencies and Obligations:"],
    ["Identify and document the dependencies and obligations related to the business processes. These may contribute towards planning and executing effective business continuity strategies and the recovery from any process disruptions."],
    [""],
    ["It is important to regularly review and update the NFRs to ensure that they remain relevant and effective in addressing the evolving business landscape."],
    [""],
    ["Disclaimer: The information provided here is for general informational purposes only and will require adaptation for specific businesses and maturity capabilities and is not intended as legal advice. Please consult with a qualified legal professional for specific legal advice tailored to your situation."],
    [""],
    [
      `BIA Assessment Form - Generated on ${new Date().toLocaleDateString()}`
    ]
  ];
};

const createEntriesWorksheet = (entries) => {
  if (!entries || entries.length === 0) {
      return [
          ['No AI Risk Assessment entries found'],
          ['Please create some risk assessments first before exporting.']
      ];
  }

  const sectionHeaders = [
    'Business Process Details',
    '', '', '', '', '', '', '', '', //{9}
    'Impact Assessment',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',  //{20}
    'Process Criticality',
    '', '', '', '', '', '', '', '', //{9}
    'Dependencies and Obligations',
    '', '', '', '', '', '' //{7}
  ];

  // Transform entries data for export with proper column ordering
  const data = entries.map((entry) => ({
    "Process ID": entry.processId,
    "Process Name": entry.processName,
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
    "Financial Impact": (
      entry.financialImpactCurrency === "dollar" ? "$" :
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
    "Environmental Impact Score": entry.environmentalImpactScore,
    "Environmental Impact": entry.environmentalImpact,
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
    "MTPD": entry.mtpd,
    "RTO": entry.recoveryTimeObjective,
    "RTA": entry.recoveryTimeActual,         
    "RPO": entry.recoveryPointObjective,
    "RPA": entry.recoveryPointActual,
    "SLA": entry.sla,
    "SLA Period": entry.slaPeriod,
    "SLA Includes Planned": entry.slaIncludesPlanned ? "Yes" : "No",
    "Legal": entry.legalObligations,
    "Resources": entry.resources,
    "Dependencies": entry.dependencies,
    "IT": entry.itDependencies,
    "People": entry.peopleDependencies,
    "Facilities": entry.facilitiesDependencies,
    "Process": entry.processDependencies,
  }));

  const wsEntries = XLSX.utils.json_to_sheet(data);

  // Define column keys for styling groups
  const processCols = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]; 
  const impactCols = ["J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y","Z", "AA"];
  const criticalCols = ["AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ"]; 
  const depCols = ["AK", "AL", "AM", "AN", "AO", "AP", "AQ"];

  // Style definitions - Excel colour styling not working with xlsx, requires xlsx-style or SheetJS Pro
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

  return [sectionHeaders, ...XLSX.utils.sheet_to_json(wsEntries, { header: 1 })];
};
