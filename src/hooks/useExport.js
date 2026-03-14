import { useState } from 'react';
import { toPng } from 'html-to-image';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportImage, setExportImage] = useState(null);

  const handleExport = async (elementId, filename = 'accio-card.png') => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    setIsExporting(true);
    
    // Give the browser a moment to render the loading overlay, 
    // especially important on mobile devices with slower main threads.
    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      // Use pixelRatio 2 for better balance on mobile (1.2 was a bit too low, 2 is standard)
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2, 
        width: 1000,
        height: 525,
        style: {
          transform: 'scale(1)',
          borderRadius: '0'
        }
      });
      
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

  return { 
    handleExport, 
    isExporting, 
    exportImage, 
    setExportImage 
  };
};
