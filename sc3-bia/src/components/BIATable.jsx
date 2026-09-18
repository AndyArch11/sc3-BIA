import React from "react";
import "./BIA.css";

const BIATable = ({
  entries,
  editIndex,
  hoveredRowIndex,
  setHoveredRowIndex,
  handleRowClick,
  moveRowUp,
  moveRowDown,
  handleRemove,
  formatImpactScore,
  formatCriticalityRating,
  handleExport,
  initialForm,
  setForm,
  setEditIndex,
  setSubmitted,
  setFieldsOpen,
  setEntries,
  setDraggedProcessIndex,
  draggedProcessIndex,
  setDropTargetIndex,
  dropTargetIndex,
  handleMoveProcess,
  biaOpen,
  setBiaOpen
}) => {

  const handleDragStart = (e, index) => {
    setDraggedProcessIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetIndex(index);
  };

  const handleDragLeave = () => {
    setDropTargetIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedProcessIndex !== null && draggedProcessIndex !== dropIndex) {
      handleMoveProcess(draggedProcessIndex, dropIndex);
    }
    setDraggedProcessIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedProcessIndex(null);
    setDropTargetIndex(null);
  };

  // Helper function to get criticality color class
  const getCriticalityColorClass = (criticality) => {
    const rating = criticality || "1";
    return `bia-criticality-color-${rating}`;
  };

  // Helper function to get impact score color class
  const getImpactColorClass = (impactScore) => {
    const score = impactScore || "1";
    return `bia-impact-color-${score}`;
  };

  // Helper function to create new entry
  const handleAddNewProcess = () => {
    setForm(initialForm);
    setEditIndex(null);
    setSubmitted(false);
    setFieldsOpen(true);
  };

  // Helper function to start new BIA
  const handleStartNew = () => {
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
  };

  if (entries.length === 0) {
    return null;
  }

  return (    
    <div className="bia-table-outer-container">
      <div className="bia-table-inner">
        <details open={biaOpen} className="bia-table-section">
          <summary className="bia-table-summary"
            onClick={(e) => {
              e.preventDefault();
              setBiaOpen(!biaOpen);
            }}>
              🗃️ BIA Processes
              <span className="bia-table-count">{entries.length} Business Impact Assessment{entries.length !== 1 ? 's' : ''}</span>
          </summary>
          <div className="bia-table-content">
            {entries.length > 0 && (
              <div className="bia-table-statistics">
                <p>
                  <strong>Total Processes:</strong> {entries.length} |
                  <strong> Platinum / Tier 1:</strong> {entries.filter(entry => entry.criticality === "5").length} |
                  <strong> Gold / Tier 2:</strong> {entries.filter(entry => entry.criticality === "4").length} |
                  <strong> Silver / Tier 3:</strong> {entries.filter(entry => entry.criticality === "3").length} |
                  <strong> Bronze / Tier 4:</strong> {entries.filter(entry => entry.criticality === "2").length} |
                  <strong> None / Tier 5:</strong> {entries.filter(entry => entry.criticality === "1").length}
                </p>
              </div>
            )}
          </div>
        </details>
        {/* Table spills out both sides - moved outside bia-table-inner to avoid max-width constraint */}
        <div className="bia-table-container">
          {/* Outer wrapper for horizontal scroll so that scroll bar does not hide the last row - works for Chrome and Edge, not for Firefox */}
          <div className="bia-table-scroll">
              {/* Table is now inside the scrollable area */}
              <table className="bia-table">
                <thead>
                  {/* Group titles row with colored lines */}
                  <tr>
                    <th colSpan={9} className="bia-th-group-business">
                      Business Process Details
                    </th>
                    <th colSpan={20} className="bia-th-group-impact">
                      Impact Assessment
                    </th>
                    <th colSpan={9} className="bia-th-group-criticality">
                      Process Criticality
                    </th>
                    <th colSpan={7} className="bia-th-group-dependencies">
                      Dependencies and Obligations
                    </th>
                  </tr>
                  <tr>
                    {/* Column headers */}
                    <th className="bia-th-detail">Process ID</th>
                    <th className="bia-th-detail">Name</th>
                    <th className="bia-th-detail">Business Unit</th>
                    <th className="bia-th-detail">Owner</th>
                    <th className="bia-th-detail">Description</th>
                    <th className="bia-th-detail">In Scope Scenarios</th>
                    <th className="bia-th-detail">Out of Scope Scenarios</th>
                    <th className="bia-th-detail">Created By</th>
                    <th className="bia-th-detail">Date Created</th>

                    <th className="bia-th-impact">Impact Score</th>
                    <th className="bia-th-impact">Impact</th>
                    <th className="bia-th-impact">Financial Impact Score</th>
                    <th className="bia-th-impact">Financial Impact</th>
                    <th className="bia-th-impact">Operational Impact Score</th>
                    <th className="bia-th-impact">Operational Impact</th>
                    <th className="bia-th-impact">OH&S Impact Score</th>
                    <th className="bia-th-impact">OH&S Impact</th>
                    <th className="bia-th-impact">Environmental Impact Score</th>
                    <th className="bia-th-impact">Environmental Impact</th>
                    <th className="bia-th-impact">Staff Impacted Score</th>
                    <th className="bia-th-impact"># Staff Impacted</th>
                    <th className="bia-th-impact">Sites Impacted Score</th>
                    <th className="bia-th-impact"># Sites Impacted</th>
                    <th className="bia-th-impact">Reputational Impact Score</th>
                    <th className="bia-th-impact">Reputational Impact</th>
                    <th className="bia-th-impact">Statutory Impact Score</th>
                    <th className="bia-th-impact">Statutory Impact</th>
                    <th className="bia-th-impact">Information Security Impact Score</th>
                    <th className="bia-th-impact">Information Security Impact</th>

                    <th className="bia-th-criticality">Criticality Rating</th>
                    <th className="bia-th-criticality">MTPD</th>
                    <th className="bia-th-criticality">RTO</th>
                    <th className="bia-th-criticality">RTA</th>
                    <th className="bia-th-criticality">RPO</th>
                    <th className="bia-th-criticality">RPA</th>
                    <th className="bia-th-criticality">SLA</th>
                    <th className="bia-th-criticality">SLA Period</th>
                    <th className="bia-th-criticality">SLA Incl. Planned</th>

                    <th className="bia-th-dependency">Legal</th>
                    <th className="bia-th-dependency">Resources</th>
                    <th className="bia-th-dependency">Key Dependencies</th>
                    <th className="bia-th-dependency">IT</th>
                    <th className="bia-th-dependency">People</th>
                    <th className="bia-th-dependency">Facilities</th>
                    <th className="bia-th-dependency">Process</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`bia-table-row 
                        ${dropTargetIndex === idx ? 'bia-table-row-drop-target' : ''} 
                        ${editIndex === idx ? 'bia-table-row-editing' : ''} 
                        ${hoveredRowIndex === idx ? 'bia-table-row-hover' : ''}`}
                      onClick={() => handleRowClick(idx)}
                      onMouseEnter={() => setHoveredRowIndex(idx)}
                      onMouseLeave={() => setHoveredRowIndex(null)}
                      title={editIndex === idx ? 
                        `Currently editing: ${entry.processId} - ${entry.processName} (click to save changes)` : 
                        `${entry.processId} - ${entry.processName} (click to edit this entry)`
                      }
                    >
                      {/* Business Process Details */}
                      <td className="bia-td-detail">{entry.processId}</td>
                      <td className="bia-td-detail">{entry.processName}</td>
                      <td className="bia-td-detail">{entry.businessUnit}</td>
                      <td className="bia-td-detail">{entry.owner}</td>
                      <td className="bia-td-detail">{entry.description}</td>
                      <td className="bia-td-detail">{entry.inScopeScenarios}</td>
                      <td className="bia-td-detail">{entry.outOfScopeScenarios}</td>
                      <td className="bia-td-detail">{entry.createdBy}</td>
                      <td className="bia-td-detail">{entry.dateCreated}</td>
                      
                      {/* Impact Assessment */}
                      <td className={`bia-td-impact ${getImpactColorClass(entry.impactScore)}`}>{formatImpactScore(entry.impactScore)}</td>
                      <td className="bia-td-impact">{entry.impact}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.financialImpactScore)}`}>{formatImpactScore(entry.financialImpactScore)}</td>
                      <td className="bia-td-impact">
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
                      <td className={`bia-td-impact ${getImpactColorClass(entry.operationalImpactScore)}`}>{formatImpactScore(entry.operationalImpactScore)}</td>
                      <td className="bia-td-impact">{entry.operationalImpact}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.ohsImpactScore)}`}>{formatImpactScore(entry.ohsImpactScore)}</td>
                      <td className="bia-td-impact">{entry.ohsImpact}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.environmentalImpactScore)}`}>{formatImpactScore(entry.environmentalImpactScore)}</td>
                      <td className="bia-td-impact">{entry.environmentalImpact}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.staffImpactScore)}`}>{formatImpactScore(entry.staffImpactScore)}</td>
                      <td className="bia-td-impact">{entry.numberOfStaffImpacted}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.sitesImpactScore)}`}>{formatImpactScore(entry.sitesImpactScore)}</td>
                      <td className="bia-td-impact">{entry.numberOfSitesImpacted}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.reputationalImpactScore)}`}>{formatImpactScore(entry.reputationalImpactScore)}</td>
                      <td className="bia-td-impact">{entry.reputationalImpact}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.statutoryImpactScore)}`}>{formatImpactScore(entry.statutoryImpactScore)}</td>
                      <td className="bia-td-impact">{entry.statutoryImpact}</td>
                      <td className={`bia-td-impact ${getImpactColorClass(entry.infosecImpactScore)}`}>{formatImpactScore(entry.infosecImpactScore)}</td>
                      <td className="bia-td-impact">{entry.infosecImpact}</td>
                      
                      {/* Process Criticality */}
                      <td className={`bia-td-criticality ${getCriticalityColorClass(entry.criticality)}`}>{formatCriticalityRating(entry.criticality)}</td>
                      <td className="bia-td-criticality">{entry.mtpd}</td>
                      <td className="bia-td-criticality">{entry.recoveryTimeObjective}</td>
                      <td className="bia-td-criticality">{entry.recoveryTimeActual}</td>
                      <td className="bia-td-criticality">{entry.recoveryPointObjective}</td>
                      <td className="bia-td-criticality">{entry.recoveryPointActual}</td>
                      <td className="bia-td-criticality">{entry.sla}</td>
                      <td className="bia-td-criticality">{entry.slaPeriod || "Month"}</td>
                      <td className="bia-td-criticality">{entry.slaIncludesPlanned ? "Yes" : "No"}</td>
                      
                      {/* Dependencies and Obligations */}
                      <td className="bia-td-dependency">{entry.legalObligations}</td>
                      <td className="bia-td-dependency">{entry.resources}</td>
                      <td className="bia-td-dependency">{entry.dependencies}</td>
                      <td className="bia-td-dependency">{entry.itDependencies}</td>
                      <td className="bia-td-dependency">{entry.peopleDependencies}</td>
                      <td className="bia-td-dependency">{entry.facilitiesDependencies}</td>
                      <td className="bia-td-dependency">{entry.processDependencies}</td>
                      
                      {/* Action buttons */}
                      <td className="bia-action-cell">
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); moveRowUp(idx); }}
                          disabled={idx === 0}
                          className="bia-action-button"
                          title="Move Up"
                        >▲</button>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); moveRowDown(idx); }}
                          disabled={idx === entries.length - 1}
                          className="bia-action-button"
                          title="Move Down"
                        >▼</button>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleRemove(idx); }}
                          className="bia-action-button bia-action-button-remove"
                          title="Remove Entry"
                        >🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p></p> {/* Empty paragraph to ensure the table has some space below */}
            </div>
          </div>          
          {/* Button row: Create New Entry and Export to Excel */}
          <div className="bia-table-button-container">
            <button
              type="button"
              onClick={handleAddNewProcess}
              className="bia-btn bia-btn-outline-secondary"
            >
              + Add New Process
            </button>
            <button
              type="button"
              onClick={handleStartNew}
              className="bia-btn bia-btn-outline-primary"
            >
              🗑️ Start New
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="bia-btn bia-btn-accent"
            >
              📊 Export to Excel
            </button>
          </div>
      </div>
      </div>
  );
};

export default BIATable;
