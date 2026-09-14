import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning';
  children: React.ReactNode;
}

export default function Alert({ type, children }: AlertProps) {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const icons = {
    success: <CheckCircle2 size={16} className="shrink-0 mt-0.5" />,
    error: <AlertCircle size={16} className="shrink-0 mt-0.5" />,
    warning: <AlertCircle size={16} className="shrink-0 mt-0.5" />,
  };

  return (
    <div className={`flex items-start gap-2.5 p-4 rounded-xl border text-xs font-semibold leading-relaxed transition-all ${styles[type]}`}>
      {icons[type]}
      <span>{children}</span>
    </div>
  );
}
