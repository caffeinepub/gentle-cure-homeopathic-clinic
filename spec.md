# Gentle Cure Homeopathic Clinic

## Current State
Empty Caffeine project (no App.tsx). Backend is an empty actor. The client's existing website at drkshitejbhati.com is a basic homeopathy clinic site.

## Requested Changes (Diff)

### Add
- Full professional website for Dr. Kshitej Bhati (homeopathic clinic) targeting international patients
- Hero section with compelling headline and CTA buttons (Book Consultation, Learn More)
- About the Doctor section with credentials, experience, and approach
- Services section: chronic diseases, online consultation, international patients
- How It Works section (3-step process)
- Testimonials carousel (patient stories)
- International Patient section with multi-currency fee display (INR / USD / EUR / GBP)
- Online consultation booking flow with Stripe payment integration
- Contact/Inquiry form with lead capture (name, email, phone, country, condition, message)
- Admin dashboard (protected) to view and manage all inquiry leads
- FAQ accordion section
- SEO meta tags, Open Graph, structured data (schema.org MedicalBusiness)
- Footer with social links, contact info, WhatsApp button
- Sticky navigation with smooth scroll
- Multi-currency toggle for international fee display
- WhatsApp floating button

### Modify
- N/A (fresh build)

### Remove
- Products section (not needed for a clinic)

## Implementation Plan
1. Backend: Store inquiries/leads with fields: name, email, phone, country, condition, message, timestamp, status
2. Backend: Admin can list all leads, update lead status, mark as contacted
3. Backend: Stripe payment session creation for online consultation booking
4. Frontend: Full multi-page single app with sections: Home, About, Services, How It Works, International Patients, Testimonials, FAQ, Contact
5. Frontend: Inquiry form submits to backend canister
6. Frontend: Admin view behind Internet Identity login
7. Frontend: Currency converter component showing fees in INR/USD/EUR/GBP
8. Frontend: Stripe checkout integration for consultation booking
9. Frontend: SEO meta tags in index.html
