"use strict";exports.id=560,exports.ids=[560],exports.modules={10560:(a,b,c)=>{c.d(b,{BR:()=>g,Rv:()=>k,Sz:()=>l,TP:()=>o,ep:()=>n,kn:()=>h,s9:()=>i,tm:()=>j,vG:()=>m,y:()=>f});var d=c(21393),e=c(48180);let f=a=>(0,d.I)({queryKey:["cms-page-content",a],queryFn:async()=>{try{let{data:b,error:c}=await e.N.from("cms_pages").select(`
            id,
            slug,
            status,
            cms_page_sections(
              section_key,
              content,
              is_visible
            )
          `).eq("slug",a).eq("status","published").single();if(c){if("PGRST116"===c.code)return console.log(`No published CMS content for page: ${a}`),null;throw c}if(!b)return null;let d={};return b.cms_page_sections?.forEach(a=>{a.is_visible&&(d[a.section_key]=a.content)}),d}catch(a){return console.error("Error fetching CMS content:",a),null}},staleTime:3e5,retry:1}),g={hero:{title:"Contact Drive917",subtitle:"Get in touch for premium vehicle rentals, chauffeur services, and exclusive offers in Los Angeles."},contact_info:{phone:{number:"",availability:""},email:{address:"",response_time:"Response within 2 hours during business hours (PST)"},office:{address:""},whatsapp:{number:"",description:"Quick response for urgent enquiries"}},contact_form:{title:"Send Us a Message",subtitle:"We typically reply within 2 hours during business hours.",success_message:"Thank you for contacting Drive917. Our concierge team will respond within 2 hours during business hours (PST).",gdpr_text:"I consent to being contacted regarding my enquiry.",submit_button_text:"Send Message",subject_options:["General Enquiry","Corporate Rental","Vehicle Availability","Partnerships"]},trust_badges:{badges:[{icon:"shield",label:"Secure",tooltip:"Your data and booking details are encrypted and secure"},{icon:"lock",label:"Confidential",tooltip:"All information is kept strictly confidential"},{icon:"clock",label:"24/7 Support",tooltip:"Our concierge team is available around the clock"}]},seo:{title:"Contact Drive917 — Los Angeles Luxury Car Rentals",description:"Get in touch with Drive917 for premium vehicle rentals, chauffeur services, and exclusive offers in Los Angeles.",keywords:"contact Drive917, luxury car rental Los Angeles, premium vehicle rental contact, chauffeur service inquiry"},pwa_install:{title:"Install Drive917",description:"Scan the QR code to add Drive917 to your home screen for fast, seamless bookings in Los Angeles and beyond."}},h={hero:{title:"Customer Reviews",subtitle:"What our customers say about their vehicle rental experience."},feedback_cta:{title:"Would you like to share your experience?",description:"We value your feedback and would love to hear about your rental experience with Drive917.",button_text:"Submit Feedback",empty_state_message:"Be the first to share your Drive917 experience."},seo:{title:"Drive917 — Customer Reviews",description:"Read verified customer reviews of Drive917's luxury car rentals. Real experiences from our distinguished clientele.",keywords:"Drive917 reviews, luxury car rental reviews, customer testimonials, verified reviews"}},i={hero:{title:"About Drive917",subtitle:"Setting the standard for premium luxury vehicle rentals across the United Kingdom."},about_story:{title:"Excellence in Every Rental",founded_year:"2010",content:`<p>Drive917 was founded with a simple vision: to provide the highest standard of premium vehicle rentals with unmatched flexibility and service.</p>
<p>What began as a boutique rental service has grown into the trusted choice for executives, professionals, and discerning clients who demand the finest vehicles with exceptional service.</p>
<p>Our founders recognized the need for a rental service that truly understood the unique requirements of premium vehicle hire—offering flexible daily, weekly, and monthly rates without compromising on quality.</p>
<p>Discretion, reliability, and uncompromising quality became the pillars upon which Drive917 was built.</p>
<p>Drive917 operates a fleet of the finest vehicles, each maintained to the highest standards and equipped with premium amenities. From Rolls-Royce to Range Rover, every vehicle represents automotive excellence.</p>
<p>We offer flexible rental periods tailored to your needs—whether it's a day, a week, or a month, we provide premium vehicles with transparent pricing and exceptional service.</p>
<p>Our commitment extends beyond just providing vehicles. We ensure every rental includes comprehensive insurance, 24/7 support, and meticulous vehicle preparation.</p>
<p>We will never claim to be the biggest company — but what we are, is the pinnacle of excellence in luxury vehicle rentals.</p>
<p>This commitment creates a service that is second to none:</p>
<ul>
<li>Flexible daily, weekly, and monthly rental options</li>
<li>The finest luxury vehicles in the USA</li>
<li>Transparent pricing with no hidden fees</li>
<li>24/7 customer support and roadside assistance</li>
<li>Immaculate vehicles delivered to your door</li>
</ul>
<p>This is more than a rental service — it's a new standard in luxury vehicle hire.</p>`},stats:{items:[{icon:"clock",label:"YEARS EXPERIENCE",value:"",suffix:"+",use_dynamic:!0,dynamic_source:"years_experience"},{icon:"car",label:"RENTALS COMPLETED",value:"",suffix:"+",use_dynamic:!0,dynamic_source:"total_rentals"},{icon:"crown",label:"PREMIUM VEHICLES",value:"",suffix:"+",use_dynamic:!0,dynamic_source:"active_vehicles"},{icon:"star",label:"CLIENT RATING",value:"",suffix:"",use_dynamic:!0,dynamic_source:"avg_rating"}]},why_choose_us:{title:"Why Choose Us",items:[{icon:"lock",title:"Privacy & Discretion",description:"Your rental details remain completely private. We maintain strict confidentiality for all our distinguished clients."},{icon:"crown",title:"Premium Fleet",description:"From the Rolls-Royce Phantom to the Range Rover Autobiography, every vehicle represents British excellence and comfort."},{icon:"shield",title:"Flexible Terms",description:"Choose from daily, weekly, or monthly rental periods. Competitive rates with no hidden fees or surprises."},{icon:"clock",title:"24/7 Availability",description:"Whether weekday or weekend, we're ready to respond at a moment's notice — anywhere across the UK."}]},faq_cta:{title:"Still have questions?",description:"Our team is here to help. Contact us for personalised assistance.",button_text:"Call Us"},final_cta:{title:"Ready to Experience Premium Luxury?",description:"Join our distinguished clients and enjoy world-class vehicle rental service.",tagline:"Professional • Discreet • 24/7 Availability"},seo:{title:"About Drive917 — Premium Luxury Car Rentals",description:"Discover Drive917 — the UK's trusted name in premium car rentals, offering unmatched quality, flexibility, and discretion.",keywords:"about Drive917, luxury car rental UK, premium vehicle hire, executive car rental, luxury fleet"}},j={promotions_hero:{headline:"Promotions & Offers",subheading:"Exclusive rental offers with transparent savings.",primary_cta_text:"View Fleet & Pricing",primary_cta_href:"/fleet",secondary_cta_text:"Book Now"},how_it_works:{title:"How Promotions Work",subtitle:"Simple steps to save on your luxury car rental",steps:[{number:"1",title:"Select Offer",description:"Browse active promotions and choose your preferred deal"},{number:"2",title:"Choose Vehicle",description:"Select from eligible vehicles in our premium fleet"},{number:"3",title:"Apply at Checkout",description:"Discount automatically applied with promo code"}]},empty_state:{title_active:"No active promotions right now",title_default:"No promotions found",description:"Check back soon or browse our Fleet & Pricing.",button_text:"Browse Fleet & Pricing"},terms:{title:"Terms & Conditions",terms:["Promotions are subject to availability and vehicle eligibility","Discounts cannot be combined with other offers","Valid for new bookings only during the promotional period","Promo codes must be applied at the time of booking","Drive 917 reserves the right to modify or cancel promotions at any time","Standard rental terms and conditions apply"]},seo:{title:"Promotions & Offers | Drive 917 - Exclusive Luxury Car Rental Deals",description:"Exclusive deals on luxury car rentals with daily, weekly, and monthly rates. Limited-time Drive 917 offers with transparent savings.",keywords:"luxury car rental deals, car rental promotions, exclusive offers, discount car hire, Drive 917 deals"}},k={fleet_hero:{headline:"Fleet & Pricing",subheading:"Browse our premium vehicles with clear daily, weekly, and monthly rates.",background_image:"",primary_cta_text:"Book Now",secondary_cta_text:"View Fleet Below"},rental_rates:{section_title:"Flexible Rental Rates",daily:{title:"Daily",description:"Ideal for short stays and one-day hires."},weekly:{title:"Weekly",description:"Perfect balance of flexibility and value."},monthly:{title:"Monthly",description:"Exclusive long-term rates for regular clients."}},inclusions:{section_title:"Every Drive917 Rental Includes",section_subtitle:"Peace of mind and premium service come standard with every vehicle.",standard_title:"Standard Inclusions",standard_items:[{icon:"Shield",title:"Comprehensive Insurance Coverage"},{icon:"Phone",title:"24/7 Roadside Assistance"},{icon:"MapPin",title:"Unlimited Mileage"},{icon:"Fuel",title:"Full Tank of Premium Fuel"},{icon:"User",title:"Professional Vehicle Handover"},{icon:"Sparkles",title:"Vehicle Valeting & Cleaning"}],premium_title:"Premium Add-ons",premium_items:[{icon:"User",title:"Chauffeur Service (per hour)"},{icon:"Plane",title:"Airport Meet & Greet"},{icon:"User",title:"Additional Driver"},{icon:"MapPin",title:"GPS Navigation System"}]},extras:{items:[{name:"Child Safety Seat",price:15,description:"Per day"},{name:"Mobile WiFi Hotspot",price:10,description:"Per day"},{name:"Delivery & Collection",price:50,description:"Within 25 miles"},{name:"Extended Insurance",price:25,description:"Per day"}],footer_text:"All add-ons can be selected and customized during booking."},seo:{title:"Fleet & Pricing | Drive 917 - Premium Luxury Car Rentals",description:"Browse our exclusive fleet of luxury vehicles including Rolls-Royce, Bentley, and Range Rover. Transparent daily, weekly, and monthly rental rates.",keywords:"luxury car rental pricing, Rolls-Royce rental rates, premium vehicle hire, executive car rental"}},l={home_hero:{headline:"Reliable Car Rentals You Can Count On",subheading:"Quality vehicles. Transparent pricing. Exceptional service.",background_image:"",phone_number:"08001234567",phone_cta_text:"Call 0800 123 4567",book_cta_text:"Book Now",trust_line:"Premium Fleet • Flexible Rates • 24/7 Support"},promo_badge:{enabled:!0,discount_amount:"20%",discount_label:"OFF",line1:"When You Book",line2:"Online"},service_highlights:{title:"Why Choose Drive917",subtitle:"Delivering excellence through premium vehicle rentals and exceptional service.",services:[{icon:"ThumbsUp",title:"Outstanding Services",description:"Experience top-tier car rental services tailored for your convenience. Our well-maintained vehicles, transparent pricing, and seamless booking process ensure a hassle-free journey every time."},{icon:"Users",title:"Name for Quality Vehicles",description:"Our high-quality rental vehicles are regularly maintained to provide you with a smooth and reliable driving experience."},{icon:"MapPin",title:"GPS on Every Vehicle!",description:"Never lose your way with our built-in GPS navigation system. Every rental car comes equipped with GPS to ensure a smooth, stress-free journey."},{icon:"Baby",title:"Baby Chairs/Booster Seats",description:"Your child's safety is our priority! We provide baby chairs and booster seats to ensure a secure and comfortable ride for your little ones."},{icon:"Settings",title:"AT/MT Transmission",description:"Choose the driving experience that suits you best! We offer both Automatic (AT) and Manual (MT) transmission vehicles."},{icon:"Headphones",title:"24 Hours Support",description:"We're here for you anytime, anywhere! Our dedicated support team is available 24/7 to assist you with bookings, inquiries, and roadside assistance."}]},booking_header:{title:"Book Your Rental",subtitle:"Quick, easy, and affordable car rentals in Dallas — from pickup to drop-off, we've got you covered.",trust_points:["Dallas–Fort Worth Area","Transparent Rates","24/7 Support"]},testimonials_header:{title:"Why Dallas Drivers Choose Drive917"},home_cta:{title:"Ready to Book Your Dallas Rental?",description:"Quick, easy, and affordable car rentals across Dallas and the DFW area. Friendly service, transparent pricing, and clean vehicles every time.",primary_cta_text:"Book Now",secondary_cta_text:"Get in Touch",trust_points:["Reliable Service","Clean Vehicles","24/7 Support"]},contact_card:{title:"Have Questions About Your Rental?",description:"We're here to help 7 days a week. Reach out to our Dallas team for quick answers and booking support.",phone_number:"+19725156635",email:"info@drive917.com",call_button_text:"Call Now",email_button_text:"Email Us"},seo:{title:"Premium Luxury Car Rentals",description:"Rent premium luxury vehicles with Drive917. Flexible daily, weekly, and monthly rates. Top-tier fleet and exceptional service.",keywords:"luxury car rental, premium vehicle hire, exotic car rental, Dallas car rental"}},m={privacy_content:{title:"Privacy Policy",content:`<h2>Introduction</h2>
<p>Drive917 is committed to protecting your privacy and ensuring the security of your personal information. This policy outlines how we collect, use, and safeguard your data.</p>

<h2>Information We Collect</h2>
<p>We collect information necessary to provide our services, including:</p>
<ul>
<li>Contact details (name, email, phone number)</li>
<li>Booking information (pickup/drop-off locations, dates, times)</li>
<li>Payment information (processed securely through third-party providers)</li>
<li>Service preferences and special requirements</li>
</ul>

<h2>How We Use Your Information</h2>
<p>Your information is used exclusively for:</p>
<ul>
<li>Providing and managing our rental services</li>
<li>Processing bookings and payments</li>
<li>Communicating with you about your bookings</li>
<li>Improving our services based on your feedback</li>
<li>Complying with legal obligations</li>
</ul>

<h2>Data Security</h2>
<p>We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse. All data is encrypted both in transit and at rest.</p>

<h2>Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access your personal data</li>
<li>Correct inaccurate data</li>
<li>Request deletion of your data</li>
<li>Object to processing of your data</li>
<li>Data portability</li>
</ul>

<h2>Contact Us</h2>
<p>For any privacy-related questions or requests, please contact us at <a href="mailto:privacy@drive917.com">privacy@drive917.com</a></p>`,last_updated:new Date().toISOString().split("T")[0]},seo:{title:"Privacy Policy | Drive 917",description:"Learn about how Drive917 collects, uses, and protects your personal information.",keywords:"privacy policy, data protection, Drive917 privacy"}},n={terms_content:{title:"Terms of Service",content:`<h2>Service Agreement</h2>
<p>By booking our services, you agree to these terms and conditions. Drive917 reserves the right to modify these terms at any time, with changes effective immediately upon posting.</p>

<h2>Booking and Payment</h2>
<ul>
<li>All bookings are subject to availability</li>
<li>Payment is required at the time of booking unless credit terms have been agreed</li>
<li>Cancellations made less than 24 hours before pickup may incur a 50% cancellation fee</li>
<li>No-shows will be charged the full booking amount</li>
</ul>

<h2>Service Standards</h2>
<p>We are committed to providing the highest standards of service:</p>
<ul>
<li>All vehicles are maintained to the highest standards</li>
<li>Comprehensive insurance coverage is maintained on all vehicles</li>
<li>24/7 roadside assistance is included with every rental</li>
</ul>

<h2>Client Responsibilities</h2>
<ul>
<li>Provide accurate pickup and destination information</li>
<li>Be ready at the agreed pickup time</li>
<li>Treat our vehicles with respect</li>
<li>Report any issues immediately</li>
<li>Return the vehicle in the same condition as received</li>
</ul>

<h2>Liability</h2>
<p>While we take every precaution to ensure your safety and comfort, Drive917's liability is limited to the value of the service provided. We are not liable for delays caused by circumstances beyond our control, including traffic, weather, or road conditions.</p>

<h2>Confidentiality</h2>
<p>All client information is kept strictly confidential unless disclosure is required by law.</p>`,last_updated:new Date().toISOString().split("T")[0]},seo:{title:"Terms of Service | Drive 917",description:"Read the terms and conditions for Drive917 car rental services.",keywords:"terms of service, rental terms, Drive917 terms"}};new Date().getFullYear();let o=(a,b)=>a?{hero:a.hero||b.hero,contact_info:a.contact_info||b.contact_info,contact_form:a.contact_form||b.contact_form,trust_badges:a.trust_badges||b.trust_badges,seo:a.seo||b.seo,pwa_install:a.pwa_install||b.pwa_install,feedback_cta:a.feedback_cta||b.feedback_cta,about_story:a.about_story||b.about_story,stats:a.stats||b.stats,why_choose_us:a.why_choose_us||b.why_choose_us,faq_cta:a.faq_cta||b.faq_cta,final_cta:a.final_cta||b.final_cta,promotions_hero:a.promotions_hero||b.promotions_hero,how_it_works:a.how_it_works||b.how_it_works,empty_state:a.empty_state||b.empty_state,terms:a.terms||b.terms,fleet_hero:a.fleet_hero||b.fleet_hero,rental_rates:a.rental_rates||b.rental_rates,inclusions:a.inclusions||b.inclusions,extras:a.extras||b.extras,home_hero:a.home_hero||b.home_hero,promo_badge:a.promo_badge||b.promo_badge,home_cta:a.home_cta||b.home_cta,service_highlights:a.service_highlights||b.service_highlights,booking_header:a.booking_header||b.booking_header,testimonials_header:a.testimonials_header||b.testimonials_header,contact_card:a.contact_card||b.contact_card,privacy_content:a.privacy_content||b.privacy_content,terms_content:a.terms_content||b.terms_content,logo:a.logo||b.logo,site_contact:a.site_contact||b.site_contact,social:a.social||b.social,footer_settings:a.footer_settings||b.footer_settings}:b}};