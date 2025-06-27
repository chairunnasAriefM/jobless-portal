import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react';

const Toolbar = ({ editor }) => {
  if (!editor) return null;
  const Button = ({ onClick, isActive, children }) => (
    <button type="button" onClick={onClick} className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-slate-700 text-white' : 'hover:bg-slate-200'}`}>
      {children}
    </button>
  );
  return (
    <div className="flex flex-wrap items-center gap-1 border border-slate-300 border-b-0 p-2 rounded-t-lg bg-slate-50">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}><Bold size={18} /></Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><Italic size={18} /></Button>
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}><List size={18} /></Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}><ListOrdered size={18} /></Button>
    </div>
  );
};

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 border border-slate-300 rounded-b-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-orange-500',
      },
    },
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;