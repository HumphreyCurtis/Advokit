import Image from "next/image";
import AphasiaReconnectImage from "@/public/images/aphasia-reconnect-logo.png";
import KingsCollegeLondonImage from "@/public/images/kings-college-london.svg";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-2 px-4 py-4">
        <p className="text-center text-sm leading-snug text-black-600 md:text-left m-0">
          From Aphasia Re-Connect & KCL
        </p>
        <a
          href="https://aphasiareconnect.org/"
          target="_blank"
          rel="noreferrer"
          aria-label="Aphasia Re-Connect website"
        >
          <Image
            src={AphasiaReconnectImage.src}
            alt="Aphasia Re-Connect"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </a>

        <a
          href="https://www.kcl.ac.uk/"
          target="_blank"
          rel="noreferrer"
          aria-label="King’s College London website"
        >
          <Image
            src={KingsCollegeLondonImage.src}
            alt="King’s College London"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </a>
      </div>
    </footer>
  );
}
