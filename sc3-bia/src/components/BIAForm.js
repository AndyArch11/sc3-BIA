import React, { useState } from "react";
import InputForm from "./BIAInputForm";
import BIAIntro from "./BIAIntro";
import BIATable from "./BIATable";
import BIAReport from "./BIAReport";
import { exportBIAToExcel } from "./ExcelExport";
import "./BIA.css";

const VERSION = "v0.2.0"; // Update as needed

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
  slaPeriod: "Month",
  slaIncludesPlanned: false,
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
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [criticalityDefaults, setCriticalityDefaults] = useState({
    1: { mtpd: "168", rto: "72", rpo: "48", sla: "90%", slaPeriod: "Month", slaIncludesPlanned: false },
    2: { mtpd: "120", rto: "48", rpo: "24", sla: "95%", slaPeriod: "Month", slaIncludesPlanned: false },
    3: { mtpd: "72", rto: "24", rpo: "12", sla: "99%", slaPeriod: "Month", slaIncludesPlanned: false },
    4: { mtpd: "48", rto: "12", rpo: "6", sla: "99.9%", slaPeriod: "Month", slaIncludesPlanned: false },
    5: { mtpd: "24", rto: "4", rpo: "1", sla: "99.95%", slaPeriod: "Month", slaIncludesPlanned: false }
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
      slaPeriod: defaults.slaPeriod || "Month",
      slaIncludesPlanned: defaults.slaIncludesPlanned || false,
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
        slaPeriod: defaults.slaPeriod || "Month",
        slaIncludesPlanned: defaults.slaIncludesPlanned || false,
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
    exportBIAToExcel(entries);
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
    <div className="bia-container">
      <h2 className="bia-main-heading">
        Business Impact Assessment Form
      </h2>
      <BIAIntro 
        criticalityDefaults={criticalityDefaults}
        setCriticalityDefaults={setCriticalityDefaults}
      />
      
      {(!submitted || entries.length === 0) ? (
        <InputForm 
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleBack}
          editIndex={editIndex}
          fieldsOpen={fieldsOpen || entries.length === 0}
          setFieldsOpen={setFieldsOpen}
        />
      ) : null}

      <BIATable
        entries={entries}
        editIndex={editIndex}
        hoveredRowIndex={hoveredRowIndex}
        setHoveredRowIndex={setHoveredRowIndex}
        handleRowClick={handleRowClick}
        moveRowUp={moveRowUp}
        moveRowDown={moveRowDown}
        handleRemove={handleRemove}
        formatImpactScore={formatImpactScore}
        formatCriticalityRating={formatCriticalityRating}
        handleExport={handleExport}
        initialForm={initialForm}
        setForm={setForm}
        setEditIndex={setEditIndex}
        setSubmitted={setSubmitted}
        setFieldsOpen={setFieldsOpen}
        setEntries={setEntries}
      />

      <BIAReport entries={entries} />
    </div>
  );
};

function WrappedBIAForm() {
  return (
    <>
      <BIAForm />
      <div className="bia-version">
        SC3 BIA Form {VERSION}
      </div>
    </>
  );
}

export default WrappedBIAForm;