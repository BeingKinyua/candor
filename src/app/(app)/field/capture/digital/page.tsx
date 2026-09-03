'use client';

import { RequirePermission } from '@/src/lib/auth/guards';
import { DigitalFormCaptureView } from '@/src/components/views/field/DigitalFormCaptureView';

export default function DigitalFormCapturePage() {
  return (
    <RequirePermission permission="field.capture">
      <DigitalFormCaptureView />
    </RequirePermission>
  );
}
