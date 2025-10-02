import Header from '../components/Layout/Header';

interface SimplePageProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function SimplePage({ title, subtitle, children }: SimplePageProps) {
  return (
    <div className="flex-1">
      <Header title={title} subtitle={subtitle} />
      <div className="p-8">
        {children || (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">{title} Module</h3>
            <p className="text-slate-500">This module is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}
