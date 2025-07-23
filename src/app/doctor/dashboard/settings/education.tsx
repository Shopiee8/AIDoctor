import React, { useState } from "react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { SessionNavBar as DoctorSidebar } from "@/components/ui/sidebar";
import { DashboardHeader as SettingsHeader } from "@/components/dashboard-header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EducationEntry {
  id: number;
  institution: string;
  course: string;
  startDate: Date | null;
  endDate: Date | null;
  years: string;
  description: string;
  logo: File | null;
  logoPreview: string | ArrayBuffer | null;
  isExpanded: boolean;
}

const emptyEducation = (): EducationEntry => ({
  id: Date.now() + Math.random(),
  institution: "",
  course: "",
  startDate: null,
  endDate: null,
  years: "",
  description: "",
  logo: null,
  logoPreview: null,
  isExpanded: true,
});

// Helper to recursively remove undefined values from an object or array
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}

const Education: React.FC = (props) => {
  const [educations, setEducations] = useState<EducationEntry[]>([emptyEducation()]);

  // Add new education entry
  const addEducation = (): void => {
    setEducations([
      ...educations.map(e => ({ ...e, isExpanded: false })),
      emptyEducation(),
    ]);
  };

  // Remove education entry
  const deleteEducation = (id: number): void => {
    setEducations(educations.filter((e) => e.id !== id));
  };

  // Expand/collapse accordion
  const toggleAccordion = (id: number): void => {
    setEducations(educations.map(e => ({ ...e, isExpanded: e.id === id ? !e.isExpanded : false })));
  };

  // Handle field change
  const handleChange = (id: number, field: keyof EducationEntry, value: any): void => {
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Handle logo upload
  const handleLogoChange = (id: number, file: File | null): void => {
    if (!file) {
      setEducations(educations.map(e =>
        e.id === id ? { ...e, logo: null, logoPreview: null } : e
      ));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEducations(educations.map(e =>
        e.id === id ? { ...e, logo: file, logoPreview: reader.result } : e
      ));
    };
    reader.readAsDataURL(file);
  };

  // Reset a single education entry
  const resetEducation = (id: number): void => {
    setEducations(educations.map(e =>
      e.id === id ? { ...emptyEducation(), id, isExpanded: true } : e
    ));
  };

  // Save handler (replace with Firestore integration as needed)
  const handleSave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Example: Clean data before saving to Firestore
    const cleanedEducations = removeUndefined(educations.map(e => ({
      ...e,
      // Convert File and logoPreview to a string or remove before saving
      logo: undefined, // Remove file object from Firestore data
      logoPreview: undefined, // Remove preview from Firestore data
      startDate: e.startDate ? e.startDate.toISOString() : null,
      endDate: e.endDate ? e.endDate.toISOString() : null,
    })));
    // TODO: Save cleanedEducations to Firestore
    console.log('Ready to save to Firestore:', cleanedEducations);
    alert("Saved! (Implement Firestore integration)");
  };

  return (
    <div>
      <LandingHeader {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Doctor Profile</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Doctor Profile
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Sidebar */}
              <DoctorSidebar />
              {/* /Profile Sidebar */}
            </div>
            <div className="col-lg-8 col-xl-9">
              {/* Profile Settings */}
              <div className="dashboard-header">
                <h3>Profile Settings</h3>
              </div>
              {/* Settings List */}
              <SettingsHeader />
              {/* /Settings List */}
              <div className="dashboard-header border-0 mb-0 d-flex justify-content-between align-items-center">
                <h3>Education</h3>
                <button
                  type="button"
                  className="btn btn-primary prime-btn add-educations"
                  onClick={addEducation}
                >
                  + Add New Education
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="accordions education-infos" id="list-accord">
                  {educations.map((education, idx) => (
                    <div className="user-accordion-item mb-3" key={education.id}>
                      <div
                        className={`accordion-wrap d-flex justify-content-between align-items-center ${education.isExpanded ? '' : 'collapsed'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleAccordion(education.id)}
                        aria-expanded={education.isExpanded}
                        aria-controls={`education${education.id}`}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleAccordion(education.id); }}
                      >
                        <span>{education.institution || `Education ${idx + 1}`}</span>
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0 ms-2"
                          onClick={e => { e.stopPropagation(); deleteEducation(education.id); }}
                          aria-label="Delete education"
                        >
                          <i className="fa fa-trash" />
                        </button>
                      </div>
                      <div
                        className={`accordion-collapse collapse${education.isExpanded ? ' show' : ''}`}
                        id={`education${education.id}`}
                        data-bs-parent="#list-accord"
                      >
                        <div className="content-collapse p-3 border rounded bg-light">
                          <div className="row align-items-center">
                            <div className="col-md-12 mb-3">
                              <div className="form-wrap mb-2">
                                <div className="change-avatar img-upload d-flex align-items-center">
                                  <div className="profile-img me-3">
                                    {education.logoPreview ? (
                                      <img src={typeof education.logoPreview === 'string' ? education.logoPreview : undefined} alt="Logo Preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                                    ) : (
                                      <i className="fa-solid fa-file-image fa-2x text-secondary" />
                                    )}
                                  </div>
                                  <div className="upload-img">
                                    <h5>Logo</h5>
                                    <div className="imgs-load d-flex align-items-center">
                                      <label className="btn btn-sm btn-outline-primary me-2 mb-0">
                                        Upload New
                                        <input
                                          type="file"
                                          className="upload d-none"
                                          accept="image/*"
                                          onChange={e => {
                                            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                            handleLogoChange(education.id, file);
                                          }}
                                        />
                                      </label>
                                      {education.logoPreview && (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={e => { e.stopPropagation(); handleLogoChange(education.id, null); }}
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                    <p className="form-text">
                                      Image &lt; 4 MB, formats: jpg, png, svg
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form-wrap">
                                <label className="col-form-label">Name of the institution</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={education.institution}
                                  onChange={e => handleChange(education.id, 'institution', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="form-wrap">
                                <label className="col-form-label">Course</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={education.course}
                                  onChange={e => handleChange(education.id, 'course', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                              <div className="form-wrap">
                                <label className="col-form-label">Start Date <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <DatePicker
                                    className="form-control datetimepicker"
                                    selected={education.startDate}
                                    onChange={date => handleChange(education.id, 'startDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="Select start date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    required
                                  />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                              <div className="form-wrap">
                                <label className="col-form-label">End Date <span className="text-danger">*</span></label>
                                <div className="form-icon">
                                  <DatePicker
                                    className="form-control datetimepicker"
                                    selected={education.endDate}
                                    onChange={date => handleChange(education.id, 'endDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="Select end date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    required
                                  />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                              <div className="form-wrap">
                                <label className="col-form-label">No of Years <span className="text-danger">*</span></label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={education.years}
                                  onChange={e => handleChange(education.id, 'years', e.target.value)}
                                  min={1}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 mb-3">
                              <div className="form-wrap">
                                <label className="col-form-label">Description <span className="text-danger">*</span></label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  value={education.description}
                                  onChange={e => handleChange(education.id, 'description', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-end">
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm me-2"
                              onClick={() => resetEducation(education.id)}
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-btn text-end mt-4">
                  <button type="button" className="btn btn-gray me-2" onClick={() => setEducations([emptyEducation()])}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary prime-btn">
                    Save Changes
                  </button>
                </div>
              </form>
              {/* /Profile Settings */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <LandingFooter />
    </div>
  );
};

export default Education; 
