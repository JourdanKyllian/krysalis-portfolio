"use server";

import { Resend } from 'resend';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateTicketId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function sendEmail(formData: FormData) {
  // 1. Mécanisme Honeypot anti-bot
  const honeyPot = formData.get("company_tax_id") as string;
  if (honeyPot && honeyPot.trim() !== '') {
    return { success: true }; 
  }

  // 2. Vérification de la cohérence temporelle
  const formTimestamp = formData.get("form_timestamp") as string;
  if (formTimestamp) {
    const loadTime = parseInt(formTimestamp, 10);
    const now = Date.now();
    if (now - loadTime < 3000) {
      return { 
        success: false, 
        error: "Soumission trop rapide. Veuillez prendre le temps de rédiger votre message." 
      };
    }
  }

  const name = (formData.get("name") as string || '').trim();
  const email = (formData.get("email") as string || '').trim();
  const type = formData.get("type") as string; 
  const message = (formData.get("message") as string || '').trim();

  if (!name || !email || !message) {
    return { success: false, error: "Tous les champs obligatoires doivent être renseignés." };
  }
  if (name.length > 60 || message.length > 2000) {
    return { success: false, error: "La taille des champs texte dépasse les limites autorisées." };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Le format de l'adresse e-mail est invalide." };
  }

  // 3. Évaluation Rate Limiting sur 7 jours
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  if (supabase) {
    try {
      const { count, error: countError } = await supabase
        .from('form_rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', oneWeekAgo.toISOString());

      if (countError) throw countError;

      if (count && count >= 2) {
        return { 
          success: false, 
          error: "Limite de contact atteinte pour cette semaine (maximum 2 messages autorisés)." 
        };
      }
    } catch (dbError) {
      console.error("Erreur d'interrogation du composant de sécurité Supabase :", dbError);
    }
  }

  const formattedMessage = message.replace(/\n/g, '<br />');
  // Prefix 'KS' pour Krysalis Studio
  const ticketId = `KS-${generateTicketId()}`;
  const adminEmail = 'bonjour@krysalis-studio.fr';

  try {
    // Dispatch vers Océane (Admin)
    const { error: errorAdmin } = await resend.emails.send({
      from: 'Krysalis Studio <contact@krysalis-studio.fr>', // Remplace par ton domaine vérifié sur Resend
      to: adminEmail, 
      replyTo: email, 
      subject: `[${ticketId}] Nouvelle demande : ${type} - ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #02044d; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #efca5e; margin-top: 0;">Nouveau projet d'intérieur ! ✨</h2>
          <p style="font-size: 11px; color: #999;">Référence : ${ticketId} | IP : ${ip}</p>
          <p>Nouvelle demande de la part de <strong>${name}</strong>.</p>
          <p>Nature du projet (<strong>${type}</strong>) :</p>
          <blockquote style="background-color: #f8f9fa; border-left: 4px solid #efca5e; padding: 15px; color: #241407; font-style: italic; border-radius: 0 8px 8px 0; margin: 0 0 20px 0;">
            <p style="margin: 0;">${formattedMessage}</p>
          </blockquote>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 13px; color: #666; margin-bottom: 0;">
            <strong>Contact client :</strong><br/>
            Nom : ${name}<br/>
            Email : <a href="mailto:${email}" style="color: #010777;">${email}</a>
          </p>
        </div>
      `,
    });

    if (errorAdmin) return { success: false, error: "Le serveur SMTP distant a rejeté l'envoi." };

    // Accusé de réception pour le client
    await resend.emails.send({
      from: 'Krysalis Studio <contact@krysalis-studio.fr>',
      to: email, 
      replyTo: adminEmail, 
      subject: `[${ticketId}] Votre projet d'intérieur x Krysalis Studio`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #02044d; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #efca5e; margin-top: 0;">Bonjour ${name},</h2>
          <p style="font-size: 11px; color: #999;">Référence de votre demande : ${ticketId}</p>
          <p>Je vous confirme la bonne réception de votre demande concernant votre projet : <strong>${type}</strong>.</p>
          <p>Je prends le temps de lire tout cela avec attention et je reviens vers vous très vite pour en discuter.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="margin-bottom: 0;">À très bientôt,</p>
          <p style="margin-top: 5px;">
            <strong>Océane Gosset</strong><br/>
            <span style="color: #efca5e;">Krysalis Studio</span><br/>
            <a href="https://krysalis-studio.fr" style="color: #010777; text-decoration: none;">krysalis-studio.fr</a>
          </p>
        </div>
      `,
    });

    if (supabase) {
      await supabase.from('form_rate_limits').insert([{ ip_address: ip }]);
    }

    return { success: true };
  } catch (err) {
    console.error("Échec Server Action sendEmail :", err);
    return { success: false, error: "Une erreur critique est survenue sur l'infrastructure." };
  }
}
