import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import {
  guardInput,
  sanitizeEmail,
  isValidEmail,
  checkPasswordStrength,
  PasswordStrength
} from '../../utils/security';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showStrength?: boolean;
  onSafeChange?: (value: string, isClean: boolean) => void;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  error: externalError,
  type = 'text',
  showStrength = false,
  onSafeChange,
  onChange,
  className = '',
  ...props
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let isSafe = true;
    let msg: string | null = null;

    const guard = guardInput(val);
    if (!guard.safe) {
      isSafe = false;
      msg = '⚠ 检测到非法字符';
    }

    if (type === 'email' && val) {
      if (!isValidEmail(sanitizeEmail(val))) {
        msg = '邮箱格式不正确';
        isSafe = false;
      }
    }

    if (type === 'password' && showStrength) {
      setStrength(checkPasswordStrength(val));
    }

    setInternalError(msg);
    onSafeChange?.(val, isSafe);
    onChange?.(e);
  };

  const error = externalError || internalError;

  const strengthColors: Record<string, string> = {
    weak: 'bg-red-500',
    fair: 'bg-yellow-500',
    good: 'bg-blue-500',
    strong: 'bg-green-500',
  };

  const strengthLabels: Record<string, string> = {
    weak: '弱',
    fair: '一般',
    good: '良好',
    strong: '强',
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <input
          type={type}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error
              ? 'border-red-300 bg-red-50 focus:ring-red-400'
              : 'border-gray-300 bg-white'
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <AlertCircle size={16} className="text-red-500" />
          </div>
        )}
        {!error && props.value && type === 'email' && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <CheckCircle size={16} className="text-green-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {strength && showStrength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {(['weak', 'fair', 'good', 'strong'] as const).map((level, i) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  ['weak', 'fair', 'good', 'strong'].indexOf(strength.level) >= i
                    ? strengthColors[strength.level]
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            密码强度：<span className="font-medium">{strengthLabels[strength.level]}</span>
          </p>
        </div>
      )}
    </div>
  );
};

interface SecureSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const SecureSelect: React.FC<SecureSelectProps> = ({
  label,
  error,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

interface SecureTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  onSafeChange?: (value: string, isClean: boolean) => void;
}

export const SecureTextarea: React.FC<SecureTextareaProps> = ({
  label,
  error: externalError,
  onSafeChange,
  onChange,
  className = '',
  ...props
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const guard = guardInput(val);
    const msg = guard.safe ? null : '⚠ 检测到非法字符';
    setInternalError(msg);
    onSafeChange?.(val, guard.safe);
    onChange?.(e);
  };

  const error = externalError || internalError;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};
