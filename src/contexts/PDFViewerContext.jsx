import { createContext, useContext, useState } from 'react';

const PDFViewerContext = createContext();

export const usePDFViewer = () => {
  const context = useContext(PDFViewerContext);
  if (!context) {
    throw new Error('usePDFViewer must be used within a PDFViewerProvider');
  }
  return context;
};

export const PDFViewerProvider = ({ children }) => {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);

  return (
    <PDFViewerContext.Provider value={{ isPDFViewerOpen, setIsPDFViewerOpen }}>
      {children}
    </PDFViewerContext.Provider>
  );
};