import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, XClose } from '@untitled-ui/icons-react';
import PropTypes from 'prop-types';

export default function StackedPageSheet({ title, children, backUrl, closeUrl }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the slide-in animation shortly after mount
    const timer = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (closeUrl) {
        navigate(closeUrl);
      } else {
        navigate(-1);
      }
    }, 300); // Wait for transition
  };

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (backUrl) {
        navigate(backUrl);
      } else {
        navigate(-1);
      }
    }, 300);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex pt-2 pl-2 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-tl-[40px] border-l border-t border-gray-200 bg-white pb-12 pt-8">
        {/* Header section */}
        <div className="mb-8 flex flex-col gap-6 px-8">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Back to previous page
            </button>
            {/* Close Button X */}
            <button
              onClick={handleClose}
              className="rounded-lg bg-white p-2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <XClose size={20} />
            </button>
          </div>
          {/* Page header */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

StackedPageSheet.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  backUrl: PropTypes.string,
  closeUrl: PropTypes.string,
};

StackedPageSheet.defaultProps = {
  title: '',
  children: null,
  backUrl: '',
  closeUrl: '',
};
