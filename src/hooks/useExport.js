import { toPng } from 'html-to-image';

export const useExport = () => {
  const handleExport = async (elementId, filename = 'accio-card.png') => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    try {
      // Use toBlob for better memory management on mobile
      // Set pixelRatio to 1.2 to reduce file size while maintaining enough quality for clear text
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 1.2,
        width: 1000,
        height: 525,
        style: {
          transform: 'scale(1)',
          borderRadius: '0'
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return { handleExport };
};
