import React from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiWifi, FiWifiOff, FiEye, FiAlertTriangle } from "react-icons/fi";
import styles from "./LeftPanel.module.scss";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  camOn: boolean;
  micOn: boolean;
  online: boolean;
  focused: boolean;
  tabWarnings: number;
  camError: string | null;
}

const LeftPanel: React.FC<Props> = ({ videoRef, camOn, micOn, online, focused, tabWarnings, camError }) => {
  return (
    <aside className={styles.panel}>
      <div className={styles.title}>Candidate Monitor</div>
      <div className={styles.videoWrap}>
        <video ref={videoRef} className={styles.video} autoPlay muted playsInline />
        {camOn && (
          <span className={styles.live}>
            <span className={styles.dot} /> LIVE
          </span>
        )}
      </div>

      <div className={styles.statusGrid}>
        <div className={styles.statusItem}>
          {camOn ? <FiVideo className={styles.ok} /> : <FiVideoOff className={styles.err} />}
          <span>Camera</span>
        </div>
        <div className={styles.statusItem}>
          {micOn ? <FiMic className={styles.ok} /> : <FiMicOff className={styles.err} />}
          <span>Microphone</span>
        </div>
        <div className={styles.statusItem}>
          {online ? <FiWifi className={styles.ok} /> : <FiWifiOff className={styles.err} />}
          <span>{online ? "Online" : "Offline"}</span>
        </div>
        <div className={styles.statusItem}>
          <FiEye className={focused ? styles.ok : styles.warn} />
          <span>{focused ? "Focused" : "Unfocused"}</span>
        </div>
      </div>

      {camError && (
        <div className={styles.warningBox}>
          <FiAlertTriangle /> {camError}
        </div>
      )}

      {tabWarnings > 0 && (
        <div className={styles.warningBox}>
          <FiAlertTriangle /> Tab switch detected ({tabWarnings})
        </div>
      )}

      <div className={styles.warningBox} style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
        <FiEye /> Face detection: Active
      </div>
    </aside>
  );
};

export default LeftPanel;
