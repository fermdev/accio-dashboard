import { useState } from 'react';
import { toBlob } from 'html-to-image';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportImage, setExportImage] = useState(null);
  const [exportError, setExportError] = useState(null);

  const handleExport = async (elementId, filename = 'accio-card.jpg') => {
    const element = document.getElementById(elementId);
    if (!element) {
      setExportError("Download error: System target not found. Please refresh.");
      return;
    }

    setExportError(null);
    setIsExporting(true);
    
    // 800ms delay to guarantee the loading UI is rendered by the browser
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // 1. Ensure all images inside the element are loaded
      const images = element.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      const options = {
        cacheBust: true,
        pixelRatio: 2, // High resolution to match desktop
        quality: 0.9,  // High quality JPEG
        width: 1000,
        height: 525,
        style: {
          transform: 'scale(1)',
          borderRadius: '0',
          visibility: 'visible',
          opacity: '1'
        }
      };

      // 2. Capture as Blob (much more efficient than base64 for mobile)
      // Double capture for Safari/iOS stability
      await toBlob(element, options);
      const blob = await toBlob(element, options);
      
      if (!blob) throw new Error("Failed to generate image blob");

      const imageUrl = URL.createObjectURL(blob);
      setExportImage(imageUrl);

      // 3. Attempt automatic download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Export failed:', err);
      setExportError("Sorry, export failed. Please try refreshing or use Google Chrome.");
    } finally {
      setIsExporting(false);
    }
  };

  return { 
    handleExport, 
    isExporting, 
    exportImage, 
    setExportImage,
    exportError,
    setExportError
  };
};
