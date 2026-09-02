import React, { useState, useRef } from 'react';
import {
  Camera,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Zap,
  Sliders,
  Maximize2,
  ScanLine,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { FieldFormType, ExtractedField } from '@/src/types';
import { Button, Badge, Input, Select } from '@/src/components/ui/Controls';
import { GlassCard } from '@/src/components/ui/Cards';

const SAMPLE_DOCS = [
  {
    name: 'Voter Pledge Slip (Kiambaa Ward)',
    url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80',
    type: 'Voter Mobilization & Pledges' as FieldFormType,
    county: 'Kiambu',
    constituency: 'Kiambaa',
    ward: 'Karuri',
    fields: [
      { id: 'f1', name: 'fullName', label: 'Full Name', value: 'Samuel Gitau Njoroge', confidence: 0.97, originalValue: 'Samuel Gitau Njoroge', boundingBox: { x: 20, y: 25, width: 60, height: 6 } },
      { id: 'f2', name: 'phone', label: 'Phone Number', value: '+254 722 901 823', confidence: 0.94, originalValue: '0722 901 823', boundingBox: { x: 20, y: 34, width: 45, height: 6 } },
      { id: 'f3', name: 'nationalId', label: 'National ID', value: '23819024', confidence: 0.91, originalValue: '23819024', boundingBox: { x: 20, y: 43, width: 35, height: 6 } },
      { id: 'f4', name: 'ward', label: 'Ward', value: 'Karuri', confidence: 0.88, originalValue: 'Karuri', boundingBox: { x: 20, y: 52, width: 30, height: 6 } },
    ],
  },
  {
    name: 'Event Sign-up Sheet (Nakuru Central)',
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    type: 'Event Sign-up' as FieldFormType,
    county: 'Nakuru',
    constituency: 'Nakuru Town East',
    ward: 'Biashara',
    fields: [
      { id: 'f5', name: 'fullName', label: 'Full Name', value: 'Mary Wanjiru Kinyua', confidence: 0.98, originalValue: 'Mary Wanjiru Kinyua', boundingBox: { x: 20, y: 24, width: 55, height: 6 } },
      { id: 'f6', name: 'phone', label: 'Phone Number', value: '+254 719 330 912', confidence: 0.96, originalValue: '0719 330 912', boundingBox: { x: 20, y: 32, width: 40, height: 6 } },
      { id: 'f7', name: 'nationalId', label: 'National ID', value: '28491023', confidence: 0.89, originalValue: '28491023', boundingBox: { x: 20, y: 40, width: 38, height: 6 } },
    ],
  },
];

export const CameraCaptureView: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<string>('');
  const [scanComplete, setScanComplete] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedField[]>([]);

  const sample = SAMPLE_DOCS[selectedDocIndex];

  const handleCapture = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress('Aligning camera viewfinder & detecting sheet boundaries...');

    setTimeout(() => {
      setScanProgress('Running neural optical character recognition (OCR)...');
    }, 800);

    setTimeout(() => {
      setScanProgress('Cross-referencing National ID against voter directory...');
    }, 1600);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setExtractedData(sample.fields);
    }, 2400);
  };

  const handleSendToVerification = () => {
    const newSubmission = campaignStore.addSubmission({
      batchNumber: `BATCH-MOB-${Date.now().toString().slice(-4)}`,
      formType: sample.type,
      capturedBy: user?.name || 'Field Mobilizer',
      capturedById: user?.id || 'usr-4',
      location: {
        county: sample.county,
        constituency: sample.constituency,
        ward: sample.ward,
      },
      status: 'pending_review',
      originalImageUrl: sample.url,
      extractedFields: extractedData,
      possibleDuplicate: {
        isDuplicate: false,
      },
      notes: `Mobile capture via camera scanner at ${sample.ward} polling desk.`,
    });

    navigate(`/field/submissions/${newSubmission.id}`);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/field')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#08453A]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Field Operations</span>
        </button>

        <div className="flex items-center space-x-2">
          <Badge variant="info">Mobile Scanner Online</Badge>
          <span className="text-xs text-[#707D7D] font-mono">Edge AI v2.4</span>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Viewfinder Window (7 cols) */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel-elevated border-2 border-[#00DF81]/40 shadow-2xl bg-[#000] aspect-[4/3] flex items-center justify-center group">
            
            {/* Scanned Document Image */}
            <img
              src={sample.url}
              alt="Document capture sample"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity filter contrast-125"
            />

            {/* Target Reticle & Viewfinder Overlays */}
            <div className="absolute inset-6 border-2 border-dashed border-[#00DF81]/60 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-[#00DF81] rounded-tl-lg" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-[#00DF81] rounded-tr-lg" />
              </div>

              {/* Real-time Scanning Laser Line Animation */}
              {isScanning && (
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00DF81] to-transparent shadow-lg shadow-[#00DF81] animate-bounce" />
              )}

              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-[#00DF81] rounded-bl-lg" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-[#00DF81] rounded-br-lg" />
              </div>
            </div>

            {/* Live Camera Guidelines Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] text-[#F1F7F6] bg-[#032221]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#AACBC4]/20">
              <span className="flex items-center space-x-1.5 text-[#00DF81]">
                <span className="w-2 h-2 rounded-full bg-[#00DF81] animate-ping" />
                <span>Auto-Focus / OCR Active</span>
              </span>
              <span>Keep paper flat & within borders</span>
            </div>

            {/* Shutter Button Overlay */}
            {!scanComplete && (
              <div className="absolute bottom-6 inset-x-0 flex justify-center items-center">
                <button
                  onClick={handleCapture}
                  disabled={isScanning}
                  className="w-18 h-18 rounded-full bg-[#00DF81] p-1.5 shadow-2xl shadow-[#00DF81]/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-[#032221] cursor-pointer disabled:opacity-50"
                  title="Capture & Digitize"
                >
                  <div className="w-full h-full rounded-full border-2 border-[#032221] flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Sample Switcher */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-panel border border-[#AACBC4]/15">
            <span className="text-xs text-[#AACBC4]">Select Field Slip Preset:</span>
            <div className="flex space-x-2">
              {SAMPLE_DOCS.map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDocIndex(idx);
                    setScanComplete(false);
                    setExtractedData([]);
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer hover:cursor-pointer ${
                    selectedDocIndex === idx
                      ? 'bg-[#00DF81] text-[#032221] font-semibold'
                      : 'bg-[#08453A] text-[#AACBC4] hover:text-[#F1F7F6]'
                  }`}
                >
                  {doc.name.split(' ')[0]} {doc.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Extraction Results (5 cols) */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <GlassCard elevated className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#AACBC4]/15">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#00DF81]" />
                  <h3 className="font-serif-heading text-lg font-semibold text-[#F1F7F6]">
                    Instant OCR Extraction Preview
                  </h3>
                </div>
                {scanComplete && (
                  <Badge variant="success">96.4% Conf</Badge>
                )}
              </div>

              {isScanning && (
                <div className="py-12 text-center space-y-3 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-[#00DF81]/20 text-[#00DF81] flex items-center justify-center mx-auto">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                  <p className="text-xs font-mono text-[#00DF81]">{scanProgress}</p>
                </div>
              )}

              {!isScanning && !scanComplete && (
                <div className="py-16 text-center space-y-2 text-[#AACBC4]">
                  <ScanLine className="w-10 h-10 mx-auto text-[#08453A]" />
                  <p className="text-xs">
                    Position physical sheet in camera view and tap shutter button to extract handwriting.
                  </p>
                </div>
              )}

              {scanComplete && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-[#00DF81] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Neural OCR Completed: 4 Fields Parsed</span>
                  </p>

                  <div className="space-y-2.5">
                    {extractedData.map((field) => (
                      <div
                        key={field.id}
                        className="p-3 rounded-xl bg-[#032221] border border-[#AACBC4]/20 space-y-1 text-xs"
                      >
                        <div className="flex justify-between text-[#AACBC4]">
                          <span className="font-medium">{field.label}</span>
                          <span className="font-mono text-[10px] text-[#00DF81]">
                            {Math.round(field.confidence * 100)}% match
                          </span>
                        </div>
                        <p className="font-semibold text-[#F1F7F6] text-sm">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {scanComplete && (
              <div className="pt-4 border-t border-[#AACBC4]/15 space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSendToVerification}
                  className="w-full"
                  icon={<Zap className="w-4 h-4" />}
                >
                  Send to Verification Station
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setScanComplete(false);
                    setExtractedData([]);
                  }}
                  className="w-full text-xs"
                >
                  Retake Photo
                </Button>
              </div>
            )}
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
