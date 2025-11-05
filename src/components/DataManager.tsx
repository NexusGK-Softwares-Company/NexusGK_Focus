import React from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';

interface DataManagerProps {
  onExport: () => void;
  onImport: (data: string) => void;
  onClearData: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({
  onExport,
  onImport,
  onClearData,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        onImport(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold mb-4">Data Management</h3>
      
      <div className="space-y-3">
        <button
          onClick={onExport}
          className="w-full px-4 py-3 rounded-lg bg-secondary hover:bg-secondary-dark transition-all flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Export Data
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-3 rounded-lg bg-primary hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          Import Data
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={() => {
            if (window.confirm('Are you sure? This will delete all your data permanently!')) {
              onClearData();
            }
          }}
          className="w-full px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={20} />
          Clear All Data
        </button>
      </div>

      <p className="text-xs text-white/40 mt-4 text-center">
        Export your data to backup or transfer to another device
      </p>
    </div>
  );
};

