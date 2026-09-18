import * as ExcelJS from 'exceljs';

const processCols = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const impactCols = ["J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA"];
const criticalCols = ["AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ"];
const depCols = ["AK", "AL", "AM", "AN", "AO", "AP", "AQ"];

/**
 * Excel Export Utility for BIA (Business Impact Assessment) data
 * Exports entries to a structured Excel file with guidance and data sheets
 */

export const exportBIAToExcel = async (entries) => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SC3 Business Impact Assessment Tool';
    workbook.lastModifiedBy = 'SC3 Business Impact Assessment Tool';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Add a worksheet for BIA Guidance
    const guidanceData = createGuidanceWorksheet();
    const guidanceWorksheet = workbook.addWorksheet('BIA Guidance');
    guidanceWorksheet.addRows(guidanceData);
    guidanceWorksheet.getColumn(1).width = 100;
    styleGuidanceWorksheet(guidanceWorksheet);

    // Add a worksheet for BIA Entries
    const entriesData = createEntriesWorksheet(entries);
    const entriesWorksheet = workbook.addWorksheet('BIA Entries');
    entriesWorksheet.addRows(entriesData);
    autoSizeWorksheetColumns(entriesWorksheet, entriesData);
    styleEntriesWorksheet(entriesWorksheet, entriesData);

    // Generate timestamp for filename
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // Format: YYYY-MM-DDTHH-MM-SS
    const filename = `SC3_BIA_Export_${timestamp}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating Excel export:', error);
    alert('An error occurred while creating the Excel file. Please try again.');
  }
};

const styleGuidanceWorksheet = (worksheet) => {
  if (worksheet.getRow(1).cellCount > 0) {
    const headerCell = worksheet.getRow(1).getCell(1);
    headerCell.font = { bold: true, size: 16, color: { rgb: 'FFFFFF' } };
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { rgb: '2F5233' }
    };
    headerCell.alignment = { horizontal: 'center' };
  }
};

const autoSizeWorksheetColumns = (worksheet, worksheetData) => {
  if (worksheetData.length > 0 && worksheetData[0]) {
    const maxWidth = worksheetData[0].length;
    for (let i = 1; i <= maxWidth; i++) {
      let maxLength = 10;
      worksheetData.forEach(row => {
        if (row[i - 1] && row[i - 1].toString().length > maxLength) {
          maxLength = row[i - 1].toString().length;
        }
      });
      worksheet.getColumn(i).width = Math.min(Math.max(maxLength + 2, 10), 50);
    }
  }
};

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
    "Operational Impact": entry.operationalImpact,
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
    "Statutory Impact": entry.statutoryImpact,
    "InfoSec Impact Score": entry.infosecImpactScore,
    "InfoSec Impact": entry.infosecImpact,
    "Criticality Rating": entry.criticality,
    "MTPD (hours)": entry.mtpd,
    "RTO (hours)": entry.recoveryTimeObjective,
    "RTA (hours)": entry.recoveryTimeActual,
    "RPO (hours)": entry.recoveryPointObjective,
    "RPA (hours)": entry.recoveryPointActual,
    "SLO (Availability)": entry.sla,
    "SLO Period": entry.slaPeriod,
    "SLO Includes Planned Outages": entry.slaIncludesPlanned ? "Yes" : "No",
    "Legal": entry.legalObligations,
    "Resources": entry.resources,
    "Dependencies": entry.dependencies,
    "IT": entry.itDependencies,
    "People": entry.peopleDependencies,
    "Facilities": entry.facilitiesDependencies,
    "Process": entry.processDependencies,
  }));

  const headerRow = Object.keys(data[0] || {});
  const dataRows = data.map(row => Object.values(row));

  return [sectionHeaders, headerRow, ...dataRows];
};

const styleEntriesWorksheet = (worksheet, worksheetData) => {
  const columnGroups = [
    { columns: processCols, fill: 'F5FAFF' },
    { columns: impactCols, fill: 'F8FFF5' },
    { columns: criticalCols, fill: 'EDE7F6', font: '7B1FA2' },
    { columns: depCols, fill: 'FFFBEA' }
  ];

  const applyCellStyle = (cell, fill, font) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${fill}` } };
    cell.alignment = { vertical: 'top', wrapText: true };
    if (font) cell.font = { color: { argb: `FF${font}` }, bold: true };
  };

  columnGroups.forEach(({ columns, fill, font }) => {
    columns.forEach((column) => {
      const columnNumber = column.split('').reduce((value, character) => value * 26 + character.charCodeAt(0) - 64, 0);
      for (let rowNumber = 1; rowNumber <= worksheetData.length; rowNumber++) {
        applyCellStyle(worksheet.getCell(rowNumber, columnNumber), fill, rowNumber <= 2 ? (font || '003366') : font);
      }
    });
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { rgb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { rgb: '2F5233' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
};
