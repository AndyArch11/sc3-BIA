import React, { useState } from "react";
import "./BIA.css";

const BIAIntro = ({ criticalityDefaults, setCriticalityDefaults, initialCriticalityDefaults }) => {

  // State for guidance section
  const [showImplementationGuidance, setShowImplementationGuidance] = useState(false);
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  

  return (
    <details className="bia-intro-details">
      <summary className="bia-intro-summary">
        📚 BIA Guidance and Preparation
      </summary>
      
      <p>A <i>Business Impact Analysis (BIA)</i> is a systematic process for evaluating the potential effects of an interruption to critical business operations as a result of a disaster, accident, or emergency. 
        It is dependent on an inventory of business processes and their interdependencies.</p>

      <div>
        <p>Also see:</p>
        <ul>
          <li>
            <em>
              <a 
                href="https://www.iso.org/standard/75106.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bia-intro-link"
              >
                ISO/TS 22301
              </a>
            </em> - Security and Resilience — Business Continuity Management Systems — Requirements
          </li>
          <li>
            <em>
              <a 
                href="https://www.iso.org/standard/55199.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bia-intro-link"
              >
                ISO/TS 22313
              </a>
            </em> - Security and Resilience — Business Continuity Management Systems — Guidance on the use of ISO 22301
          </li>
          <li>
            <em>
              <a 
                href="https://www.iso.org/standard/79000.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bia-intro-link"
              >
                ISO/TS 22317
              </a>
            </em> - Security and Resilience — Business Continuity Management Systems — Guidelines for Business Impact Analysis
          </li>
        </ul>
        
        <p><b>Before commencing the BIA process:</b></p>
        <ul>
          <li>Identify the context, scope and objectives of the BIA.</li>
          <li>Identify and document the business processes and their interdependencies.</li>
          <li>Define and communicate the roles and responsibilities of the BIA team:
            <ul>
              <li><b>BIA Leader:</b> Responsible for overseeing the BIA process and ensuring its alignment with business objectives and obtaining approval of the BIA outcomes from management.</li>
              <li><b>Activity Owner:</b> Responsible for providing detailed information about the business processes and their dependencies.</li>
              <li><b>Subject Matter Experts (SMEs):</b> Provide expertise and insights into specific business areas and processes.</li>
            </ul>
          </li>
          <li>Obtain leadership commitment and have adequate resources allocated.</li>
        </ul>
        <p><b>Performing the BIA:</b></p>
        <ul>
          <li>Engage stakeholders and subject matter experts.</li>
          <li>Identify and document the potential impacts of disruptions to the business processes.</li>
          <li>Assess the impact against the most important period of activity.</li>
          <li>Consider both quantitative and qualitative factors in the assessment.</li>
          <li>Validate the assessment with stakeholders and subject matter experts.</li>
          <li>Document the findings and recommendations for business continuity planning.</li>
          <li>Obtain approval of the BIA outcomes from management.</li>
        </ul>

        <p><b>Impact Score</b></p>
        <p>Assess the potential impact of disruptions to business processes using a graded scale:</p>
        <ul>
          <li><b>1: Negligible</b> - no significant impact</li>
          <li><b>2: Low</b> - may cause minor disruptions</li>
          <li><b>3: Moderate</b> - likely to have a noticeable impact</li>
          <li><b>4: High</b> - highly probable to have a significant impact</li>
          <li><b>5: Critical</b> - will have a major impact on the organisation</li>
        </ul>

        <p>The impact score can be used to determine the relative criticality of the assessed business processes and inform their respective corresponding recovery priorities.</p>

        <p>It is important to note that the BIA is an iterative process and should be revisited regularly to ensure it remains aligned with the business objectives and the changing environment. 
            These requirements feed into the overall risk assessment process and the Business Continuity Planning (BCP) process.</p>

        <div className="bia-back-to-top-container">
          <button 
            onClick={scrollToTop}
            className="bia-back-to-top-button"
            title="Back to Top"
          >
            ↑ Back to Top
          </button>
        </div>

        <p><b>Non-Functional Requirements (NFRs)</b> that are informed by the criticality levels:</p>
        <p><i>Set MTPD, RTO, RPO, and SLA for Each Criticality Level. These values will be used as defaults when calculating Process Criticality based on impact scores.</i></p>

        <div className="bia-intro-section">
          <div className="bia-intro-table-wrapper">
            {/* Outer wrapper for horizontal scroll so that scroll bar does not hide the last row - works for Chrome and Edge, not for Firefox */}
            <div className="bia-intro-table-scroll">
              <table className="bia-intro-table">
                <thead>
                  <tr className="bia-intro-table-header">
                    <th className="bia-intro-table-th">Criticality</th>
                    <th className="bia-intro-table-th">MTPD (hours)</th>
                    <th className="bia-intro-table-th">RTO (hours)</th>
                    <th className="bia-intro-table-th">RPO (hours)</th>
                    <th className="bia-intro-table-th">SLA (%)</th>
                    <th className="bia-intro-table-th">Period</th>
                    <th className="bia-intro-table-th">Incl. Planned?</th>
                  </tr>
                </thead>
                <tbody>
                {Object.entries(criticalityDefaults).reverse().map(([level, defaults]) => (
                  <tr key={level} className="bia-intro-table-row">
                    <td className={`bia-criticality-color-${level} bia-intro-table-td`}>
                      {level} ({level === "1" ? "None / Tier 5" : level === "2" ? "Bronze / Tier 4" : level === "3" ? "Silver / Tier 3" : level === "4" ? "Gold / Tier 2" : "Platinum / Tier 1"})
                    </td>
                    <td className={`bia-criticality-color-${level} bia-intro-table-td`}>
                      <div className="bia-intro-cell-content">
                        <select
                          value={defaults.mtpdSymbol || "="}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], mtpdSymbol: e.target.value }
                          }))}
                          className="bia-intro-symbol-select"
                        >
                          <option value="<">&lt;</option>
                          <option value="≤">&#8804;</option>
                          <option value="=">=</option>
                          <option value=">">&gt;</option>
                          <option value="≥">&#8805;</option>
                        </select>
                        <input
                          type="number"
                          value={defaults.mtpd}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], mtpd: e.target.value }
                          }))}
                          className="bia-intro-input"
                        />
                      </div>
                    </td>
                    <td className={`bia-criticality-color-${level} bia-intro-table-td`}>
                      <div className="bia-intro-cell-content">
                        <select
                          value={defaults.rtoSymbol || "="}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], rtoSymbol: e.target.value }
                          }))}
                          className="bia-intro-symbol-select"
                        >
                          <option value="<">&lt;</option>
                          <option value="≤">&#8804;</option>
                          <option value="=">=</option>
                          <option value=">">&gt;</option>
                          <option value="≥">&#8805;</option>
                        </select>
                        <input
                          type="number"
                          value={defaults.rto}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], rto: e.target.value }
                          }))}
                          className="bia-intro-input"
                        />
                      </div>
                    </td>
                    <td className={`bia-criticality-color-${level} bia-intro-table-td`}>
                      <div className="bia-intro-cell-content">
                        <select
                          value={defaults.rpoSymbol || "="}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], rpoSymbol: e.target.value }
                          }))}
                          className="bia-intro-symbol-select"
                        >
                          <option value="<">&lt;</option>
                          <option value="≤">&#8804;</option>
                          <option value="=">=</option>
                          <option value=">">&gt;</option>
                          <option value="≥">&#8805;</option>
                        </select>
                        <input
                          type="number"
                          value={defaults.rpo}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], rpo: e.target.value }
                          }))}
                          className="bia-intro-input"
                        />
                      </div>
                    </td>
                    <td className={`bia-criticality-color-${level} bia-intro-table-td`}>
                      <div className="bia-intro-cell-content">
                        <select
                          value={defaults.slaSymbol || "="}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], slaSymbol: e.target.value }
                          }))}
                          className="bia-intro-symbol-select"
                        >
                          <option value="<">&lt;</option>
                          <option value="≤">&#8804;</option>
                          <option value="=">=</option>
                          <option value=">">&gt;</option>
                          <option value="≥">&#8805;</option>
                        </select>
                        <input
                          type="text"
                          value={defaults.sla}
                          onChange={e => setCriticalityDefaults(prev => ({
                            ...prev,
                            [level]: { ...prev[level], sla: e.target.value }
                          }))}
                          className="bia-intro-input"
                        />
                      </div>
                    </td>
                    <td className={`bia-criticality-color-${level} bia-intro-table-td`}>
                      <select
                        value={defaults.slaPeriod || "Month"}
                        onChange={(e) => setCriticalityDefaults(prev => ({
                          ...prev,
                          [level]: { ...prev[level], slaPeriod: e.target.value }
                        }))}
                        className="bia-intro-select"
                      >
                        <option value="Day">Day</option>
                        <option value="Week">Week</option>
                        <option value="Month">Month</option>
                        <option value="Quarter">Quarter</option>
                        <option value="Year">Year</option>
                      </select>
                    </td>
                    <td className={`bia-criticality-color-${level} bia-intro-table-td bia-intro-checkbox-cell`}>
                      <input
                        type="checkbox"
                        checked={defaults.slaIncludesPlanned || false}
                        onChange={(e) => setCriticalityDefaults(prev => ({
                          ...prev,
                          [level]: { ...prev[level], slaIncludesPlanned: e.target.checked }
                        }))}
                        className="bia-intro-checkbox"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCriticalityDefaults(initialCriticalityDefaults)}
          className="bia-intro-reset-button"
        >
          Reset to Initial Defaults
        </button>

        <div className="bia-back-to-top-container">
          <button 
            onClick={scrollToTop}
            className="bia-back-to-top-button"
            title="Back to Top"
          >
            ↑ Back to Top
          </button>
        </div>

        <p><b>Note:</b> These Non-Functional Requirements (NFRs) are naive blunt instruments that do not usually account for the scenarios that they are meant to address or those that they don't address, 
        whether they are applicable equally or not for nodal scoped events, locale scoped events, or regional scoped events, or for outages vs data corruption, etc.</p>

        <p><b>MTPD (Maximum Tolerable Period of Disruption):</b> The maximum time that an organization can tolerate a disruption to a business process before the impact becomes unacceptable. 
        This is the absolute limit beyond which the organization cannot survive.</p>

        <p><b>RTO (Recovery Time Objective):</b> The target time set for the recovery of IT and business activities after a disaster has occurred.</p>

        <p><b>RPO (Recovery Point Objective):</b> The maximum tolerable period in which data might be lost from an IT service due to a major incident.</p>

        <p>RTOs and RPOs represent business-defined recovery objectives. In contrast, Recovery Time Actuals (RTAs) and Recovery Point Actuals (RPAs) are the empirical values recorded and assessed during continuity testing and real-world events. 
            These actuals may deviate significantly—either exceeding or undershooting—the targeted objectives. RTAs and RPAs are often mistakenly conflated with RTOs and RPOs, but they serve different purposes in the BCP process.</p>

        <p><b>SLA (Service Level Agreement):</b> A formal agreement between a service provider and a customer that outlines the expected level of service, including metrics such as availability, performance, and response times. 
        A public contractual SLA is usually made up of a combination of internal Service Level Objectives (SLOs) and external commitments. An SLA is often mistakenly used to indicate an internal availability SLO.</p>

        <div className="bia-back-to-top-container">
          <button 
            onClick={scrollToTop}
            className="bia-back-to-top-button"
            title="Back to Top"
          >
            ↑ Back to Top
          </button>
        </div>

        <p><b>Service Level Objectives (SLO) vs Service Level Agreements (SLA):</b></p>
        <div className="bia-guidance-table-container">
          <table className="bia-comparison-table">
            <thead>
              <tr className="bia-comparison-table-header">
                <th className="bia-comparison-table th">Aspect</th>
                <th className="bia-comparison-table th">SLO (Service Level Objective)</th>
                <th className="bia-comparison-table th">SLA (Service Level Agreement)</th>
              </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bia-comparison-table td bia-comparison-table-bold">Definition</td>
              <td className="bia-comparison-table td">Internal target for service reliability</td>
              <td className="bia-comparison-table td">External commitment with consequences</td>
            </tr>
            <tr className="bia-comparison-table-row-alt">
              <td className="bia-comparison-table td bia-comparison-table-bold">Audience</td>
              <td className="bia-comparison-table td">Internal teams and stakeholders</td>
              <td className="bia-comparison-table td">External customers or clients</td>
            </tr>
            <tr>
              <td className="bia-comparison-table td bia-comparison-table-bold">Consequences</td>
              <td className="bia-comparison-table td">Performance management and process improvement</td>
              <td className="bia-comparison-table td">Financial penalties, credits, or legal consequences</td>
            </tr>
            <tr className="bia-comparison-table-row-alt">
              <td className="bia-comparison-table td bia-comparison-table-bold">Flexibility</td>
              <td className="bia-comparison-table td">Can be adjusted based on operational needs</td>
              <td className="bia-comparison-table td">Contractually binding, harder to change</td>
            </tr>
          </tbody>
        </table>
        </div>

        <p><b>SLA Percentage Downtime Reference:</b></p>
        <div className="bia-guidance-table-container">
          <table className="bia-downtime-table">
          <thead>
            <tr className="bia-downtime-table-header">
              <th className="bia-downtime-table th">SLA Percentage</th>
              <th className="bia-downtime-table th">Common Name</th>
              <th className="bia-downtime-table th">Downtime Per Day</th>
              <th className="bia-downtime-table th">Downtime Per Week</th>
              <th className="bia-downtime-table th">Downtime Per Month</th>
              <th className="bia-downtime-table th">Downtime Per Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bia-downtime-table td bia-downtime-table-bold">90%</td>
              <td className="bia-downtime-table td">"one nine"</td>
              <td className="bia-downtime-table td">2.4 hours</td>
              <td className="bia-downtime-table td">16.8 hours</td>
              <td className="bia-downtime-table td">73 hours</td>
              <td className="bia-downtime-table td">36.5 days</td>
            </tr>
            <tr className="bia-downtime-table-row-alt">
              <td className="bia-downtime-table td bia-downtime-table-bold">95%</td>
              <td className="bia-downtime-table td">"one nine five"</td>
              <td className="bia-downtime-table td">1.2 hours</td>
              <td className="bia-downtime-table td">8.4 hours</td>
              <td className="bia-downtime-table td">36.5 hours</td>
              <td className="bia-downtime-table td">18.3 days</td>
            </tr>
            <tr>
              <td className="bia-downtime-table td bia-downtime-table-bold">99%</td>
              <td className="bia-downtime-table td">"two nines"</td>
              <td className="bia-downtime-table td">14.4 minutes</td>
              <td className="bia-downtime-table td">1.68 hours</td>
              <td className="bia-downtime-table td">7.3 hours</td>
              <td className="bia-downtime-table td">3.65 days</td>
            </tr>
            <tr className="bia-downtime-table-row-alt">
              <td className="bia-downtime-table td bia-downtime-table-bold">99.9%</td>
              <td className="bia-downtime-table td">"three nines"</td>
              <td className="bia-downtime-table td">1.44 minutes</td>
              <td className="bia-downtime-table td">10.08 minutes</td>
              <td className="bia-downtime-table td">43.8 minutes</td>
              <td className="bia-downtime-table td">8.77 hours</td>
            </tr>
            <tr>
              <td className="bia-downtime-table td bia-downtime-table-bold">99.95%</td>
              <td className="bia-downtime-table td">"three nines five"</td>
              <td className="bia-downtime-table td">43.2 seconds</td>
              <td className="bia-downtime-table td">5.04 minutes</td>
              <td className="bia-downtime-table td">21.92 minutes</td>
              <td className="bia-downtime-table td">4.38 hours</td>
            </tr>
          </tbody>
        </table>
        </div>

        <p><i>Note: Availability SLOs (and SLAs) should explicitly define the measurement window; the period during which service availability is tracked, along with the reset cadence for the metric. This is often missing in Availability SLOs and SLAs.</i></p>
        <p>Availability SLOs (and SLAs) should also indicate if it is inclusive of planned downtime or only unplanned outages.</p>

        <div className="bia-back-to-top-container">
          <button 
            onClick={scrollToTop}
            className="bia-back-to-top-button"
            title="Back to Top"
          >
            ↑ Back to Top
          </button>
        </div>

        
        <div className="bia-guidance-container">
          <div
            className="bia-guidance-toggle"
            onClick={() => setShowImplementationGuidance(!showImplementationGuidance)}
          >
            <h3 className="bia-guidance-title">
              Technical Implementation Strategies for SLA/RTO/RPO Thresholds
            </h3>
            <span className="bia-guidance-toggle-icon">
              {showImplementationGuidance ? "−" : "+"}
            </span>
          </div>

          {showImplementationGuidance && (
            <div className="bia-guidance-content">
              <p>Different SLA, RTO, and RPO requirements necessitate specific technical architectures and implementation strategies. The following provides guidance on matching technical solutions to business requirements:</p>

              <div className="bia-guidance-table-container">
                <table className="bia-downtime-table">
                <thead>
                  <tr className="bia-downtime-table-header">
                    <th className="bia-downtime-table th">SLA Range</th>
                    <th className="bia-downtime-table th">RTO Range</th>
                    <th className="bia-downtime-table th">RPO Range</th>
                    <th className="bia-downtime-table th">Recommended Strategy</th>
                    <th className="bia-downtime-table th">Technical Implementation</th>
                    <th className="bia-downtime-table th">Cost/Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bia-downtime-table td bia-downtime-table-bold">90-95%</td>
                    <td className="bia-downtime-table td">24-72 hours</td>
                    <td className="bia-downtime-table td">12-48 hours</td>
                    <td className="bia-downtime-table td">Basic Backup & Restore</td>
                    <td className="bia-downtime-table td">Daily/weekly backups, manual restore procedures, single-site deployment</td>
                    <td className="bia-downtime-table td">Low</td>
                  </tr>
                  <tr className="bia-downtime-table-row-alt">
                    <td className="bia-downtime-table td bia-downtime-table-bold">95-99%</td>
                    <td className="bia-downtime-table td">4-24 hours</td>
                    <td className="bia-downtime-table td">4-12 hours</td>
                    <td className="bia-downtime-table td">Cold Standby</td>
                    <td className="bia-downtime-table td">Automated backups, documented runbooks, spare hardware available, DR site prepared</td>
                    <td className="bia-downtime-table td">Low-Medium</td>
                  </tr>
                  <tr>
                    <td className="bia-downtime-table td bia-downtime-table-bold">99-99.5%</td>
                    <td className="bia-downtime-table td">1-4 hours</td>
                    <td className="bia-downtime-table td">1-4 hours</td>
                    <td className="bia-downtime-table td">Warm Standby</td>
                    <td className="bia-downtime-table td">Hot/warm HA cluster, automated failover, regular data synchronization, load balancers</td>
                    <td className="bia-downtime-table td">Medium</td>
                  </tr>
                  <tr className="bia-downtime-table-row-alt">
                    <td className="bia-downtime-table td bia-downtime-table-bold">99.5-99.9%</td>
                    <td className="bia-downtime-table td">15min-1 hour</td>
                    <td className="bia-downtime-table td">15min-1 hour</td>
                    <td className="bia-downtime-table td">Hot Standby</td>
                    <td className="bia-downtime-table td">Hot/hot HA cluster, real-time replication, automatic failover, redundant network paths</td>
                    <td className="bia-downtime-table td">Medium-High</td>
                  </tr>
                  <tr>
                    <td className="bia-downtime-table td bia-downtime-table-bold">99.9-99.95%</td>
                    <td className="bia-downtime-table td">5-15 minutes</td>
                    <td className="bia-downtime-table td">5-15 minutes</td>
                    <td className="bia-downtime-table td">Cross-Site Failover</td>
                    <td className="bia-downtime-table td">Multi-site deployment, synchronous replication, automated orchestration, health monitoring</td>
                    <td className="bia-downtime-table td">High</td>
                  </tr>
                  <tr className="bia-downtime-table-row-alt">
                    <td className="bia-downtime-table td bia-downtime-table-bold">99.95%+</td>
                    <td className="bia-downtime-table td">&lt;5 minutes</td>
                    <td className="bia-downtime-table td">&lt;5 minutes</td>
                    <td className="bia-downtime-table td">Regional Failover</td>
                    <td className="bia-downtime-table td">Multi-region deployment, consensus algorithms, chaos engineering, advanced monitoring</td>
                    <td className="bia-downtime-table td">Very High</td>
                  </tr>
                </tbody>
              </table>
              </div>

              <p><i><b>Important:</b> The technical solutions and strategies outlined above are subject to organizational budget constraints and resource availability. 
              Some business objectives may not be technically or economically achievable within current budget allocations. 
              It is essential to align SLA requirements with realistic budget expectations and consider phased implementation approaches where immediate full compliance may not be feasible.</i></p>

              <h4>Implementation Strategy Details:</h4>

              <p><b>Basic Backup & Restore (90-95% SLA):</b></p>
              <ul>
                <li>Scheduled backups to local/cloud storage</li>
                <li>Manual restoration procedures with documented runbooks</li>
                <li>Single application instance with minimal redundancy</li>
                <li>Cost-effective for non-critical systems</li>
              </ul>

              <p><b>Cold Standby (95-99% SLA):</b></p>
              <ul>
                <li>Pre-configured standby environment (powered off)</li>
                <li>Regular backup testing and validation</li>
                <li>Automated deployment scripts and infrastructure as code</li>
                <li>Designated DR site with spare capacity</li>
              </ul>

              <p><b>Warm Standby (99-99.5% SLA):</b></p>
              <ul>
                <li>Secondary system running with periodic data synchronization</li>
                <li>Load balancer for traffic distribution and health checks</li>
                <li>Automated failover with manual confirmation</li>
                <li>Database clustering or replication lag acceptable</li>
              </ul>

              <p><b>Hot Standby (99.5-99.9% SLA):</b></p>
              <ul>
                <li>Active-passive or active-active cluster configuration</li>
                <li>Real-time or near-real-time data replication</li>
                <li>Automatic failover without human intervention</li>
                <li>Shared storage or synchronous database replication</li>
                <li>Network redundancy and multiple connection paths</li>
              </ul>

              <p><b>Cross-Site Failover (99.9-99.95% SLA):</b></p>
              <ul>
                <li>Geographically distributed deployment across data centers</li>
                <li>Synchronous replication for zero data loss</li>
                <li>Advanced monitoring and automated health checks</li>
                <li>Network-level redundancy and carrier diversity</li>
                <li>Coordinated failover orchestration</li>
              </ul>

              <p><b>Regional Failover (99.95%+ SLA):</b></p>
              <ul>
                <li>Multi-region deployment with global load balancing</li>
                <li>Consensus-based systems (Raft, PBFT) for consistency</li>
                <li>Chaos engineering and fault injection testing</li>
                <li>Advanced telemetry and predictive monitoring</li>
                <li>Automated remediation and self-healing capabilities</li>
              </ul>

              <h4>Key Implementation Considerations:</h4>

              <p><b>Data Consistency:</b> Higher availability often requires trade-offs with consistency (CAP theorem). Choose appropriate consistency models based on business requirements.</p>

              <p><b>Testing and Validation:</b> Regular disaster recovery testing is critical. Higher SLA targets require more frequent and comprehensive testing scenarios.</p>

              <p><b>Monitoring and Observability:</b> Implement comprehensive monitoring, alerting, and observability solutions proportional to your SLA requirements.</p>

              <p><b>Cost Optimization:</b> Balance business requirements with infrastructure costs. Consider hybrid approaches where different components have different availability requirements.</p>

              <p><b>Vendor Selection:</b> Cloud providers offer various SLA guarantees. Ensure vendor commitments align with your business requirements and include appropriate penalty clauses.</p>

              <h4>System Availability Calculations:</h4>

              <p><b>Component Dependency Models:</b></p>
              <ul>
                <li><b>Serial Dependencies (Chain):</b> Overall availability = A₁ × A₂ × A₃ × ... × Aₙ (where A is availability of each component)</li>
                <li><b>Parallel Redundancy:</b> Overall availability = 1 - ((1 - A₁) × (1 - A₂) × ... × (1 - Aₙ)) for redundant components</li>
                <li><b>Mixed Architecture:</b> Combination of serial and parallel calculations based on system design</li>
              </ul>

              <p><b>Practical Examples:</b></p>
              <ul>
                <li><b>Single Path System:</b> Web server (99.9%) → Database (99.9%) → Storage (99.9%) = 99.7% overall availability</li>
                <li><b>Load Balanced Web Tier:</b> Two web servers (99.9% each) in parallel = 99.9999% web tier availability</li>
                <li><b>Complete System:</b> Redundant web tier (99.9999%) → Single database (99.9%) = 99.8999% overall</li>
                <li><b>Full Redundancy:</b> All components redundant can achieve 99.9999%+ availability</li>
              </ul>

              <p><b>Key Considerations:</b></p>
              <ul>
                <li><b>Weakest Link:</b> Non-redundant components become the limiting factor for overall system availability</li>
                <li><b>Shared Dependencies:</b> Common infrastructure (power, network, storage) can negate redundancy benefits</li>
                <li><b>Failover Time:</b> Detection and switchover time affects actual experienced availability</li>
                <li><b>Maintenance Windows:</b> Planned maintenance can be performed on redundant systems without service impact</li>
                <li><b>Cost vs Benefit:</b> Diminishing returns as availability approaches 100% - each additional "nine" typically doubles costs</li>
              </ul>

              <p><i><b>Note:</b> These calculations assume independent failures and perfect failover mechanisms. Real-world scenarios may include correlated failures, partial degradation, and cascading failures that can significantly impact actual availability.</i></p>

              <h4>Software Deployment and Patching Considerations:</h4>

              <p><b>Deployment Strategies by SLA Tier:</b></p>
              <ul>
                <li><b>Basic (90-95% SLA):</b> Traditional deployment windows, scheduled maintenance outages acceptable</li>
                <li><b>Standard (95-99% SLA):</b> Blue-green deployments, rolling updates with brief service interruptions</li>
                <li><b>High Availability (99-99.5% SLA):</b> Canary deployments, feature flags, zero-downtime deployment pipelines</li>
                <li><b>Mission Critical (99.5%+ SLA):</b> Immutable infrastructure, automated rollback, multi-region deployment orchestration</li>
              </ul>

              <p><b>Patching and Security Updates:</b></p>
              <ul>
                <li><b>Critical Security Patches:</b> Must be deployable within emergency change windows regardless of SLA tier</li>
                <li><b>Regular Updates:</b> Higher SLA tiers require automated testing pipelines and staged deployment processes</li>
                <li><b>Operating System Patches:</b> Container-based deployments enable immutable patching strategies</li>
                <li><b>Database Schema Changes:</b> Require backward-compatible migrations and online schema change tools for high SLA environments</li>
              </ul>

              <h4>Risk Mitigation: Backups vs Replication Strategies:</h4>

              <p><b>Backup Strategies - Protection Against:</b></p>
              <ul>
                <li><b>Data Corruption:</b> Logical corruption, application bugs writing bad data, ransomware attacks</li>
                <li><b>Human Error:</b> Accidental deletions, incorrect data modifications, configuration mistakes</li>
                <li><b>Long-term Data Retention:</b> Compliance requirements, historical analysis, audit trails</li>
                <li><b>Point-in-time Recovery:</b> Ability to restore to any specific moment before an incident</li>
                <li><b>Cross-region Disasters:</b> Geographic diversification of backup storage locations</li>
              </ul>

              <p><b>Replication Strategies - Protection Against:</b></p>
              <ul>
                <li><b>Hardware Failures:</b> Server crashes, disk failures, network outages, power failures</li>
                <li><b>Site-level Disasters:</b> Fire, flood, earthquake, facility-wide power loss</li>
                <li><b>Planned Maintenance:</b> Zero-downtime updates, hardware replacement, facility maintenance</li>
                <li><b>Performance Scaling:</b> Read replicas for load distribution, geographic performance optimization</li>
                <li><b>High Availability:</b> Immediate failover capabilities, minimal service interruption</li>
              </ul>

              <p><b>Combined Strategy Considerations:</b></p>
              <ul>
                <li><b>Replication ≠ Backup:</b> Replication can propagate corruption; backups provide point-in-time recovery</li>
                <li><b>3-2-1 Rule:</b> 3 copies of data, 2 different media types, 1 offsite location</li>
                <li><b>Recovery Testing:</b> Both backup restoration and failover procedures must be regularly tested</li>
                <li><b>RTO vs RPO Trade-offs:</b> Replication optimizes RTO (fast recovery), backups optimize RPO (data preservation)</li>
                <li><b>Cost Implications:</b> Replication requires ongoing infrastructure costs, backups have storage and testing costs</li>
              </ul>

              <p><b>Risk Scenarios Requiring Different Approaches:</b></p>
              <ul>
                <li><b>Malicious Insider Attack:</b> Requires offline, immutable backups with access controls</li>
                <li><b>Application Logic Bugs:</b> Need point-in-time backups before corruption propagates to replicas</li>
                <li><b>Natural Disasters:</b> Geographic replication provides immediate failover; backups enable full recovery</li>
                <li><b>Compliance Violations:</b> Backups support data forensics and regulatory investigation requirements</li>
                <li><b>Vendor Lock-in:</b> Platform-agnostic backup formats enable migration strategies</li>
              </ul>

              <p><i>Note: These are general guidelines. Specific implementations should be tailored to your technology stack, compliance requirements, and business constraints. Consider engaging with solution architects and reliability engineers for detailed system design.</i></p>
            </div>
          )}
        </div>

        <p><b>Dependencies and Obligations:</b></p>
        <p>Identify and document the dependencies and obligations related to the business processes. These may contribute towards planning and executing effective business continuity strategies and the recovery from any process disruptions.</p>
        
        <p>It is important to regularly review and update the NFRs to ensure that they remain relevant and effective in addressing the evolving business landscape.</p>

        <p><b>Disclaimer:</b> The information provided here is for general informational purposes only and will require adaptation for specific businesses and maturity capabilities and is not intended as legal advice. 
          Please consult with a qualified legal professional for specific legal advice tailored to your situation.</p>

        <div className="bia-back-to-top-container">
          <button 
            onClick={scrollToTop}
            className="bia-back-to-top-button"
            title="Back to Top"
          >
            ↑ Back to Top
          </button>
        </div>

        <p><hr /></p>
      </div>
    </details>
  );
};

export default BIAIntro;
