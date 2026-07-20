// ---------------------------------------------------------------------------
// Site content model. Single source of truth for the portfolio.
// Consumed by build.mjs to generate the static homepage + case study pages.
// ---------------------------------------------------------------------------

export const site = {
  name: "Lucia Scott",
  role: "Senior Product Designer",
  bio:
    "Product Designer with 5+ years owning complex B2C products end-to-end " +
    "across native mobile and web. Data-driven, AI-forward, and collaborative " +
    "with product & engineering, focused on shipping real, measurable impact.",
  email: "luciaparkscott@gmail.com",
  linkedinLabel: "linkedin.com/in/luciaparkscott",
  linkedinUrl: "https://www.linkedin.com/in/luciaparkscott",
  resumeUrl: "#resume",
  intro: "Product design that ships real, measurable impact — across native mobile and web.",
  stats: [
    { value: "+14.2%", label: "YoY app revenue from a redesigned merchant & offer experience" },
    { value: "+447%", label: "Growth in average daily customer profile completions" },
    { value: "+117%", label: "YoY lift in push notification opt-ins through onboarding" },
  ],
  testimonial: {
    quote:
      "Lucia's made huge contributions to the VoucherCodes app… particularly with " +
      "redesigning our discovery and sharing experiences. She's brilliant at working " +
      "cross-functionally with product and engineering and her customer-led approach " +
      "ensures we're always concentrating on solving the biggest customer pain points.",
    author: "VP Product, VoucherCodes",
  },
};

// Ordered exactly as listed in the case-study index.
// layout: "full" cards carry device mockups; "half" cards pair up as text tiles.
export const caseStudies = [
  {
    slug: "merchant-offer-redesign",
    layout: "full",
    mockup: "offer",
    title: "Driving +14.2% YoY revenue through a redesigned merchant and offer experience",
    cardDescription:
      "Redesigning the core screens for the app to earn its place as the primary channel for users and merchants.",
    subtitle: "Compounding growth by design: +47% merchant sales, +28% session frequency",
    summary:
      "A full redesign of the merchant page and offer detail screens that turned the app into a " +
      "high-performing commercial channel — driving +14.2% YoY revenue, +47% merchant sales, and " +
      "double-digit month-on-month growth across installs, sessions, and conversion.",
    heroMetric: { value: "+14.2%", label: "YoY app revenue" },
    overview: [
      ["Initiative", "Merchant page & offer detail screen redesign"],
      ["Focus", "Engagement, activation, retention"],
      ["Surface", "App (iOS & Android)"],
      ["Timeline", "2025"],
      ["Role", "Product Design (lead)"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "The merchant page and offer detail screens are the beating heart of the app — they're where users decide whether an offer is worth acting on. But the existing experience was holding us back on multiple fronts.",
        ],
        bullets: [
          "Discoverability was poor. Offers sat inside a dense layout that made scanning slow and redemption steps unclear, eroding user trust at the moment of decision.",
          "Browsing was high-friction. Users had to commit to a full page view to assess each offer, creating unnecessary back-and-forth and dropping engagement.",
          "No retention hooks. There was no way for users to save, favourite, or return to brands they cared about — a missed retention lever confirmed by earlier user testing.",
          "No built-in growth loop. Sharing — one of the most natural behaviours around a deal — wasn't supported in the flow, so organic acquisition was leaking out of the product.",
        ],
        closer:
          "The underlying opportunity: redesign the core screens so the app earns its place as the primary channel for users and merchants.",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Ground the redesign in evidence", p: "Started from prior user testing and interview insights that pointed clearly to two behavioural needs: users wanted to browse faster and come back to brands they liked. These anchored every subsequent design decision." },
          { h: "Raise the craft bar", p: "An intentional push to raise the design ceiling of the app — drawing on leading consumer products, particularly Airbnb's use of micro-interactions and motion, so the app would feel as good as it performed." },
          { h: "Redesign the merchant page", p: "Introduced merchant imagery to anchor brand recognition, added brand favouriting at the merchant level as a lightweight retention mechanic grounded in research, and cleaned up hierarchy so a merchant's offering scans in seconds." },
          { h: "Redesign the offer detail screen", p: "A cleaner, more focused layout, a new half-offer overlay so users can preview offers without leaving the merchant page, explicit redemption steps to build trust, and embedded sharing to feed the referral growth loop." },
          { h: "Ship, measure, iterate", p: "Worked closely with engineering to land the redesign with the motion and polish we'd scoped — then monitored weekly active users, activation rate, and session frequency as leading indicators." },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        table: {
          head: ["Metric", "Impact"],
          rows: [
            ["App revenue (YoY)", "+14.2%"],
            ["Merchant sales via the app", "+47%"],
            ["Installations (MoM)", "+19%"],
            ["Session frequency (MoM)", "+28%"],
            ["Conversion rate (MoM)", "+14%"],
          ],
        },
        bullets: [
          "The app is now a strategic channel, not a secondary one — double-digit month-on-month growth across installs, sessions, and conversion.",
          "A referral growth loop is baked into the product; sharing is part of how users naturally engage with offers.",
          "A new bar for craft: motion, micro-interactions, and polish are now part of how the team ships, not just how it designs.",
        ],
      },
    ],
    reflections: [
      "Redesigning core commercial screens isn't about making them prettier — it's about removing friction at the exact moment users decide whether to act.",
      "Grounding favouriting in prior research was the unlock. We weren't guessing at a retention mechanic; we were building one users had already asked for.",
      "Pushing for Airbnb-calibre motion was worth it. Craft is a performance lever, not a cosmetic one — and the numbers back that up.",
    ],
  },

  {
    slug: "profile-completion",
    layout: "half",
    mockup: "profile",
    title: "Transforming customer data capture: +447% growth in profile completion",
    cardDescription:
      "Reframing profile completion as a behavioural moment — not a form — to turn anonymous visitors into known, personalisable customers.",
    subtitle: "From 1% to 7% completion, sustained through Q4",
    summary:
      "A behaviour-led redesign of customer profile completion that turned a low-engagement data " +
      "capture moment into a meaningful participation surface — driving a +447% increase in average " +
      "daily completions, 50,000+ in Q1 alone, and rates up from 1% to 7% by Q4.",
    heroMetric: { value: "+447%", label: "Average daily completions" },
    overview: [
      ["Initiative", "Customer profile completion redesign"],
      ["Surface", "Web (app rollout in planning)"],
      ["Timeline", "Launched Feb 2025; sustained through Q4"],
      ["Role", "Product Design (lead)"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "Profile completion is where we translate anonymous visitors into known, personalisable customers — and the old experience was barely doing that job. Completion sat at 1%, meaning 99% of users passed through our data capture moments without engaging at all.",
        ],
        bullets: [
          "No behavioural hook. Prompts were generic and static, with no reason to act now versus later (i.e. never).",
          "Poor perceived value. The ask was clear, but the why for the user wasn't — no framing of personalisation, better offers, or relevance.",
          "Dated UI patterns. The interface felt like an admin form bolted into the flow, not a considered moment in the journey.",
          "Downstream impact. Low completion meant weaker personalisation, weaker CRM targeting, and a weaker data foundation.",
        ],
        closer: "The opportunity: rethink profile completion as a behavioural moment, not a data capture form.",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Diagnose why users weren't completing", p: "Started with the behavioural question, not the UI one: why would a user stop what they're doing to share data about themselves? The old experience answered 'because we asked.' That was never going to move a 1% rate." },
          { h: "Apply behavioural design principles", p: "Rebuilt prompts around a clear, specific value exchange, reduced cognitive load, contextual timing, and lightweight progress cues that made continuing feel easier than abandoning." },
          { h: "Modernise the UI patterns", p: "Moved from form-style screens toward modern, considered prompts — lifting the visual craft to match the rest of the product and signal that this moment matters." },
          { h: "Ship, measure, extend", p: "Launched on web in February 2025 with clear success metrics, then watched completion climb from 1% to 7% through Q4. The sustained trajectory, not the initial spike, was the signal the redesign was compounding." },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        table: {
          head: ["Metric", "Impact"],
          rows: [
            ["Average daily completions", "+447%"],
            ["Total completions in Q1", "50,000+"],
            ["Completion rate (start of year → end of Q4)", "1% → 7%"],
          ],
        },
        bullets: [
          "A stronger data foundation — richer profiles directly improve personalisation, CRM targeting, and downstream experiences.",
          "Proof that behavioural design scales: one well-framed moment moved the needle 447%.",
          "A clear path to the app — web performance has de-risked the rollout, now actively in planning.",
        ],
      },
    ],
    reflections: [
      "Moving completion from 1% to 7% is a 7x multiplier on the data the rest of the business depends on. Data capture is a design problem, not a form problem.",
      "The biggest shift was framing: stop asking 'how do we improve the form?' and start asking 'why would a user want to do this right now?'",
      "Behavioural design compounds. The launch spike matters; the continued climb to 7% through Q4 is what proves the approach.",
    ],
  },

  {
    slug: "stories",
    layout: "half",
    mockup: "stories",
    title: "Launching Stories: up to +230% clickouts and a new premium merchant placement",
    cardDescription:
      "Bringing an Instagram-style Stories surface to the app — a flexible commercial and editorial canvas the whole business can use.",
    subtitle: "A new commercial and editorial surface inside the app",
    summary:
      "A new, Instagram-style Stories surface inside the app that unlocked a dedicated commercial " +
      "channel for merchants and drove double and triple-digit uplifts on clickouts, transactions, " +
      "merchant sales and revenue across featured offers in its first two weeks live.",
    heroMetric: { value: "+230%", label: "Peak clickout uplift, week one" },
    overview: [
      ["Initiative", "Stories — new app feature"],
      ["Partners", "Commercials, Partnerships, CRM, Engineering"],
      ["Surface", "App (home screen)"],
      ["Launched", "April 2025 (Phase 2 in pipeline)"],
      ["Role", "Product Design (lead)"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "The home screen is the first thing users land on — a strong surface for offer discovery, but fundamentally static. Every merchant placement looked the same, every campaign competed on the same template, and there was no native way to tell a richer visual story.",
        ],
        bullets: [
          "For merchants, placement options were limited and visually undifferentiated — weakening our commercial proposition.",
          "For users, the home screen lacked the visual variation, motion, and 'what's new today' signal that defines modern consumer apps.",
          "For internal teams, there was no flexible canvas for campaigns, editorial, or social-style assets — every new idea required engineering work.",
        ],
        closer: "The opportunity: create a new surface that works commercially, visually, and editorially — a flexible format the whole business could use.",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Define what Stories needed to do", p: "Framed Stories against three audiences from day one — a premium placement merchants would pay for, a familiar low-commitment browse for users, and a reusable canvas for internal campaigns and editorial." },
          { h: "Borrow the right pattern", p: "Stories is a well-understood pattern, so design effort concentrated on the parts that needed to be ours: the coin entry point, the offer framing inside each Story, and the clickout behaviour." },
          { h: "Design the system, not just the screens", p: "Home-screen coins as branded entry points, a full-bleed Story viewer with a single dominant CTA, a VC coin for in-house content, and a template system built to hand over to Commercials." },
          { h: "Ship, then stand up the operation", p: "I personally produced Story assets weekly, coordinating across Commercials and Partnerships, until the Stories admin tool and self-serve templates shipped — removing design as a bottleneck." },
          { h: "Measure against real behaviour", p: "Tracked clickouts, transactions, merchant sales and revenue weekly, with prior-week comparisons as the benchmark." },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        table: {
          head: ["Offer", "Signal"],
          rows: [
            ["Nike (coin position 1→2)", "+230% clickouts"],
            ["MyProtein", "+167% clickouts, +45% revenue"],
            ["Deliveroo", "+90% clickouts, +186% transactions"],
            ["New Look", "£2,986 merchant sales from 52 clickouts"],
          ],
        },
        bullets: [
          "A new commercial product — a premium, visually differentiated placement for Commercials to sell, with performance data to sell it with.",
          "Data-backed merchandising levers: coin position and offer strength are now understood, negotiable variables.",
          "A scalable operation — the admin tool and self-serve templates made Stories a repeatable, weekly-cadence product.",
        ],
      },
    ],
    reflections: [
      "The strongest decision was treating Stories as a system from day one — coin, viewer, template, handover — which is why it scaled off the design team instead of depending on it.",
      "Coin position behaving like a merchandising lever turned a visual decision into a commercial one, and handed Commercials something to negotiate with.",
      "Producing weekly assets myself for months wasn't glamorous, but it kept the feature performing long enough to prove itself — and taught us how to design the admin tool properly.",
    ],
  },

  {
    slug: "push-optins-onboarding",
    layout: "full",
    mockup: "onboarding",
    title: "Lifting push opt-ins +117% YoY through onboarding optimisation",
    cardDescription:
      "A data-driven onboarding iteration that questioned every assumption — and let behaviour, not opinion, guide the design.",
    subtitle: "Sometimes the most impactful design decision is removing a screen",
    summary:
      "A data-driven onboarding iteration that lifted push notification opt-ins by 15% overall and " +
      "117% year-on-year, by questioning assumptions and letting behaviour guide the design.",
    heroMetric: { value: "+117%", label: "YoY push opt-in rate" },
    overview: [
      ["Initiative", "Onboarding optimisation — DealFinder push opt-in"],
      ["Partners", "CRM team"],
      ["Surfaces", "App & Web onboarding"],
      ["Timeline", "July 2025 – November 2025"],
      ["Role", "Product Design"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "Push notifications are one of our most valuable retention levers, but opt-in rates during onboarding were underperforming. The DealFinder install screen — the gateway to push opt-ins — had a clear friction point.",
        ],
        bullets: [
          "Copy wasn't landing. The value proposition didn't connect strongly enough with user intent at that moment in the flow.",
          "Drop-off was invisible. Without historical behavioural data, we couldn't see where users fell out or benchmark year-on-year.",
          "A hidden leak. 25% of users who tapped through to set up DealFinder never came back to complete onboarding.",
        ],
        closer: "The underlying question: was this screen actually earning its place in the flow?",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Copy iteration (July)", p: "Partnered closely with CRM to rewrite the install screen copy — from a generic 'stay informed' framing to a benefit-led, urgency-driven message tied directly to deals. Result within 5 days: +57% opt-in rate." },
          { h: "Behavioural audit (Aug–Oct)", p: "With Snowplow in place, we could look at onboarding with proper attribution for the first time — and found that 25% of users who clicked into DealFinder setup never returned. That reframed the problem entirely." },
          { h: "Remove the screen entirely (Nov)", p: "Rather than keep optimising a screen that was creating drop-off, we removed it from onboarding and surfaced DealFinder later, in a more contextually relevant moment — validated against year-on-year data." },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        table: {
          head: ["Metric", "Impact"],
          rows: [
            ["Opt-ins from copy change (5 days)", "+57%"],
            ["Overall push opt-in lift (combined)", "+15%"],
            ["Year-on-year push opt-in rate", "+117%"],
          ],
        },
        bullets: [
          "A more data-driven onboarding practice — Snowplow-enabled YoY comparisons are now the baseline for evaluating changes.",
          "A sharper editorial bar — CRM and design moving together on copy proved how much leverage a few words carry.",
          "Permission to remove, not just add — the biggest win came from deleting a screen, a pattern now applied elsewhere.",
        ],
      },
    ],
    reflections: [
      "The best opt-in rate is one users actually want to give. Copy that speaks to intent beats copy that speaks about features.",
      "Sometimes the most impactful design decision is removing a screen — only visible once we finally had the data to see the 25% drop-off.",
      "Close partnership with CRM was the force multiplier: design and copy moving together, backed by analytics.",
    ],
  },

  {
    slug: "loyalty-rewards",
    layout: "full",
    mockup: "stamp",
    title: "Simplifying loyalty rewards: transaction tracker & wallet redesign",
    cardDescription:
      "Turning a fragmented rewards experience into a single, visual, trust-building surface — anchored on a familiar stamp-card model.",
    subtitle: "A cornerstone of the broader VIP proposition",
    summary:
      "A co-led redesign of the VIP transaction tracker that took a confusing, fragmented rewards " +
      "experience and turned it into a single, visual, trust-building surface — with a full supporting " +
      "cast of wallet, accounts, and merchant page designs delivered across the year.",
    heroMetric: { value: "Stamp card", label: "A familiar mental model for progress" },
    overview: [
      ["Initiative", "VIP transaction tracker (+ wallet, accounts, merchant pages)"],
      ["Platform", "Web"],
      ["Partners", "Product, Engineering, Commercials, CRM, Ops"],
      ["Launched", "Mid-2025 (soft launch → full rollout)"],
      ["Role", "Co-lead Product Design"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "Rewards are now core to the VIP proposition — users have to become VIPs to access them across web, app, and DealFinder. That makes the tracker one of the most important surfaces in the product: it's where users see progress and decide whether to keep going. The existing experience wasn't doing that job.",
        ],
        bullets: [
          "Transactions were fragmented and illogical, buried in the account with no clear structure.",
          "Reward and 'Shop Twice, Earn £5' tracking sat apart, forcing users to piece together their own view of progress.",
          "Key information was buried in FAQs, driving customer queries and eroding trust.",
          "No onboarding — new VIPs were dropped into a complex system with no guidance.",
        ],
        closer: "The opportunity: consolidate, simplify, and visualise — make progress feel tangible and the rules of the loyalty programme obvious.",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Co-lead across the business", p: "The tracker touches Product, Engineering, Commercials, CRM, and Ops — every reward has commercial, operational, and technical rules. Co-led through a sustained rhythm of group calls and cross-functional syncs." },
          { h: "Reframe transactions as a dedicated surface", p: "Grouped transactions into a dedicated tab — a single place users go to see progress. That one structural decision unlocked most of the design opportunities downstream." },
          { h: "Borrow the stamp-card mental model", p: "Designed the core progress view around a coffee-shop-style stamp card — instantly legible, motivating, and scalable across both Reward and 'Shop Twice, Earn £5' tracking." },
          { h: "Design detailed transaction screens", p: "Dedicated detail screens for VIP and Reward shops showing status, the qualifying gift card, and original offer T&Cs — so everything users need is on the screen, not buried elsewhere." },
          { h: "Design onboarding as part of the product", p: "A new onboarding flow that walks users through how tracking works, surfacing what had lived in FAQs — reducing queries and speeding activation." },
          { h: "Soft launch, then scale", p: "A staged rollout — soft launch first, then broader comms and full rollout — with the same thinking feeding the new rewards system across H2 2025–H1 2026." },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        bullets: [
          "Unified tracking — Reward and 'Shop Twice, Earn £5' progress in one place for the first time.",
          "A dedicated VIP transactions tab using the stamp-card pattern, making progress visible at a glance.",
          "Detailed transaction screens and a new onboarding flow that surfaces information previously buried in FAQs.",
          "Alongside the tracker: delivered hi-fi wallet designs and a prototype in under 5 days, presented to the SVP and General Manager.",
        ],
      },
    ],
    reflections: [
      "The best decision wasn't visual — it was giving transactions their own surface. Once that was true, the stamp card, detail screens, and onboarding all became obvious next steps.",
      "Borrowing the coffee-shop stamp card punched above its weight — a pattern users already understand, so the design could focus on making progress feel rewarding.",
      "Co-leading a project with this many stakeholders is a design discipline in itself. The syncs weren't a tax on the work — they were the work.",
    ],
  },

  {
    slug: "app-strategy-facilitation",
    layout: "half",
    mockup: "workshop",
    title: "Aligning the business on app strategy through hands-on facilitation",
    cardDescription:
      "Two co-led, cross-functional workshops that turned scattered stakeholder input into a tested prototype and a shared product vision.",
    subtitle: "Where cross-functional alignment is the deliverable, not a side effect",
    summary:
      "Two co-led, cross-functional workshops that aligned the business on app vision and strategy — " +
      "turning diverse stakeholder input into a tested prototype, a shared product vision, and the " +
      "foundation for the app roadmap.",
    heroMetric: { value: "21", label: "Stakeholders aligned across two workshops" },
    overview: [
      ["Initiative", "App strategy & alignment through facilitation"],
      ["Formats", "4-day design sprint + full-day strategy session"],
      ["Participants", "10 + 11 across both workshops"],
      ["Outputs", "Tested prototype, H1 roadmap input, product vision"],
      ["Role", "Co-facilitator / Product Design"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "The app sits at the intersection of Commercials, CRM, Partnerships, Engineering, Product, and Design — its biggest strength and its biggest risk. Without deliberate moments to align, the team ends up pulled in different directions.",
        ],
        bullets: [
          "Competing priorities pulling the roadmap in different directions.",
          "Hypotheses and insights scattered across teams with no shared canvas to compare or prioritise them.",
          "Slow, linear decision-making where direction emerges over weeks of meetings rather than being set intentionally.",
          "A roadmap that reflects the loudest voices rather than the strongest evidence.",
        ],
        closer: "The opportunity: create deliberate, high-intensity moments where cross-functional alignment is the deliverable, not a side effect.",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Workshop 1 — 4-day design sprint (10 people)", p: "Co-led a structured, time-boxed sprint from problem framing to a tested prototype in four days: Frame, Ideate & prototype, then Test with real users. The prototype was refined post-sprint and directly contributed to the H1 roadmap." },
          { h: "Workshop 2 — full-day strategy session (11 people)", p: "Co-led an in-office session grounded in existing research and hypotheses, clustering challenges and high-impact ideas into themes the group could prioritise — producing a shared product vision the team could point back to." },
          { h: "What co-facilitation unlocked", p: "Shared ownership of the outcome, better facilitation in the room (one runs the session, two can read it), and a repeatable model: ground in evidence, time-box, converge on action." },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        bullets: [
          "Roadmap influence — the sprint prototype shaped the H1 roadmap; the strategy session shaped the phase that followed.",
          "A shared language across the business — stakeholders from 11 perspectives left with the same vision and priorities.",
          "Facilitation established as a core team practice, and evidence-led prioritisation that removed 'loudest voice wins.'",
        ],
      },
    ],
    reflections: [
      "The output of a good workshop isn't the Miro board — it's what gets built afterwards. Both of these show up in the roadmap and in shipped work.",
      "Co-leading made both workshops better: it shared the cognitive load and modelled the cross-functional partnership we were asking the group to adopt.",
      "Grounding every session in existing insight is what separates a strategy workshop from a brainstorm. The evidence turns alignment into conviction.",
    ],
  },

  {
    slug: "design-systems-nebula-gamora",
    layout: "half",
    mockup: "system",
    title: "Building design systems as leverage: Nebula and Gamora",
    cardDescription:
      "Rebuilding the app design system into Nebula and co-designing Gamora for Deals.com from the ground up — design as leverage for the whole business.",
    subtitle: "Make the right thing the easy thing",
    summary:
      "Led the redesign and restructure of the existing app design system into Nebula, and co-designed " +
      "Gamora from the ground up — the new design system for our sister site, Deals.com. Two systems, " +
      "one philosophy: make the right thing the easy thing, and turn design into leverage.",
    heroMetric: { value: "2 systems", label: "Nebula + Gamora, one shared DNA" },
    overview: [
      ["Initiative", "Design system redesign (Nebula) + new system from scratch (Gamora)"],
      ["Systems", "Nebula — VoucherCodes app DS 2.0 · Gamora — Deals.com DS"],
      ["Scope", "Tokens, components, patterns, documentation, adoption"],
      ["Role", "Lead (Nebula) · Co-lead (Gamora)"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "The existing app design system had grown organically over several years. It worked — but it was quietly costing the team speed, consistency, and accessibility.",
        ],
        bullets: [
          "Structural drift — components had diverged from the tokens beneath them, so the same decision existed in multiple places with different values.",
          "Unclear component APIs — variants and states weren't consistently named or structured.",
          "Theming was bolted on, not built in — dark mode, accessibility modes, and brand variants required bespoke work.",
          "Documentation gaps, and no shared foundation for the incoming sister site.",
        ],
        closer: "The opportunity: treat the system as a product — with users, a roadmap, and success metrics — built to hold up at scale.",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Rebuild the foundation first", p: "Started Nebula from the token layer up — colour, type, spacing, radius, elevation, motion — defined as the single source of truth and mapped cleanly between Figma variables and code, structured to support theming at scale without forking." },
          { h: "Redesign the component library", p: "Components with clear, consistent APIs that map 1:1 with engineering, flexible enough for real product needs but opinionated enough to enforce consistency by default, with a shared naming system across design and engineering." },
          { h: "Bake accessibility in at the foundation", p: "Treated WCAG compliance as a system property, not a per-screen checklist — contrast, focus states, keyboard support, and semantic structure inherited by every surface." },
          { h: "Ship documentation teams actually use", p: "Usage, anatomy, and do/don't guidance alongside each component, with live examples and code snippets at the point of need — reducing the cost of doing the right thing." },
          { h: "Governance & contribution", p: "A clear path for how components get proposed, reviewed, promoted, and deprecated — balancing central ownership with product-team input." },
          { h: "Co-design Gamora for Deals.com", p: "With Nebula stable, applied the same token architecture, component API model, and governance to build Gamora from the ground up — tuned to feel distinctly Deals.com while keeping the underlying model consistent." },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        bullets: [
          "Nebula — a redesigned system with a clean token layer, consistent component library, and accessibility by default.",
          "Gamora — a brand-new system for Deals.com, co-designed from scratch, reusing Nebula's structural principles.",
          "A streamlined Figma file structure with a Build / WIP split so teams always know what's shipped, building, or in discovery.",
          "A shared vocabulary and a governance model across design and engineering — speed, consistency across two brands, and accessibility as a default.",
        ],
      },
    ],
    reflections: [
      "A design system lives or dies on leverage. Every decision had to make the next hundred screens faster, more consistent, and more accessible — not just the one in front of us.",
      "Rebuilding from the token layer up was slower at the start and dramatically faster afterwards. You can't shortcut the foundation without paying for it later.",
      "Co-designing Gamora straight after Nebula is the clearest proof the system works: we didn't reinvent the wheel, we scaled it.",
    ],
  },

  {
    slug: "biind",
    layout: "full",
    mockup: "biind",
    title: "Biind: designing an alternative music platform from 0→1",
    cardDescription:
      "A 0→1 product: an alternative music platform for early-career artists, built from blank canvas to brand, hi-fi UI, and prototype.",
    subtitle: "Brand identity as the first product decision, not the last",
    summary:
      "A 0→1 product design project: built Biind — an alternative music platform for early-career " +
      "artists — from blank canvas to wireframes, brand guidelines, and a full hi-fidelity design system " +
      "across app and web app.",
    heroMetric: { value: "0→1", label: "Concept to prototype, sole designer" },
    overview: [
      ["Initiative", "Biind — alternative music platform for emerging artists"],
      ["Surfaces", "App + web app"],
      ["Scope", "Discovery → wireframes → brand → hi-fi UI → prototype"],
      ["Stage", "0→1"],
      ["Role", "Product Design (sole designer)"],
    ],
    sections: [
      {
        title: "Problem",
        accent: "orange",
        paras: [
          "The music industry is built around artists who already have momentum — the platforms, the algorithms, the discovery tools all reward scale. Artists at the start of their journey are left in a difficult middle ground: too small for the majors to surface, too far along to rely on local networks alone.",
        ],
        bullets: [
          "Discovery is broken at the bottom of the funnel — listeners who want to find new artists can't easily, and emerging artists can't easily be found.",
          "No purpose-built home for emerging work — existing platforms treat early-career artists as a smaller version of established ones.",
          "Brand identity is the first product decision, not the last — for a platform aimed at artists, the look, feel, and voice is the value proposition.",
        ],
        closer: "The opportunity: design Biind for emerging artists specifically — visually distinctive, behaviourally different, and credible enough that artists want to be on it.",
      },
      {
        title: "Process",
        accent: "blue",
        subsections: [
          { h: "Define the product before drawing anything", p: "Started with the strategic questions, not the screens: who Biind is for specifically, what it must do that Spotify, Apple Music, and SoundCloud don't do well for this audience, and the minimum surface area for a credible v1." },
          { h: "Wireframes — structure first", p: "Built the core flows in low fidelity to get the architecture right before any visual decisions — discovery, artist profile, onboarding (distinct journeys for listeners and artists), and playback and engagement." },
          { h: "Brand guidelines", p: "Developed Biind's brand from scratch as a core product layer — logo and wordmark, a palette differentiated from the green/black/white incumbents, a type system, and a confident, artist-first tone of voice." },
          { h: "Hi-fidelity UI across app and web app", p: "Brought wireframes and brand together into a full hi-fi system — native app and web app from the same foundation, reusable components from the start, and micro-interaction and motion thinking to give the product a feel." },
          { h: "Prototype", p: "Pulled the hi-fi designs into a working prototype so the product could be experienced, not just reviewed — where design moves from 'looks good' to 'feels right.'" },
        ],
      },
      {
        title: "Outcome",
        accent: "green",
        bullets: [
          "0→1 product design end-to-end — concept, structure, brand, UI, and prototype, owned across every layer with no team to lean on.",
          "Multi-surface thinking — app and web app designed from a shared foundation, so the experience holds up wherever the user lands.",
          "Brand as a product decision — identity treated as part of the value proposition, not an afterthought.",
          "Range — a counterpoint to the in-house product work: different domain, different audience, same design rigour.",
        ],
      },
    ],
    reflections: [
      "0→1 work changes the nature of the problem — no existing product to react to, no metrics to optimise against. Every decision is a first one. That's harder, and a lot more honest.",
      "Brand and UX aren't separable on a project like this — the brand decisions are product decisions, because they're what makes a user trust the product enough to spend time in it.",
      "Working without the safety net of an existing design system made me appreciate Nebula and Gamora more, not less. You feel the cost of every component you build by hand.",
    ],
  },
];
