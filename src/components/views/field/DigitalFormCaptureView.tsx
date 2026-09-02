import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Radio,
  Plus,
  Save,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Button, Input, Select, Badge } from '@/src/components/ui/Controls';
import { GlassCard } from '@/src/components/ui/Cards';
import { FieldFormType } from '@/src/types';

export const DigitalFormCaptureView: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const [formType, setFormType] = useState<FieldFormType>('Voter Mobilization & Pledges');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [county, setCounty] = useState('Nakuru');
  const [constituency, setConstituency] = useState('Nakuru Town East');
  const [ward, setWard] = useState('Biashara');
  const [pollingStation, setPollingStation] = useState('012 - Afraha Stadium Main Gate');
  const [pledge, setPledge] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const sub = campaignStore.addSubmission({
      batchNumber: `DIGI-MOB-${Date.now().toString().slice(-4)}`,
      formType,
      capturedBy: user?.name || 'Field Officer',
      capturedById: user?.id || 'usr-4',
      location: {
        county,
        constituency,
        ward,
        pollingStation,
      },
      status: 'pending_review',
      originalImageUrl: '',
      extractedFields: [
        { id: 'd1', name: 'fullName', label: 'Full Name', value: fullName, confidence: 1.0, originalValue: fullName },
        { id: 'd2', name: 'phone', label: 'Phone Number', value: phone, confidence: 1.0, originalValue: phone },
        { id: 'd3', name: 'nationalId', label: 'National ID', value: nationalId, confidence: 1.0, originalValue: nationalId },
        { id: 'd4', name: 'ward', label: 'Electoral Ward', value: ward, confidence: 1.0, originalValue: ward },
        { id: 'd5', name: 'pledge', label: 'Pledge Commitment', value: pledge, confidence: 1.0, originalValue: pledge },
      ],
      possibleDuplicate: {
        isDuplicate: false,
      },
      notes: notes || 'Direct digital entry from rapid field tablet.',
    });

    setSubmittedId(sub.id);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setNationalId('');
    setPledge('');
    setNotes('');
    setSubmittedId(null);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/field')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#08453A]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Field Hub</span>
        </button>

        <div className="flex items-center space-x-2">
          <Badge variant="success">Offline Buffer Active</Badge>
          <span className="text-xs text-[#AACBC4]">Direct Digital Entry</span>
        </div>
      </div>

      <GlassCard elevated className="space-y-6">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F1F7F6]">
            Fast Digital Field Ingestion
          </h1>
          <p className="text-xs text-[#AACBC4] mt-1">
            Rapid manual registration without paper scanning. Automatically routes to the verification station.
          </p>
        </div>

        {submittedId ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00DF81]/20 text-[#00DF81] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif-heading text-xl text-[#F1F7F6]">Record Successfully Queued</h3>
            <p className="text-xs text-[#AACBC4] max-w-md mx-auto">
              Field entry has been dispatched to the verification station under submission ID: <strong>{submittedId}</strong>.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <Button variant="primary" onClick={handleReset} icon={<Plus className="w-4 h-4" />}>
                Capture Next Record
              </Button>
              <Button variant="outline" onClick={() => navigate(`/field/submissions/${submittedId}`)}>
                Open Verification View
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Intake Form Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as FieldFormType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                <option value="Voter Mobilization & Pledges">Voter Mobilization & Pledges</option>
                <option value="Event Sign-up">Event Sign-up Sheet</option>
                <option value="Community Grievance Log">Community Grievance Log</option>
                <option value="Delegate Registry">Delegate Registry</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Agnes Chepkorir Sang"
                required
              />
              <Input
                label="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="National ID"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="e.g. 32849012"
              />
              <Input
                label="Specific Polling Station / Stream"
                value={pollingStation}
                onChange={(e) => setPollingStation(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="County"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                required
              />
              <Input
                label="Constituency"
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                required
              />
              <Input
                label="Ward"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                required
              />
            </div>

            <Input
              label="Pledge / Commitment Note"
              value={pledge}
              onChange={(e) => setPledge(e.target.value)}
              placeholder="e.g. Pledged to bring 15 family members to rally"
            />

            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Mobilizer Field Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observation of enthusiasm, issues raised..."
                className="w-full rounded-xl bg-[#032221] border border-[#AACBC4]/25 p-3 text-sm text-[#F1F7F6]"
              />
            </div>

            <div className="pt-4 border-t border-[#AACBC4]/15 flex justify-end space-x-3">
              <Button variant="ghost" type="button" onClick={() => navigate('/field')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" size="lg" icon={<Save className="w-4 h-4" />}>
                Queue for Verification
              </Button>
            </div>
          </form>
        )}
      </GlassCard>
    </div>
  );
};
