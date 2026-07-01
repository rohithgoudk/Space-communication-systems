import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-root">
      <div className="notfound-overlay">
        <div className="notfound-content">
          <div className="notfound-artifact-icon">📡</div>
          <h1 className="notfound-title">
            <span>4</span>
            <span className="notfound-zero">0</span>
            <span>4</span>
          </h1>
          <p className="notfound-subtitle">Signal lost beyond the relay horizon</p>
          <p className="notfound-description">
            The transmission you're looking for dropped out of range. It may have
            been rerouted, decommissioned, or it's simply drifting somewhere
            outside our current coverage.
          </p>

          <div className="notfound-actions">
            <button
              className="notfound-btn notfound-btn-primary"
              onClick={() => navigate("/")}
            >
              <span className="notfound-btn-icon">🛰️</span>
              Return to Mission Control
            </button>
            <button
              className="notfound-btn notfound-btn-secondary"
              onClick={() => navigate(-1)}
            >
              <span className="notfound-btn-icon">←</span>
              Go Back
            </button>
          </div>

          <div className="notfound-hints">
            <span>📶</span>
            <p>Lost link? Try re-acquiring the carrier or return to mission control.</p>
          </div>

          <div className="notfound-dig-sites">
            <span className="notfound-sites-label">Active Relay Stations:</span>
            <div className="notfound-sites-dots">
              <span className="notfound-site-dot"></span>
              <span className="notfound-site-dot"></span>
              <span className="notfound-site-dot"></span>
              <span className="notfound-site-dot"></span>
              <span className="notfound-site-dot"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}