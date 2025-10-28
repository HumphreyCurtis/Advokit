import type { InfoBox } from "../types";

export default function Infobox({ status, published }: InfoBox) {
  return (
    <>
      <aside className="hidden lg:block lg:self-start">
        <div className="sticky top-16 rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <h3 id="quick-facts" className="text-base font-semibold">
              Article facts
            </h3>
          </div>
          <dl className="divide-y divide-gray-200 text-sm">
            <div className="grid grid-cols-3 gap-3 p-4">
              <dt className="col-span-1 text-gray-500">Status</dt>
              <dd className="col-span-2 font-medium">{status}</dd>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              <dt className="col-span-1 text-gray-500">Published</dt>
              <dd className="col-span-2 font-medium">{published}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </>
  );
}
