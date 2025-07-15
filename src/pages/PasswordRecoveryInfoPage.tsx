import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  HelpCircle, 
  Shield, 
  Clock, 
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Smartphone,
  PhoneCall
} from 'lucide-react';

const PasswordRecoveryInfoPage: React.FC = () => {
  const recoveryMethods = [
    {
      id: 'email',
      title: 'Recuperación por Correo Electrónico',
      icon: <Mail size={32} className="text-blue-500" />,
      description: 'Recibe un enlace seguro en tu correo electrónico para restablecer tu contraseña.',
      process: [
        'Ingresa tu dirección de correo electrónico registrada',
        'Recibirás un enlace de restablecimiento en tu bandeja de entrada',
        'Haz clic en el enlace y crea una nueva contraseña',
        'Inicia sesión con tu nueva contraseña'
      ],
      advantages: [
        'Método más común y familiar',
        'Completamente gratuito',
        'Alta seguridad con enlaces temporales',
        'Funciona en cualquier dispositivo'
      ],
      disadvantages: [
        'Requiere acceso al correo electrónico',
        'Puede llegar a spam o promociones',
        'Depende de conexión a internet'
      ],
      security: 5,
      cost: 'Gratis',
      availability: 'Alta',
      speed: 'Media',
      currentlyAvailable: true
    },
    {
      id: 'sms',
      title: 'Recuperación por SMS',
      icon: <MessageSquare size={32} className="text-green-500" />,
      description: 'Recibe un código de verificación temporal en tu teléfono móvil.',
      process: [
        'Ingresa tu número de teléfono registrado',
        'Recibirás un código de 6 dígitos por SMS',
        'Ingresa el código en la página de verificación',
        'Crea tu nueva contraseña'
      ],
      advantages: [
        'Muy rápido y directo',
        'Funciona sin acceso a internet en el teléfono',
        'Alta tasa de entrega',
        'Familiar para la mayoría de usuarios'
      ],
      disadvantages: [
        'Requiere cobertura móvil',
        'Pequeño costo por SMS',
        'Puede tener retrasos ocasionales'
      ],
      security: 4,
      cost: '$0.01 por SMS',
      availability: 'Alta',
      speed: 'Rápida',
      currentlyAvailable: false
    },
    {
      id: 'phone',
      title: 'Recuperación por Llamada Telefónica',
      icon: <PhoneCall size={32} className="text-purple-500" />,
      description: 'Recibe una llamada automatizada con tu código de verificación.',
      process: [
        'Ingresa tu número de teléfono registrado',
        'Recibirás una llamada automatizada',
        'Escucha y anota el código de verificación',
        'Ingresa el código y crea tu nueva contraseña'
      ],
      advantages: [
        'Ideal cuando tienes las manos ocupadas cocinando',
        'Funciona sin internet en el teléfono',
        'Útil para personas con dificultades visuales',
        'Muy seguro'
      ],
      disadvantages: [
        'Costo más alto por llamada',
        'Puede ser bloqueado por operadores',
        'Requiere estar disponible para contestar'
      ],
      security: 5,
      cost: '$0.03 por llamada',
      availability: 'Media',
      speed: 'Media',
      currentlyAvailable: false
    },
    {
      id: 'security-questions',
      title: 'Preguntas de Seguridad Culinarias',
      icon: <HelpCircle size={32} className="text-orange-500" />,
      description: 'Responde preguntas personales relacionadas con cocina que configuraste al registrarte.',
      process: [
        'Selecciona "Preguntas de seguridad" en la página de recuperación',
        'Responde 2-3 preguntas sobre tus preferencias culinarias',
        'Si las respuestas son correctas, podrás crear una nueva contraseña',
        'Actualiza tus preguntas de seguridad si es necesario'
      ],
      advantages: [
        'No requiere dispositivos externos',
        'Preguntas temáticas sobre cocina',
        'Completamente gratuito',
        'Funciona sin conexión una vez configurado'
      ],
      disadvantages: [
        'Las respuestas pueden olvidarse',
        'Menos seguro que otros métodos',
        'Requiere configuración previa'
      ],
      security: 3,
      cost: 'Gratis',
      availability: 'Media',
      speed: 'Rápida',
      currentlyAvailable: false
    }
  ];

  const SecurityRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Shield
          key={i}
          size={16}
          className={i < rating ? 'text-green-500 fill-current' : 'text-gray-300'}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/login"
            className="inline-flex items-center text-amber-700 hover:text-amber-800 transition mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver al Login
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">
              Métodos de Recuperación de Contraseña
            </h1>
            <p className="text-lg text-amber-800">
              En <strong>Pastel Recipes</strong> ofrecemos múltiples formas seguras de recuperar el acceso a tu cuenta 
              y a todas tus recetas favoritas. Conoce las opciones disponibles y elige la que mejor se adapte a tus necesidades.
            </p>
          </div>
        </div>
      </div>

      {/* Methods Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {recoveryMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Method Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {method.icon}
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{method.title}</h3>
                      <div className="flex items-center mt-1">
                        {method.currentlyAvailable ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={12} className="mr-1" />
                            Próximamente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{method.description}</p>
              </div>

              {/* Method Details */}
              <div className="p-6">
                {/* Process */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">¿Cómo funciona?</h4>
                  <ol className="space-y-2">
                    {method.process.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Seguridad</div>
                    <SecurityRating rating={method.security} />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Costo</div>
                    <div className="flex items-center">
                      <DollarSign size={16} className="text-green-500 mr-1" />
                      <span className="text-sm font-medium">{method.cost}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Disponibilidad</div>
                    <div className="flex items-center">
                      <Smartphone size={16} className="text-blue-500 mr-1" />
                      <span className="text-sm font-medium">{method.availability}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Velocidad</div>
                    <div className="flex items-center">
                      <Clock size={16} className="text-purple-500 mr-1" />
                      <span className="text-sm font-medium">{method.speed}</span>
                    </div>
                  </div>
                </div>

                {/* Advantages & Disadvantages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-800 mb-2 flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      Ventajas
                    </h5>
                    <ul className="space-y-1">
                      {method.advantages.map((advantage, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-800 mb-2 flex items-center">
                      <XCircle size={16} className="mr-1" />
                      Desventajas
                    </h5>
                    <ul className="space-y-1">
                      {method.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-amber-900 mb-8 text-center">
            Comparación Rápida de Métodos
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-900">Método</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-amber-900">Seguridad</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-amber-900">Costo</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-amber-900">Velocidad</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-amber-900">Disponibilidad</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-amber-900">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recoveryMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {method.icon}
                          <span className="ml-3 font-medium text-gray-900">{method.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <SecurityRating rating={method.security} />
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{method.cost}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{method.speed}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{method.availability}</td>
                      <td className="px-6 py-4 text-center">
                        {method.currentlyAvailable ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={12} className="mr-1" />
                            Pronto
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            Recomendaciones para Usuarios de Pastel Recipes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 p-6 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-3">👨‍🍳 Para Cocineros Activos</h3>
              <p className="text-amber-800 text-sm mb-3">
                Si cocinas frecuentemente y tienes las manos ocupadas, recomendamos:
              </p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Recuperación por llamada telefónica</li>
                <li>• SMS como alternativa rápida</li>
                <li>• Configurar preguntas culinarias</li>
              </ul>
            </div>
            <div className="bg-white/80 p-6 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-3">📱 Para Usuarios Digitales</h3>
              <p className="text-amber-800 text-sm mb-3">
                Si prefieres métodos digitales y tienes acceso constante a dispositivos:
              </p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Recuperación por correo electrónico</li>
                <li>• SMS para acceso rápido</li>
                <li>• Login con Google como respaldo</li>
              </ul>
            </div>
            <div className="bg-white/80 p-6 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-3">🏠 Para Uso Familiar</h3>
              <p className="text-amber-800 text-sm mb-3">
                Si compartes recetas en familia o tienes usuarios de diferentes edades:
              </p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Preguntas de seguridad simples</li>
                <li>• Recuperación por correo</li>
                <li>• Llamada telefónica para mayores</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              ¿Necesitas Recuperar tu Contraseña Ahora?
            </h2>
            <p className="text-amber-800 mb-6">
              Actualmente ofrecemos recuperación por correo electrónico. 
              Más métodos estarán disponibles próximamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition"
              >
                Recuperar Contraseña por Email
              </Link>
              <Link
                to="/register"
                className="bg-white hover:bg-gray-50 text-amber-600 font-medium py-3 px-6 rounded-lg border border-amber-300 transition"
              >
                Crear Nueva Cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryInfoPage;