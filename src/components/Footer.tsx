import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-8 px-4">
      <div className="container mx-auto flex flex-col items-center space-y-6">
        {/* Social Links */}
        <div className="flex space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook className="text-2xl hover:text-white transition-colors duration-300" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter className="text-2xl hover:text-white transition-colors duration-300" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="text-2xl hover:text-white transition-colors duration-300" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube className="text-2xl hover:text-white transition-colors duration-300" />
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-400">
          <Link href="/about" className="hover:text-white transition-colors duration-300">
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-white transition-colors duration-300"
          >
            Contact Us
          </Link>
          <Link
            href="/privacy"
            className="hover:text-white transition-colors duration-300"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-300">
            Terms of Use
          </Link>
        </div>

        {/* Footer Description */}
        <div className="text-sm text-center max-w-lg leading-relaxed text-gray-500">
          <p>© 2024 Movieliely. All Rights Reserved.</p>
          <p>
            This is a mock application built for learning purposes. All trademarks,
            images, and logos belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
