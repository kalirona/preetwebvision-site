import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Folder, Image, Trash2, Clipboard, Check, Upload, X, ZoomIn, RefreshCw, FileText } from 'lucide-react';

export const MediaModule = ({ onSelectImage }: { onSelectImage?: (url: string) => void }) => {
  const [mediaList, setMediaList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFolder, setActiveFolder] = React.useState('All');
  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
  const [folders, setFolders] = React.useState<string[]>(['All']);

  // Upload state
  const [uploadUrl, setUploadUrl] = React.useState('');
  const [uploadName, setUploadName] = React.useState('');
  const [uploadFolder, setUploadFolder] = React.useState('Graphics');
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [compressing, setCompressing] = React.useState(false);

  // Edit details Form states
  const [editAlt, setEditAlt] = React.useState('');
  const [editName, setEditName] = React.useState('');
  const [editFolder, setEditFolder] = React.useState('');
  const [editSuccess, setEditSuccess] = React.useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      const data = await res.json();
      setMediaList(data);

      // Extract raw folders list list
      const extracted = ['All', ...new Set(data.map((item: any) => item.folder || 'Unsorted')) as any];
      setFolders(extracted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMedia();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Simulate real-upload mapping
      setUploadName(file.name);
      setUploadUrl("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"); // fallback Mock
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName || !uploadUrl) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: uploadName,
          url: uploadUrl,
          folder: uploadFolder,
          type: "image/jpeg",
          size: "185 KB",
          dimensions: "1920 x 1200",
          alt: uploadName.split(".")[0]
        })
      });

      if (res.ok) {
        setUploadSuccess(true);
        setUploadName('');
        setUploadUrl('');
        setTimeout(() => setUploadSuccess(false), 2000);
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompress = async (id: string) => {
    setCompressing(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/media/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedItem(updated);
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompressing(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/media/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          alt: editAlt,
          name: editName,
          folder: editFolder
        })
      });

      if (res.ok) {
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 2000);
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Verify deleting this asset? Link dependencies will sever.")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSelectedItem(null);
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMedia = mediaList.filter((m: any) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (m.alt && m.alt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = activeFolder === 'All' || m.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const selectItemForViewing = (item: any) => {
    setSelectedItem(item);
    setEditAlt(item.alt || '');
    setEditName(item.name || '');
    setEditFolder(item.folder || 'Graphics');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex justify-between items-start pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Media Library</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">Slick folder asset container with WebP auto-compressor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns - Media Explorer */}
        <div className="lg:col-span-2 space-y-8">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 border border-slate-100 rounded-3xl shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:bg-white"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400" size={14} />
            </div>

            {/* Folder Filter Links */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    activeFolder === folder 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>
          </div>

          {/* Grid display list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {filteredMedia.map((m) => (
              <motion.div
                layoutId={`media-${m.id}`}
                key={m.id}
                onClick={() => selectItemForViewing(m)}
                className={`relative aspect-[4/3] bg-slate-50 border rounded-[2rem] overflow-hidden group cursor-pointer transition-all duration-300 ${
                  selectedItem?.id === m.id ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md' : 'border-slate-100 hover:shadow-lg'
                }`}
              >
                <img 
                  src={m.url} 
                  alt={m.alt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <p className="text-[10px] font-black text-white line-clamp-1">{m.name}</p>
                  <p className="text-[8px] font-bold text-slate-350 tracking-wider mt-1">{m.dimensions} • {m.size}</p>
                </div>

                <div className="absolute top-3 left-3 bg-slate-900/75 text-white text-[8px] font-bold tracking-widest uppercase px-2 py-1 rounded-md">
                   {m.folder}
                </div>
              </motion.div>
            ))}

            {filteredMedia.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[3rem]">
                No files matching active search parameters.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column - Details Side Block / New Simulated Upload Area */}
        <div className="space-y-12">
          {/* Upload panel */}
          <div className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Media Upload Portal</h3>

            <div 
              onDragEnter={handleDrag} 
              onDragOver={handleDrag} 
              onDragLeave={handleDrag} 
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[2rem] p-6 text-center transition-all ${
                dragActive ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
              }`}
            >
              <Upload className="mx-auto text-slate-400 mb-4 animate-bounce" size={24} />
              <p className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Drag & Drop Image Files</p>
              <p className="text-[9px] text-slate-400 font-medium leading-relaxed mt-2">Or paste standard direct URL link below to add to index</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {uploadSuccess && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 font-bold text-[10px] flex items-center gap-2">
                  <Check size={14} /> Asset registered under active bucket!
                </div>
              )}

              <div>
                <input 
                  type="text" 
                  required
                  placeholder="Image Asset Name (e.g. logo.png)"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <input 
                  type="text" 
                  required
                  placeholder="Direct Image URL (Unsplash/Imgur)"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select 
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="Graphics">Graphics</option>
                    <option value="Dashboards">Dashboards</option>
                    <option value="Creative Concepts">Creative Concepts</option>
                    <option value="Unsorted">Unsorted</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-indigo-650 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md transition-all"
                >
                  Register URL
                </button>
              </div>
            </form>
          </div>

          {/* Asset Viewer block details */}
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6 relative"
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"
                >
                  <X size={16} />
                </button>

                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Image Inspector</h3>

                <div className="aspect-[16/10] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                  <img src={selectedItem.url} alt={selectedItem.alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-600 py-4 border-y border-slate-50">
                  <div className="flex justify-between">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolution:</span>
                     <span className="font-bold text-slate-800">{selectedItem.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">File Weight:</span>
                     <span className="font-bold text-slate-800">{selectedItem.size}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Format:</span>
                     <span className="font-bold text-slate-800 font-mono text-[10px] uppercase">{selectedItem.type.split("/")[1]}</span>
                  </div>
                </div>

                {onSelectImage && (
                  <button 
                    onClick={() => onSelectImage(selectedItem.url)}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-505 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                  >
                     Select for Feature Image
                  </button>
                )}

                {/* Edit Form */}
                <form onSubmit={handleSaveChanges} className="space-y-4">
                  {editSuccess && (
                     <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 font-bold text-[9px]">
                        Changes synchronized to database.
                     </div>
                  )}

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">File Display Label</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Alt Text (Search Indexing)</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3">
                     <button
                       type="button"
                       disabled={compressing}
                       onClick={() => handleCompress(selectedItem.id)}
                       className="py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-1 shadow"
                     >
                       <RefreshCw size={12} className={compressing ? 'animate-spin' : ''} />
                       WebP Compress
                     </button>
                     <button
                       type="submit"
                       className="py-3 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 shadow"
                     >
                       Save Alt
                     </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(selectedItem.id)}
                    className="w-full py-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest tracking-widest transition-all mt-1"
                  >
                     Delete Permanent
                  </button>
                </form>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 p-10 border border-slate-100 rounded-[2.5rem] text-center text-slate-400 font-bold italic text-xs leading-normal">
                Click on any image block inside the explorer to expand metadata details or trigger Google-safe WebP compress tests on it.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
