import { KnowledgeDocument } from "@/src/types";

export const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-401',
    title: 'Kiambu & Murang’a Agricultural Corridor Strategic Assessment',
    type: 'Strategy Memo',
    category: 'Regional Strategy',
    date: '2026-08-28',
    fileSize: '3.4 MB',
    status: 'indexed',
    author: 'Grace Nyambura (Strategic Intel)',
    classification: 'Confidential',
    aiSummary: 'Comprehensive analytical brief on voter consolidation across 12 agricultural constituencies. Outlines specific policy levers: guaranteed coffee cherry advance payments, subsidized fertilizer logistics, and road upgrading promises. Identifies 14 key elders including Elder Josephat Kariuki.',
    keyTakeaways: [
      'Karuri and Banana Hill wards present highest volunteer pledge density in Kiambaa.',
      'Coffee farmers demand formal escrow audit guarantees for cooperative debt relief.',
      'Youth voter apathy in semi-urban fringe can be mitigated through sports tournament sponsorships.',
      'Recommend scheduling high-profile rally in Karuri town center before September 15.',
    ],
    tags: ['Strategy', 'Kiambu', 'Agriculture', 'Elders', 'Voter Turnout'],
    relatedPeopleIds: ['per-101', 'per-108'],
    relatedMeetingIds: ['mtg-201'],
    content: `EXECUTIVE SUMMARY: STRATEGIC CORRIDOR ANALYSIS (KIAMBU-MURANG'A)
1. REGIONAL DEMOGRAPHICS & ELECTORAL WEIGHT
Kiambu County represents 1.3M registered voters across 12 constituencies. The agrarian belt (Kiambaa, Githunguri, Gatundu South, Lari) demonstrates strong voting discipline anchored in tea/coffee cooperative networks.

2. STAKEHOLDER MATRIX
Elder Josephat Kariuki remains the central convener of the Karuri Parish Council. His endorsement reliably swings community opinion across 18 polling streams.

3. STRATEGIC RECOMMENDATIONS
- Operationalize mobile verification units to digitize paper voter sign-ups within 12 hours of field gatherings.
- Fulfill outstanding infrastructure pledges regarding drainage and feeder access.`,
  },
  {
    id: 'doc-402',
    title: 'SME Traders & Informal Economy Policy Platform (Nairobi)',
    type: 'Strategy Memo',
    category: 'Economic Policy',
    date: '2026-08-25',
    fileSize: '2.1 MB',
    status: 'indexed',
    author: 'Fatuma Hassan (Ops Lead)',
    classification: 'Internal Ops',
    aiSummary: 'Operational playbook for engaging Nairobi’s 350,000 informal traders across Kayole, Gikomba, Muthurwa, and Toi markets. Includes legal analysis of county bylaws and proposed licensing fee reduction formulas.',
    keyTakeaways: [
      'Single business permit fees represent 28% of average micro-merchant operating margin.',
      'Alliance with Hon. Beatrice Atieno unlocks organized access to 4,200 active market stall owners.',
      'Night-time solar security lighting is the #1 requested infrastructure intervention.',
    ],
    tags: ['Nairobi', 'Hawkers', 'SME Policy', 'Market Economics'],
    relatedPeopleIds: ['per-102'],
    relatedMeetingIds: ['mtg-202'],
    content: `OPERATIONAL PLAYBOOK: NAIROBI INFORMAL TRADERS GUILD
Formal trade associations in Eastlands operate on high-trust peer accountability. Engaging leadership like Beatrice Atieno must be paired with rapid resolution of municipal licensing confiscation disputes.`,
  },
  {
    id: 'doc-403',
    title: 'Rift Valley Field Operations & Mobile Capture Weekly Audit',
    type: 'Field Report',
    category: 'Field Operations',
    date: '2026-08-30',
    fileSize: '4.8 MB',
    status: 'indexed',
    author: 'Ezekiel Kiprop (Field Mobilizer Lead)',
    classification: 'Field Dissemination',
    aiSummary: 'Weekly metrics report summarizing 1,240 physical sign-up sheets digitized via the camera OCR scanner across Nakuru, Kericho, and Baringo counties. Highlights 96.4% OCR accuracy and 3.6% manual review rate.',
    keyTakeaways: [
      'Camera-first scanning reduced turnaround from 4 days to 45 minutes.',
      'Low lighting conditions at dusk accounted for 80% of duplicate review flags.',
      'Recommends equipping mobilizers with portable LED clip lights for evening registration drives.',
    ],
    tags: ['Field Audit', 'OCR Metrics', 'Nakuru', 'Data Quality'],
    relatedPeopleIds: ['per-103', 'per-107'],
    relatedMeetingIds: ['mtg-203'],
    content: `FIELD AUDIT & TELEMETRY REPORT
Mobile scanners processed 1,240 sheets across 32 polling zones. Dual-pass AI verification correctly flagged 42 potential duplicate identity entries.`,
  },
  {
    id: 'doc-404',
    title: 'Coastal Peace Accord & Interfaith Code of Conduct',
    type: 'Legal/Compliance',
    category: 'Legal & Peace',
    date: '2026-08-29',
    fileSize: '1.7 MB',
    status: 'indexed',
    author: 'Secretariat Legal Counsel',
    classification: 'Internal Ops',
    aiSummary: 'Legal framework and binding code of conduct agreed between campaign leadership, the Council of Imams and Preachers of Kenya (CIPK), and the Coast Interfaith Council of Clergy.',
    keyTakeaways: [
      'Establishes zero-tolerance standard for sectarian or divisive campaign messaging.',
      'Creates a 24/7 hotline for rapid escalation of localized community tensions.',
      'Provides standard clearance protocol for all campaign public address audio scripts.',
    ],
    tags: ['Legal', 'Peace Accord', 'Mombasa', 'Interfaith'],
    relatedPeopleIds: ['per-104'],
    relatedMeetingIds: ['mtg-204'],
    content: `COASTAL INTERFAITH CODE OF CONDUCT
Signed by Dr. Wanjiku Mwangi and Sheikh Omar Salim Bakari. All field events must incorporate the peace pledge prior to candidate address.`,
  },
];
