import React, { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ClubEvent, StudentProfile, FeedbackQuestion } from '../types';
import { StorageService } from '../services/storageService';

interface EventFeedbackModalProps {
  event: ClubEvent;
  studentProfile: StudentProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const EventFeedbackModal: React.FC<EventFeedbackModalProps> = ({
  event,
  studentProfile,
  onClose,
  onSuccess
}) => {
  // Use event-specific custom questions set by admin, or default sample questions if none set
  const questions: FeedbackQuestion[] = (event.feedbackQuestions && event.feedbackQuestions.length > 0)
    ? event.feedbackQuestions
    : [
        { id: 'q1', questionText: 'How would you rate the quality & organization of this event?', type: 'rating' },
        { id: 'q2', questionText: 'What was your key technical takeaway or favorite part?', type: 'text' },
        { id: 'q3', questionText: 'Any suggestions for future GITS workshops or hackathons?', type: 'text' }
      ];

  const [overallRating, setOverallRating] = useState<number>(5);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (qId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q.id,
        questionText: q.questionText,
        answer: answers[q.id] || (q.type === 'rating' ? 5 : 'N/A')
      }));

      StorageService.addFeedbackResponse({
        eventId: event.id,
        eventTitle: event.title,
        studentName: studentProfile.name,
        studentEmail: studentProfile.email,
        rollNo: studentProfile.rollNo,
        overallRating,
        answers: formattedAnswers,
        comments: comments.trim(),
      });

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 1800);
    } catch (err) {
      console.error('Feedback submit error:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(121, 40, 202, 0.15) 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00f2fe', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              <MessageSquare size={14} /> Student Feedback Form
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>{event.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <CheckCircle size={54} color="#34d399" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>Thank You for Your Feedback!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Your feedback is only visible to GITS Admin Coordinators to help improve future events.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
            
            {/* Overall Event Rating */}
            <div style={{ marginBottom: '1.5rem', padding: '1.15rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
              <label style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                Overall Event Experience Rating
              </label>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Star 
                      size={28} 
                      color={star <= overallRating ? '#fbbf24' : 'rgba(255,255,255,0.2)'} 
                      fill={star <= overallRating ? '#fbbf24' : 'transparent'} 
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.35rem', fontWeight: 600 }}>
                {overallRating === 5 ? '⭐⭐⭐⭐⭐ Excellent' : overallRating === 4 ? '⭐⭐⭐⭐ Great' : overallRating === 3 ? '⭐⭐⭐ Good' : overallRating === 2 ? '⭐⭐ Fair' : '⭐ Needs Improvement'}
              </div>
            </div>

            {/* Custom Admin Questions */}
            {questions.map((q, idx) => (
              <div key={q.id} className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                  {idx + 1}. {q.questionText}
                </label>

                {q.type === 'rating' ? (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`btn btn-sm ${answers[q.id] === r ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleAnswerChange(q.id, r)}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {r} ★
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type your response here..."
                    value={(answers[q.id] as string) || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                )}
              </div>
            ))}

            {/* General Comments */}
            <div className="form-group">
              <label className="form-label">Additional Comments / Suggestions (Optional)</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Share any additional thoughts with event coordinators..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            {/* Privacy note */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
              🔒 Privacy Note: This feedback form is strictly confidential and visible ONLY to GITS Admin Coordinators.
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Send size={15} /> {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
