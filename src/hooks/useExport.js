import { useState } from 'react';
import { toJpeg } from 'html-to-image';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportImage, setExportImage] = useState(null);

  const handleExport = async (elementId, filename = 'accio-card.jpg') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    
    // Ensure the loading overlay is painted to the screen before 
    // we block the main thread with image generation.
    // Double RAF + Timeout is the most reliable way to force a paint on mobile.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const options = {
        cacheBust: true,
        pixelRatio: 1,
        quality: 0.8,
        width: 1000,
        height: 525,
        style: {
          transform: 'scale(1)',
          borderRadius: '0'
        }
      };

      // Double-capture for Safari stability (sometimes first call results in blank/skipped resources)
      await toJpeg(element, options);
      const dataUrl = await toJpeg(element, options);
      
      setExportImage(dataUrl);

      // Attempt automatic download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting, exportImage, setExportImage };
};
