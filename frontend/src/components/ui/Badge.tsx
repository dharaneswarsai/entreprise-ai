import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'green' | 'amber' | 'red' | 'gray' | 'blue' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'forest',
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    forest: 'bg-[#EBF2EE] text-[#1F4D3A] border border-[#D5E4DC]',
    green: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    amber: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
    red: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
    gray: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    blue: 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]',
    purple: 'bg-[#FAF5FF] text-[#6B21A8] border border-[#E9D5FF]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let variant: BadgeProps['variant'] = 'gray';
  const s = status.toUpperCase();

  if (s === 'COMPLETED' || s === 'WON' || s === 'ACCEPTED' || s === 'PAID' || s === 'APPROVED' || s === 'PUBLISHED' || s === 'HEALTHY' || s === 'ON TRACK') {
    variant = 'green';
  } else if (s === 'IN_PROGRESS' || s === 'NEGOTIATION' || s === 'SCHEDULED' || s === 'INTERESTED' || s === 'QUALIFIED' || s === 'MEETING') {
    variant = 'forest';
  } else if (s === 'IN_REVIEW' || s === 'REVIEW' || s === 'PROPOSAL_SENT' || s === 'NEEDS ATTENTION' || s === 'AT RISK' || s === 'PARTIALLY PAID') {
    variant = 'amber';
  } else if (s === 'REVISION' || s === 'OVERDUE' || s === 'DELAYED' || s === 'LOST' || s === 'REJECTED') {
    variant = 'red';
  } else if (s === 'EDITING' || s === 'DESIGN' || s === 'SCRIPT') {
    variant = 'blue';
  }

  return (
    <Badge variant={variant} size="sm">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' }> = ({ priority }) => {
  const styles = {
    LOW: 'bg-stone-100 text-stone-600 border-stone-200',
    MEDIUM: 'bg-emerald-50 text-[#1F4D3A] border-[#D5E4DC]',
    HIGH: 'bg-amber-50 text-amber-800 border-amber-200',
    URGENT: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export const LeadScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  let label = 'Cold';
  let color = 'bg-stone-100 text-stone-700 border-stone-200';
  let dotColor = 'bg-stone-400';

  if (score >= 80) {
    label = 'High Priority';
    color = 'bg-emerald-50 text-[#15382B] border-[#1F4D3A]/20 font-bold';
    dotColor = 'bg-[#1F4D3A]';
  } else if (score >= 60) {
    label = 'Hot';
    color = 'bg-orange-50 text-orange-800 border-orange-200';
    dotColor = 'bg-orange-500';
  } else if (score >= 30) {
    label = 'Warm';
    color = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${color}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="font-mono font-bold">{score}</span>
      <span className="text-[10px] uppercase opacity-75">· {label}</span>
    </div>
  );
};
