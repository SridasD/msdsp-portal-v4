"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "./portal-primitives";
import { FullStackPage } from "./full-stack-page";
import type { Role } from "../portal-config";

export type WorkshopTab = "fullstack" | "courseDetails" | "workflow";

interface WorkshopHubProps {
  role?: Role;
  initialTab?: WorkshopTab;
  notify: (message: string) => void;
  onNavigate?: (page: string, assignmentId?: string) => void;
  openEvidence?: (assignment?: string) => void;
  renderCourseDetails: () => ReactNode;
  renderWorkflow: () => ReactNode;
}

export function WorkshopHub({
  role = "courseHead",
  initialTab = "courseDetails",
  notify,
  onNavigate,
  openEvidence,
  renderCourseDetails,
  renderWorkflow,
}: WorkshopHubProps) {
  const [activeTab, setActiveTab] = useState<WorkshopTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: WorkshopTab, label: string) => {
    setActiveTab(tab);
    notify(`Switched to ${label}`);
  };

  const handleInternalNavigate = (page: string, assignmentId?: string) => {
    if (page === "Course Details") {
      setActiveTab("courseDetails");
      notify("Navigated to Course Details reference");
      return;
    }
    if (page === "Programme Workflow") {
      setActiveTab("workflow");
      notify("Navigated to Programme Workflow diagrams");
      return;
    }
    if (page === "Full Stack Development") {
      setActiveTab("fullstack");
      notify("Navigated to Full Stack Development");
      return;
    }
    if (onNavigate) {
      onNavigate(page, assignmentId);
    } else {
      notify(`Navigate to ${page}`);
    }
  };

  const roleLabel =
    role === "courseHead"
      ? "Course Head View"
      : role === "mentor"
      ? "Mentor Reference"
      : "Learner Workshop";

  return (
    <div className="workshop-hub">
      {/* Workshop Navigation Header & Segmented Controls */}
      <header className="workshop-header">
        <div className="workshop-header-copy">
          <div className="workshop-breadcrumbs">
            <span className="eyebrow">ACADEMIC &amp; TECHNICAL WORKSHOP</span>
            <span className="role-tag" aria-label={`Current perspective: ${roleLabel}`}>
              <Icon name={role === "courseHead" ? "shield" : role === "mentor" ? "users" : "target"} />
              {roleLabel}
            </span>
          </div>
          <h2>Technical Workshop &amp; Programme Blueprint</h2>
          <p>
            Unified workspace consolidating the Full Stack engineering curriculum, official programme course structure, and interactive delivery architecture diagrams.
          </p>
        </div>

        {/* Segmented Tab Controls */}
        <nav className="workshop-tab-bar" role="tablist" aria-label="Workshop sections">
          <button
            type="button"
            role="tab"
            id="workshop-tab-course-details"
            aria-selected={activeTab === "courseDetails"}
            aria-controls="workshop-panel-course-details"
            className={`workshop-tab-btn ${activeTab === "courseDetails" ? "active" : ""}`}
            onClick={() => handleTabChange("courseDetails", "Course Details")}
          >
            <Icon name="book" />
            <span className="tab-label">Course Details</span>
            <span className="tab-pill">Syllabus &amp; Credits</span>
          </button>

          <button
            type="button"
            role="tab"
            id="workshop-tab-workflow"
            aria-selected={activeTab === "workflow"}
            aria-controls="workshop-panel-workflow"
            className={`workshop-tab-btn ${activeTab === "workflow" ? "active" : ""}`}
            onClick={() => handleTabChange("workflow", "Programme Workflow")}
          >
            <Icon name="network" />
            <span className="tab-label">Programme Workflow</span>
            <span className="tab-pill">9 Flowcharts</span>
          </button>

          <button
            type="button"
            role="tab"
            id="workshop-tab-fullstack"
            aria-selected={activeTab === "fullstack"}
            aria-controls="workshop-panel-fullstack"
            className={`workshop-tab-btn ${activeTab === "fullstack" ? "active" : ""}`}
            onClick={() => handleTabChange("fullstack", "Full Stack Development")}
          >
            <Icon name="layers" />
            <span className="tab-label">Full Stack Development</span>
            <span className="tab-pill">Sprints &amp; Code</span>
          </button>
        </nav>
      </header>

      {/* Workshop Tab Content Panels */}
      <div className="workshop-content-container">
        {activeTab === "courseDetails" && (
          <div
            id="workshop-panel-course-details"
            role="tabpanel"
            aria-labelledby="workshop-tab-course-details"
            className="workshop-tab-pane"
          >
            {renderCourseDetails()}
          </div>
        )}

        {activeTab === "workflow" && (
          <div
            id="workshop-panel-workflow"
            role="tabpanel"
            aria-labelledby="workshop-tab-workflow"
            className="workshop-tab-pane"
          >
            {renderWorkflow()}
          </div>
        )}

        {activeTab === "fullstack" && (
          <div
            id="workshop-panel-fullstack"
            role="tabpanel"
            aria-labelledby="workshop-tab-fullstack"
            className="workshop-tab-pane"
          >
            <FullStackPage
              notify={notify}
              onNavigate={handleInternalNavigate}
              openEvidence={openEvidence}
              isFaculty={role === "courseHead"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
