import React, { useState } from "react";
import BIAInputForm from "./BIAInputForm";
import BIAIntro from "./BIAIntro";
import BIATable from "./BIATable";
import BIAReport from "./BIAReport";
import { exportBIAToExcel } from "./ExcelExport";
import "./BIA.css";

const VERSION = "v0.2.2"; // Update as needed

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
  environmentalImpactScore: "1",
  environmentalImpact: "",
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

const CRITICALITY_DEFAULTS = {
  1: { mtpd: "168", mtpdSymbol: "=", rto: "72", rtoSymbol: "=", rpo: "48", rpoSymbol: "=", sla: "90%", slaSymbol: "=", slaPeriod: "Month", slaIncludesPlanned: false },
  2: { mtpd: "120", mtpdSymbol: "<", rto: "48", rtoSymbol: "≤", rpo: "24", rpoSymbol: "≤", sla: "95%", slaSymbol: "≥", slaPeriod: "Month", slaIncludesPlanned: false },
  3: { mtpd: "72", mtpdSymbol: "<", rto: "24", rtoSymbol: "≤", rpo: "12", rpoSymbol: "≤", sla: "99%", slaSymbol: "≥", slaPeriod: "Month", slaIncludesPlanned: false },
  4: { mtpd: "48", mtpdSymbol: "<", rto: "12", rtoSymbol: "≤", rpo: "6", rpoSymbol: "≤", sla: "99.9%", slaSymbol: "≥", slaPeriod: "Month", slaIncludesPlanned: false },
  5: { mtpd: "24", mtpdSymbol: "<", rto: "4", rtoSymbol: "≤", rpo: "1", rpoSymbol: "≤", sla: "99.95%", slaSymbol: "≥", slaPeriod: "Month", slaIncludesPlanned: false }
};

const BIAForm = () => {
  const [form, setForm] = useState(initialForm);
  const [entries, setEntries] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [criticalityDefaults, setCriticalityDefaults] = useState(CRITICALITY_DEFAULTS);

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
    // If Impact of Disruption is set and not "1", use it for criticality
    let criticality;
    if (f.impactScore && f.impactScore !== "1") {
      criticality = f.impactScore;
    } else {
      // Otherwise, use the average of the other impact scores
      const scores = [
        f.financialImpactScore,
        f.operationalImpactScore,
        f.ohsImpactScore,
        f.environmentalImpactScore,
        f.staffImpactScore,
        f.sitesImpactScore,
        f.reputationalImpactScore,
        f.statutoryImpactScore,
        f.infosecImpactScore
      ].map(s => parseInt(s || "1", 10));
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg <= 1.5) criticality = "1";
      else if (avg <= 2.5) criticality = "2";
      else if (avg <= 3.5) criticality = "3";
      else if (avg <= 4.5) criticality = "4";
      else criticality = "5";
    }
    // Calculate processImpactScore as sum of all impact scores
    const impactSum =
      Number(f.impactScore) +
      Number(f.financialImpactScore) +
      Number(f.operationalImpactScore) +
      Number(f.ohsImpactScore) +
      Number(f.environmentalImpactScore) +
      Number(f.staffImpactScore) +
      Number(f.sitesImpactScore) +
      Number(f.reputationalImpactScore) +
      Number(f.statutoryImpactScore) +
      Number(f.infosecImpactScore);
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
    const impactFields = [
      "impactScore",
      "financialImpactScore",
      "operationalImpactScore",
      "ohsImpactScore",
      "environmentalImpactScore",
      "staffImpactScore",
      "sitesImpactScore",
      "reputationalImpactScore",
      "statutoryImpactScore",
      "infosecImpactScore",
    ];
    let updatedForm = { ...form, [name]: value };

    // If Impact of Disruption is changed, reset other impact assessment values to 1
    if (name === "impactScore") {
      updatedForm = {
        ...updatedForm,
        financialImpactScore: "1",
        operationalImpactScore: "1",
        ohsImpactScore: "1",
        environmentalImpactScore: "1",
        staffImpactScore: "1",
        sitesImpactScore: "1",
        reputationalImpactScore: "1",
        statutoryImpactScore: "1",
        infosecImpactScore: "1",
      };
    }

    // If any other Impact Assessment field changes, reset impactScore to "1"
    if (impactFields.includes(name) && name !== "impactScore") {
      updatedForm.impactScore = "1";
    }

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

 
  
  // Drag and drop state for reordering risks
  const [draggedEntryIndex, setDraggedEntryIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);

  const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);

  const updatedEntries = [...entries];
  const draggedEntry= updatedEntries[draggedEntryIndex];

  // Drag and drop handlers for reordering processes
  const handleMoveProcess = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= entries.length) {
      return;
    }

    const updatedEntries = [...entries];
    const entryToMove = updatedEntries[fromIndex];
    updatedEntries.splice(fromIndex, 1);
    updatedEntries.splice(toIndex, 0, entryToMove);

    setEntries(updatedEntries);

    // Update selected process index if needed
    if (selectedEntryIndex === fromIndex) {
      setSelectedEntryIndex(toIndex);
    } else if (selectedEntryIndex !== null) {
      if (fromIndex < selectedEntryIndex && toIndex >= selectedEntryIndex) {
        setSelectedEntryIndex(selectedEntryIndex - 1);
      } else if (fromIndex > selectedEntryIndex && toIndex <= selectedEntryIndex) {
        setSelectedEntryIndex(selectedEntryIndex + 1);
      }
    }
  };
    
  const handleDragStart = (e, index) => {
    setDraggedEntryIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedEntryIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedEntryIndex === null || draggedEntryIndex === dropIndex) {
      return;
    }

    // Remove the dragged item
    updatedEntries.splice(draggedEntryIndex, 1);

    // Insert it at the new position
    const insertIndex =
      draggedEntryIndex < dropIndex ? dropIndex - 1 : dropIndex;
    updatedEntries.splice(insertIndex, 0, draggedEntry);

    setEntries(updatedEntries);

    // Update selected entry index if needed
    if (selectedEntryIndex === draggedEntryIndex) {
      setSelectedEntryIndex(insertIndex);
    } else if (selectedEntryIndex !== null) {
      if (
        draggedEntryIndex < selectedEntryIndex &&
        insertIndex >= selectedEntryIndex
      ) {
        setSelectedEntryIndex(selectedEntryIndex - 1);
      } else if (
        draggedEntryIndex > selectedEntryIndex &&
        insertIndex <= selectedEntryIndex
      ) {
        setSelectedEntryIndex(selectedEntryIndex + 1);
      }
    }

    setDraggedEntryIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="bia-main-container">
      <h2 className="bia-main-heading">
        Business Impact Assessment Form
      </h2>

      <BIAIntro 
        criticalityDefaults={criticalityDefaults}
        setCriticalityDefaults={setCriticalityDefaults}
        initialCriticalityDefaults={CRITICALITY_DEFAULTS}
      />
      
      {(!submitted || entries.length === 0) ? (
        <BIAInputForm 
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
        setDraggedProcessIndex={setDraggedEntryIndex}
        draggedProcessIndex={draggedEntryIndex}
        setDropTargetIndex={setDropTargetIndex}
        dropTargetIndex={dropTargetIndex}
        handleMoveProcess={handleMoveProcess}
      />

      <BIAReport entries={entries} />
    </div>
  );
};

export default function WrappedBIAForm() {
  return (
    <>
      <BIAForm />
      <div className="bia-version">
        SC3 BIA Form {VERSION}
      </div>
    </>
  );
}