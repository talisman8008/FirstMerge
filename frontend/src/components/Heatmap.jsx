import { useState } from 'react'

export default function Heatmap({ data, totalIssues, activeDays, isDemoMode }) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });

  const plotData = (!data || data.length === 0) 
    ? Array.from({ length: 365 }, () => ({ count: 0, date: '' }))
    : data;

  // Match exact number of days per month (assuming current year)
  const year = new Date().getFullYear();
  const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const months = [];
  let currentDayIndex = 0;

  daysInMonth.forEach((numDays) => {
    const monthDays = plotData.slice(currentDayIndex, currentDayIndex + numDays);
    currentDayIndex += numDays;

    const monthWeeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      monthWeeks.push(monthDays.slice(i, i + 7));
    }
    months.push(monthWeeks);
  });

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatTooltipText = (dateStr, count) => {
    if (!dateStr) return 'No data';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return 'No data';
    
    const monthsFull = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const monthName = monthsFull[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    
    const countText = count === 1 ? '1 PR merged' : `${count} PRs merged`;
    return `${countText} on ${monthName} ${day}${suffix}`;
  };

  return (
    <div className="w-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-[13px] text-[var(--text-muted)] px-2">
        <div>
          <span className="text-[18px] font-semibold mr-1" style={{ color: 'var(--accent-green)' }}>{totalIssues || 0}</span> 
          <span style={{ color: 'var(--accent-green)' }}>pull requests merged</span> {isDemoMode ? '— Demo Data' : '— verified by GitHub'}
        </div>
        <div className="flex gap-4">
          <span>Total active days: {activeDays || 0}</span>
        </div>
      </div>

      {/* Grid of Months */}
      <div className="flex justify-between overflow-x-auto pb-2 w-full custom-scrollbar" onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}>
        {months.map((monthWeeks, mIdx) => (
          <div key={mIdx} className="flex flex-col items-center gap-1">
            <div className="flex gap-[3px]">
              {monthWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => {
                    let bg = 'bg-[var(--border)]'; // empty
                    if (day.count === 1) bg = 'bg-[var(--accent-green-dim)]';
                    if (day.count === 2) bg = 'bg-[var(--accent-green)]';
                    if (day.count >= 3) bg = 'bg-[var(--accent-green)]';
                    
                    const tooltipText = formatTooltipText(day.date, day.count);
                    
                    return (
                      <div 
                        key={dIdx} 
                        className={`w-[12px] h-[12px] rounded-[2px] ${bg} hover:ring-[1.5px] hover:ring-black hover:scale-110 transition-all duration-100 cursor-pointer`} 
                        onMouseEnter={(e) => setTooltip({ show: true, x: e.clientX, y: e.clientY, text: tooltipText })}
                        onMouseMove={(e) => setTooltip({ show: true, x: e.clientX, y: e.clientY, text: tooltipText })}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            {/* Month Label directly under the block */}
            <span className="text-[11px] text-[var(--text-muted)] mt-1">{monthLabels[mIdx]}</span>
          </div>
        ))}

        {/* Floating Tooltip */}
        {tooltip.show && (
          <div 
            className="fixed z-[100] bg-[var(--bg-card-hover)] text-[var(--text-primary)] text-[11px] font-medium px-2 py-1.5 rounded shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y - 12 }}
          >
            {tooltip.text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-[var(--bg-card-hover)]"></div>
          </div>
        )}
      </div>
    </div>
  )
}
