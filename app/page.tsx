import URLForm from "@/components/URLForm";
import { POST_STYLES } from "@/lib/post-styles";

export default function Home() {
  const freeStyles = POST_STYLES.filter((s) => !s.proOnly);
  const proStyles = POST_STYLES.filter((s) => s.proOnly);

  return (
    <div className="flex flex-col items-center px-4 py-16 gap-12">
      <div className="text-center max-w-2xl flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Turn any YouTube video into LinkedIn posts
        </h1>
        <p className="text-lg text-gray-500">
          Paste a URL. Get 5 ready-to-publish LinkedIn posts in different styles — in under 30 seconds.
        </p>
      </div>

      <URLForm />

      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 text-center">
          Post styles
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {freeStyles.map((s) => (
            <div key={s.name} className="border border-gray-200 rounded-lg p-3 bg-white text-sm">
              <p className="font-medium text-gray-900">{s.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">Free</p>
            </div>
          ))}
          {proStyles.map((s) => (
            <div key={s.name} className="border border-indigo-100 rounded-lg p-3 bg-indigo-50 text-sm">
              <p className="font-medium text-indigo-900">{s.label}</p>
              <p className="text-indigo-400 text-xs mt-0.5">Pro</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
