import { useState } from 'react';
import { 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconBrandWhatsapp,
  IconSend,
  IconClock,
  IconMessageCircle,
  IconHeadphones,
  IconHelpCircle
} from '@tabler/icons-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: '',
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'tutor', label: 'Tutor Application' },
    { value: 'student', label: 'Student Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'partnership', label: 'Partnership Opportunities' },
  ];

  const contactMethods = [
    {
      icon: IconMail,
      title: 'Email Us',
      primary: 'support@askyourtutor.com',
      secondary: 'info@askyourtutor.com',
      color: 'blue',
      link: 'mailto:support@askyourtutor.com',
    },
    {
      icon: IconPhone,
      title: 'Call Us',
      primary: '+1 (555) 123-4567',
      secondary: 'Mon-Fri 9AM-6PM EST',
      color: 'green',
      link: 'tel:+15551234567',
    },
    {
      icon: IconBrandWhatsapp,
      title: 'WhatsApp',
      primary: '+1 (555) 987-6543',
      secondary: '24/7 Quick Support',
      color: 'emerald',
      link: 'https://wa.me/15559876543',
    },
    {
      icon: IconMapPin,
      title: 'Visit Us',
      primary: '123 Education Street',
      secondary: 'New York, NY 10001',
      color: 'purple',
      link: 'https://maps.google.com',
    },
  ];

  const faqItems = [
    {
      icon: IconHelpCircle,
      question: 'How do I become a tutor?',
      answer: 'Visit our Tutor Application page, submit your credentials, and our team will review your application within 2-3 business days.',
    },
    {
      icon: IconMessageCircle,
      question: 'How can I book a session?',
      answer: 'Browse our tutors, select one that matches your needs, choose a time slot, and complete the booking process.',
    },
    {
      icon: IconHeadphones,
      question: 'What if I need to cancel?',
      answer: 'You can cancel sessions up to 24 hours before the scheduled time for a full refund through your dashboard.',
    },
    {
      icon: IconClock,
      question: 'What are your response times?',
      answer: 'We typically respond to inquiries within 2-4 hours during business hours, and within 24 hours outside business hours.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 !text-white">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg !text-white mb-5">
              Have questions? We're here to help you succeed in your learning journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm !text-white">
              <div className="flex items-center gap-2">
                <IconClock size={18} />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <IconHeadphones size={18} />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMessageCircle size={18} />
                <span>Multiple Channels</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
                  green: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white',
                  emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
                  purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
                };

                return (
                  <a
                    key={index}
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
                        colorClasses[method.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-sm font-medium text-gray-900 mb-1">{method.primary}</p>
                    <p className="text-xs text-gray-500">{method.secondary}</p>
                  </a>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Inquiry Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {contactCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <IconSend size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                      ✓ Thank you for contacting us! We'll get back to you within 24 hours.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                      ✗ Something went wrong. Please try again or email us directly.
                    </div>
                  )}
                </form>
              </div>

              {/* FAQ Section */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-gray-600">
                    Quick answers to common questions about our platform.
                  </p>
                </div>

                <div className="space-y-4">
                  {faqItems.map((faq, index) => {
                    const Icon = faq.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Icon size={20} className="text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Help */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Check out our comprehensive Help Center for detailed guides and tutorials.
                  </p>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Visit Help Center
                    <IconSend size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Our Location</h2>
              <p className="text-gray-600">Visit us at our office or schedule a virtual meeting</p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg" style={{ height: '400px' }}>
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
