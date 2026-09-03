export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-10 h-10 rounded-xl bg-[#08453A] border border-[#00DF81]/40 flex items-center justify-center animate-pulse">
        <span className="font-serif-heading text-lg font-bold text-[#00DF81]">C</span>
      </div>
      <p className="text-xs font-mono text-[#AACBC4] tracking-wide animate-pulse">
        Loading operational intelligence...
      </p>
    </div>
  );
}
