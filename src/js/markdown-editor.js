import 'easymde/dist/easymde.min.css';
import EasyMDE from 'easymde';

const markdownEditor = document.querySelector('[data-markdown-editor]');
const easyMDE = new EasyMDE({element: markdownEditor, showIcons: ["code"]});

const elementId = markdownEditor.attributes.id.value;
document.querySelector(`label[for="${elementId}"]`).onclick = function () { easyMDE.codemirror.focus(); };
