import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, ImageUp, RotateCcw, Check, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

function LoadingStatus() {
  const [text, setText] = useState('Scanning image / OCR... ');
  useEffect(() => {
    const t1 = setTimeout(() => setText('Analyzing with Gemini AI...'), 2000);
    const t2 = setTimeout(() => setText('Structuring medicine data...'), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return <p className="text-[10px] font-mono tracking-widest uppercase opacity-80 mt-2">{text}</p>;
}

export function CameraCapture({ onCapture, isLoading }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; mimeType: string } | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setPreviewImage(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please ensure permissions are granted.');
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewImage({ url: dataUrl, mimeType: 'image/jpeg' });
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage({ url: reader.result as string, mimeType: file.type });
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const submitImage = () => {
    if (previewImage) {
      onCapture(previewImage.url, previewImage.mimeType);
    }
  };

  const retakeImage = () => {
    setPreviewImage(null);
    if (!isCameraActive) {
      // Opt out of auto starting camera if they uploaded a file instead of using camera
      // Let them choose again
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-[32px] shadow-sm border border-[#e5e2d9] overflow-hidden">
      {!isCameraActive && !previewImage && (
        <div className="p-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-20 h-20 bg-[#f5f4ef] text-[#5a6b5d] flex items-center justify-center rounded-full mb-2">
            <Camera className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#3a443c]">Scan Medicine</h3>
            <p className="text-sm text-[#7e7868] mt-2">Capture the packaging, label, or tablet clearly.</p>
          </div>
          
          <div className="flex flex-col w-full gap-3 mt-4">
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2 w-full bg-[#5a6b5d] hover:bg-[#4a584c] text-white py-3 px-4 rounded-full text-sm font-semibold shadow-sm transition-colors"
            >
              <Camera className="w-5 h-5" />
              Open Camera
            </button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#e5e2d9]"></div>
              <span className="flex-shrink-0 mx-4 text-[#8e8a7d] text-xs font-bold tracking-wider uppercase">or</span>
              <div className="flex-grow border-t border-[#e5e2d9]"></div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full bg-white border border-[#e5e2d9] hover:bg-[#f5f4ef] text-[#2d332e] py-3 px-4 rounded-full text-sm font-semibold shadow-sm transition-colors"
            >
              <ImageUp className="w-5 h-5" />
              Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}

      {isCameraActive && (
        <div className="relative bg-black w-full aspect-[4/5] sm:aspect-video flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Viewfinder overlay */}
          <div className="absolute inset-4 border-2 border-white/50 rounded-xl pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full border-t border-white/20 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 h-full border-l border-white/20 pointer-events-none"></div>
          </div>
          
          <div className="absolute bottom-6 left-0 w-full flex justify-center items-center gap-8 px-6">
            <button
              onClick={stopCamera}
              className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full border-4 border-white/50 bg-clip-padding flex items-center justify-center hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-white rounded-full"></div>
            </button>
            <div className="w-12"></div> {/* Spacer for alignment */}
          </div>
        </div>
      )}

      {previewImage && (
        <div className="relative bg-slate-900 w-full aspect-[4/5] sm:aspect-video flex items-center justify-center overflow-hidden group">
          <img
            src={previewImage.url}
            alt="Preview"
            className={`w-full h-full object-contain ${isLoading ? 'opacity-50 grayscale blur-sm' : ''} transition-all duration-300`}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900/50 backdrop-blur-sm z-10 transition-opacity">
              <div className="w-12 h-12 border-4 border-[#5a6b5d] border-t-transparent rounded-full animate-spin mb-4"></div>
              <LoadingStatus />
            </div>
          )}

          {!isLoading && (
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4">
              <button
                onClick={retakeImage}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur text-white rounded-full font-medium transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={submitImage}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#5a6b5d] hover:bg-[#4a584c] text-white rounded-full font-bold transition-colors shadow-lg shadow-[#5a6b5d]/30 text-sm"
              >
                <Check className="w-4 h-4" />
                Analyze
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
