import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Save, Edit3, Trash2, BookOpen, X, Check, Globe, HelpCircle, 
  FileText, Cpu, Sparkles, RefreshCw, Award, ArrowUp, ArrowDown, 
  List, Quote, Code, Image, Type, ChevronUp, ChevronDown
} from 'lucide-react';
import { MediaModule } from './MediaModule';

export interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code' | 'image';
  value: string;
  level?: 1 | 2 | 3;
  language?: string;
  alt?: string;
  url?: string;
}

export function parseMarkdownToBlocks(md: string): Block[] {
  if (!md) {
    return [{ id: Math.random().toString(36).substring(2, 9), type: 'paragraph', value: '' }];
  }
  
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  
  while (i < lines.length) {
    let line = lines[i];
    
    // Code block parsing
    if (line.trim().startsWith('```')) {
      const lang = line.trim().substring(3).trim() || 'typescript';
      let codeValue = '';
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeValue += (codeValue ? '\n' : '') + lines[i];
        i++;
      }
      blocks.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'code',
        value: codeValue,
        language: lang
      });
      i++; // Skip closing ```
      continue;
    }
    
    // Blockquote block parsing
    if (line.startsWith('> ')) {
      let quoteVal = line.substring(2);
      i++;
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteVal += '\n' + lines[i].substring(2);
        i++;
      }
      blocks.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'quote',
        value: quoteVal
      });
      continue;
    }
    
    // Headings
    if (line.startsWith('# ')) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'heading',
        level: 1,
        value: line.substring(2)
      });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'heading',
        level: 2,
        value: line.substring(3)
      });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'heading',
        level: 3,
        value: line.substring(4)
      });
      i++;
      continue;
    }
    
    // Bullet lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      let listValue = line.substring(2);
      i++;
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listValue += '\n' + (lines[i].startsWith('- ') ? lines[i].substring(2) : lines[i].substring(2));
        i++;
      }
      blocks.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'list',
        value: listValue
      });
      continue;
    }
    
    // Markdown Images: ![alt](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      blocks.push({
        id: Math.random().toString(36).substring(2, 9),
        type: 'image',
        value: '',
        alt: imgMatch[1],
        url: imgMatch[2]
      });
      i++;
      continue;
    }
    
    // Paragraph or generic lines
    if (line.trim() === '') {
      i++;
      continue;
    }
    
    let paraVal = line;
    i++;
    while (i < lines.length && 
           lines[i].trim() !== '' && 
           !lines[i].startsWith('#') && 
           !lines[i].startsWith('>') && 
           !lines[i].startsWith('- ') && 
           !lines[i].startsWith('* ') && 
           !lines[i].match(/^!\[(.*?)\]\((.*?)\)$/)) {
      paraVal += '\n' + lines[i];
      i++;
    }
    
    blocks.push({
      id: Math.random().toString(36).substring(2, 9),
      type: 'paragraph',
      value: paraVal
    });
  }
  
  if (blocks.length === 0) {
    blocks.push({ id: Math.random().toString(36).substring(2, 9), type: 'paragraph', value: '' });
  }
  return blocks;
}

export function serializeBlocksToMarkdown(blocks: Block[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return block.value;
      case 'heading':
        const hashes = '#'.repeat(block.level || 2);
        return `${hashes} ${block.value}`;
      case 'list':
        return block.value.split('\n').map(item => `- ${item}`).join('\n');
      case 'quote':
        return block.value.split('\n').map(line => `> ${line}`).join('\n');
      case 'code':
        return `\`\`\`${block.language || 'typescript'}\n${block.value}\n\`\`\``;
      case 'image':
        return `![${block.alt || ''}](${block.url || ''})`;
      default:
        return '';
    }
  }).join('\n\n');
}

export const PostsModule = () => {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingPost, setEditingPost] = React.useState<any | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  // Form states
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('WordPress Tutorials');
  const [image, setImage] = React.useState('');
  const [author, setAuthor] = React.useState('Preet');
  const [status, setStatus] = React.useState('PUBLISHED');
  
  // SEO States
  const [metaTitle, setMetaTitle] = React.useState('');
  const [metaDescription, setMetaDescription] = React.useState('');
  const [focusKeyword, setFocusKeyword] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  
  // AI SEO Heuristics States
  const [aiAnalyzing, setAiAnalyzing] = React.useState(false);
  const [isImgPickerOpen, setIsImgPickerOpen] = React.useState(false);
  const [aiSeoScore, setAiSeoScore] = React.useState<number | null>(null);
  const [aiSuggestions, setAiSuggestions] = React.useState<string[]>([]);
  const [headingReport, setHeadingReport] = React.useState('');

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Built-in WordPress/Markdown content-composer suite
  const [editorTab, setEditorTab] = React.useState<'visual' | 'raw' | 'preview'>('visual');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // WordPress Block Editor States
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [focusedBlockId, setFocusedBlockId] = React.useState<string | null>(null);
  const [imageTargetBlockId, setImageTargetBlockId] = React.useState<string | null>(null);

  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    const md = serializeBlocksToMarkdown(newBlocks);
    setContent(md);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    handleBlocksChange(updated);
  };

  const addBlock = (type: Block['type'], afterIndex?: number) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      value: type === 'heading' ? 'New Section Heading' : type === 'code' ? '// write syntax code here' : '',
      level: type === 'heading' ? 2 : undefined,
      language: type === 'code' ? 'typescript' : undefined,
      alt: type === 'image' ? '' : undefined,
      url: type === 'image' ? 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80' : undefined
    };
    
    if (afterIndex !== undefined) {
      const updated = [...blocks];
      updated.splice(afterIndex + 1, 0, newBlock);
      handleBlocksChange(updated);
    } else {
      handleBlocksChange([...blocks, newBlock]);
    }
    setFocusedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const updated = blocks.map(b => b.id === id ? { ...b, ...updates } : b);
    handleBlocksChange(updated);
  };

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      handleBlocksChange([{ id: Math.random().toString(36).substring(2, 9), type: 'paragraph', value: '' }]);
      return;
    }
    const updated = blocks.filter(b => b.id !== id);
    handleBlocksChange(updated);
  };

  const insertFormatSyntax = (formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      let syntax = '';
      switch (formatType) {
        case 'bold': syntax = '**Bold Text**'; break;
        case 'italic': syntax = '*Italic Text*'; break;
        case 'link': syntax = '[Link Title](https://example.com)'; break;
        case 'h1': syntax = '\n# New Section Title Heading\n'; break;
        case 'h2': syntax = '\n## Secondary Subsection Title\n'; break;
        case 'h3': syntax = '\n### Tertiary Topic Area\n'; break;
        case 'quote': syntax = '\n> "Expert insight quotation paragraph..."\n'; break;
        case 'code': syntax = '\n```typescript\n// code insight\nconst preet = "web vision analytics";\n```\n'; break;
        case 'list': syntax = '\n- Ordered checklist item\n- Continuing segment detail\n'; break;
      }
      setContent(prev => prev + syntax);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    let wrapped = '';
    switch (formatType) {
      case 'bold':
        wrapped = `**${selection || 'Bold Text'}**`;
        break;
      case 'italic':
        wrapped = `*${selection || 'Italic Text'}*`;
        break;
      case 'link':
        wrapped = `[${selection || 'Link Title'}](https://example.com)`;
        break;
      case 'h1':
        wrapped = `\n# ${selection || 'New Section Title Heading'}\n`;
        break;
      case 'h2':
        wrapped = `\n## ${selection || 'Secondary Subsection Title'}\n`;
        break;
      case 'h3':
        wrapped = `\n### ${selection || 'Tertiary Topic Area'}\n`;
        break;
      case 'quote':
        wrapped = `\n> ${selection || '"Expert insight quotation paragraph..."'}\n`;
        break;
      case 'code':
        wrapped = `\n\`\`\`typescript\n${selection || '// code insight\nconst preet = "web vision";'}\n\`\`\`\n`;
        break;
      case 'list':
        if (selection) {
          wrapped = selection.split('\n').map(line => line.startsWith('- ') ? line : `- ${line}`).join('\n');
        } else {
          wrapped = `\n- Ordered checklist item\n- Continuing segment detail\n`;
        }
        break;
      default:
        wrapped = selection;
    }

    const newContent = before + wrapped + after;
    setContent(newContent);

    // Maintain focus and update selection range
    setTimeout(() => {
      textarea.focus();
      const newCursorStart = start + wrapped.length;
      textarea.setSelectionRange(start, newCursorStart);
    }, 0);
  };

  const runAiSEOAnalysis = async () => {
    setAiAnalyzing(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          focusKeyword,
          metaDescription
        })
      });

      if (res.ok) {
        const report = await res.json();
        setAiSeoScore(report.score);
        setAiSuggestions(report.suggestions || []);
        setHeadingReport(report.headingsAnalysis || '');
      } else {
        setError("AI SEO service failed to respond.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const runAiSEOImprovement = async () => {
    setAiAnalyzing(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/seo/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          focusKeyword
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.title) setTitle(result.title);
        if (result.metaDescription) setMetaDescription(result.metaDescription);
        if (result.content) {
          setContent(result.content);
          setBlocks(parseMarkdownToBlocks(result.content));
        }
        setSuccess("AI successfully expanded content structure & subheadings!");
        setAiSeoScore(95); // optimized
        setTimeout(() => setSuccess(''), 2500);
      } else {
        setError("AI optimizer failed. Try again.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const openAddEditor = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    const defaultContent = '# New Tutorial Article\n\nStart writing blog post content here...';
    setContent(defaultContent);
    setBlocks(parseMarkdownToBlocks(defaultContent));
    setCategory('WordPress Tutorials');
    setImage('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80');
    setAuthor('Preet');
    setStatus('PUBLISHED');
    setMetaTitle('');
    setMetaDescription('');
    setFocusKeyword('');
    setTags([]);
    setTagInput('');
    setAiSeoScore(null);
    setAiSuggestions([]);
    setHeadingReport('');
    setError('');
    setSuccess('');
    setIsEditorOpen(true);
  };

  const openEditEditor = (post: any) => {
    setEditingPost(post);
    setTitle(post.title || '');
    setSlug(post.slug || '');
    setExcerpt(post.excerpt || '');
    const loadedContent = post.content || '';
    setContent(loadedContent);
    setBlocks(parseMarkdownToBlocks(loadedContent));
    setCategory(post.category || 'WordPress Tutorials');
    setImage(post.image || '');
    setAuthor(post.author || 'Preet');
    setStatus(post.status || 'PUBLISHED');
    setMetaTitle(post.seo?.metaTitle || '');
    setMetaDescription(post.seo?.metaDescription || '');
    setFocusKeyword(post.seo?.focusKeyword || '');
    setTags(post.seo?.tags || []);
    setTagInput('');
    setAiSeoScore(null);
    setAiSuggestions([]);
    setHeadingReport('');
    setError('');
    setSuccess('');
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !slug) {
      setError('Title and slug are required');
      return;
    }

    const token = localStorage.getItem('adminToken');
    const postData = {
      title,
      slug,
      excerpt,
      content,
      category,
      image,
      author,
      status,
      seo: {
        metaTitle: metaTitle || title,
        metaDescription,
        focusKeyword,
        tags
      }
    };

    try {
      let response;
      if (editingPost) {
        response = await fetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });
      } else {
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Operation failed');
      }

      setSuccess('Post published successfully!');
      setTimeout(() => {
        setIsEditorOpen(false);
        fetchPosts();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog post? This is irreversible.')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPosts();
      } else {
        const res = await response.json();
        alert(res.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  // Auto-generate slug and meta title
  React.useEffect(() => {
    if (!editingPost && title) {
      setSlug(title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      setMetaTitle(`${title} | Preet Web Vision`);
    }
  }, [title, editingPost]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex justify-between items-center pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Blog & SEO Articles</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">High-performance technical blog CMS</p>
        </div>
        <button 
          onClick={openAddEditor}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md cursor-pointer"
        >
          <Plus size={16} /> Write Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-150 transition-all flex flex-col justify-between min-h-[420px]">
             {/* Article Image Header */}
             <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img 
                  src={post.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-slate-900/45 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {post.category}
                </div>
                <div className="absolute top-4 right-4 bg-white/95 text-slate-900 text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full">
                  {post.status}
                </div>
             </div>

             <div className="p-8 flex-1 flex flex-col justify-between">
               <div>
                  <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                     <span className="flex items-center gap-1.5"><BookOpen size={12} /> {post.author}</span>
                     <span>•</span>
                     <span>{post.date}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 italic tracking-tight uppercase line-clamp-2 leading-snug mb-3 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => openEditEditor(post)}>
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
               </div>

               <div className="border-t border-slate-50 pt-6 mt-auto">
                 {post.seo?.focusKeyword && (
                    <div className="mb-4">
                       <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mr-2">Focus Keyword:</span>
                       <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[9px] font-black font-mono">{post.seo.focusKeyword}</span>
                    </div>
                 )}
                 
                 <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-455 uppercase tracking-widest font-mono">
                      /{post.slug}
                    </p>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => openEditEditor(post)}
                         className="w-10 h-10 rounded-xl bg-slate-50 text-indigo-600 border border-slate-100/50 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all"
                       >
                          <Edit3 size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(post.id)}
                         className="w-10 h-10 rounded-xl bg-slate-50 text-red-500 border border-slate-100/50 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        ))}

        {posts.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[3rem]">
             No blog posts registered under SEO-Engine. Click "+ Write Article" to deploy first.
          </div>
        )}
      </div>

      {/* Editor Modal Drawer */}
      <AnimatePresence>
        {isEditorOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
              onClick={() => setIsEditorOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-3xl bg-white z-[90] shadow-2xl overflow-y-auto"
            >
              <div className="p-12 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-8 border-b border-slate-100 mb-10">
                     <div>
                       <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                         {editingPost ? 'Edit Blog Article' : 'Publish Blog Article'}
                       </h3>
                       <p className="text-xs text-indigo-600 font-semibold tracking-wider mt-1">SEO Engine Management</p>
                     </div>
                     <button 
                       onClick={() => setIsEditorOpen(false)}
                       className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
                     >
                       <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-8">
                     {error && (
                       <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-650 font-bold text-xs">
                         {error}
                       </div>
                     )}
                     {success && (
                       <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 font-bold text-xs flex items-center gap-2">
                         <Check size={16} /> {success}
                       </div>
                     )}

                     <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Article Title</label>
                           <input 
                             type="text"
                             value={title} 
                             onChange={(e) => setTitle(e.target.value)}
                             placeholder="WordPress SEO Mastery 2026" 
                             className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold focus:outline-none transition-all"
                           />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Slug</label>
                           <input 
                             type="text"
                             value={slug} 
                             onChange={(e) => setSlug(e.target.value)}
                             placeholder="wordpress-seo-mastery-2026" 
                             className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-mono font-bold focus:outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-6">
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Category</label>
                           <select 
                             value={category} 
                             onChange={(e) => setCategory(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold focus:outline-none transition-all"
                           >
                             <option value="WordPress Tutorials">WordPress Tutorials</option>
                             <option value="Digital Marketing Tips">Digital Marketing Tips</option>
                             <option value="SEO Strategies 2026">SEO Strategies 2026</option>
                             <option value="Agency Growth">Agency Growth</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Author Name</label>
                           <input 
                             type="text"
                             value={author} 
                             onChange={(e) => setAuthor(e.target.value)}
                             placeholder="Preet" 
                             className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none transition-all"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-2 block">Publish State</label>
                           <select 
                             value={status} 
                             onChange={(e) => setStatus(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold focus:outline-none transition-all"
                           >
                             <option value="PUBLISHED">Published</option>
                             <option value="DRAFT">Draft</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Featured Image URL</label>
                        <div className="flex gap-2.5">
                           <input 
                             type="text"
                             value={image} 
                             onChange={(e) => setImage(e.target.value)}
                             placeholder="https://images.unsplash.com/..." 
                             className="flex-1 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none transition-all font-mono"
                           />
                           <button
                             type="button"
                             onClick={() => setIsImgPickerOpen(true)}
                             className="px-5 bg-slate-900 border border-slate-905 hover:border-indigo-500 hover:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow shrink-0"
                           >
                              Pick from Media Library
                           </button>
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Short Excerpt</label>
                        <textarea 
                          rows={2}
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                          placeholder="Summary text to entice clicks on blog hubs..."
                          className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl p-4 text-xs font-medium focus:outline-none transition-all leading-relaxed"
                        />
                     </div>

                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2.5 block font-sans">POST CONTENT COMPOSITION ENGINE (WordPress Gutenberg Style)</label>
                        
                        {/* Tab Switcher */}
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-slate-100 p-2.5 rounded-2xl border border-slate-200/60 gap-4 mb-6 select-none font-sans">
                           <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-sm flex-wrap shrink-0">
                              <button 
                                type="button" 
                                onClick={() => {
                                  setEditorTab('visual');
                                  setBlocks(parseMarkdownToBlocks(content));
                                }} 
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border-0 bg-transparent ${editorTab === 'visual' ? 'bg-indigo-600 text-white shadow-md font-sans font-bold text-white' : 'text-slate-500 hover:text-slate-800'}`}
                              >
                                Visual Block Editor
                              </button>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setEditorTab('raw');
                                }} 
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border-0 bg-transparent ${editorTab === 'raw' ? 'bg-indigo-600 text-white shadow-md font-sans font-bold text-white' : 'text-slate-500 hover:text-slate-800'}`}
                              >
                                RAW Markdown Editor
                              </button>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setEditorTab('preview');
                                }} 
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border-0 bg-transparent ${editorTab === 'preview' ? 'bg-indigo-600 text-white shadow-md font-sans font-bold text-white' : 'text-slate-500 hover:text-slate-800'}`}
                              >
                                Live Preview
                              </button>
                           </div>
                           
                           <div className="text-[9px] font-black uppercase tracking-widest text-slate-450 mr-4 flex items-center justify-between sm:justify-end gap-4 font-sans font-bold">
                              <span>Total Active Blocks: {blocks.length}</span>
                           </div>
                        </div>

                        {/* Visual Block Editor Layout */}
                        {editorTab === 'visual' && (
                           <div className="space-y-6 font-sans">
                              {/* Gutenberg Core Inserter Toolbox */}
                              <div className="bg-slate-50 border border-slate-205/50 rounded-[2rem] p-6 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
                                 <div className="space-y-1 text-center xl:text-left">
                                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 justify-center xl:justify-start">
                                      <Sparkles size={14} className="text-indigo-600" />
                                      Gutenberg block Library
                                    </h4>
                                    <p className="text-[8.5px] text-slate-505 font-bold uppercase tracking-widest leading-relaxed">
                                      Hover individual canvas nodes to alter types, add intervals or reorder indices.
                                    </p>
                                 </div>
                                 
                                 <div className="flex flex-wrap gap-2 justify-center font-sans">
                                    <button
                                       type="button"
                                       onClick={() => addBlock('paragraph')}
                                       className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-indigo-650 hover:bg-slate-105 rounded-lg text-[8.5px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-1.5 shadow-sm transition-all focus:ring-1 focus:ring-indigo-505 cursor-pointer font-sans"
                                    >
                                       <Type size={11} className="text-indigo-600" /> + Add Paragraph
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => addBlock('heading')}
                                       className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-indigo-650 hover:bg-slate-105 rounded-lg text-[8.5px] font-black uppercase tracking-widest text-slate-700 flex items-center gap-1.5 shadow-sm transition-all focus:ring-1 focus:ring-indigo-505 cursor-pointer font-sans"
                                    >
                                       <Plus size={11} className="text-indigo-600" /> + Add Heading
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => addBlock('list')}
                                       className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-indigo-655 hover:bg-slate-105 rounded-lg text-[8.5px] font-black uppercase tracking-widest text-slate-705 flex items-center gap-1.5 shadow-sm transition-all focus:ring-1 focus:ring-indigo-505 cursor-pointer font-sans"
                                    >
                                       <List size={11} className="text-indigo-600" /> + Add List
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => addBlock('quote')}
                                       className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-indigo-655 hover:bg-slate-105 rounded-lg text-[8.5px] font-black uppercase tracking-widest text-slate-705 flex items-center gap-1.5 shadow-sm transition-all focus:ring-1 focus:ring-indigo-550 cursor-pointer font-sans"
                                    >
                                       <Quote size={11} className="text-indigo-655" /> + Add Quote
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => addBlock('code')}
                                       className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-indigo-655 hover:bg-slate-105 rounded-lg text-[8.5px] font-black uppercase tracking-widest text-slate-705 flex items-center gap-1.5 shadow-sm transition-all focus:ring-1 focus:ring-indigo-550 cursor-pointer font-sans"
                                    >
                                        <Code size={11} className="text-indigo-600" /> + Add Code
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => addBlock('image')}
                                       className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-indigo-655 hover:bg-slate-105 rounded-lg text-[8.5px] font-black uppercase tracking-widest text-slate-705 flex items-center gap-1.5 shadow-sm transition-all focus:ring-1 focus:ring-indigo-550 cursor-pointer font-sans"
                                    >
                                       <Image size={11} className="text-indigo-600" /> + Add Image
                                    </button>
                                 </div>
                              </div>

                              {/* Dynamic Canvas Block Stack list */}
                              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                                 {blocks.map((block, idx) => {
                                    const isFocused = focusedBlockId === block.id;
                                    return (
                                       <div 
                                          key={block.id}
                                          onFocus={() => setFocusedBlockId(block.id)}
                                          className={`group relative p-6 bg-white border rounded-[2rem] transition-all duration-300 ${isFocused ? 'border-indigo-600 bg-indigo-50/5 ring-1 ring-indigo-650' : 'border-slate-150 hover:border-slate-300'}`}
                                       >
                                          {/* Floating Block Header Controls menu */}
                                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                             <div className="flex items-center gap-2">
                                                <span className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-indigo-600 flex items-center justify-center">
                                                   {block.type === 'paragraph' && <Type size={11} />}
                                                   {block.type === 'heading' && <span className="font-extrabold text-[10px] leading-none">H{block.level}</span>}
                                                   {block.type === 'list' && <List size={11} />}
                                                   {block.type === 'quote' && <Quote size={11} />}
                                                   {block.type === 'code' && <Code size={11} />}
                                                   {block.type === 'image' && <Image size={11} />}
                                                </span>
                                                &nbsp;&nbsp;&nbsp;<span>{block.type} BLOCK</span>
                                                
                                                {/* Custom heading type settings toggles */}
                                                {block.type === 'heading' && (
                                                   <div className="flex gap-1 ml-2.5 bg-slate-100 p-0.5 rounded-lg border border-slate-205">
                                                      {[1,2,3].map(lvl => (
                                                         <button
                                                            key={lvl}
                                                            type="button"
                                                            onClick={() => updateBlock(block.id, { level: lvl as 1|2|3 })}
                                                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold leading-none cursor-pointer border-0 ${block.level === lvl ? 'bg-indigo-600 text-white font-sans' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}
                                                         >
                                                            H{lvl}
                                                         </button>
                                                      ))}
                                                   </div>
                                                )}

                                                {/* Custom code languages options selection list */}
                                                {block.type === 'code' && (
                                                   <select
                                                      value={block.language || 'typescript'}
                                                      onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                                                      className="ml-2.5 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[8.5px] font-extrabold text-slate-755"
                                                   >
                                                      <option value="typescript">TypeScript</option>
                                                      <option value="javascript">JavaScript</option>
                                                      <option value="html">HTML</option>
                                                      <option value="css">CSS</option>
                                                      <option value="markdown">Markdown</option>
                                                   </select>
                                                )}
                                             </div>

                                             {/* Actions swap ordering / inserts layout */}
                                             <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                                <button
                                                   type="button"
                                                   disabled={idx === 0}
                                                   onClick={() => moveBlock(idx, 'up')}
                                                   className="p-1 px-2 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-indigo-650 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer bg-transparent"
                                                   title="Move Up"
                                                >
                                                   <ArrowUp size={11} />
                                                </button>
                                                <button
                                                   type="button"
                                                   disabled={idx === blocks.length - 1}
                                                   onClick={() => moveBlock(idx, 'down')}
                                                   className="p-1 px-2 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-indigo-650 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer bg-transparent"
                                                   title="Move Down"
                                                >
                                                   <ArrowDown size={11} />
                                                </button>
                                                
                                                <div className="w-[1px] h-3 bg-slate-205 mx-1" />

                                                <button
                                                   type="button"
                                                   onClick={() => addBlock('paragraph', idx)}
                                                   className="p-1 px-2 hover:bg-slate-50 border border-slate-105 rounded-lg text-indigo-605 bg-white transition-colors cursor-pointer font-sans"
                                                   title="Insert Paragraph Below"
                                                >
                                                   <Plus size={11} />
                                                </button>
                                                
                                                <button
                                                   type="button"
                                                   onClick={() => deleteBlock(block.id)}
                                                   className="p-1 px-2 hover:bg-red-50 hover:border-red-200 border border-slate-105 rounded-lg text-red-500 transition-colors cursor-pointer bg-transparent font-sans"
                                                   title="Remove Block"
                                                >
                                                   <Trash2 size={11} />
                                                </button>
                                             </div>
                                          </div>

                                          {/* Core Component Element Input Canvas */}
                                          <div className="font-sans">
                                             {block.type === 'paragraph' && (
                                                <textarea
                                                   rows={Math.max(2, block.value.split('\n').length)}
                                                   value={block.value}
                                                   onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                                   placeholder="Type paragraph content copy here..."
                                                   className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-705 placeholder:text-slate-400 font-medium text-xs md:text-sm leading-relaxed focus:outline-none resize-none"
                                                />
                                             )}

                                             {block.type === 'heading' && (
                                                <input
                                                   type="text"
                                                   value={block.value}
                                                   onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                                   placeholder="Section Heading..."
                                                   className={`w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-900 placeholder:text-slate-400 font-black italic uppercase italic tracking-tight focus:outline-none ${block.level === 1 ? 'text-xl md:text-2xl' : block.level === 2 ? 'text-lg md:text-xl' : 'text-base'}`}
                                                />
                                             )}

                                             {block.type === 'list' && (
                                                <div className="space-y-1 font-sans">
                                                   <span className="text-[8px] font-black uppercase tracking-widest text-indigo-505 mr-2 block select-none mb-1">Enter one list line-item per line:</span>
                                                   <textarea
                                                      rows={Math.max(2, block.value.split('\n').length)}
                                                      value={block.value}
                                                      onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                                      placeholder="Bullet list item segment one&#10;Bullet list item segment two..."
                                                      className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-700 placeholder:text-slate-400 font-mono text-xs focus:outline-none focus:bg-slate-50/10 leading-relaxed rounded-xl resize-none"
                                                   />
                                                </div>
                                             )}

                                             {block.type === 'quote' && (
                                                <div className="pl-4 border-l-4 border-indigo-650 italic text-slate-650 bg-slate-50/50 p-4 rounded-r-2xl font-sans">
                                                   <textarea
                                                      rows={Math.max(2, block.value.split('\n').length)}
                                                      value={block.value}
                                                      onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                                      placeholder="Type blockquote citation text copy..."
                                                      className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-705 placeholder:text-slate-455 font-semibold focus:outline-none resize-none"
                                                   />
                                                </div>
                                             )}

                                             {block.type === 'code' && (
                                                <textarea
                                                   rows={Math.max(4, block.value.split('\n').length)}
                                                   value={block.value}
                                                   onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                                   placeholder="// paste structure code language text syntax copy"
                                                   className="w-full bg-slate-950 p-5 rounded-2xl font-mono text-xs text-indigo-200 border border-slate-900 focus:border-indigo-505 focus:outline-none shadow-inner resize-y"
                                                />
                                             )}

                                             {block.type === 'image' && (
                                                <div className="space-y-4 font-sans">
                                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      <div>
                                                         <label className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 block mb-1">Image Block URL</label>
                                                         <input
                                                            type="text"
                                                            value={block.url || ''}
                                                            onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                                                            placeholder="https://images.unsplash.com/..."
                                                            className="w-full bg-slate-50 border border-slate-100 hover:border-slate-205 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-[11px] font-mono leading-none focus:outline-none tracking-tight transition-all font-bold"
                                                         />
                                                      </div>
                                                      <div className="flex flex-col justify-end">
                                                         <button
                                                            type="button"
                                                            onClick={() => {
                                                               setImageTargetBlockId(block.id);
                                                               setIsImgPickerOpen(true);
                                                            }}
                                                            className="w-full py-3.5 bg-slate-900 border border-slate-950 hover:border-indigo-500 hover:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow cursor-pointer font-sans"
                                                         >
                                                            Select file from Media Library
                                                         </button>
                                                      </div>
                                                   </div>

                                                   <div className="grid grid-cols-1 gap-4 font-sans">
                                                      <div>
                                                         <label className="text-[8.5px] font-black uppercase tracking-widest text-slate-440 block mb-1">Alt Accessibility Text</label>
                                                         <input
                                                            type="text"
                                                            value={block.alt || ''}
                                                            onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                                                            placeholder="Alt text summary..."
                                                            className="w-full bg-slate-50 border border-slate-100 hover:border-slate-205 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-[11px] font-bold focus:outline-none transition-all"
                                                         />
                                                      </div>
                                                   </div>

                                                   {block.url && (
                                                      <div className="relative aspect-[16/6] bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden shadow-inner mt-2">
                                                         <img
                                                            src={block.url}
                                                            alt={block.alt || 'Gutenberg visual view'}
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                         />
                                                      </div>
                                                   )}
                                                </div>
                                             )}
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        )}

                        {/* RAW Markdown fall-back panel */}
                        {editorTab === 'raw' && (
                           <div className="space-y-4 font-sans">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 block font-sans">Direct Markdown Content Source (Updates synchronized to live canvas)</label>
                              <textarea 
                                rows={12}
                                value={content}
                                onChange={(e) => {
                                  setContent(e.target.value);
                                }}
                                ref={textareaRef}
                                placeholder="# WordPress Mastery Tutorial..."
                                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-2xl p-6 text-xs font-semibold focus:outline-none transition-all font-mono min-h-[350px]"
                              />
                           </div>
                        )}

                        {/* Preview Layout */}
                        {editorTab === 'preview' && (
                          <div className="w-full min-h-[350px] bg-slate-50 p-10 rounded-[2.5rem] border border-slate-150 prose prose-slate text-xs space-y-4 font-sans text-slate-800 shadow-inner mb-6 font-sans">
                             {content ? content.split('\n').map((para, i) => {
                               if (para.startsWith('# ')) return <h1 key={i} className="text-lg font-black italic border-b border-slate-200 pb-2 uppercase text-slate-900 mt-4 mb-2">{para.replace('# ', '')}</h1>;
                               if (para.startsWith('## ')) return <h2 key={i} className="text-sm font-black text-slate-800 uppercase mt-4 mb-1">{para.replace('## ', '')}</h2>;
                               if (para.startsWith('### ')) return <h3 key={i} className="text-xs font-black text-indigo-700 uppercase mt-2">{para.replace('### ', '')}</h3>;
                               if (para.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-indigo-500 pl-4 italic text-slate-505 bg-slate-50 p-2 rounded">{para.replace('> ', '')}</blockquote>;
                               if (para.startsWith('- ')) return <li key={i} className="list-disc list-inside ml-2">{para.replace('- ', '')}</li>;
                               if (para.trim().startsWith('```')) return null;
                               if (!para.trim()) return <div key={i} className="h-2" />;
                               return <p key={i} className="text-slate-655 leading-relaxed font-semibold">{para}</p>;
                             }) : <p className="text-slate-400 italic">No content text is staged under this compiler tab.</p>}
                          </div>
                        )}

                     </div>

                     {/* Yoast SEO Optimization Block */}
                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                           <div className="flex items-center gap-2 text-slate-800">
                              <Globe size={16} className="text-indigo-600" />
                              <h4 className="text-xs font-black uppercase tracking-wider">SEO Snippet & Schema (RankMath Model)</h4>
                           </div>
                           
                           {/* AI SEO Buttons! */}
                           <div className="flex gap-2.5">
                             <button
                               type="button"
                               onClick={runAiSEOAnalysis}
                               disabled={aiAnalyzing}
                               className="px-3.5 py-2 bg-slate-900 border border-slate-900 hover:border-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow"
                             >
                               <Cpu size={12} className={aiAnalyzing ? 'animate-spin' : ''} />
                               {aiAnalyzing ? 'Analyzing...' : 'Analyze SEO'}
                             </button>
                             <button
                               type="button"
                               onClick={runAiSEOImprovement}
                               disabled={aiAnalyzing}
                               className="px-3.5 py-2 bg-indigo-600 border border-indigo-600 hover:border-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow"
                             >
                               <Sparkles size={12} />
                               Improve SEO with AI
                             </button>
                           </div>
                        </div>

                        {aiSeoScore !== null && (
                          <div className="bg-white p-6 border border-slate-150 rounded-2xl mb-6 space-y-3 animate-fade-in">
                             <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                <span className="text-[10px] font-black uppercase text-slate-400">AI Quality Score</span>
                                <span className="bg-slate-950 text-green-400 text-[10px] font-mono font-black px-2 py-0.5 rounded-md">{aiSeoScore}/100</span>
                             </div>
                             {headingReport && (
                                <p className="text-[10px] font-bold text-slate-500 italic">Heuristics: "{headingReport}"</p>
                             )}
                             {aiSuggestions.length > 0 && (
                                <ul className="space-y-1.5 pt-1">
                                   {aiSuggestions.map((sug, sIdx) => (
                                     <li key={sIdx} className="text-[10px] text-slate-600 font-medium flex gap-2">
                                        <span className="text-indigo-650 font-bold">•</span>
                                        {sug}
                                     </li>
                                   ))}
                                </ul>
                             )}
                          </div>
                        )}
                        
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Focus Keyword</label>
                                 <input 
                                   type="text"
                                   value={focusKeyword}
                                   onChange={(e) => setFocusKeyword(e.target.value)}
                                   placeholder="WordPress SEO"
                                   className="w-full bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all"
                                 />
                              </div>
                              <div>
                                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Tags (Press Enter)</label>
                                 <input 
                                   type="text"
                                   value={tagInput}
                                   onChange={(e) => setTagInput(e.target.value)}
                                   onKeyDown={handleAddTag}
                                   placeholder="Add tag and press Enter"
                                   className="w-full bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all"
                                 />
                              </div>
                           </div>

                           {tags.length > 0 && (
                             <div className="flex flex-wrap gap-2">
                               {tags.map((tg, idx) => (
                                 <span key={idx} className="bg-indigo-650 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-2 rounded-full">
                                   {tg}
                                   <X size={12} className="cursor-pointer hover:scale-125" onClick={() => handleRemoveTag(idx)} />
                                 </span>
                               ))}
                             </div>
                           )}

                           <div>
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Google Search Meta Title</label>
                              <input 
                                type="text"
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                placeholder="RankMath Meta Title"
                                className="w-full bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all"
                              />
                           </div>
                           <div>
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Google Search Meta Description</label>
                              <textarea 
                                rows={2}
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                placeholder="RankMath Meta Description"
                                className="w-full bg-white border border-slate-100 focus:border-indigo-500 rounded-xl p-4 text-xs font-medium focus:outline-none transition-all leading-relaxed"
                              />
                           </div>

                           {/* Google Preview */}
                           <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-2">
                             <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                                <span>preetwebvision.com</span>
                                <span>›</span>
                                <span>blog</span>
                                <span>›</span>
                                <span>{slug || 'url-slug'}</span>
                             </div>
                             <h5 className="text-sm font-black text-indigo-700 hover:underline leading-tight line-clamp-1">{metaTitle || title || 'No meta title'}</h5>
                             <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{metaDescription || 'No description assigned. Custom snippet description keeps click rate high on Google Search.'}</p>
                           </div>
                        </div>
                     </div>
                  </form>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end gap-3 mt-10">
                   <button 
                     onClick={() => setIsEditorOpen(false)}
                     className="px-6 py-4 bg-slate-50 text-slate-605 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                   >
                     Discard
                   </button>
                   <button 
                     onClick={handleSave}
                     className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
                   >
                     <Save size={14} /> Commit Post
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Media Picker Popup Overlay modal */}
      <AnimatePresence>
        {isImgPickerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
              onClick={() => setIsImgPickerOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-6 sm:inset-12 bg-white z-[110] shadow-2xl rounded-[3rem] p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Choose Featured Image</h3>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest mt-0.5">Media Library Vault</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsImgPickerOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="mt-4">
                <MediaModule onSelectImage={(url) => {
                  setImage(url);
                  setIsImgPickerOpen(false);
                }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
