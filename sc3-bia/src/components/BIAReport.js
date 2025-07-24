import React from "react";
import "./BIA.css";

const BIAReport = ({ entries }) => {
  if (entries.length === 0) {
    return null;
  }

  // Calculate summary statistics
  const totalProcesses = entries.length;
  
  // Criticality distribution
  const criticalityStats = entries.reduce((acc, entry) => {
    const rating = entry.criticality || "1";
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  // Impact distribution (using average of all impact scores)
  const impactStats = entries.reduce((acc, entry) => {
    // Get all impact scores for this entry
    const impacts = [
      parseFloat(entry.financialImpactScore) || 1,
      parseFloat(entry.operationalImpactScore) || 1,
      parseFloat(entry.ohsImpactScore) || 1,
      parseFloat(entry.environmentalImpactScore) || 1,
      parseFloat(entry.staffImpactScore) || 1,
      parseFloat(entry.sitesImpactScore) || 1,
      parseFloat(entry.reputationalImpactScore) || 1,
      parseFloat(entry.statutoryImpactScore) || 1,
      parseFloat(entry.infosecImpactScore) || 1
    ];
    
    // Calculate average impact score and round to nearest integer
    const avgImpact = Math.round(impacts.reduce((sum, score) => sum + score, 0) / impacts.length);
    const score = avgImpact.toString();
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, {});

  // Business units
  const businessUnits = [...new Set(entries.map(entry => entry.businessUnit).filter(unit => unit))];

  // Helper function to format numbers without unnecessary decimal places
  const formatNumber = (value) => {
    if (value === "N/A") return value;
    const num = parseFloat(value);
    if (isNaN(num)) return "N/A";
    // If the number is a whole number, don't show decimal places
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  // RTO statistics
  const rtoValues = entries.map(entry => parseFloat(entry.recoveryTimeObjective)).filter(val => !isNaN(val));
  const avgRTO = rtoValues.length > 0 ? formatNumber((rtoValues.reduce((sum, val) => sum + val, 0) / rtoValues.length)) : "N/A";
  const maxRTO = rtoValues.length > 0 ? formatNumber(Math.max(...rtoValues)) : "N/A";

  // RTA statistics - include all entries, treat empty as 0
  const rtaValues = entries.map(entry => {
    const val = parseFloat(entry.recoveryTimeActual);
    return isNaN(val) ? 0 : val;
  });
  const avgRTA = rtaValues.length > 0 ? formatNumber((rtaValues.reduce((sum, val) => sum + val, 0) / rtaValues.length)) : "N/A";
  const maxRTA = entries.map(entry => parseFloat(entry.recoveryTimeActual)).filter(val => !isNaN(val));
  const maxRTAValue = maxRTA.length > 0 ? formatNumber(Math.max(...maxRTA)) : "N/A";

  // MTPD statistics
  const mtpdValues = entries.map(entry => parseFloat(entry.mtpd)).filter(val => !isNaN(val));
  const avgMTPD = mtpdValues.length > 0 ? formatNumber((mtpdValues.reduce((sum, val) => sum + val, 0) / mtpdValues.length)) : "N/A";
  const maxMTPD = mtpdValues.length > 0 ? formatNumber(Math.max(...mtpdValues)) : "N/A";

  // RPO statistics
  const rpoValues = entries.map(entry => parseFloat(entry.recoveryPointObjective)).filter(val => !isNaN(val));
  const avgRPO = rpoValues.length > 0 ? formatNumber((rpoValues.reduce((sum, val) => sum + val, 0) / rpoValues.length)) : "N/A";
  const maxRPO = rpoValues.length > 0 ? formatNumber(Math.max(...rpoValues)) : "N/A";

  // RPA statistics - include all entries, treat empty as 0
  const rpaValues = entries.map(entry => {
    const val = parseFloat(entry.recoveryPointActual);
    return isNaN(val) ? 0 : val;
  });
  const avgRPA = rpaValues.length > 0 ? formatNumber((rpaValues.reduce((sum, val) => sum + val, 0) / rpaValues.length)) : "N/A";
  const maxRPA = entries.map(entry => parseFloat(entry.recoveryPointActual)).filter(val => !isNaN(val));
  const maxRPAValue = maxRPA.length > 0 ? formatNumber(Math.max(...maxRPA)) : "N/A";

  // Helper function to format criticality rating
  const formatCriticalityRating = (rating) => {
    const ratings = {
      "1": "1 (None)",
      "2": "2 (Bronze)",
      "3": "3 (Silver)",
      "4": "4 (Gold)",
      "5": "5 (Platinum)"
    };
    return ratings[rating] || rating;
  };

  // Helper function to format impact score
  const formatImpactScore = (score) => {
    const scores = {
      "1": "1 (Negligible)",
      "2": "2 (Low)",
      "3": "3 (Moderate)",
      "4": "4 (High)",
      "5": "5 (Critical)"
    };
    return scores[score] || score;
  };

  // Calculate processes by criticality level
  const criticalProcesses = entries.filter(entry => (entry.criticality || "1") === "5").length;
  const highCriticalityProcesses = entries.filter(entry => (entry.criticality || "1") === "4").length;

  // Donut Chart Component
  const CriticalityDonutChart = ({ data, total, formatCriticalityRating }) => {
    const [tooltip, setTooltip] = React.useState({ show: false, content: '', x: 0, y: 0 });
    
    const size = 200;
    const strokeWidth = 40;
    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Color mapping for criticality levels - consistent scheme: 1=Green, 2=Blue, 3=Purple, 4=Yellow/Gold, 5=Red
    const colors = {
      "5": "#d32f2f",   // 5 - Red (Platinum)
      "4": "#fbc02d",   // 4 - Yellow/Gold (Gold)
      "3": "#7b1fa2",   // 3 - Purple (Silver)
      "2": "#0099cc",   // 2 - Blue (Bronze)
      "1": "#388e3c"    // 1 - Green (None)
    };

    const handleMouseEnter = (event, content) => {
      const rect = event.currentTarget.closest('svg').getBoundingClientRect();
      setTooltip({
        show: true,
        content,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    };

    const handleMouseLeave = () => {
      setTooltip({ show: false, content: '', x: 0, y: 0 });
    };

    // Sort data by rating (highest first)
    const sortedData = Object.entries(data).sort(([a], [b]) => b - a);
    
    // Handle single segment case (full circle)
    if (sortedData.length === 1) {
      const [rating, count] = sortedData[0];
      const tooltipContent = `${formatCriticalityRating(rating)}: ${count} processes (100%)`;
      
      return (
        <div className="bia-donut-chart" style={{ position: 'relative' }}>
          <div className="bia-donut-content">
            <svg width={size} height={size} className="bia-donut-svg">
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={colors[rating]}
                strokeWidth={strokeWidth}
                className="bia-donut-segment"
                onMouseEnter={(e) => handleMouseEnter(e, tooltipContent)}
                onMouseLeave={handleMouseLeave}
              />
              <text
                x={centerX}
                y={centerY - 5}
                textAnchor="middle"
                className="bia-donut-center-number"
              >
                {total}
              </text>
              <text
                x={centerX}
                y={centerY + 15}
                textAnchor="middle"
                className="bia-donut-center-label"
              >
                Processes
              </text>
            </svg>
            <div className="bia-donut-legend">
            <div className="bia-donut-legend-item">
              <div 
                className="bia-donut-legend-color" 
                style={{ backgroundColor: colors[rating] }}
              ></div>
              <span>{formatCriticalityRating(rating)}: {count}</span>
            </div>
          </div>
          </div>
          {tooltip.show && (
            <div 
              className="bia-donut-tooltip" 
              style={{ 
                left: tooltip.x + 10, 
                top: tooltip.y - 30,
                position: 'absolute',
                pointerEvents: 'none'
              }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
      );
    }

    // Calculate angles for multiple segments
    let cumulativeAngle = 0;
    const segments = sortedData.map(([rating, count]) => {
      const percentage = count / total;
      const angle = percentage * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      // Convert angles to radians
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      // Calculate arc path
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      return {
        rating,
        count,
        pathData,
        color: colors[rating],
        percentage: (percentage * 100).toFixed(1)
      };
    });

    return (
      <div className="bia-donut-chart" style={{ position: 'relative' }}>
        <div className="bia-donut-content">
          <svg width={size} height={size} className="bia-donut-svg">
            {segments.map((segment, index) => {
              const tooltipContent = `${formatCriticalityRating(segment.rating)}: ${segment.count} processes (${segment.percentage}%)`;
              return (
                <path
                  key={segment.rating}
                  d={segment.pathData}
                  fill={segment.color}
                  stroke="#fff"
                  strokeWidth="2"
                  className="bia-donut-segment"
                  style={{ opacity: 0.9 }}
                  onMouseEnter={(e) => handleMouseEnter(e, tooltipContent)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius - strokeWidth / 2}
              fill="var(--sc3-bg)"
              stroke="none"
            />
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="bia-donut-center-number"
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="bia-donut-center-label"
            >
              Processes
            </text>
          </svg>
          <div className="bia-donut-legend">
            {segments.map((segment) => (
              <div key={segment.rating} className="bia-donut-legend-item">
                <div 
                  className="bia-donut-legend-color" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span>{formatCriticalityRating(segment.rating)}: {segment.count} ({segment.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
        {tooltip.show && (
          <div 
            className="bia-donut-tooltip" 
            style={{ 
              left: tooltip.x + 10, 
              top: tooltip.y - 30,
              position: 'absolute',
              pointerEvents: 'none'
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    );
  };

  // Impact Donut Chart Component
  const ImpactDonutChart = ({ data, total, formatImpactScore }) => {
    const [tooltip, setTooltip] = React.useState({ show: false, content: '', x: 0, y: 0 });
    
    const size = 200;
    const strokeWidth = 40;
    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Color mapping for impact scores - consistent scheme: 1=Green, 2=Blue, 3=Purple, 4=Yellow/Gold, 5=Red
    const colors = {
      "5": "#d32f2f",   // 5 - Red (Critical)
      "4": "#fbc02d",   // 4 - Yellow/Gold (High)
      "3": "#7b1fa2",   // 3 - Purple (Moderate)
      "2": "#0099cc",   // 2 - Blue (Low)
      "1": "#388e3c"    // 1 - Green (Negligible)
    };

    const handleMouseEnter = (event, content) => {
      const rect = event.currentTarget.closest('svg').getBoundingClientRect();
      setTooltip({
        show: true,
        content,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    };

    const handleMouseLeave = () => {
      setTooltip({ show: false, content: '', x: 0, y: 0 });
    };

    // Sort data by score (highest first)
    const sortedData = Object.entries(data).sort(([a], [b]) => b - a);
    
    // Handle single segment case (full circle)
    if (sortedData.length === 1) {
      const [score, count] = sortedData[0];
      const tooltipContent = `${formatImpactScore(score)}: ${count} processes (100%)`;
      
      return (
        <div className="bia-donut-chart" style={{ position: 'relative' }}>
          <div className="bia-donut-content">
            <svg width={size} height={size} className="bia-donut-svg">
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={colors[score]}
                strokeWidth={strokeWidth}
                className="bia-donut-segment"
                onMouseEnter={(e) => handleMouseEnter(e, tooltipContent)}
                onMouseLeave={handleMouseLeave}
              />
              <text
                x={centerX}
                y={centerY - 5}
                textAnchor="middle"
                className="bia-donut-center-number"
              >
                {total}
              </text>
              <text
                x={centerX}
                y={centerY + 15}
                textAnchor="middle"
                className="bia-donut-center-label"
              >
                Processes
              </text>
            </svg>
            <div className="bia-donut-legend">
            <div className="bia-donut-legend-item">
              <div 
                className="bia-donut-legend-color" 
                style={{ backgroundColor: colors[score] }}
              ></div>
              <span>{formatImpactScore(score)}: {count}</span>
            </div>
          </div>
          </div>
          {tooltip.show && (
            <div 
              className="bia-donut-tooltip" 
              style={{ 
                left: tooltip.x + 10, 
                top: tooltip.y - 30,
                position: 'absolute',
                pointerEvents: 'none'
              }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
      );
    }

    // Calculate angles for multiple segments
    let cumulativeAngle = 0;
    const segments = sortedData.map(([score, count]) => {
      const percentage = count / total;
      const angle = percentage * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      // Convert angles to radians
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      // Calculate arc path
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      return {
        score,
        count,
        pathData,
        color: colors[score],
        percentage: (percentage * 100).toFixed(1)
      };
    });

    return (
      <div className="bia-donut-chart" style={{ position: 'relative' }}>
        <div className="bia-donut-content">
          <svg width={size} height={size} className="bia-donut-svg">
            {segments.map((segment, index) => {
              const tooltipContent = `${formatImpactScore(segment.score)}: ${segment.count} processes (${segment.percentage}%)`;
              return (
                <path
                  key={segment.score}
                  d={segment.pathData}
                  fill={segment.color}
                  stroke="#fff"
                  strokeWidth="2"
                  className="bia-donut-segment"
                  style={{ opacity: 0.9 }}
                  onMouseEnter={(e) => handleMouseEnter(e, tooltipContent)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius - strokeWidth / 2}
              fill="var(--sc3-bg)"
              stroke="none"
            />
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="bia-donut-center-number"
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="bia-donut-center-label"
            >
              Processes
            </text>
          </svg>
          <div className="bia-donut-legend">
            {segments.map((segment) => (
              <div key={segment.score} className="bia-donut-legend-item">
                <div 
                  className="bia-donut-legend-color" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span>{formatImpactScore(segment.score)}: {segment.count} ({segment.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
        {tooltip.show && (
          <div 
            className="bia-donut-tooltip" 
            style={{ 
              left: tooltip.x + 10, 
              top: tooltip.y - 30,
              position: 'absolute',
              pointerEvents: 'none'
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <details className="bia-intro-details">
      <summary className="bia-intro-summary">
        BIA Report
      </summary>
      <div>
        {/* Report content starts here */}
        <h3 className="bia-report-title">
            Business Impact Assessment Report
        </h3>
        <div className="bia-report-content">
        {/* Executive Summary */}
        <div className="bia-report-section">
          <h4 className="bia-report-section-title">Executive Summary</h4>
          <div className="bia-report-summary-grid">
            <div className="bia-report-summary-item">
              <span className="bia-report-summary-label">Total Processes Analyzed:</span>
              <span className="bia-report-summary-value">{totalProcesses}</span>
            </div>
            <div className="bia-report-summary-item">
              <span className="bia-report-summary-label">Business Units Covered:</span>
              <span className="bia-report-summary-value">{businessUnits.length}</span>
            </div>
            <div className="bia-report-summary-item">
              <span className="bia-report-summary-label">Critical Processes (Platinum):</span>
              <span className="bia-report-summary-value bia-report-critical">{criticalProcesses}</span>
            </div>
            <div className="bia-report-summary-item">
              <span className="bia-report-summary-label">High Priority Processes (Gold):</span>
              <span className="bia-report-summary-value bia-report-high">{highCriticalityProcesses}</span>
            </div>
          </div>
        </div>

        {/* Recovery Time Objectives */}
        <div className="bia-report-section">
          <h4 className="bia-report-section-title">Recovery Time Analysis</h4>
          <div className="bia-report-rto-grid">
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Average RTO:</span>
              <span className="bia-report-metric-value">{avgRTO} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Maximum RTO:</span>
              <span className="bia-report-metric-value">{maxRTO} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Average RTA:</span>
              <span className="bia-report-metric-value">{avgRTA} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Maximum RTA:</span>
              <span className="bia-report-metric-value">{maxRTAValue} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Average MTPD:</span>
              <span className="bia-report-metric-value">{avgMTPD} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Maximum MTPD:</span>
              <span className="bia-report-metric-value">{maxMTPD} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Average RPO:</span>
              <span className="bia-report-metric-value">{avgRPO} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Maximum RPO:</span>
              <span className="bia-report-metric-value">{maxRPO} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Average RPA:</span>
              <span className="bia-report-metric-value">{avgRPA} hours</span>
            </div>
            <div className="bia-report-metric">
              <span className="bia-report-metric-label">Maximum RPA:</span>
              <span className="bia-report-metric-value">{maxRPAValue} hours</span>
            </div>
          </div>
        </div>

        {/* Criticality Distribution */}
        <div className="bia-report-section">
          <h4 className="bia-report-section-title">Process Criticality Distribution</h4>
          
          {/* Donut Chart */}
          <div className="bia-report-criticality-chart">
            <CriticalityDonutChart 
              data={criticalityStats} 
              total={totalProcesses}
              formatCriticalityRating={formatCriticalityRating}
            />
          </div>

          {/* Bar Chart */}
          <div className="bia-report-distribution">
            {Object.entries(criticalityStats)
              .sort(([a], [b]) => b - a)
              .map(([rating, count]) => (
                <div key={rating} className="bia-report-distribution-item">
                  <span className="bia-report-distribution-label">
                    {formatCriticalityRating(rating)}:
                  </span>
                  <span className="bia-report-distribution-value">{count}</span>
                  <div className="bia-report-distribution-bar">
                    <div 
                      className={`bia-report-distribution-fill bia-report-criticality-${rating}`}
                      style={{ width: `${(count / totalProcesses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Impact Distribution */}
        <div className="bia-report-section">
          <h4 className="bia-report-section-title">Average Impact Score Distribution</h4>
          <p className="bia-report-section-description">
            Based on the average of all impact categories (Financial, Operational, OHS, Environmental,Staff, Sites, Reputational, Statutory, Information Security)
          </p>
          
          {/* Donut Chart */}
          <div className="bia-report-criticality-chart">
            <ImpactDonutChart 
              data={impactStats} 
              total={totalProcesses}
              formatImpactScore={formatImpactScore}
            />
          </div>

          {/* Bar Chart */}
          <div className="bia-report-distribution">
            {Object.entries(impactStats)
              .sort(([a], [b]) => b - a)
              .map(([score, count]) => (
                <div key={score} className="bia-report-distribution-item">
                  <span className="bia-report-distribution-label">
                    {formatImpactScore(score)}:
                  </span>
                  <span className="bia-report-distribution-value">{count}</span>
                  <div className="bia-report-distribution-bar">
                    <div 
                      className={`bia-report-distribution-fill bia-report-impact-${score}`}
                      style={{ width: `${(count / totalProcesses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Business Units */}
        <div className="bia-report-section">
          <h4 className="bia-report-section-title">Business Units Analyzed</h4>
          <div className="bia-report-business-units">
            {businessUnits.length > 0 ? (
              businessUnits.map((unit, index) => (
                <span key={index} className="bia-report-business-unit">
                  {unit}
                </span>
              ))
            ) : (
              <span className="bia-report-no-data">No business units specified</span>
            )}
          </div>
        </div>

        {/* Critical Process Summary */}
        {criticalProcesses > 0 && (
          <div className="bia-report-section">
            <h4 className="bia-report-section-title">Critical Processes (Platinum Level)</h4>
            <div className="bia-report-critical-processes">
              {entries
                .filter(entry => (entry.criticality || "1") === "5")
                .map((entry, index) => (
                  <div key={index} className="bia-report-critical-process">
                    <div className="bia-report-process-name">{entry.processName || entry.processId}</div>
                    <div className="bia-report-process-details">
                      <span>RTO: {formatNumber(entry.recoveryTimeObjective) === "N/A" ? "N/A" : `${formatNumber(entry.recoveryTimeObjective)}h`}</span>
                      <span>RTA: {formatNumber(entry.recoveryTimeActual) === "N/A" ? "N/A" : `${formatNumber(entry.recoveryTimeActual)}h`}</span>
                      <span>MTPD: {formatNumber(entry.mtpd) === "N/A" ? "N/A" : `${formatNumber(entry.mtpd)}h`}</span>
                      <span>RPO: {formatNumber(entry.recoveryPointObjective) === "N/A" ? "N/A" : `${formatNumber(entry.recoveryPointObjective)}h`}</span>
                      <span>RPA: {formatNumber(entry.recoveryPointActual) === "N/A" ? "N/A" : `${formatNumber(entry.recoveryPointActual)}h`}</span>
                      <span>Unit: {entry.businessUnit || "N/A"}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bia-report-section">
          <h4 className="bia-report-section-title">Key Recommendations</h4>
          <div className="bia-report-recommendations">
            {criticalProcesses > 0 && (
              <div className="bia-report-recommendation">
                <strong>Critical Process Focus:</strong> {criticalProcesses} critical processes require immediate attention for business continuity planning.
              </div>
            )}
            {avgRTO !== "N/A" && parseFloat(avgRTO) > 24 && (
              <div className="bia-report-recommendation">
                <strong>Recovery Time Concern:</strong> Average RTO of {avgRTO} hours may be too high for critical business operations.
              </div>
            )}
            {avgRTA !== "N/A" && avgRTO !== "N/A" && parseFloat(avgRTA) > parseFloat(avgRTO) && (
              <div className="bia-report-recommendation">
                <strong>Performance Gap:</strong> Average RTA ({avgRTA}h) exceeds average RTO ({avgRTO}h), indicating recovery performance issues.
              </div>
            )}
            {avgRPO !== "N/A" && parseFloat(avgRPO) > 24 && (
              <div className="bia-report-recommendation">
                <strong>Data Loss Risk:</strong> Average RPO of {avgRPO} hours may result in significant data loss for critical processes.
              </div>
            )}
            {avgRPA !== "N/A" && avgRPO !== "N/A" && parseFloat(avgRPA) > parseFloat(avgRPO) && (
              <div className="bia-report-recommendation">
                <strong>Data Recovery Gap:</strong> Average RPA ({avgRPA}h) exceeds average RPO ({avgRPO}h), indicating data recovery performance issues.
              </div>
            )}
            {businessUnits.length < totalProcesses / 2 && (
              <div className="bia-report-recommendation">
                <strong>Documentation Gap:</strong> Consider completing business unit assignments for better organizational coverage analysis.
              </div>
            )}
            <div className="bia-report-recommendation">
              <strong>Regular Review:</strong> BIA should be reviewed and updated at least annually or when significant business changes occur.
            </div>
          </div>
        </div>
        </div>
      </div>
    </details>
  );
};

export default BIAReport;
