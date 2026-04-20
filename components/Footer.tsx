'use client';

import Link from 'next/link';
import { Mail, Globe, Shield } from 'lucide-react';
import styles from './Footer.module.css';

const footerLinks = {
  Protocol: [
    { name: 'Index', href: '/' },
    { name: 'Fleet_Directory', href: '/cars' },
    { name: 'System_Status', href: '#' },
    { name: 'Security_Log', href: '#' },
  ],
  Resources: [
    { name: 'FAQ', href: '#' },
    { name: 'Support_Ticket', href: '#' },
    { name: 'Terms_of_Service', href: '#' },
    { name: 'Privacy_Vault', href: '#' },
  ],
  Connect: [
    { name: 'HQ_Node', href: '#' },
    { name: 'Comm_Link', href: '#' },
    { name: 'Social_Feed', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandInfo}>
            <Link href="/" className={styles.logo}>
              LUXE<span className={styles.logoAccent}>DRIVE</span>
            </Link>
            <p className={styles.tagline}>
              High-performance vehicle acquisition protocol. Cryptographically secured transactions. Global deployment capability.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className={styles.columnTitle}>[ {title.toUpperCase()} ]</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className={styles.link}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className={styles.columnTitle}>[ CONNECT_HQ ]</h4>
            <ul className={styles.linkList}>
              <li className="flex gap-3 mb-4">
                 <Globe className="w-4 h-4 text-accent" />
                 <span className="mono-text text-[10px] text-muted">BEVERLY_HILLS_NODE_01</span>
              </li>
              <li className="flex gap-3 mb-4">
                 <Shield className="w-4 h-4 text-accent" />
                 <span className="mono-text text-[10px] text-muted">SSL_SECURED_ENDPOINT</span>
              </li>
              <li className="flex gap-3">
                 <Mail className="w-4 h-4 text-accent" />
                 <span className="mono-text text-[10px] text-muted">UPLINK@LUXEDRIVE.COM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className="mono-text text-[9px] text-muted">© 2024 LUXE DRIVE // ALL_RIGHTS_RESERVED</p>
          <div className="flex gap-8">
            <p className="mono-text text-[9px] text-muted">STABILITY: NOMINAL</p>
            <p className="mono-text text-[9px] text-muted">LATENCY: 14MS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
