'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { validateEmail, validatePhone, validateName, validateComments, type ValidationResult } from '@/utils/validation';
import { ErrorHandler, ErrorCategory } from '@/utils/errorHandler';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    interests: [] as string[],
    comments: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section label
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Animate divider
      gsap.from(dividerRef.current, {
        scaleX: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Animate form
      gsap.from(formRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validateField = (name: string, value: string): ValidationResult => {
    switch (name) {
      case 'firstName':
        return validateName(value, 'First Name');
      case 'lastName':
        return validateName(value, 'Last Name');
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'comments':
        return validateComments(value);
      default:
        return { isValid: true };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate on blur or after user has interacted
    if (touched[name]) {
      const validation = validateField(name, value);
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, [name]: validation.error || '' }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validation = validateField(name, value);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [name]: validation.error || '' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    const firstNameValidation = validateField('firstName', formData.firstName);
    const lastNameValidation = validateField('lastName', formData.lastName);
    const emailValidation = validateField('email', formData.email);
    const phoneValidation = validateField('phone', formData.phone);
    const commentsValidation = validateField('comments', formData.comments);

    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error || '';
    }
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error || '';
    }
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || '';
    }
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error || '';
    }
    if (!commentsValidation.isValid) {
      newErrors.comments = commentsValidation.error || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Form is valid, proceed with submission
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // TODO: Replace with actual API endpoint when form submission service is implemented
      // For now, simulate a successful submission
      const simulateSubmission = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return { success: true };
      };

      // Uncomment when API is ready:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      //   signal: controller.signal,
      // });
      // clearTimeout(timeoutId);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const result = await response.json();

      const result = await simulateSubmission();
      clearTimeout(timeoutId);
      
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setSubmitMessage('Thank you! Your message has been sent successfully.');
      
      // Clear form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          countryCode: '+1',
          interests: [],
          comments: '',
        });
        setTouched({});
        setErrors({});
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again later.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
          ErrorHandler.handleError(error, ErrorCategory.NETWORK, { type: 'timeout', formData });
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your connection and try again.';
          ErrorHandler.handleNetworkError(error, { formData });
        } else {
          ErrorHandler.handleFormError(error, formData);
        }
      } else {
        ErrorHandler.handleError(error, ErrorCategory.FORM, { formData });
      }

      setSubmitStatus('error');
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="form" className="py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Section Label */}
        <div ref={labelRef} className="mb-12 md:mb-16 text-center">
          <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-semibold">
            Contact
          </span>
          <div ref={dividerRef} className="mt-3 w-12 h-px bg-bronze origin-left mx-auto"></div>
        </div>

        {/* Form Container - Centered */}
        <div className="flexContainer">
          <div className="column one">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Name Fields - Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-xs font-light text-gray-700 uppercase tracking-wider mb-2">
                    First Name <span className="text-bronze">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="First Name"
                    className={`w-full px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 transition-all duration-300 font-light text-gray-900 placeholder:text-gray-400 ${
                      errors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-bronze focus:ring-bronze/20'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-xs font-light text-gray-700 uppercase tracking-wider mb-2">
                    Last Name <span className="text-bronze">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Last Name"
                    className={`w-full px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 transition-all duration-300 font-light text-gray-900 placeholder:text-gray-400 ${
                      errors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-bronze focus:ring-bronze/20'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email - Full Width */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-light text-gray-700 uppercase tracking-wider mb-2">
                  Email <span className="text-bronze">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter Email"
                  className={`w-full px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 transition-all duration-300 font-light text-gray-900 placeholder:text-gray-400 ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-amber-400 focus:ring-amber-400/20'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone with Country Code */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs font-light text-gray-700 uppercase tracking-wider mb-2">
                  Phone
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-sm">
                    <span className="text-lg mr-2">🇺🇸</span>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, countryCode: e.target.value }))}
                      className="bg-transparent border-none outline-none font-light text-gray-900 cursor-pointer text-sm"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+33">+33</option>
                      <option value="+49">+49</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Phone Number"
                    className={`flex-1 px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 transition-all duration-300 font-light text-gray-900 placeholder:text-gray-400 ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-bronze focus:ring-bronze/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Interests Checkboxes */}
              <div className="space-y-3">
                <label className="block text-xs font-light text-gray-700 uppercase tracking-wider mb-3">
                  I am interested in:
                </label>
                <div className="space-y-3">
                  {['Sales', 'Advisory', 'Capital'].map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleCheckboxChange(interest)}
                        className="w-5 h-5 border-gray-300 rounded-sm text-bronze focus:ring-bronze focus:ring-2 focus:ring-offset-0 cursor-pointer transition-all duration-300"
                      />
                      <span className="text-sm md:text-base font-light text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        {interest}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comments Textarea */}
              <div className="space-y-2">
                <label htmlFor="comments" className="block text-xs font-light text-gray-700 uppercase tracking-wider mb-2">
                  Comments
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={5}
                  value={formData.comments}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter Comments"
                  maxLength={1000}
                  className={`w-full px-4 py-3 bg-white border rounded-sm focus:outline-none focus:ring-1 transition-all duration-300 font-light text-gray-900 placeholder:text-gray-400 resize-vertical ${
                    errors.comments
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-amber-400 focus:ring-amber-400/20'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.comments && (
                    <p className="text-xs text-red-600">{errors.comments}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.comments.length}/1000
                  </p>
                </div>
              </div>

              {/* reCAPTCHA Placeholder */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>protected by reCAPTCHA</span>
                </div>
                <div className="text-xs text-gray-500">
                  <a href="#" className="hover:text-bronze transition-colors duration-200">Privacy</a>
                  {' - '}
                  <a href="#" className="hover:text-bronze transition-colors duration-200">Terms</a>
                </div>
              </div>

              {/* Submit Status Message */}
              {submitStatus !== 'idle' && (
                <div
                  className={`p-4 rounded-sm ${
                    submitStatus === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  <p className="text-sm font-light">{submitMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-bronze hover:bg-bronze-dark disabled:bg-bronze-light disabled:cursor-not-allowed text-charcoal font-light uppercase tracking-wider rounded-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
