import React, { useRef, useEffect, useState } from "react";
import { Camera, CameraOff, AlertTriangle } from "lucide-react";

interface WebcamMonitorProps {
  isActive: boolean;
  onWarning?: (message: string) => void;
}

const WebcamMonitor: React.FC<WebcamMonitorProps> = ({ isActive, onWarning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCamera(true);
        setCameraError("");
      } catch {
        setCameraError("Camera access denied");
        setHasCamera(false);
        onWarning?.("Camera access denied. Please enable camera for proctoring.");
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [isActive, onWarning]);

  if (!isActive) return null;

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm">
      {hasCamera ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-auto rounded-xl mirror"
            style={{ transform: "scaleX(-1)" }}
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400">
            <Camera className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-44 gap-2 text-muted-foreground">
          {cameraError ? (
            <>
              <AlertTriangle className="w-8 h-8 text-warning" />
              <p className="text-xs text-center px-2">{cameraError}</p>
            </>
          ) : (
            <>
              <CameraOff className="w-8 h-8" />
              <p className="text-xs">Connecting camera...</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WebcamMonitor;
