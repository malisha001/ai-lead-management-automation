import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Loader2, Zap, ArrowRight } from 'lucide-react';
import { submitLead } from '../api/leadsApi';
import Navbar from '../components/Navbar';

const SERVICE_TYPES = [
  'Website Development', 'Mobile App Development', 'SEO/Marketing',
  'E-Commerce', 'CRM/Software', 'Support', 'Partnership', 'General Inquiry',
];

const schema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters.'),
  email:       z.string().email('Please enter a valid email address.'),
  phone:       z.string().optional(),
  company:     z.string().optional(),
  serviceType: z.string().min(1, 'Please select a service type.'),
  message:     z.string().min(10, 'Message must be at least 10 characters.'),
});

const LandingPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await submitLead(data);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-brand-400 text-sm font-medium">AI-Powered Lead Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-6">
            Get in Touch &<br />
            <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
              We'll Follow Up Fast
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-12">
            Tell us what you need. Our AI instantly analyses your message and routes it to the right team.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        {submitted ? (
          <div className="glass-card p-10 text-center animate-slide-up">
            <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Message Received!</h2>
            <p className="text-slate-400">
              Our AI has analysed your request and it's been routed to the right team. We'll be in touch soon.
            </p>
            <button onClick={() => setSubmitted(false)} className="mt-6 btn-ghost text-sm">
              Submit another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 sm:p-8 space-y-5 animate-slide-up">
            <h2 className="text-xl font-semibold text-slate-100 mb-1">Contact Us</h2>
            <p className="text-slate-500 text-sm -mt-3">Fill in the form and our team will get back to you within 24 hours.</p>

            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input {...register('name')} placeholder="Jane Smith" className="input-field" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Email *</label>
                <input {...register('email')} type="email" placeholder="jane@company.com" className="input-field" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Phone + Company */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input {...register('phone')} type="tel" placeholder="+1 555 000 0000" className="input-field" />
              </div>
              <div>
                <label className="label">Company</label>
                <input {...register('company')} placeholder="Acme Corp" className="input-field" />
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="label">Service Type *</label>
              <select {...register('serviceType')} className="input-field">
                <option value="">Select a service…</option>
                {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="label">Message *</label>
              <textarea
                {...register('message')}
                rows={5}
                placeholder="Tell us about your project, timeline, budget, or anything that would help us understand your needs…"
                className="input-field resize-none"
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm">{serverError}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                <>Send Message <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
