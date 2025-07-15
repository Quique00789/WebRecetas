import { ref as dbRef, set, get, remove } from 'firebase/database';
import { database } from '../lib/firebase';

// Simulación de Twilio (en producción usar Twilio real)
class TwilioService {
  private accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  private authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  private phoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // En desarrollo, simular envío exitoso
      if (import.meta.env.DEV) {
        console.log(`SMS simulado enviado a ${to}: ${message}`);
        return true;
      }

      // En producción, usar Twilio real
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.phoneNumber,
          To: to,
          Body: message,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  async makeCall(to: string, message: string): Promise<boolean> {
    try {
      // En desarrollo, simular llamada exitosa
      if (import.meta.env.DEV) {
        console.log(`Llamada simulada a ${to}: ${message}`);
        return true;
      }

      // En producción, usar Twilio real
      const twimlMessage = `<Response><Say voice="alice" language="es-MX">${message}</Say></Response>`;
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.phoneNumber,
          To: to,
          Twiml: twimlMessage,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error making call:', error);
      return false;
    }
  }
}

export class PhoneRecoveryService {
  private twilioService = new TwilioService();

  // Generar código de 6 dígitos
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Formatear número de teléfono
  private formatPhoneNumber(phone: string): string {
    // Remover espacios y caracteres especiales
    const cleaned = phone.replace(/\D/g, '');
    
    // Agregar código de país si no lo tiene
    if (cleaned.length === 10) {
      return `+52${cleaned}`; // México
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`; // USA/Canadá
    }
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    return cleaned;
  }

  // Verificar si el usuario tiene teléfono registrado
  async getUserPhone(email: string): Promise<string | null> {
    try {
      const usersRef = dbRef(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        const user = Object.values(users).find((u: any) => u.email === email);
        return user?.phone || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user phone:', error);
      return null;
    }
  }

  // Enviar código por SMS
  async sendSMSCode(email: string): Promise<{ success: boolean; message: string; maskedPhone?: string }> {
    try {
      const phone = await this.getUserPhone(email);
      
      if (!phone) {
        return {
          success: false,
          message: 'No hay número de teléfono registrado para esta cuenta.'
        };
      }

      const code = this.generateCode();
      const formattedPhone = this.formatPhoneNumber(phone);
      
      // Guardar código temporalmente (expira en 10 minutos)
      const codeRef = dbRef(database, `recovery_codes/${email.replace('.', '_')}`);
      await set(codeRef, {
        code,
        method: 'sms',
        phone: formattedPhone,
        createdAt: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutos
        attempts: 0
      });

      // Enviar SMS
      const message = `Tu código de recuperación de Pastel Recipes es: ${code}. Válido por 10 minutos.`;
      const sent = await this.twilioService.sendSMS(formattedPhone, message);

      if (sent) {
        // Enmascarar número para mostrar al usuario
        const maskedPhone = formattedPhone.replace(/(\+\d{2})(\d{3})(\d{3})(\d{4})/, '$1***$3$4');
        
        return {
          success: true,
          message: 'Código enviado por SMS exitosamente.',
          maskedPhone
        };
      } else {
        return {
          success: false,
          message: 'Error enviando SMS. Intenta más tarde.'
        };
      }
    } catch (error) {
      console.error('Error in sendSMSCode:', error);
      return {
        success: false,
        message: 'Error interno. Intenta más tarde.'
      };
    }
  }

  // Enviar código por llamada
  async sendVoiceCode(email: string): Promise<{ success: boolean; message: string; maskedPhone?: string }> {
    try {
      const phone = await this.getUserPhone(email);
      
      if (!phone) {
        return {
          success: false,
          message: 'No hay número de teléfono registrado para esta cuenta.'
        };
      }

      const code = this.generateCode();
      const formattedPhone = this.formatPhoneNumber(phone);
      
      // Guardar código temporalmente
      const codeRef = dbRef(database, `recovery_codes/${email.replace('.', '_')}`);
      await set(codeRef, {
        code,
        method: 'voice',
        phone: formattedPhone,
        createdAt: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000),
        attempts: 0
      });

      // Hacer llamada
      const message = `Hola, tu código de recuperación de Pastel Recipes es: ${code.split('').join(', ')}. Repito: ${code.split('').join(', ')}. Este código es válido por 10 minutos.`;
      const called = await this.twilioService.makeCall(formattedPhone, message);

      if (called) {
        const maskedPhone = formattedPhone.replace(/(\+\d{2})(\d{3})(\d{3})(\d{4})/, '$1***$3$4');
        
        return {
          success: true,
          message: 'Te llamaremos en unos segundos con tu código.',
          maskedPhone
        };
      } else {
        return {
          success: false,
          message: 'Error realizando llamada. Intenta más tarde.'
        };
      }
    } catch (error) {
      console.error('Error in sendVoiceCode:', error);
      return {
        success: false,
        message: 'Error interno. Intenta más tarde.'
      };
    }
  }

  // Verificar código ingresado
  async verifyCode(email: string, inputCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const codeRef = dbRef(database, `recovery_codes/${email.replace('.', '_')}`);
      const snapshot = await get(codeRef);

      if (!snapshot.exists()) {
        return {
          success: false,
          message: 'No hay código de recuperación activo para esta cuenta.'
        };
      }

      const data = snapshot.val();
      const now = Date.now();

      // Verificar expiración
      if (now > data.expiresAt) {
        await remove(codeRef);
        return {
          success: false,
          message: 'El código ha expirado. Solicita uno nuevo.'
        };
      }

      // Verificar intentos
      if (data.attempts >= 3) {
        await remove(codeRef);
        return {
          success: false,
          message: 'Demasiados intentos fallidos. Solicita un nuevo código.'
        };
      }

      // Verificar código
      if (data.code === inputCode) {
        await remove(codeRef);
        return {
          success: true,
          message: 'Código verificado correctamente.'
        };
      } else {
        // Incrementar intentos
        await set(codeRef, {
          ...data,
          attempts: data.attempts + 1
        });

        return {
          success: false,
          message: `Código incorrecto. Te quedan ${2 - data.attempts} intentos.`
        };
      }
    } catch (error) {
      console.error('Error in verifyCode:', error);
      return {
        success: false,
        message: 'Error verificando código. Intenta más tarde.'
      };
    }
  }

  // Limpiar códigos expirados (función de mantenimiento)
  async cleanExpiredCodes(): Promise<void> {
    try {
      const codesRef = dbRef(database, 'recovery_codes');
      const snapshot = await get(codesRef);

      if (snapshot.exists()) {
        const codes = snapshot.val();
        const now = Date.now();

        for (const [key, data] of Object.entries(codes)) {
          if (now > (data as any).expiresAt) {
            await remove(dbRef(database, `recovery_codes/${key}`));
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning expired codes:', error);
    }
  }
}

export const phoneRecoveryService = new PhoneRecoveryService();