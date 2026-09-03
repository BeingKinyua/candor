'use client';

import { RequirePermission } from '@/src/lib/auth/guards';
import { CameraCaptureView } from '@/src/components/views/field/CameraCaptureView';

export default function FieldCapturePage() {
  return (
    <RequirePermission permission="field.capture">
      <CameraCaptureView />
    </RequirePermission>
  );
}
