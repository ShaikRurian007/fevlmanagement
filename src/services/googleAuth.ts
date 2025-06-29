// Google Authentication Service
import { jwtDecode } from 'jwt-decode';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

// Check if Google Client ID is configured
const isGoogleConfigured = (): boolean => {
  const configured = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id-here' && GOOGLE_CLIENT_ID.length > 0);
  
  if (configured) {
    console.log('✅ Google Authentication: Configured and ready');
  } else {
    console.warn('⚠️ Google Authentication: Not configured - missing REACT_APP_GOOGLE_CLIENT_ID');
  }
  
  return configured;
};

// Interface for Google JWT payload
interface GoogleJWTPayload {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

// Interface for user data extracted from Google
export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
}

// Declare google for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

class GoogleAuthService {
  private isInitialized = false;

  // Initialize Google Identity Services
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        console.log('✅ Google Auth already initialized');
        resolve();
        return;
      }

      console.log('🔄 Initializing Google Auth...');
      
      // Wait for Google script to load
      const checkGoogleLoaded = () => {
        if (window.google && window.google.accounts) {
          this.isInitialized = true;
          console.log('✅ Google Auth initialized successfully');
          resolve();
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };

      checkGoogleLoaded();
    });
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<GoogleUser> {
    // Check if Google is configured
    if (!isGoogleConfigured()) {
      const error = 'Google authentication is not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file.';
      console.error('❌', error);
      throw new Error(error);
    }

    console.log('🔐 Starting Google sign-in process...');
    await this.initialize();

    return new Promise((resolve, reject) => {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            try {
              console.log('✅ Google sign-in callback received');
              const user = this.handleGoogleResponse(response);
              console.log('👤 User authenticated:', {
                name: user.name,
                email: user.email,
                emailVerified: user.email_verified
              });
              resolve(user);
            } catch (error) {
              console.error('❌ Error in Google callback:', error);
              reject(error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Prompt for sign-in
        window.google.accounts.id.prompt((notification: any) => {
          console.log('🔔 Google prompt notification:', notification);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('⚠️ Google prompt not displayed, trying alternative method...');
            // Try alternative method if prompt is not displayed
            try {
              this.renderSignInButton();
            } catch (error: any) {
              console.error('❌ Failed to render sign-in button:', error);
              reject(new Error('Failed to display Google sign-in. Please try again.'));
            }
          }
        });
      } catch (error) {
        console.error('❌ Error initializing Google sign-in:', error);
        reject(error);
      }
    });
  }

  // Alternative: Render sign-in button (if prompt doesn't work)
  private renderSignInButton(): void {
    console.log('🔘 Rendering Google sign-in button...');
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'google-signin-button';
    buttonContainer.style.display = 'none'; // We'll trigger it programmatically
    document.body.appendChild(buttonContainer);

    window.google.accounts.id.renderButton(
      buttonContainer,
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
      }
    );

    // Programmatically click the button
    setTimeout(() => {
      const button = buttonContainer.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        console.log('🖱️ Programmatically clicking Google sign-in button');
        button.click();
      }
    }, 100);
  }

  // Handle Google response and extract user data
  private handleGoogleResponse(response: any): GoogleUser {
    try {
      console.log('🔍 Processing Google JWT response...');
      const credential = response.credential;
      const payload = jwtDecode<GoogleJWTPayload>(credential);

      const user: GoogleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        email_verified: payload.email_verified,
      };

      console.log('✅ Google JWT decoded successfully');
      return user;
    } catch (error) {
      console.error('❌ Error decoding Google JWT:', error);
      throw new Error('Failed to decode Google authentication response');
    }
  }

  // Sign out
  signOut(): void {
    console.log('🚪 Signing out from Google...');
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
      console.log('✅ Google sign-out completed');
    }
  }

  // Check if Google services are available
  isAvailable(): boolean {
    const available = !!(window.google && window.google.accounts);
    console.log('🔍 Google services available:', available);
    return available;
  }

  // Check if Google is configured
  isConfigured(): boolean {
    return isGoogleConfigured();
  }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService();
