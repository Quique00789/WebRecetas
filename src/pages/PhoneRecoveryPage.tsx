import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Shield
} from 'lucide-react';
import { phoneRecoveryService } from '../services/phoneRecovery';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

const PhoneRecoveryPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'method' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<'sms' | 'voice' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  // Contador regresivo para reenvío
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verificar si el usuario tiene teléfono registrado
      const phone = await phoneRecoveryService.getUserPhone(email);
      
      if (phone) {
        setStep('method');
      } else {
        // Si no tiene teléfono, ofrecer solo email
        await sendPasswordResetEmail(auth, email);
        setSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('Email no encontrado o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = async (selectedMethod: 'sms' | 'voice') => {
    setMethod(selectedMethod);
    setError('');
    setLoading(true);

    try {
      let result;
      if (selectedMethod === 'sms') {
        result = await phoneRecoveryService.sendSMSCode(email);
      } else {
        result = await phoneRecoveryService.sendVoiceCode(email);
      }

      if (result.success) {
        setSuccess(result.message);
        setMaskedPhone(result.maskedPhone || '');
        setStep('code');
        setTimeLeft(60); // 60 segundos antes de poder reenviar
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error enviando código. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await phoneRecoveryService.verifyCode(email, code);
      
      if (result.success) {
        setSuccess('Código verificado. Enviando enlace de recuperación...');
        
        // Enviar email de recuperación después de verificar el código
        await sendPasswordResetEmail(auth, email);
        setStep('success');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error verificando código. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0 || !method) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let result;
      if (method === 'sms') {
        result = await phoneRecoveryService.sendSMSCode(email);
      } else {
        result = await phoneRecoveryService.sendVoiceCode(email);
      }

      if (result.success) {
        setSuccess('Código reenviado exitosamente.');
        setTimeLeft(60);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error reenviando código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/login"
              className="inline-flex items-center text-amber-700 hover:text-amber-800 transition mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver al Login
            </Link>
            <h1 className="text-2xl font-bold text-amber-900">
              Recuperar Contraseña
            </h1>
            <p className="text-amber-700 mt-2">
              Usa tu teléfono para recuperar el acceso a tus recetas
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'email' ? 'bg-amber-500 text-white' : 
                ['method', 'code', 'success'].includes(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-8 h-1 ${
                ['method', 'code', 'success'].includes(step) ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'method' ? 'bg-amber-500 text-white' : 
                ['code', 'success'].includes(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`w-8 h-1 ${
                ['code', 'success'].includes(step) ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'code' ? 'bg-amber-500 text-white' : 
                step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Step 1: Email Input */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label className="block text-amber-900 font-medium mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="tu@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Verificando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Method Selection */}
            {step === 'method' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-900 text-center mb-6">
                  Elige cómo recibir tu código
                </h3>

                <button
                  onClick={() => handleMethodSelect('sms')}
                  disabled={loading}
                  className="w-full p-4 border-2 border-amber-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition disabled:opacity-50 flex items-center"
                >
                  <MessageSquare size={24} className="text-green-500 mr-4" />
                  <div className="text-left">
                    <div className="font-medium text-amber-900">SMS</div>
                    <div className="text-sm text-amber-700">Recibe un código por mensaje de texto</div>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelect('voice')}
                  disabled={loading}
                  className="w-full p-4 border-2 border-amber-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition disabled:opacity-50 flex items-center"
                >
                  <Phone size={24} className="text-purple-500 mr-4" />
                  <div className="text-left">
                    <div className="font-medium text-amber-900">Llamada Telefónica</div>
                    <div className="text-sm text-amber-700">Te llamamos con tu código de verificación</div>
                  </div>
                </button>

                {loading && (
                  <div className="text-center py-4">
                    <Loader className="animate-spin mx-auto mb-2" size={24} />
                    <p className="text-amber-700">Enviando código...</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Code Input */}
            {step === 'code' && (
              <form onSubmit={handleCodeSubmit}>
                <div className="text-center mb-6">
                  <Shield size={48} className="text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-amber-900">
                    Ingresa tu código de verificación
                  </h3>
                  <p className="text-amber-700 text-sm mt-2">
                    Código enviado a {maskedPhone}
                  </p>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 text-center text-2xl font-mono rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition font-medium disabled:opacity-50 flex items-center justify-center mb-4"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Verificando...
                    </>
                  ) : (
                    'Verificar Código'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timeLeft > 0 || loading}
                  className="w-full text-amber-600 hover:text-amber-700 transition disabled:opacity-50 flex items-center justify-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  {timeLeft > 0 ? `Reenviar en ${timeLeft}s` : 'Reenviar código'}
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-amber-900 mb-4">
                  ¡Código Verificado!
                </h3>
                <p className="text-amber-700 mb-6">
                  Se ha enviado un enlace de recuperación a tu correo electrónico. 
                  Revisa tu bandeja de entrada para restablecer tu contraseña.
                </p>
                <Link
                  to="/login"
                  className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
                >
                  Ir al Login
                </Link>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && step !== 'success' && (
              <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center">
                <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                {success}
              </div>
            )}
          </div>

          {/* Alternative Methods */}
          {step === 'email' && (
            <div className="mt-6 text-center">
              <p className="text-amber-700 text-sm mb-2">¿Prefieres otro método?</p>
              <Link
                to="/password-recovery-info"
                className="text-amber-600 hover:text-amber-700 transition text-sm"
              >
                Ver todos los métodos de recuperación
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneRecoveryPage;