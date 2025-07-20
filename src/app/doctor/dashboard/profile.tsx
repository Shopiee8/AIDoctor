import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Helper to join array or fallback to string
const joinOrString = (val: any, sep = ', ') => Array.isArray(val) ? val.join(sep) : val || '';

const DoctorProfile = ({ doctorId }: { doctorId?: string }) => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = doctorId || user?.uid;
        if (!id) throw new Error('No doctor ID');
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor(docSnap.data());
        } else {
          setError('Doctor not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, user]);

  // Carousel settings (same as your original)
  const CustomNextArrow = ({ className, onClick }: any) => (
    <div className="nav nav-container slide-1 doctor-profile">
      <button type="button" role="presentation" className="owl-next" onClick={onClick}>
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
  const CustomPrevArrow = ({ className, onClick }: any) => (
    <div className="nav nav-container slide-1 doctor-profile">
      <button type="button" role="presentation" className="owl-prev" onClick={onClick}>
        <i className="fas fa-chevron-left" />
      </button>
    </div>
  );
  const insurence = { dots: false, infinite: false, speed: 2000, slidesToShow: 6, slidesToScroll: 1, nextArrow: <CustomNextArrow />, prevArrow: <CustomPrevArrow />, responsive: [ { breakpoint: 1300, settings: { slidesToShow: 6 } }, { breakpoint: 1000, settings: { slidesToShow: 5 } }, { breakpoint: 768, settings: { slidesToShow: 3 } }, { breakpoint: 480, settings: { slidesToShow: 2 } } ] };
  const availability = { dots: false, infinite: false, speed: 2000, slidesToShow: 7, slidesToScroll: 1, nextArrow: <CustomNextArrow />, prevArrow: <CustomPrevArrow />, responsive: [ { breakpoint: 1400, settings: { slidesToShow: 7 } }, { breakpoint: 1300, settings: { slidesToShow: 6 } }, { breakpoint: 1000, settings: { slidesToShow: 5 } }, { breakpoint: 768, settings: { slidesToShow: 3 } }, { breakpoint: 480, settings: { slidesToShow: 2 } } ] };
  const awards = { dots: false, infinite: false, speed: 2000, slidesToShow: 4, slidesToScroll: 1, nextArrow: <CustomNextArrow />, prevArrow: <CustomPrevArrow />, responsive: [ { breakpoint: 1400, settings: { slidesToShow: 4 } }, { breakpoint: 1300, settings: { slidesToShow: 4 } }, { breakpoint: 1000, settings: { slidesToShow: 2 } }, { breakpoint: 768, settings: { slidesToShow: 1 } }, { breakpoint: 480, settings: { slidesToShow: 1 } } ] };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!doctor) return null;

  // Helper: get current workplace
  const getCurrentWorkplace = () => {
    if (Array.isArray(doctor.experience)) {
      const current = doctor.experience.find((exp: any) => exp.currentlyWorking && (exp.hospital || exp.clinic));
      if (current) return current.hospital || current.clinic || '';
    }
    if (Array.isArray(doctor.clinics)) {
      const currentClinic = doctor.clinics.find((c: any) => c.isCurrent || c.currentlyWorking);
      if (currentClinic) return currentClinic.name || '';
    }
    return doctor.location || '';
  };

  return (
    <div className="main-wrapper">
      <LandingHeader />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Doctor Profile</li>
                </ol>
                <h2 className="breadcrumb-title">Doctor Profile</h2>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content">
        <div className="container">
          {/* Doctor Widget */}
          <div className="card doc-profile-card">
            <div className="card-body">
              <div className="doctor-widget doctor-profile-two">
                <div className="doc-info-left">
                  <div className="doctor-img">
                    <img src={doctor.image || '/assets/img/doctors/doc-profile-02.jpg'} className="img-fluid" alt="User Image" />
                  </div>
                  <div className="doc-info-cont">
                    <span className="badge doc-avail-badge">
                      <i className="fa-solid fa-circle" />
                      {doctor.available ? 'Available' : 'Unavailable'}
                    </span>
                    <h4 className="doc-name">
                      {doctor.name} {doctor.isVerified && <img src="/assets/img/icons/badge-check.svg" alt="Verified" />}
                      <span className="badge doctor-role-badge">
                        <i className="fa-solid fa-circle" />
                        {joinOrString(doctor.specialization)}
                      </span>
                    </h4>
                    <p>{joinOrString(doctor.degree) || joinOrString(doctor.education?.[0]?.course)}</p>
                    <p>Speaks : {joinOrString(doctor.languages)}</p>
                    <p className="address-detail">
                      <span className="loc-icon"><i className="feather-map-pin" /></span>
                      {getCurrentWorkplace()} {doctor.location && <span className="view-text">( View Location )</span>}
                    </p>
                  </div>
                </div>
                <div className="doc-info-right">
                  <ul className="doctors-activities">
                    <li>
                      <div className="hospital-info">
                        <span className="list-icon"><img src="/assets/img/icons/watch-icon.svg" alt="Watch" /></span>
                        <p>{doctor.employmentType || 'Full Time'}{doctor.onlineTherapy ? ', Online Therapy Available' : ''}</p>
                      </div>
                    </li>
                    <li>
                      <div className="hospital-info">
                        <span className="list-icon"><img src="/assets/img/icons/thumb-icon.svg" alt="Thumb" /></span>
                        <p><b>{doctor.recommendation || '94%'} </b> Recommended</p>
                      </div>
                    </li>
                    <li>
                      <div className="hospital-info">
                        <span className="list-icon"><img src="/assets/img/icons/building-icon.svg" alt="Building" /></span>
                        <p>{getCurrentWorkplace()}</p>
                      </div>
                      <h5 className="accept-text">
                        <span><i className="feather-check" /></span>
                        {doctor.acceptingNewPatients ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                      </h5>
                    </li>
                    <li>
                      <div className="rating">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <span>{doctor.rating || '5.0'}</span>
                        <a href="#" className="d-inline-block average-rating">{doctor.reviewsCount || '150'} Reviews</a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Add more dynamic sections below as needed, e.g. experience, insurances, clinics, etc. */}
            </div>
          </div>
          {/* /Doctor Widget */}
          {/* Add more dynamic sections here, e.g. experience, insurances, clinics, awards, etc. */}
        </div>
      </div>
      {/* /Page Content */}
      <LandingFooter />
    </div>
  );
};

export default DoctorProfile; 