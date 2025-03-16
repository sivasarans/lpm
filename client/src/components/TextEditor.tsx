import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './ckeditor-custom.css';
const TextEditor = ({value,setValue}:any) => {
  const handleChange = (event, editor) => {
    const data = editor.getData();
    setValue('message', data);
  };
  const editorConfiguration = {
    toolbar: ['bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
    language:'en'
    // Other editor configuration options
  };
  return <>
   <div className="App1" >
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={value}
        onChange={handleChange}
      />
    </div>
  </>;
};

export default TextEditor;
