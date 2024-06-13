import Link from "next/link";

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Manage Your Decentralized Lens Profiles
                  </h1>
                  <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                    Our tool helps you easily manage and maintain your Lens
                    protocol profiles, ensuring your online presence is always
                    up-to-date and engaging.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/lens-tools/profile-manager"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#8b5cf6] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#7c3aed] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6d28d9] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#a78bfa] dark:text-[#1e293b] dark:hover:bg-[#9d7aff]"
                    prefetch={true}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#learn-more"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#e5e7eb] border-[#e5e7eb] bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-[#f3f4f6] hover:text-[#1f2937] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6d28d9] disabled:pointer-events-none disabled:opacity-50 dark:border-[#374151] dark:border-[#374151] dark:bg-[#1e293b] dark:hover:bg-[#374151] dark:hover:text-[#f3f4f6] dark:focus-visible:ring-[#a78bfa]"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              {/* <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              /> */}
            </div>
          </div>
        </section>
        <section
          id="learn-more"
          className="w-full bg-[#f3f4f6] py-12 dark:bg-[#1e293b] md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
              <div className="flex flex-col items-start gap-4">
                <MenuIcon className="h-8 w-8 text-[#8b5cf6]" />
                <h3 className="text-xl font-bold">Manage Profiles</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Easily manage and update your Lens protocol profiles from a
                  single dashboard.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <MoveIcon className="h-8 w-8 text-[#8b5cf6]" />
                <h3 className="text-xl font-bold">Transfer Profiles</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Securely transfer ownership of your Lens profiles to other
                  accounts.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <DeleteIcon className="h-8 w-8 text-[#8b5cf6]" />
                <h3 className="text-xl font-bold">Add/Remove Managers</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Easily add or remove additional profile managers to
                  collaborate on your Lens profiles.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <LinkIcon className="h-8 w-8 text-[#8b5cf6]" />
                <h3 className="text-xl font-bold">Follow Settings</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Customize your Lens profile&apos;s follow settings to control
                  who can interact with your content.
                </p>
              </div>
              {/* <div className="flex flex-col items-start gap-4">
                <ScanIcon className="h-8 w-8 text-[#8b5cf6]" />
                <h3 className="text-xl font-bold">Analyze Performance</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Track key metrics and insights to optimize your Lens profiles
                  for maximum engagement.
                </p>
              </div> */}
              {/* <div className="flex flex-col items-start gap-4">
                <BotIcon className="h-8 w-8 text-[#8b5cf6]" />
                <h3 className="text-xl font-bold">Automate Updates</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Set up automated updates to ensure your Lens profiles are
                  always current and engaging.
                </p>
              </div> */}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full bg-[#1e293b] p-6 md:py-12">
        {/* <div className="container grid max-w-7xl grid-cols-2 gap-8 text-sm text-gray-400 sm:grid-cols-3 md:grid-cols-5">
          <div className="grid gap-1">
            <h3 className="font-semibold text-gray-200">Company</h3>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              About Us
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Our Team
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Careers
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              News
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-gray-200">Product</h3>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Features
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Pricing
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Integrations
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Roadmap
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-gray-200">Resources</h3>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Documentation
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Blog
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Community
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Support
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-gray-200">Legal</h3>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Cookie Policy
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold text-gray-200">Connect</h3>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Twitter
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              Discord
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              GitHub
            </Link>
            <Link href="#" className="hover:text-gray-200" prefetch={false}>
              LinkedIn
            </Link>
          </div>
        </div> */}
      </footer>
    </div>
  );
}

function BotIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function CameraIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function DeleteIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  );
}

function LinkIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function MenuIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MoveIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="5 9 2 12 5 15" />
      <polyline points="9 5 12 2 15 5" />
      <polyline points="15 19 12 22 9 19" />
      <polyline points="19 9 22 12 19 15" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="22" />
    </svg>
  );
}

function ScanIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}
