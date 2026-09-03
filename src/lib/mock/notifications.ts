import { NotificationItem } from "@/src/types";

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Critical Issue Escalated',
    message: 'Kayole market stall impoundment escalated by Campaign Director.',
    timestamp: '15m ago',
    type: 'urgent',
    read: false,
    linkUrl: '/issues/iss-501',
  },
  {
    id: 'notif-2',
    title: '3 Submissions Awaiting Human Verification',
    message: 'Batch BATCH-NBI-2026-088 contains 1 possible duplicate requiring approval.',
    timestamp: '42m ago',
    type: 'warning',
    read: false,
    linkUrl: '/field/submissions/fs-8842',
  },
  {
    id: 'notif-3',
    title: 'Meeting in 45 Minutes',
    message: 'Kiambu Agricultural Cooperatives Strategic Alignment with Elder Josephat Kariuki.',
    timestamp: '1h ago',
    type: 'info',
    read: false,
    linkUrl: '/meetings/mtg-201',
  },
  {
    id: 'notif-4',
    title: 'Overdue Commitment Alert',
    message: 'Kiambaa Feeder Roads Engineering Assessment passed deadline.',
    timestamp: '2h ago',
    type: 'urgent',
    read: true,
    linkUrl: '/commitments',
  },
];
