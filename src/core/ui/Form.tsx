import React, { useState, useRef, useEffect } from 'react';
import styles from './Form.module.css';
import Button from './Button/Button';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Form: React.FC<{
  onSubmit: (data: { name: string; email: string; message: string }) => void;
  buttonText?: string;
}> = ({ onSubmit, buttonText = 'Gönder' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'İsim alanı zorunludur';
    }

    if (!email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!message.trim()) {
      newErrors.message = 'Mesaj alanı zorunludur';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      onSubmit({ name, email, message });

      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);

      if (nameRef.current) {
        nameRef.current.focus();
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          İsim
        </label>
        <input
          id="name"
          ref={nameRef}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          disabled={isSubmitting}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          E-posta
        </label>
        <input
          id="email"
          ref={emailRef}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          disabled={isSubmitting}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          Mesaj
        </label>
        <textarea
          id="message"
          ref={messageRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          rows={5}
          disabled={isSubmitting}
        />
        {errors.message && <span className={styles.error}>{errors.message}</span>}
      </div>

      <div className={styles.formActions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Gönderiliyor...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default Form;
