import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ZoomIn, ZoomOut, RotateCw, Download, Maximize, Minimize, 
  ChevronLeft, ChevronRight, Home, BookOpen, Share2, Heart,
  ExternalLink, FileText, Eye
} from 'lucide-react';
import { getGoogleDriveEmbedLink, getGoogleDriveDirectLink } from '../utils/supabase.js';
import PDFDataService from '../utils/pdfDataService.js';

const PDFViewer = ({ isOpen, onClose, pdfResource, onResourceChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [relatedResources, setRelatedResources] = useState([]);
  
  const viewerRef = useRef(null);
  const iframeRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const resetControlsTimeout = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isFullscreen) {
          setShowControls(false);
        }
      }, 3000);
    };

    if (isOpen) {
      resetControlsTimeout();
      const handleMouseMove = () => resetControlsTimeout();
      const handleTouchStart = () => resetControlsTimeout();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchstart', handleTouchStart);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchstart', handleTouchStart);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [isOpen, isFullscreen]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Show controls when exiting fullscreen
      if (!isCurrentlyFullscreen) {
        setShowControls(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Fetch related resources when PDF changes
  useEffect(() => {
    if (pdfResource && isOpen) {
      fetchRelatedResources();
      incrementDownloadCount();
    }
  }, [pdfResource, isOpen]);

  const fetchRelatedResources = async () => {
    try {
      const resources = await PDFDataService.getAllResources({
        category: pdfResource.pdf_categories?.category,
        sortBy: 'popular'
      });
      
      // Filter out current resource and limit to 6
      const related = resources
        .filter(r => r.id !== pdfResource.id)
        .slice(0, 6);
      
      setRelatedResources(related);
    } catch (error) {
      console.error('Error fetching related resources:', error);
    }
  };

  const incrementDownloadCount = async () => {
    try {
      await PDFDataService.incrementDownloadCount(pdfResource.id);
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. This might be due to browser restrictions.');
  };

  const handleDownload = async () => {
    const downloadLink = getGoogleDriveDirectLink(pdfResource.file_link);
    window.open(downloadLink, '_blank');
    await incrementDownloadCount();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pdfResource.name,
          text: `Check out this amazing PDF: ${pdfResource.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      } else if (viewerRef.current?.webkitRequestFullscreen) {
        viewerRef.current.webkitRequestFullscreen();
      } else if (viewerRef.current?.mozRequestFullScreen) {
        viewerRef.current.mozRequestFullScreen();
      } else if (viewerRef.current?.msRequestFullscreen) {
        viewerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleClose = () => {
    // Exit fullscreen if in fullscreen mode
    if (isFullscreen) {
      toggleFullscreen();
    }
    
    setIsFullscreen(false);
    setZoom(100);
    setRotation(0);
    setError(null);
    onClose();
  };

  const handleResourceSelect = (resource) => {
    setIsLoading(true);
    setError(null);
    onResourceChange(resource);
  };

  if (!isOpen || !pdfResource) return null;

  const embedUrl = getGoogleDriveEmbedLink(pdfResource.file_link);

  return (
    <AnimatePresence>
      <motion.div
        ref={viewerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-lg ${
          isFullscreen ? 'bg-black' : ''
        }`}
      >
        {/* Header Controls */}
        <AnimatePresence>
          {(showControls || !isFullscreen) && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-3 sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </motion.button>
                  
                  <div className="text-white min-w-0">
                    <h2 className="text-sm sm:text-base font-bold truncate">
                      {pdfResource.name}
                    </h2>
                    <p className="text-xs text-gray-300 truncate hidden sm:block">
                      {pdfResource.pdf_categories?.category} • {pdfResource.pdf_categories?.subcategory}
                    </p>
                  </div>
                </div>

                {/* Action Buttons and Zoom Controls - All in one row for mobile */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {/* Zoom Controls for mobile and desktop */}
                  <div className="flex items-center bg-white/10 rounded-lg p-1 mr-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleZoomOut}
                      className="p-1 sm:p-2 rounded text-white hover:bg-white/20 transition-colors"
                    >
                      <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.button>
                    <span className="text-white text-xs sm:text-sm min-w-[2rem] sm:min-w-[3rem] text-center">
                      {zoom}%
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleZoomIn}
                      className="p-1 sm:p-2 rounded text-white hover:bg-white/20 transition-colors"
                    >
                      <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.button>
                  </div>

                  {/* Action Buttons */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRotate}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden sm:block"
                  >
                    <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDownload}
                    className="p-1.5 sm:p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    ) : (
                      <Maximize className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex h-full pt-16 sm:pt-20">
          {/* PDF Viewer */}
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading PDF...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-xs sm:max-w-md">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-red-400" />
                  <h3 className="text-lg font-semibold mb-2">Unable to Load PDF</h3>
                  <p className="text-sm text-gray-300 mb-4">{error}</p>
                  <div className="flex flex-col gap-2 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Download Instead
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={pdfResource.name}
              className="w-full h-full border-0"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>

          {/* Sidebar - Related Resources - Hidden on mobile when not fullscreen */}
          {!isFullscreen && relatedResources.length > 0 && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden md:block w-80 bg-white/5 backdrop-blur-lg border-l border-white/10 p-4 overflow-y-auto"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Related Resources
              </h3>
              
              <div className="space-y-3">
                {relatedResources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleResourceSelect(resource)}
                    className="bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-all duration-200 border border-white/10"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded flex-shrink-0 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                          {resource.name}
                        </h4>
                        <p className="text-gray-400 text-xs mb-2">
                          {resource.pdf_categories?.subcategory}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{resource.downloads} downloads</span>
                          <div className="flex items-center gap-1">
                            <span>★</span>
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Controls - Removed the div with download info as requested */}
        <AnimatePresence>
          {(showControls || !isFullscreen) && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4"
            >
              {/* Empty div - removed the download info div as requested */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFViewer;