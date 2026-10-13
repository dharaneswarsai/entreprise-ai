import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderOpen,
  FileText,
  FileImage,
  Video,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import { FileCategory, FileAsset } from '../types';

export const AssetLibrary: React.FC = () => {
  const { files, addFileAsset, clients, projects } = useApp();
  const [selectedFolder, setSelectedFolder] = useState<FileCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload state
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<FileCategory>('Brand Assets');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [sizeMB, setSizeMB] = useState('14');

  const folders: FileCategory[] = [
    'Brand Assets',
    'Raw Footage',
    'Designs',
    'Final Exports',
    'Documents',
    'Proposals',
    'Invoices'
  ];

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolder === 'ALL' || f.category === selectedFolder;
    const matchesSearch = !searchQuery || f.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    const c = clients.find(cl => cl.id === clientId) || clients[0];

    addFileAsset({
      fileName,
      fileType: fileName.endsWith('.mp4') ? 'video/mp4' : fileName.endsWith('.pdf') ? 'application/pdf' : 'image/svg+xml',
      category,
      clientId: c.id,
      clientName: c.companyName,
      sizeBytes: Number(sizeMB) * 1024 * 1024,
      uploadedBy: 'Priya Sharma',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
    });

    setFileName('');
    setIsUploadModalOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Centralized Asset Repository</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {files.length} Stored Assets
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Cloud storage: Brand vectors, 4K Sony FX3 raw footage, finalized render exports, and service agreements
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Asset</span>
        </button>
      </div>

      {/* Folder Categories Row per spec #23 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          onClick={() => setSelectedFolder('ALL')}
          className={`p-3 rounded-2xl border text-center transition-all ${
            selectedFolder === 'ALL'
              ? 'border-[#1F4D3A] bg-[#1F4D3A] text-white shadow-xs'
              : 'border-[#E5E7E3] bg-[#FAF9F6] text-[#202522] hover:bg-white'
          }`}
        >
          <FolderOpen className="w-5 h-5 mx-auto mb-1.5" />
          <span className="text-[11px] font-bold block truncate">All Assets</span>
          <span className="text-[10px] opacity-75">{files.length}</span>
        </button>

        {folders.map(fld => {
          const count = files.filter(f => f.category === fld).length;
          const isSelected = selectedFolder === fld;
          return (
            <button
              key={fld}
              onClick={() => setSelectedFolder(fld)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'border-[#1F4D3A] bg-[#1F4D3A] text-white shadow-xs'
                  : 'border-[#E5E7E3] bg-[#FAF9F6] text-[#202522] hover:bg-white'
              }`}
            >
              <FolderOpen className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
              <span className="text-[11px] font-bold block truncate">{fld}</span>
              <span className="text-[10px] opacity-75">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Files Table / List */}
      <div className="agency-card overflow-hidden">
        <div className="p-4 border-b border-[#E5E7E3] bg-[#FAF9F6] flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
            Files in {selectedFolder === 'ALL' ? 'Entire Agency Vault' : selectedFolder} ({filteredFiles.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#15382B]">
              <tr>
                <th className="p-3 font-bold">File Name & Type</th>
                <th className="p-3 font-bold">Category</th>
                <th className="p-3 font-bold">Client Account</th>
                <th className="p-3 font-bold">Size</th>
                <th className="p-3 font-bold">Uploaded By</th>
                <th className="p-3 font-bold">Date</th>
                <th className="p-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7E3]">
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-3 font-bold text-[#202522] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1F4D3A] shrink-0" />
                    <span className="truncate max-w-xs">{file.fileName}</span>
                  </td>
                  <td className="p-3 font-medium text-[#59655F]">{file.category}</td>
                  <td className="p-3 font-semibold text-[#15382B]">{file.clientName || 'General'}</td>
                  <td className="p-3 font-mono text-[#8A9690]">{formatFileSize(file.sizeBytes)}</td>
                  <td className="p-3 text-[#59655F]">{file.uploadedBy}</td>
                  <td className="p-3 text-[#8A9690]">{file.uploadedAt}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert(`Downloading ${file.fileName}`)}
                      className="p-1.5 rounded-lg border border-[#E5E7E3] hover:bg-stone-100 text-[#1F4D3A]"
                      title="Download Asset"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E5E7E3] z-10 space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#15382B]">Upload Asset to Vault</h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#202522] mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="e.g. Sanchari_Nilgiris_Story_Master.mp4"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] bg-white outline-none"
                  >
                    {folders.map(fld => (
                      <option key={fld} value={fld}>{fld}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Approx Size (MB)</label>
                  <input
                    type="number"
                    value={sizeMB}
                    onChange={e => setSizeMB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#202522] mb-1">Attach to Client Account</label>
                <select
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] bg-white outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7E3]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-[#59655F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1F4D3A] text-white font-semibold hover:bg-[#15382B]"
                >
                  Store File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
