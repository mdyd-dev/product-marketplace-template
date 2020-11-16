import 'easymde/dist/easymde.min.css';
import EasyMDE from 'easymde';

const markdownEditor = document.querySelector('[data-markdown-editor]');
const easyMDE = new EasyMDE({element: markdownEditor, showIcons: ["code"]});
