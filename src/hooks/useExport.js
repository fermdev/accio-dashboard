import { useState } from 'react';
import { toJpeg } from 'html-to-image';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportImage, setExportImage] = useState(null);

  const handleExport = async (elementId, filename = 'accio-card.jpg') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    
    // Slight delay for UI to update
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      // Use toJpeg with lower quality and 1.0 pixelRatio to hit the <100KB target
      // This is MUCH faster and more reliable on mobile devices
      const dataUrl = await toJpeg(element, {
        cacheBust: true,
        pixelRatio: 1, // Standard resolution (no scaling up)
        quality: 0.8,  // 80% quality is perfect for web and keeps size very low
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

  return { handleExport, isExporting, exportImage, setExportImage };
};
