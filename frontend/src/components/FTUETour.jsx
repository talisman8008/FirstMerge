import React from 'react';
import { Joyride, STATUS } from 'react-joyride';

// Custom Tooltip Component that perfectly matches our app UI and supports dark/light mode
const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
}) => {
  return (
    <div 
      {...tooltipProps} 
      className="bg-[var(--bg-card)] text-[var(--text-primary)] p-6 rounded-2xl border border-[var(--border)] shadow-2xl max-w-[400px]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      {step.title && (
        <h3 
          className="text-[18px] font-bold text-[var(--accent-green)] mb-2"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {step.title}
        </h3>
      )}
      
      {/* Body */}
      <div className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-6">
        {step.content}
      </div>
      
      {/* Footer / Controls */}
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-[var(--border)]">
        <button 
          {...closeProps}
          className="text-[13px] font-bold text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors"
        >
          Skip Tour
        </button>
        
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button 
              {...backProps}
              className="text-[14px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Back
            </button>
          )}
          <button 
            {...primaryProps}
            className="px-4 py-2 bg-[var(--accent-green)] hover:bg-[#2ea043] text-black text-[14px] font-bold rounded-lg transition-colors shadow-lg"
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FTUETour({ run, steps, onJoyrideStateChange }) {
  return (
    <Joyride
      callback={onJoyrideStateChange}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      scrollOffset={120}
      tooltipComponent={CustomTooltip}
      floaterProps={{
        disableAnimation: true, // We handle our own simple pop in
      }}
      styles={{
        options: {
          arrowColor: 'var(--bg-card)',
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999999,
        }
      }}
    />
  );
}
