#!/bin/bash

# Drive917-client Next.js Migration Completion Script
# This script completes the remaining page conversions

set -e

echo "🚀 Starting Next.js Migration Completion..."

# Create testimonials page
echo "Creating testimonials page..."
cp src/pages/Reviews.tsx src/app/testimonials/page.tsx
sed -i '' '1s/^/'\''use client'\'';\n\n/' src/app/testimonials/page.tsx
sed -i '' 's/const Testimonials = ()/export default function TestimonialsPage()/g' src/app/testimonials/page.tsx
sed -i '' '/^export default Testimonials;$/d' src/app/testimonials/page.tsx

# Create contact page
echo "Creating contact page..."
cp src/pages/Contact.tsx src/app/contact/page.tsx
sed -i '' '1s/^/'\''use client'\'';\n\n/' src/app/contact/page.tsx
sed -i '' 's/import { Link } from "react-router-dom";/import Link from "next\/link";/g' src/app/contact/page.tsx
sed -i '' 's/const Contact = ()/export default function ContactPage()/g' src/app/contact/page.tsx
sed -i '' '/^export default Contact;$/d' src/app/contact/page.tsx

echo "✅ Migration script completed!"
echo ""
echo "⚠️  Manual steps required:"
echo "1. Review and test each converted page"
echo "2. Convert remaining booking flow components"
echo "3. Create dynamic route for /fleet/[id]"
echo "4. Run 'npm run build' to verify"
echo ""
echo "📖 See MIGRATION_GUIDE.md for detailed instructions"
