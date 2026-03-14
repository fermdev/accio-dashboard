import { useState } from 'react';
import { toJpeg } from 'html-to-image';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportImage, setExportImage] = useState(null);

  const handleExport = async (elementId, filename = 'accio-card.jpg') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    
    // 500ms delay to ensure the browser paints the loading state 
    // before the heavy CPU task of image generation starts.
    await new Promise(resolve => setTimeout(resolve, 500));

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
