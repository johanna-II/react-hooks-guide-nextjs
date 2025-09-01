'use client';

import React, { useState } from 'react';
import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';
import { HTMLText } from '@/utils/html-parser';

export default function FormActionDemo() {
  const t = useOptimizedTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      if (formData.name && formData.email) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <h4 className="text-lg font-bold text-white mb-4">{t('form.title')}</h4>
        <p className="text-slate-300 mb-6">
          {t('form.description')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              {t('form.name')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              data-testid="name-input"
              data-no-swipe="true"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder={t('form.namePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              {t('form.email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              data-testid="email-input"
              data-no-swipe="true"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder={t('form.emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
              {t('form.message')}
            </label>
            <textarea
              id="message"
              name="message"
              data-testid="message-textarea"
              data-no-swipe="true"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              placeholder={t('form.messagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isSubmitting
                ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t('form.submit.preparing')}</span>
              </div>
            ) : (
              t('form.submit.button')
            )}
          </button>
        </form>

        {/* Status Display */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✅</span>
              <span className="text-green-300 font-medium">{t('form.successMessage')}</span>
            </div>
            <p className="text-sm text-green-400/80 mt-2">
              <HTMLText>{t('form.actionDescription')}</HTMLText>
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">❌</span>
              <span className="text-red-300 font-medium">{t('form.errorMessage')}</span>
            </div>
            <p className="text-sm text-red-400/80 mt-2">
              {t('form.required')}
            </p>
          </div>
        )}
      </div>

      {/* React 19 Code Example */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <h4 className="text-lg font-bold text-white mb-4">{t('form.formActions.code')}</h4>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600/50">
          <p className="text-sm text-green-400 mb-3">🎉 {t('form.formActions.example')}</p>
          <pre className="text-sm text-slate-300 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <code className="language-typescript">{`// React 19 Form Actions
const [error, submitAction, isPending] = useActionState(
  async (previousState, formData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    
    if (!name || !email) {
      return "${t('form.comment.actionStateUsage')}";
    }
    
    try {
      await submitForm({ name, email });
      redirect("/success");
      return null;
    } catch (error) {
      return "${t('form.comment.submitFailure')}";
    }
  },
  null
);

return (
  <form action={submitAction}>
    <input type="text" name="name" required />
    <input type="email" name="email" required />
    <button type="submit" disabled={isPending}>
      {isPending ? "${t('form.submit.preparing')}" : "${t('form.submit.button')}"}
    </button>
    {error && <p className="error">{error}</p>}
  </form>
);`}</code>
          </pre>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <h5 className="text-lg font-semibold text-blue-400 mb-3">🚀 {t('form.react19.benefits')}</h5>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• {t('form.benefits.autoReset')}</li>
            <li>• {t('form.benefits.errorHandling')}</li>
            <li>• {t('form.benefits.pendingState')}</li>
            <li>• {t('form.benefits.optimistic')}</li>
          </ul>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <h5 className="text-lg font-semibold text-green-400 mb-3">💡 {t('form.react19.comparison')}</h5>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• {t('form.comparison.noUseState')}</li>
            <li>• {t('form.comparison.noManualError')}</li>
            <li>• {t('form.comparison.simpleState')}</li>
            <li>• {t('form.comparison.betterUX')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
