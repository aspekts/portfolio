import { ReactNode } from 'react';
import { Terminal } from 'lucide-react';

interface Terminal3DProps {
  children: ReactNode;
}

const Terminal3D = ({ children }: Terminal3DProps) => {
  return (
    <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="text-purple-400" size={24} />
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Terminal3D;