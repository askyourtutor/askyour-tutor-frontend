import { useState, useCallback, useRef } from 'react';
import ReactEasyCrop from 'react-easy-crop';
import { IconX, IconCheck } from '@tabler/icons-react';
import type { Area } from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<File> => {
  const image = new Image();
  image.src = imageSrc;
  
  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Unable to get canvas context');

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'profile-photo.png', { type: 'image/png' });
          resolve(file);
        }
      }, 'image/png');
    };
  });
};

export const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1
}: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const handleCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
    
    // Update preview
    if (previewRef.current) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const ctx = previewRef.current?.getContext('2d');
        if (ctx) {
          const size = 150;
          previewRef.current!.width = size;
          previewRef.current!.height = size;
          
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            size,
            size
          );
        }
      };
    }
  }, [imageSrc]);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (err) {
      console.error('Error cropping image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Crop Your Photo</h2>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
          {/* Crop Editor */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative min-h-[300px] lg:min-h-[400px]">
            <ReactEasyCrop
              image={imageSrc}
              crop={crop}
              aspect={aspectRatio}
              cropShape="rect"
              showGrid={true}
              onCropChange={setCrop}
              onCropAreaChange={handleCropAreaChange}
              classes={{
                containerClassName: "reactEasyCrop_Container h-full",
                imageClassName: "reactEasyCrop_Image",
                cropAreaClassName: "reactEasyCrop_CropArea"
              }}
            />
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-56 flex flex-col items-center justify-center gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3 text-center">Preview</p>
              <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-48 lg:h-48 rounded-lg border-4 border-gray-300 overflow-hidden bg-gray-200 shadow-md flex items-center justify-center">
                <canvas
                  ref={previewRef}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'high-quality' }}
                />
              </div>
              {croppedAreaPixels && (
                <div className="mt-4 text-center">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || !croppedAreaPixels}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <IconCheck size={18} />
                <span>Apply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
