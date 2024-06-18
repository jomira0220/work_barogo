import dynamic from 'next/dynamic';
const ReactQuillContainer = dynamic(() => import('./ReactQuillBox'), { ssr: false });
export default ReactQuillContainer;



