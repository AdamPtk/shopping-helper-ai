"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import ShoppyLogo from "../common/shoppy-logo";

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-white bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <ShoppyLogo />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Your AI-powered shopping assistant
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              {["Features", "Pricing", "FAQ", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-500"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {["About", "Careers", "Contact", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-500"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Connect
            </h3>
            <div className="mt-4 flex space-x-6">
              {socialLinks.map(({ icon: Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <span className="sr-only">{Icon.name}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex justify-between items-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Shoppy, Inc. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by AI magic ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
