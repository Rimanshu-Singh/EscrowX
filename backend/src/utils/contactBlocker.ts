/**
 * Helper to scan input text for contact information sharing.
 * Blocks: Phone numbers, WhatsApp, Telegram, Discord, emails, and external contact links.
 */
export function hasContactInfo(text: string): boolean {
  if (!text) return false;
  
  // 1. Email address regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  
  // 2. Phone number regex: matches standard phone formats
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  
  // To prevent posting raw digits for phone numbers (e.g. 9876543210)
  const consecutiveDigitsRegex = /\b\d{8,15}\b/;
  
  // 3. Social & messaging links/keywords
  const contactKeywordsRegex = /(whatsapp|telegram|discord|t\.me|wa\.me|discord\.gg|calendly|skype|zoom)/i;

  return emailRegex.test(text) || 
         phoneRegex.test(text) || 
         consecutiveDigitsRegex.test(text) || 
         contactKeywordsRegex.test(text);
}
