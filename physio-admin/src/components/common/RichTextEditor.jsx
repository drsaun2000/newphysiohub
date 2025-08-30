import React, { useRef, useCallback, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Highlighter,
  RotateCcw,
  Type
} from 'lucide-react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder = "Enter content...", disabled = false }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [currentBgColor, setCurrentBgColor] = useState('#ffff00');

  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const formats = new Set();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strikethrough');
    if (document.queryCommandState('insertOrderedList')) formats.add('orderedList');
    if (document.queryCommandState('insertUnorderedList')) formats.add('unorderedList');
    if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft');
    if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter');
    if (document.queryCommandState('justifyRight')) formats.add('justifyRight');

    setActiveFormats(formats);
  }, []);

  const formatText = useCallback((command, value = null) => {
    if (disabled) return;
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Special handling for colors to ensure consistency
    if (command === 'foreColor' || command === 'backColor') {
      // Use styleWithCSS for better color handling
      document.execCommand('styleWithCSS', false, true);
      document.execCommand(command, false, value);
      document.execCommand('styleWithCSS', false, false);
    } else {
      document.execCommand(command, false, value);
    }

    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }

    setTimeout(updateActiveFormats, 10);
  }, [disabled, onChange, updateActiveFormats]);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const handleSelectionChange = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const handleKeyDown = useCallback((e) => {
    if (disabled) return;
    
    if (e.key === 'Tab') {
      e.preventDefault();
      formatText('indent');
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
        default:
          break;
      }
    }
  }, [disabled, formatText]);

  const handleColorChange = useCallback((e, type) => {
    const color = e.target.value;
    if (type === 'text') {
      setCurrentTextColor(color);
      formatText('foreColor', color);
    } else if (type === 'background') {
      setCurrentBgColor(color);
      formatText('backColor', color);
    }
  }, [formatText]);

  const removeAllFormatting = useCallback(() => {
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
    formatText('removeFormat');
    
    if (range && !range.collapsed) {
      const selectedText = range.toString();
      if (selectedText) {

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = range.extractContents().textContent;
        range.insertNode(tempDiv.firstChild || document.createTextNode(selectedText));
      }
    }
    
    formatText('foreColor', '#000000');
    setTimeout(updateActiveFormats, 10);
  }, [formatText, updateActiveFormats]);

  const ToolbarButton = ({ onClick, isActive, disabled, title, children, className = '' }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`toolbar-btn ${isActive ? 'active' : ''} ${className}`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="modern-rich-editor">
      <div className="modern-toolbar">
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => formatText('bold')}
            isActive={activeFormats.has('bold')}
            disabled={disabled}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('italic')}
            isActive={activeFormats.has('italic')}
            disabled={disabled}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('underline')}
            isActive={activeFormats.has('underline')}
            disabled={disabled}
            title="Underline (Ctrl+U)"
          >
            <Underline size={16} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('strikeThrough')}
            isActive={activeFormats.has('strikethrough')}
            disabled={disabled}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </ToolbarButton>
        </div>

        <div className="toolbar-group">
          <select
            onChange={(e) => {
              if (e.target.value) {
                formatText('formatBlock', e.target.value);
                setTimeout(() => {
                  e.target.value = '';
                  updateActiveFormats();
                }, 10);
              }
            }}
            disabled={disabled}
            className="modern-select"
            title="Text Style"
          >
            <option value="">Style</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
            <option value="p">Normal Text</option>
          </select>
        </div>

        {/* Color Group */}
        <div className="toolbar-group">
          <div className="color-picker-wrapper" title="Text Color">
            <label className="color-picker-label">
              <Palette size={16} />
              <input
                type="color"
                value={currentTextColor}
                onChange={(e) => handleColorChange(e, 'text')}
                disabled={disabled}
                className="color-input"
              />
              <div 
                className="color-indicator" 
                style={{ backgroundColor: currentTextColor }}
              ></div>
            </label>
          </div>
          
          <div className="color-picker-wrapper" title="Highlight Color">
            <label className="color-picker-label highlight">
              <Highlighter size={16} />
              <input
                type="color"
                value={currentBgColor}
                onChange={(e) => handleColorChange(e, 'background')}
                disabled={disabled}
                className="color-input"
              />
              <div 
                className="color-indicator" 
                style={{ backgroundColor: currentBgColor }}
              ></div>
            </label>
          </div>
        </div>

        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => formatText('insertUnorderedList')}
            isActive={activeFormats.has('unorderedList')}
            disabled={disabled}
            title="Bullet List"
          >
            <List size={16} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('insertOrderedList')}
            isActive={activeFormats.has('orderedList')}
            disabled={disabled}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </ToolbarButton>
        </div>

        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => formatText('justifyLeft')}
            isActive={activeFormats.has('justifyLeft')}
            disabled={disabled}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('justifyCenter')}
            isActive={activeFormats.has('justifyCenter')}
            disabled={disabled}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('justifyRight')}
            isActive={activeFormats.has('justifyRight')}
            disabled={disabled}
            title="Align Right"
          >
            <AlignRight size={16} />
          </ToolbarButton>
        </div>

        <div className="toolbar-group">
          <ToolbarButton
            onClick={removeAllFormatting}
            disabled={disabled}
            title="Clear All Formatting"
            className="clear-format-btn"
          >
            <RotateCcw size={16} />
          </ToolbarButton>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        className={`modern-editor-content ${disabled ? 'disabled' : ''}`}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor; 