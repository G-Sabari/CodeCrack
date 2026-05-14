import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, AlertTriangle, User, Loader2 } from "lucide-react";

type CameraStatus = "connecting" | "active" | "denied" | "error";

interface WebcamMonitorProps {
  isActive: boolean;
  onWarning?: (message: string) => void;
}

const WebcamMonitor: React.FC<WebcamMonitorProps> = ({ isActive, onWarning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>("connecting");
  const streamRef = useRef<MediaStream | null>(null);
  const onWarningRef = useRef(onWarning);
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    onWarningRef.current = onWarning;
  }, [onWarning]);

  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;

    const startCamera = async () => {
      setStatus("connecting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 360, facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus("active");
      } catch {
        if (cancelled) return;
        setStatus("denied");
        if (!hasWarnedRef.current) {
          hasWarnedRef.current = true;
          onWarningRef.current?.("Camera access denied. Please enable camera for proctoring.");
        }
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/30 bg-card/40 backdrop-blur-md shadow-lg">
      {status === "active" ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-auto rounded-2xl"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Top overlay: status badges */}
          <div className="absolute top-0 left-0 right-0 p-2.5 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-border/20 text-xs font-medium"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
              <span className="text-green-400">Live</span>
            </motion.div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-border/20 text-xs">
              <Camera className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>

          {/* Bottom overlay: face status */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/70 backdrop-blur-md border border-border/20">
              <User className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-foreground font-medium">Face Detected</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
            </div>
          </div>
        </div>
      ) : status === "connecting" ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-card/80 border border-border/30 flex items-center justify-center">
              <Camera className="w-7 h-7 text-muted-foreground/60" />
            </div>
            <Loader2 className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Connecting Camera</p>
            <p className="text-xs text-muted-foreground mt-0.5">Allow camera access when prompted</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <CameraOff className="w-7 h-7 text-destructive" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-foreground">Camera Blocked</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enable camera in browser settings for proctoring
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-3 h-3 text-destructive" />
            <span className="text-xs text-destructive font-medium">Access Denied</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamMonitor;
