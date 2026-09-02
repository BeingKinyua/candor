import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  MapPin,
  Star,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Person, PersonCategory } from '@/src/types';
import { Button, Input, Select, Badge } from '@/src/components/ui/Controls';
import { Modal } from '@/src/components/ui/Feedback';

export const PeopleListView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [countyFilter, setCountyFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newPerson, setNewPerson] = useState({
    fullName: '',
    phone: '',
    alternativePhone: '',
    nationalId: '',
    email: '',
    county: 'Kiambu',
    constituency: '',
    ward: '',
    category: 'Community Elder' as PersonCategory,
    influenceScore: 7,
    status: 'active' as const,
    notes: '',
    tags: '',
  });

  const people = campaignStore.getPeople();

  const filteredPeople = people.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.county.toLowerCase().includes(q) ||
      p.constituency.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));

    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesCounty = countyFilter === 'all' || p.county === countyFilter;

    return matchesSearch && matchesCat && matchesCounty;
  });

  const counties = Array.from(new Set(people.map((p) => p.county)));
  const categories: PersonCategory[] = [
    'Community Elder',
    'Religious Leader',
    'Business Guild Leader',
    'Youth Coordinator',
    'Grassroots Mobilizer',
    'Key Influencer',
    'Volunteer',
  ];

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.fullName || !newPerson.phone) return;

    campaignStore.createPerson({
      ...newPerson,
      tags: newPerson.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setShowAddModal(false);
    setNewPerson({
      fullName: '',
      phone: '',
      alternativePhone: '',
      nationalId: '',
      email: '',
      county: 'Kiambu',
      constituency: '',
      ward: '',
      category: 'Community Elder',
      influenceScore: 7,
      status: 'active',
      notes: '',
      tags: '',
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Relationship Registry
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            People & Key Stakeholders
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Directory of high-influence community leaders, faith elders, youth mobilizers, and guild chairs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Show me high-influence elders with pending commitments')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Relationship Scan
          </Button>

          {can('people:edit') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Stakeholder
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 border border-[#AACBC4]/20">
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, county, tags..."
            leftIcon={<Search className="w-4 h-4" />}
            className="text-xs"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] focus:outline-none focus:border-[#00DF81]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] focus:outline-none focus:border-[#00DF81]"
          >
            <option value="all">All Counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* People Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.map((person) => (
          <div
            key={person.id}
            onClick={() => navigate(`/people/${person.id}`)}
            className="glass-panel rounded-2xl p-5 border border-[#AACBC4]/20 hover:border-[#00DF81]/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            {person.duplicateFlag && (
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#E5A93C] text-[#032221] text-[10px] font-bold uppercase rounded-bl-xl flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Duplicate Flag</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#08453A] to-[#032221] border border-[#00DF81]/30 flex items-center justify-center text-[#00DF81] font-bold text-sm shadow-md">
                    {person.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif-heading text-base font-semibold text-[#F1F7F6] group-hover:text-[#00DF81] transition-colors leading-snug">
                      {person.fullName}
                    </h3>
                    <p className="text-xs text-[#AACBC4] font-medium">{person.category}</p>
                  </div>
                </div>
              </div>

              {/* Geo location */}
              <div className="flex items-center space-x-1.5 text-xs text-[#AACBC4]">
                <MapPin className="w-3.5 h-3.5 text-[#00DF81] shrink-0" />
                <span className="truncate">{person.ward}, {person.constituency}, {person.county}</span>
              </div>

              {/* Phone & ID */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#AACBC4]/10">
                <span className="font-mono text-[#F1F7F6] flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-[#AACBC4]" />
                  <span>{person.phone}</span>
                </span>
                <span className="text-[11px] text-[#707D7D] font-mono">ID: {person.nationalId || 'N/A'}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {person.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-[#032221]/90 border border-[#AACBC4]/15 text-[10px] text-[#AACBC4]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Stats & Influence Rating */}
            <div className="pt-4 mt-4 border-t border-[#AACBC4]/15 flex items-center justify-between">
              <div className="flex items-center space-x-1 bg-[#00DF81]/15 border border-[#00DF81]/30 px-2 py-0.5 rounded-lg text-xs font-semibold text-[#00DF81]">
                <Star className="w-3 h-3 fill-[#00DF81]" />
                <span>{person.influenceScore}/10 Influence</span>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-[#AACBC4]">
                <span>{person.metrics.commitmentsCount} pledges</span>
                <span>&bull;</span>
                <span>{person.metrics.meetingsCount} mtgs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Stakeholder Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register Stakeholder / Key Contact"
        subtitle="Capture high-leverage community influencer or mobilizer into central directory."
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePerson} className="space-y-4">
          <Input
            label="Full Legal / Community Name *"
            value={newPerson.fullName}
            onChange={(e) => setNewPerson({ ...newPerson, fullName: e.target.value })}
            placeholder="e.g. Elder Josephat Kariuki"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Primary Phone Number *"
              value={newPerson.phone}
              onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
              placeholder="+254 7..."
              required
            />
            <Input
              label="Alternative Phone"
              value={newPerson.alternativePhone}
              onChange={(e) => setNewPerson({ ...newPerson, alternativePhone: e.target.value })}
              placeholder="+254 7..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="National ID Number"
              value={newPerson.nationalId}
              onChange={(e) => setNewPerson({ ...newPerson, nationalId: e.target.value })}
              placeholder="e.g. 19823401"
            />
            <Input
              label="Email Address (Optional)"
              value={newPerson.email}
              onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
              placeholder="elder@domain.com"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="County *"
              value={newPerson.county}
              onChange={(e) => setNewPerson({ ...newPerson, county: e.target.value })}
              required
            />
            <Input
              label="Constituency *"
              value={newPerson.constituency}
              onChange={(e) => setNewPerson({ ...newPerson, constituency: e.target.value })}
              required
            />
            <Input
              label="Ward *"
              value={newPerson.ward}
              onChange={(e) => setNewPerson({ ...newPerson, ward: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Stakeholder Category</label>
              <select
                value={newPerson.category}
                onChange={(e) => setNewPerson({ ...newPerson, category: e.target.value as PersonCategory })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Influence Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newPerson.influenceScore}
                onChange={(e) => setNewPerson({ ...newPerson, influenceScore: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              />
            </div>
          </div>

          <Input
            label="Tags (comma-separated)"
            value={newPerson.tags}
            onChange={(e) => setNewPerson({ ...newPerson, tags: e.target.value })}
            placeholder="Agri-Coop, Church Leader, High-Influence"
          />

          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Strategic & Contextual Notes</label>
            <textarea
              rows={3}
              value={newPerson.notes}
              onChange={(e) => setNewPerson({ ...newPerson, notes: e.target.value })}
              placeholder="Key background, past campaign interactions, community standing..."
              className="w-full rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 p-3 text-sm text-[#F1F7F6] focus:outline-none focus:border-[#00DF81]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Stakeholder Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
