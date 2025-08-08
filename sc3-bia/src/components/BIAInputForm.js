import React from "react";
import "./BIA.css";



const InputForm = ({ 
  form, 
  handleChange, 
  handleSubmit, 
  handleCancel,
  editIndex, 
  fieldsOpen, 
  setFieldsOpen
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <details open={fieldsOpen} onToggle={e => setFieldsOpen(e.target.open)}>
        <summary className="bia-form-summary">BIA Form Fields</summary>
        <table className="bia-form-table">
          <tbody>
            {/* Business Process Details */}
            <tr>
              <td colSpan={2}>
                <fieldset className="bia-fieldset bia-fieldset-business">
                  <legend className="bia-legend bia-legend-business">Business Process Details</legend>
                  <table className="bia-field-table">
                    <tbody>
                      <tr title="A unique identifier for this business process (e.g. FIN-001, HR-002)">
                        <td className="bia-field-cell-label"><label className="bia-form-label">Business Process ID:<span className="bia-required">*</span></label></td>
                        <td>
                          <input
                            type="text"
                            name="processId"
                            value={form.processId}
                            onChange={handleChange}
                            required
                            className="bia-input"
                          />
                        </td>
                      </tr>
                      <tr title="The name of the business process (e.g. Payroll Processing)"> 
                        <td className="bia-field-cell-label"><label className="bia-form-label">Business Process Name:<span className="bia-required">*</span></label></td>                            
                        <td>
                          <input
                            type="text"
                            name="processName"
                            value={form.processName}
                            onChange={handleChange}
                            required  
                            className="bia-input"                  
                          />
                        </td>
                      </tr>
                      <tr title="The business unit or department responsible for this process">
                        <td className="bia-field-cell-label"><label className="bia-form-label">Business Unit:</label></td>
                        <td>
                          <input
                            type="text"
                            name="businessUnit"
                            value={form.businessUnit}
                            onChange={handleChange}
                            className="bia-input"
                          />
                        </td>
                      </tr>
                      <tr title="The person accountable for this process">
                        <td className="bia-field-cell-label"><label className="bia-form-label">Process Owner:</label></td>
                        <td>
                          <input
                            type="text"
                            name="owner"
                            value={form.owner}
                            onChange={handleChange}
                            className="bia-input"
                          />
                        </td>
                      </tr>
                      <tr title="Briefly describe the purpose and scope of this process">
                        <td className="bia-field-cell-label"><label className="bia-form-label">Description:</label></td>
                        <td>
                          <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="bia-textarea"
                          />
                        </td>
                      </tr>
                      <tr title="List scenarios or events that are considered in-scope for this BIA (e.g. system outage, data loss)">
                        <td className="bia-field-cell-label"><label className="bia-form-label">In Scope Scenarios:</label></td>
                        <td>
                          <textarea
                            name="inScopeScenarios"
                            value={form.inScopeScenarios}
                            onChange={handleChange}  
                            className="bia-textarea"                              
                          />
                        </td>
                      </tr>
                      <tr title="List scenarios or events that are not considered in-scope for this BIA">
                        <td className="bia-field-cell-label"><label className="bia-form-label">Out of Scope Scenarios:</label></td>
                        <td>
                          <textarea
                            name="outOfScopeScenarios"
                            value={form.outOfScopeScenarios}
                            onChange={handleChange}
                            className="bia-textarea"
                          />
                        </td>
                      </tr>
                      <tr title="Name of the person completing this form">
                        <td className="bia-field-cell-label"><label className="bia-form-label">Created By:</label></td>
                        <td>
                          <input
                            type="text"
                            name="createdBy"
                            value={form.createdBy}
                            onChange={handleChange}  
                            className="bia-input"                              
                          />
                        </td>
                      </tr>
                      <tr title="Date this entry was created">
                        <td className="bia-field-cell-label"><label className="bia-form-label">Date Created:</label></td>
                        <td>
                          <input
                            type="date"
                            name="dateCreated"
                            value={form.dateCreated}
                            onChange={handleChange}   
                            className="bia-input-date"                        
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
                <fieldset className="bia-fieldset bia-fieldset-impact">
                  <legend className="bia-legend bia-legend-impact">Impact Assessment</legend>
                  <table className="bia-field-table">
                    <tbody>
                      <tr className="bia-impact-row-main" title="The overall impact for this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Overall Impact of Disruption:</label></td>
                        <td>
                          <div className="bia-flex-container">
                          <select
                            name="impactScore"
                            value={form.impactScore}
                            onChange={handleChange}
                            className="bia-select"
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
                            className="bia-textarea"
                          />
                          </div>  
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" style={{ padding: 0 }}>
                          <div className="bia-or-line-container">
                            <hr className="bia-or-line-left" />
                            <span className="bia-or-text">Or</span>
                            <hr className="bia-or-line-right" />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The financial impact of disruption to this process, which may also be a factor of the duration of the disruption">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Financial Impact:</label></td>
                        <td>
                          <div className="bia-flex-container">
                            <select
                              name="financialImpactScore"
                              value={form.financialImpactScore}
                              onChange={handleChange}
                              className="bia-select"
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
                              className="bia-select"
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
                              className="bia-input"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The operational impact of disruption to this process, which may also be a factor of the duration of the disruption">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Operational Impact:</label></td>
                        <td>
                          <div className="bia-impact-container">
                          <select
                            name="operationalImpactScore"
                            value={form.operationalImpactScore}
                            onChange={handleChange}
                            className="bia-select bia-select-impact"
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
                            className="bia-textarea bia-textarea-impact"
                          />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The impact on employee health and safety due to disruption of this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Occupational Health & Safety Impact:</label></td>
                        <td>
                          <div className="bia-impact-container">
                            <select
                              name="ohsImpactScore"
                              value={form.ohsImpactScore}
                              onChange={handleChange}
                              className="bia-select bia-select-impact"
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
                              className="bia-textarea bia-textarea-impact"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The impact on the environment due to disruption of this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Environmental Impact:</label></td>
                        <td>
                          <div className="bia-impact-container">
                            <select
                              name="environmentalImpactScore"
                              value={form.environmentalImpactScore}
                              onChange={handleChange}
                              className="bia-select bia-select-impact"
                            >
                              <option value="1">1 (Negligible Impact)</option>
                              <option value="2">2 (Low Impact)</option>
                              <option value="3">3 (Moderate Impact)</option>
                              <option value="4">4 (High Impact)</option>
                              <option value="5">5 (Critical Impact)</option>
                            </select>
                            <textarea
                              name="environmentalImpact"
                              value={form.environmentalImpact}
                              onChange={handleChange}
                              className="bia-textarea bia-textarea-impact"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The impact on staff due to disruption of this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Number of Staff Impacted:</label></td>
                        <td>
                          <div className="bia-impact-container">
                            <select
                              name="staffImpactScore"
                              value={form.staffImpactScore}
                              onChange={handleChange}
                              className="bia-select bia-select-impact"
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
                              className="bia-input bia-input-impact"
                          />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The impact on sites due to disruption of this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Number of Sites Impacted:</label></td>
                        <td>
                          <div className="bia-impact-container">
                            <select
                              name="sitesImpactScore"
                              value={form.sitesImpactScore}
                              onChange={handleChange}
                              className="bia-select bia-select-impact"
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
                              className="bia-input bia-input-impact"
                          />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The impact on customers and their loyalty to the brand due to disruption of this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Reputational Impact:</label></td>
                        <td>
                          <div className="bia-impact-container">
                            <select
                              name="reputationalImpactScore"
                              value={form.reputationalImpactScore}
                              onChange={handleChange}
                              className="bia-select bia-select-impact"
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
                            className="bia-textarea bia-textarea-impact"
                          />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The impact on statutory and regulatory compliance due to disruption of this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Statutory / Regulatory Impact:</label></td>
                        <td>
                          <div className="bia-impact-container">
                            <select
                              name="statutoryImpactScore"
                              value={form.statutoryImpactScore}
                              onChange={handleChange}
                              className="bia-select bia-select-impact"
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
                              className="bia-textarea bia-textarea-impact"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="bia-impact-row-other" title="The impact on information security due to disruption of this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Information Security Impact:</label></td>
                        <td>
                          <div className="bia-impact-container">
                            <select
                              name="infosecImpactScore"
                              value={form.infosecImpactScore}
                              onChange={handleChange}
                              className="bia-select bia-select-impact"
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
                              className="bia-textarea bia-textarea-impact"
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
                <fieldset className="bia-fieldset bia-fieldset-criticality">
                  <legend className="bia-legend bia-legend-criticality">Process Criticality</legend>
                  <table className="bia-field-table">
                    <tbody>
                      <tr title="The importance of this process to the organisation">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Criticality Rating:</label></td>
                        <td>
                          <select
                            name="criticality"
                            value={form.criticality}
                            onChange={handleChange}
                            className="bia-select-criticality"
                          >
                            <option value="1">1 (None)</option>
                            <option value="2">2 (Bronze)</option>
                            <option value="3">3 (Silver)</option>
                            <option value="4">4 (Gold)</option>
                            <option value="5">5 (Platinum)</option>
                          </select>
                        </td>
                      </tr>
                      <tr title="The maximum tolerable period of disruption for this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">MTPD - Maximum Tolerable Period of Disruption (hours):</label></td>
                        <td>
                          <input
                            type="number"
                            name="mtpd"
                            value={form.mtpd}
                            onChange={handleChange}
                            placeholder="Hours"
                            min="0"
                            step="0.01"
                            className="bia-input-criticality"
                          />
                        </td>
                      </tr>
                      <tr title="The recovery time objective for this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">RTO - Recovery Time Objective (hours):</label></td>
                        <td>
                          <input
                            type="number"
                            name="recoveryTimeObjective"
                            value={form.recoveryTimeObjective}
                            onChange={handleChange}
                            placeholder="Hours"
                            min="0"
                            step="0.01"
                            className="bia-input-criticality"
                          />
                        </td>
                      </tr>
                      <tr title="The actual recovery time achieved for this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">RTA - Recovery Time Actual (hours):</label></td>
                        <td>
                          <input
                            type="number"
                            name="recoveryTimeActual"
                            value={form.recoveryTimeActual}
                            onChange={handleChange}
                            placeholder="Hours"
                            min="0"
                            step="0.01"
                            className={`bia-input-criticality ${
                              form.recoveryTimeActual && form.recoveryTimeObjective && 
                              parseFloat(form.recoveryTimeActual) > parseFloat(form.recoveryTimeObjective) 
                                ? 'bia-input-objective-exceeded' 
                                : ''
                            }`}
                          />
                          {form.recoveryTimeActual && form.recoveryTimeObjective && 
                           parseFloat(form.recoveryTimeActual) > parseFloat(form.recoveryTimeObjective) && (
                            <div className="bia-objective-warning">
                              ⚠️ RTA exceeds RTO - Objective not met
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr title="The recovery point objective for this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">RPO - Recovery Point Objective (hours):</label></td>
                        <td>
                          <input
                            type="number"
                            name="recoveryPointObjective"
                            value={form.recoveryPointObjective}
                            onChange={handleChange}
                            placeholder="Hours"
                            min="0"
                            step="0.01"
                            className="bia-input-criticality"
                          />
                        </td>
                      </tr>
                      <tr title="The actual recovery point achieved for this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">RPA - Recovery Point Actual (hours):</label></td>
                        <td>
                          <input
                            type="number"
                            name="recoveryPointActual"
                            value={form.recoveryPointActual}
                            onChange={handleChange}
                            placeholder="Hours"
                            min="0"
                            step="0.01"
                            className={`bia-input-criticality ${
                              form.recoveryPointActual && form.recoveryPointObjective && 
                              parseFloat(form.recoveryPointActual) > parseFloat(form.recoveryPointObjective) 
                                ? 'bia-input-objective-exceeded' 
                                : ''
                            }`}
                          />
                          {form.recoveryPointActual && form.recoveryPointObjective && 
                           parseFloat(form.recoveryPointActual) > parseFloat(form.recoveryPointObjective) && (
                            <div className="bia-objective-warning">
                              ⚠️ RPA exceeds RPO - Objective not met
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr title="The service level agreement for this process (actually the Availability Service Level Objective - SLO), defining the percentage of time this process should be available">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">SLA (%):</label></td>
                        <td>
                          <input
                            type="text"
                            name="sla"
                            value={form.sla}
                            onChange={handleChange}
                            placeholder="e.g. 99.9%"
                            className="bia-input-criticality"          
                          />
                        </td>
                      </tr>
                      <tr title="The measurement period for the SLA percentage">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">SLA Period:</label></td>
                        <td>
                          <select
                            name="slaPeriod"
                            value={form.slaPeriod || "Month"}
                            onChange={handleChange}
                            className="bia-select-criticality"
                          >
                            <option value="Day">Day</option>
                            <option value="Week">Week</option>
                            <option value="Month">Month</option>
                            <option value="Quarter">Quarter</option>
                            <option value="Year">Year</option>
                          </select>
                        </td>
                      </tr>
                      <tr title="Whether the SLA calculation includes planned downtime or only unplanned outages">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">SLA Includes Planned Downtime:</label></td>
                        <td>
                          <div className="bia-checkbox-container">
                            <input
                              type="checkbox"
                              name="slaIncludesPlanned"
                              checked={form.slaIncludesPlanned || false}
                              onChange={handleChange}
                              className="bia-checkbox"
                            />
                            <span className="bia-checkbox-label">
                              {form.slaIncludesPlanned ? "Yes - includes planned downtime" : "No - unplanned outages only"}
                            </span>
                          </div>
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
                <fieldset className="bia-fieldset bia-fieldset-dependencies">
                  <legend className="bia-legend bia-legend-dependencies">Dependencies and Obligations</legend>
                  <table className="bia-field-table">
                    <tbody>
                      <tr title="Legal, regulatory, and contractual obligations that this process must comply with">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Legal, Regulatory, and Contractual Obligations:</label></td>
                        <td>
                          <textarea
                            name="legalObligations"
                            value={form.legalObligations}
                            onChange={handleChange}
                            className="bia-textarea bia-textarea-dependencies"
                          />
                        </td>
                      </tr>
                      <tr title="The resources required to recover this process">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Resources Required for Recovery:</label></td>
                        <td>
                          <textarea
                            name="resources"
                            value={form.resources}
                            onChange={handleChange}
                            className="bia-textarea bia-textarea-dependencies"
                          />
                        </td>
                      </tr>
                      <tr title="Key dependencies, including suppliers and third parties">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Key Dependencies, including Suppliers and Third Parties:</label></td>
                        <td>
                          <textarea
                            name="dependencies"
                            value={form.dependencies}
                            onChange={handleChange}
                            className="bia-textarea bia-textarea-dependencies"
                          />
                        </td>
                      </tr>
                      <tr title="Dependencies on IT Systems and Applications">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Dependencies on IT Systems and Applications:</label></td>
                        <td>
                          <textarea
                            name="itDependencies"
                            value={form.itDependencies}
                            onChange={handleChange}
                            className="bia-textarea bia-textarea-dependencies"
                          />
                        </td>
                      </tr>
                      <tr title="Dependencies on people and skills">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Dependencies on people and skills:</label></td>
                        <td>
                          <textarea
                            name="peopleDependencies"
                            value={form.peopleDependencies}
                            onChange={handleChange}
                            className="bia-textarea bia-textarea-dependencies"
                          />
                        </td>
                      </tr>
                      <tr title="Dependencies on facilities and infrastructure">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Dependencies on facilities and infrastructure:</label></td>
                        <td>
                          <textarea
                            name="facilitiesDependencies"
                            value={form.facilitiesDependencies}
                            onChange={handleChange}
                            className="bia-textarea bia-textarea-dependencies"
                          />
                        </td>
                      </tr>
                      <tr title="Dependencies on other business processes">
                        <td className="bia-field-cell-label-wide"><label className="bia-form-label">Dependencies on other business processes:</label></td>
                        <td>
                          <textarea
                            name="processDependencies"
                            value={form.processDependencies}
                            onChange={handleChange}
                            className="bia-textarea bia-textarea-dependencies"
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
      <div className="bia-flex-gap">
        <button
          type="submit"
          className="bia-btn bia-btn-primary"
        >
          {editIndex !== null ? "Update Entry" : "Submit Process Details"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bia-btn bia-btn-cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default InputForm;
