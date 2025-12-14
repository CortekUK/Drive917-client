# Next.js Migration Progress

## Completed Tasks

### 1. Component Conversions
- ✅ Footer.tsx - Updated to use `next/link` and added 'use client'
- ✅ GDPRConsent.tsx - Updated to use `next/link` and added 'use client'
- ✅ Navigation.tsx - Already updated (mentioned as done)
- ✅ ScrollToTopOnNavigate.tsx - Already updated (mentioned as done)
- ✅ QueryClientProvider.tsx - Already created (mentioned as done)

### 2. App Router Pages Created
- ✅ src/app/fleet/page.tsx - Created from FleetPricing.tsx
- ✅ src/app/promotions/page.tsx - Created from Promotions.tsx

## Remaining Tasks

### 3. Components Still Using React Router
The following components still need conversion. Update them following this pattern:

**Pattern:**
```tsx
// OLD
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

// NEW
'use client';  // Add at top if using hooks/state/events

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// Replace usage:
// useNavigate() → useRouter()
// navigate('/path') → router.push('/path')
// useLocation() → usePathname()
```

**Components to convert:**
- src/components/Booking.tsx
- src/components/BookingVehicles.tsx
- src/components/BookingCheckout.tsx
- src/components/BookingCheckoutStep.tsx
- src/components/BookingPending.tsx
- src/components/BookingSuccess.tsx
- src/components/BookingCancelled.tsx
- src/components/FleetDetail.tsx
- src/components/NotFound.tsx

### 4. Pages to Create

Create the following pages by converting from their source files:

#### Simple Page Conversions
These pages mostly just need the page wrapper, 'use client', and Link updates:

```bash
# About Page
cp src/pages/About.tsx src/app/about/page.tsx
# Then update: Add 'use client', no react-router imports needed (already no Link usage)

# Contact Page  
cp src/pages/Contact.tsx src/app/contact/page.tsx
# Then update: Add 'use client', replace Link from react-router-dom with next/link

# Reviews (Testimonials) Page
cp src/pages/Reviews.tsx src/app/testimonials/page.tsx
# Then update: Add 'use client', no Link usage to update

# Fleet Detail (Dynamic Route)
# Create: src/app/fleet/[id]/page.tsx
# Use src/components/FleetDetail.tsx as source
# Make it a dynamic page with params prop

# Privacy
# Create: src/app/privacy/page.tsx  
# Use src/components/Privacy.tsx, add 'use client', update Links

# Terms
# Create: src/app/terms/page.tsx
# Use src/components/Terms.tsx, add 'use client', update Links

# FAQ
# Create: src/app/faq/page.tsx
# Use src/components/FAQ.tsx, add 'use client', update Links

# Veriff Callback
# Create: src/app/veriff-callback/page.tsx
# Use src/components/VeriffCallback.tsx, add 'use client', update navigation

# Not Found
# Create: src/app/not-found.tsx
# Use src/components/NotFound.tsx, add 'use client', update Links
```

#### Booking Flow Pages
```bash
# Booking Start
# Create: src/app/booking/page.tsx
# Use src/components/Booking.tsx, add 'use client', update navigation

# Booking Vehicles
# Create: src/app/booking/vehicles/page.tsx
# Use src/components/BookingVehicles.tsx, add 'use client', update navigation

# Booking Checkout
# Create: src/app/booking/checkout/page.tsx
# Use src/components/BookingCheckout.tsx, add 'use client', update navigation

# Booking Success
# Create: src/app/booking-success/page.tsx
# Use src/components/BookingSuccess.tsx, add 'use client', update navigation

# Booking Pending
# Create: src/app/booking-pending/page.tsx
# Use src/components/BookingPending.tsx, add 'use client', update navigation

# Booking Cancelled
# Create: src/app/booking-cancelled/page.tsx
# Use src/components/BookingCancelled.tsx, add 'use client', update navigation
```

## Key Migration Rules

1. **'use client' directive**: Add to top of ANY file that uses:
   - useState, useEffect, or any React hooks
   - Event handlers (onClick, onChange, etc.)
   - Browser APIs (localStorage, window, etc.)

2. **Imports to change:**
   ```tsx
   // OLD
   import { Link } from "react-router-dom";
   import { useNavigate, useLocation, useParams } from "react-router-dom";
   
   // NEW  
   import Link from "next/link";
   import { useRouter, usePathname, useParams } from "next/navigation";
   ```

3. **Usage changes:**
   ```tsx
   // OLD
   <Link to="/path">Text</Link>
   const navigate = useNavigate();
   navigate('/path');
   const location = useLocation();
   const path = location.pathname;
   
   // NEW
   <Link href="/path">Text</Link>
   const router = useRouter();
   router.push('/path');
   const pathname = usePathname();
   const path = pathname;
   ```

4. **Export changes:**
   ```tsx
   // OLD (in pages/)
   export default ComponentName;
   
   // NEW (in app/)
   export default function PageName() {
     return <ComponentName />;
   }
   ```

5. **Dynamic routes:**
   ```tsx
   // For /fleet/[id]/page.tsx
   export default function FleetDetailPage({ params }: { params: { id: string } }) {
     const vehicleId = params.id;
     // Use vehicleId in component
   }
   ```

## Quick Conversion Template

For each page file, use this template:

```tsx
'use client';  // Add if needed

// Update imports
import Link from "next/link";  // if using Link
import { useRouter, usePathname } from "next/navigation";  // if using navigation

// ... other imports from original component

// Wrap original component or convert inline
export default function PageName() {
  const router = useRouter();  // if using navigation
  const pathname = usePathname();  // if using location
  
  // Original component logic here
  
  return (
    // Original JSX here
  );
}
```

## Testing Checklist

After migration, test:
- [ ] All navigation links work
- [ ] Dynamic routes load correctly  
- [ ] Form submissions work
- [ ] Client-side state persists
- [ ] Browser APIs still function
- [ ] No console errors for missing 'use client'
- [ ] Build succeeds: `npm run build`

## Notes

- MobileActions.tsx doesn't use React Router, so no changes needed
- Most utility components don't need changes
- Focus on page components and navigation components
- Test each converted page before moving to next one
