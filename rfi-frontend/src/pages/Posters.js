import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiShare2, FiZap, FiLayers, FiGrid, FiColumns, FiCompass } from 'react-icons/fi';
import { eventsAPI, postersAPI } from '../services/api';

const gradientPool = [
  ['#46A2B9', '#6D5BBA'],
  ['#F857A6', '#FF5858'],
  ['#0BA360', '#3CBA92'],
  ['#1E3C72', '#2A5298'],
  ['#F3904F', '#3B4371'],
];

const fallbackEvents = [
  { id: 101, name: 'Global Freedom Rallies', location: 'Melbourne', focus: 'Street Mobilisation' },
  { id: 102, name: 'Art For Iran Studio', location: 'Sydney', focus: 'Creative Lab' },
  { id: 103, name: 'Women Life Freedom Summit', location: 'Online', focus: 'Digital Organising' },
].map((evt) => ({
  ...evt,
  title: evt.title ?? evt.name,
  focus: evt.focus ?? evt.location,
}));

const fallbackPosterMap = {
  101: [
    {
      id: 10101,
      title: 'Amplify Her Voice',
      fileUrl: 'https://placehold.co/1024x1536/f857a6/ffffff?text=Amplify+Her+Voice',
      thumbnailUrl: '',
      fileSize: 24000000,
      downloadCount: 1284,
      uploadedAt: '2025-11-01T00:00:00Z',
      caption: 'High-contrast typography for dusk marches. Works best on A2 foam boards.',
      themes: ['Women Life Freedom', 'Night Rallies'],
      palette: ['#F857A6', '#FF5858'],
    },
    {
      id: 10102,
      title: 'Light Over Darkness',
      fileUrl: 'https://placehold.co/1024x1536/1e3c72/ffffff?text=Light+Over+Darkness',
      thumbnailUrl: '',
      fileSize: 18500000,
      downloadCount: 864,
      uploadedAt: '2025-10-19T00:00:00Z',
      caption: 'Gradient beams designed for handheld LED frames and projection walls.',
      themes: ['Hope Messaging'],
      palette: ['#1E3C72', '#2A5298'],
    },
  ],
  102: [
    {
      id: 10201,
      title: 'Art Builds Revolutions',
      fileUrl: 'https://placehold.co/1024x1536/46a2b9/ffffff?text=Art+Builds+Revolutions',
      thumbnailUrl: '',
      fileSize: 32000000,
      downloadCount: 642,
      uploadedAt: '2025-09-05T00:00:00Z',
      caption: 'Modular layout optimised for RISO and risograph duplicators.',
      themes: ['Creative Lab'],
      palette: ['#46A2B9', '#6D5BBA'],
    },
    {
      id: 10202,
      title: 'Unite The Diaspora',
      fileUrl: 'https://placehold.co/1024x1536/0ba360/ffffff?text=Unite+The+Diaspora',
      thumbnailUrl: '',
      fileSize: 21000000,
      downloadCount: 498,
      uploadedAt: '2025-12-12T00:00:00Z',
      caption: 'Minimal typography ready for wheat-paste runs.',
      themes: ['Mobilisation'],
      palette: ['#0BA360', '#3CBA92'],
    },
  ],
  103: [
    {
      id: 10301,
      title: 'Internet For Iran',
      fileUrl: 'https://placehold.co/1024x1536/f3904f/ffffff?text=Internet+For+Iran',
      thumbnailUrl: '',
      fileSize: 27000000,
      downloadCount: 1560,
      uploadedAt: '2026-01-05T00:00:00Z',
      caption: 'Clean infographic for online campaigns and press kits.',
      themes: ['Digital Action'],
      palette: ['#F3904F', '#3B4371'],
    },
  ],
};

const normalizeEvents = (rawEvents = []) =>
  rawEvents
    .map((evt) => {
      const id = evt.id ?? evt.Id;
      if (!id) return null;
      return {
        ...evt,
        id,
        title: evt.title ?? evt.name ?? evt.Title ?? evt.Name ?? 'Untitled action',
        focus: evt.focus ?? evt.location ?? evt.Focus ?? evt.Location ?? 'Community action',
      };
    })
    .filter(Boolean);

const normalizePosters = (rawPosters = []) =>
  rawPosters
    .map((poster) => {
      const id = poster.id ?? poster.Id;
      if (!id) return null;
      
      const fileUrl = poster.fileUrl ?? poster.FileUrl ?? '';
      const thumbnailUrl = poster.thumbnailUrl ?? poster.ThumbnailUrl ?? '';
      
      // Convert relative URLs to absolute backend URLs
      const backendBase = 'http://localhost:5186';
      const absoluteFileUrl = fileUrl.startsWith('http') ? fileUrl : `${backendBase}${fileUrl}`;
      const absoluteThumbnailUrl = thumbnailUrl.startsWith('http') ? thumbnailUrl : `${backendBase}${thumbnailUrl}`;
      
      return {
        ...poster,
        id,
        eventId: poster.eventId ?? poster.EventId ?? 0,
        title: poster.title ?? poster.Title ?? 'Untitled poster',
        fileUrl: absoluteFileUrl,
        thumbnailUrl: absoluteThumbnailUrl,
        fileSize: poster.fileSize ?? poster.FileSize ?? 0,
        downloadCount: poster.downloadCount ?? poster.DownloadCount ?? 0,
        uploadedAt: poster.uploadedAt ?? poster.UploadedAt ?? null,
      };
    })
    .filter(Boolean);

const formatBytes = (bytes = 0) => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const PosterCard = ({ poster, accent, onDownload, onShare }) => {
  const gradient = accent || gradientPool[poster.id % gradientPool.length];
  const previewStyle = poster.thumbnailUrl
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(6,12,24,0.2), rgba(6,12,24,0.6)), url(${poster.thumbnailUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` };

  return (
    <motion.article
      whileHover={{ y: -8, rotate: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="glass-card flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-night/60 p-4 text-white shadow-glow"
    >
      <div className="relative overflow-hidden rounded-2xl" style={previewStyle}>
        <div className="aspect-[3/4]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-sm uppercase tracking-[0.25em] text-white/80">
          {poster.themes?.join(' • ') || 'Ready to print'}
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold">{poster.title}</h3>
          <p className="mt-2 text-sm text-white/70">{poster.caption || 'High fidelity artwork, CMYK ready.'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
          <span>{formatBytes(poster.fileSize)}</span>
          <span>•</span>
          <span>{poster.downloadCount.toLocaleString()} downloads</span>
        </div>
        <div className="mt-auto flex gap-3">
          <button
            type="button"
            onClick={() => onDownload(poster)}
            className="pill-button pill-button--primary flex-1 justify-center"
          >
            <FiDownload className="mr-2" /> Download
          </button>
          <button
            type="button"
            onClick={() => onShare(poster)}
            className="pill-button pill-button--secondary px-4"
            title="Share link"
          >
            <FiShare2 />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

function Posters() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log('📡 Fetching events from API...');
        const { data } = await eventsAPI.getAll();
        console.log('✅ Events API response:', data);
        const normalized = normalizeEvents(Array.isArray(data) ? data : []);
        if (normalized.length) {
          setEvents(normalized);
          setSelectedEventId(normalized[0].id);
        } else {
          console.warn('⚠️ Events API returned empty data, using fallback');
          setEvents(fallbackEvents);
          setSelectedEventId(fallbackEvents[0]?.id ?? null);
        }
      } catch (error) {
        console.error('❌ Events API failed:', error.message, error);
        console.warn('Falling back to poster presets', error);
        setEvents(fallbackEvents);
        setSelectedEventId(fallbackEvents[0].id);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    const loadPosters = async () => {
      setLoading(true);
      try {
        console.log(`📡 Fetching all posters from API...`);
        const { data } = await postersAPI.getAll();
        console.log('✅ Posters API response:', data);
        const normalized = normalizePosters(Array.isArray(data) ? data : []);
        
        // Filter by selected event if needed
        const filtered = selectedEventId 
          ? normalized.filter(p => p.eventId === selectedEventId)
          : normalized;
        
        if (filtered.length) {
          console.log(`✅ Using ${filtered.length} real posters from API`);
          setPosters(filtered);
        } else if (normalized.length) {
          console.warn(`⚠️ No posters for event ${selectedEventId}, showing all ${normalized.length} posters`);
          setPosters(normalized);
        } else {
          console.warn(`⚠️ No posters found, using fallback`);
          setPosters(fallbackPosterMap[selectedEventId] || []);
        }
      } catch (error) {
        console.error(`❌ Posters API failed:`, error.message, error);
        console.warn('Using fallback posters');
        setPosters(fallbackPosterMap[selectedEventId] || []);
      } finally {
        setLoading(false);
      }
    };

    loadPosters();
  }, [selectedEventId]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(''), 3500);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const stats = useMemo(() => {
    const total = posters.length;
    const downloads = posters.reduce((sum, poster) => sum + (poster.downloadCount || 0), 0);
    const avgSize = total ? posters.reduce((sum, poster) => sum + (poster.fileSize || 0), 0) / total : 0;
    return { total, downloads, avgSize };
  }, [posters]);

  const featuredPosters = useMemo(() => {
    if (!posters.length) return [];
    return [...posters].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0)).slice(0, 3);
  }, [posters]);

  const handleDownload = async (poster) => {
    window.open(poster.fileUrl, '_blank', 'noopener');
    try {
      await postersAPI.trackDownload(poster.id);
    } catch (error) {
      console.warn('Unable to register download', error);
    }
  };

  const handleShare = async (poster) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: poster.title, text: 'Rise For Iran Poster', url: poster.fileUrl });
        setStatusMessage('Shared via native sheet.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(poster.fileUrl);
        setStatusMessage('Poster link copied to clipboard.');
      } else {
        setStatusMessage('Copy this link manually: ' + poster.fileUrl);
      }
    } catch (error) {
      setStatusMessage('Share cancelled.');
    }
  };

  const heroEvent = events.find((evt) => evt.id === selectedEventId);

  return (
    <div className="space-y-20 pb-24">
      <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#050b19] via-[#091932] to-black px-6 py-20 text-white shadow-[0_40px_120px_rgba(5,10,25,0.7)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_65%)]" aria-hidden />
        <div className="relative space-y-8">
          <span className="text-sm uppercase tracking-[0.5em] text-primary">Poster Lab</span>
          <h1 className="max-w-3xl font-display text-5xl leading-tight sm:text-6xl">
            Rally-ready artwork crafted for bold, shareable storytelling.
          </h1>
          <p className="max-w-3xl text-lg text-white/80">
            Browse curated poster systems, download print-ready files, and remix assets for your next rally, projection drop, or
            press action. Each set includes CMYK masters, digital crops, and social cuts.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card border-white/5 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">Active Set</p>
              <p className="mt-2 text-2xl font-semibold">{heroEvent?.title || 'Creative Cohort'}</p>
              <p className="text-sm text-white/60">{heroEvent?.focus || heroEvent?.location}</p>
            </div>
            <div className="glass-card border-white/5 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">Downloads</p>
              <p className="mt-2 text-2xl font-semibold">{stats.downloads.toLocaleString()}</p>
              <p className="text-sm text-white/60">lifetime pulls</p>
            </div>
            <div className="glass-card border-white/5 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">Average Size</p>
              <p className="mt-2 text-2xl font-semibold">{formatBytes(stats.avgSize)}</p>
              <p className="text-sm text-white/60">full bleed masters</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEventId(event.id)}
                className={[
                  'pill-button px-5 py-3 text-sm font-semibold backdrop-blur',
                  event.id === selectedEventId ? 'pill-button--primary' : 'pill-button--secondary',
                ].join(' ')}
              >
                <FiCompass className="mr-2" /> {event.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-primary">Gallery</p>
            <h2 className="section-heading">Adaptive poster systems</h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`pill-button ${viewMode === 'grid' ? 'pill-button--primary' : 'pill-button--secondary'}`}
            >
              <FiGrid className="mr-2" /> Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('immersive')}
              className={`pill-button ${viewMode === 'immersive' ? 'pill-button--primary' : 'pill-button--secondary'}`}
            >
              <FiColumns className="mr-2" /> Immersive
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse rounded-3xl border border-white/5 bg-white/5 p-6">
                <div className="mb-6 aspect-[3/4] rounded-2xl bg-white/10" />
                <div className="h-4 w-2/3 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : posters.length === 0 ? (
          <div className="glass-card border border-dashed border-white/20 bg-night/50 p-10 text-center text-white/70">
            No posters yet for this event. Drop your artwork using the submission form below.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posters.map((poster, idx) => (
              <PosterCard
                key={poster.id}
                poster={poster}
                accent={gradientPool[idx % gradientPool.length]}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {posters.map((poster, idx) => (
              <motion.div
                key={poster.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/5 to-white/0 p-8 text-white"
              >
                <div className="flex flex-col gap-8 lg:flex-row">
                  <div
                    className="relative flex-1 overflow-hidden rounded-2xl"
                    style={{
                      backgroundImage: poster.thumbnailUrl
                        ? `linear-gradient(120deg, rgba(6,12,24,0.2), rgba(6,12,24,0.6)), url(${poster.thumbnailUrl})`
                        : `linear-gradient(135deg, ${gradientPool[idx % gradientPool.length][0]}, ${gradientPool[idx % gradientPool.length][1]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="aspect-[3/4]" />
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <p className="text-sm uppercase tracking-[0.4em] text-primary">Immersive view</p>
                    <h3 className="text-3xl font-semibold">{poster.title}</h3>
                    <p className="text-white/80">{poster.caption || 'Print assets with layered PSD + vector kit.'}</p>
                    <div className="flex flex-wrap gap-3">
                      {(poster.themes || ['Print', 'Digital']).map((pill) => (
                        <span key={pill} className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                          {pill}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                      <span>{formatBytes(poster.fileSize)}</span>
                      <span>•</span>
                      <span>{poster.downloadCount.toLocaleString()} pulls</span>
                    </div>
                    <div className="mt-auto flex gap-4">
                      <button type="button" className="pill-button pill-button--primary flex-1 justify-center" onClick={() => handleDownload(poster)}>
                        <FiDownload className="mr-2" /> Download pack
                      </button>
                      <button type="button" className="pill-button pill-button--secondary px-4" onClick={() => handleShare(poster)}>
                        <FiShare2 />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {!!featuredPosters.length && (
        <section className="space-y-8">
          <div className="flex items-center gap-3 text-white">
            <FiZap className="text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-primary">Spotlight</p>
              <h2 className="section-heading">Most requested files</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosters.map((poster, idx) => (
              <motion.div key={poster.id} whileHover={{ scale: 1.02 }} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.4em] text-white/70">{poster.downloadCount.toLocaleString()} pulls</p>
                <h3 className="mt-4 text-2xl font-semibold">{poster.title}</h3>
                <p className="mt-2 text-white/75">{poster.caption || 'Ready for A1, A2, and digital signage.'}</p>
                <button
                  type="button"
                  onClick={() => handleDownload(poster)}
                  className="mt-6 w-full pill-button pill-button--primary justify-center"
                >
                  <FiDownload className="mr-2" /> Grab the pack
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="glass-card space-y-6 rounded-[2.5rem] border border-dashed border-white/20 bg-night/60 p-10 text-white">
        <p className="text-sm uppercase tracking-[0.4em] text-primary">Design Lab</p>
        <h2 className="text-3xl font-semibold">Submit poster systems or request assets</h2>
        <p className="text-white/80">
          Have a design kit, template, or motion pack the movement should use? Email studio@riseforiran.org with layered files,
          colour specs, printer notes, and a short description.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:studio@riseforiran.org" className="pill-button pill-button--primary">
            <FiLayers className="mr-2" /> Send files
          </a>
          <a href="https://www.figma.com/" target="_blank" rel="noreferrer" className="pill-button pill-button--secondary">
            Open Figma guide
          </a>
        </div>
      </section>

      {statusMessage && (
        <div className="fixed bottom-6 right-6 rounded-2xl border border-white/10 bg-night px-6 py-4 text-sm text-white shadow-xl">
          {statusMessage}
        </div>
      )}
    </div>
  );
}

export default Posters;
