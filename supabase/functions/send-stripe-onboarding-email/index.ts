import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  corsHeaders,
  signedAWSRequest,
  parseXMLValue,
  isAWSConfigured,
  EMAIL_CONFIG
} from "../_shared/aws-config.ts";

interface OnboardingEmailRequest {
  contactEmail: string;
  companyName: string;
  onboardingUrl: string;
  portalUrl?: string;
  adminEmail?: string;
  adminPassword?: string;
}

/**
 * Generate the HTML email template for Stripe Connect onboarding
 */
function generateOnboardingEmailHTML(data: OnboardingEmailRequest): string {
  const {
    companyName,
    onboardingUrl,
    portalUrl,
    adminEmail,
    adminPassword,
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Drive 247 - Complete Your Setup</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #223331 0%, #1a2826 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #E9B63E; font-size: 28px; font-weight: 700;">Welcome to Drive 247</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Your rental management platform is ready</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hello <strong>${companyName}</strong>,
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Your rental company account has been created on the Drive 247 platform. To start accepting payments from your customers, you need to connect your Stripe account.
              </p>

              <!-- Stripe Connect CTA -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center; border: 1px solid #e5e7eb;">
                <h2 style="margin: 0 0 15px; color: #223331; font-size: 20px;">Step 1: Connect Stripe</h2>
                <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px;">
                  Click the button below to set up your payment processing. This allows you to receive payments directly to your bank account.
                </p>
                <a href="${onboardingUrl}" style="display: inline-block; background-color: #635bff; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Connect Stripe Account
                </a>
                <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px;">
                  This link expires in 24 hours. You can request a new link from your portal settings.
                </p>
              </div>

              ${portalUrl && adminEmail && adminPassword ? `
              <!-- Portal Access -->
              <div style="background-color: #223331; border-radius: 8px; padding: 30px; margin: 30px 0;">
                <h2 style="margin: 0 0 15px; color: #E9B63E; font-size: 20px;">Step 2: Access Your Portal</h2>
                <p style="margin: 0 0 20px; color: #d1d5db; font-size: 14px;">
                  Use these credentials to log into your rental management portal:
                </p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #9ca3af; font-size: 14px; width: 100px;">Portal URL:</td>
                    <td style="padding: 8px 0;"><a href="${portalUrl}" style="color: #E9B63E; text-decoration: none; word-break: break-all;">${portalUrl}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${adminEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Password:</td>
                    <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${adminPassword}</td>
                  </tr>
                </table>
                <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px;">
                  Please change your password after your first login.
                </p>
              </div>
              ` : ''}

              <!-- What's Next -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #223331; font-size: 18px;">What happens next?</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                  <li>Complete the Stripe onboarding (takes about 5 minutes)</li>
                  <li>Add your vehicles to your fleet</li>
                  <li>Configure your pricing and settings</li>
                  <li>Start accepting bookings from customers</li>
                </ul>
              </div>

              <!-- Support -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  Need help? Reply to this email or contact our support team. We're here to help you get started.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Drive 247 - Car Rental Management Platform
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This email was sent to you because a rental company account was created for ${companyName}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of the email
 */
function generateOnboardingEmailText(data: OnboardingEmailRequest): string {
  const {
    companyName,
    onboardingUrl,
    portalUrl,
    adminEmail,
    adminPassword,
  } = data;

  let text = `
Welcome to Drive 247!

Hello ${companyName},

Your rental company account has been created on the Drive 247 platform. To start accepting payments from your customers, you need to connect your Stripe account.

STEP 1: CONNECT STRIPE
Click the link below to set up your payment processing:
${onboardingUrl}

This link expires in 24 hours. You can request a new link from your portal settings.
`;

  if (portalUrl && adminEmail && adminPassword) {
    text += `

STEP 2: ACCESS YOUR PORTAL
Portal URL: ${portalUrl}
Email: ${adminEmail}
Password: ${adminPassword}

Please change your password after your first login.
`;
  }

  text += `

WHAT'S NEXT?
- Complete the Stripe onboarding (takes about 5 minutes)
- Add your vehicles to your fleet
- Configure your pricing and settings
- Start accepting bookings from customers

Need help? Reply to this email or contact our support team.

---
Drive 247 - Car Rental Management Platform
`;

  return text.trim();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: OnboardingEmailRequest = await req.json();
    console.log('Stripe onboarding email request:', {
      to: request.contactEmail,
      company: request.companyName,
    });

    // Validate required fields
    if (!request.contactEmail || !request.companyName || !request.onboardingUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: contactEmail, companyName, onboardingUrl',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const htmlContent = generateOnboardingEmailHTML(request);
    const textContent = generateOnboardingEmailText(request);

    // Check if AWS is configured
    if (!isAWSConfigured()) {
      console.log('AWS not configured, simulating email send');
      console.log('To:', request.contactEmail);
      console.log('Subject: Welcome to Drive 247 - Complete Your Setup');
      console.log('Onboarding URL:', request.onboardingUrl);
      return new Response(JSON.stringify({
        success: true,
        simulated: true,
        messageId: 'simulated-' + Date.now()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `Welcome to Drive 247 - Complete Your Setup, ${request.companyName}`;

    // Build SES SendEmail request body
    const params: Record<string, string> = {
      'Action': 'SendEmail',
      'Version': '2010-12-01',
      'Source': EMAIL_CONFIG.fromEmail,
      'Destination.ToAddresses.member.1': request.contactEmail,
      'Message.Subject.Data': subject,
      'Message.Subject.Charset': 'UTF-8',
      'Message.Body.Html.Data': htmlContent,
      'Message.Body.Html.Charset': 'UTF-8',
      'Message.Body.Text.Data': textContent,
      'Message.Body.Text.Charset': 'UTF-8',
    };

    // URL encode parameters
    const body = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await signedAWSRequest({
      service: 'ses',
      method: 'POST',
      body,
    });

    const responseText = await response.text();
    console.log('SES Response Status:', response.status);

    if (!response.ok) {
      console.error('SES Error Response:', responseText);
      const errorMessage = parseXMLValue(responseText, 'Message') || 'Unknown error';
      return new Response(JSON.stringify({
        success: false,
        error: errorMessage,
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messageId = parseXMLValue(responseText, 'MessageId');
    console.log('Stripe onboarding email sent successfully, MessageId:', messageId);

    return new Response(JSON.stringify({
      success: true,
      messageId: messageId || undefined,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-stripe-onboarding-email:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
