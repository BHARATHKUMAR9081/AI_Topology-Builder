import React from 'react';

// 1. Official Kubernetes Logo (#326ce5)
export function KubernetesLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 256 249" fill="#326ce5" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M128 0L10.3 67.9V203.7L128 271.6L245.7 203.7V67.9L128 0ZM128 20.3L228.3 78.2V193.4L128 251.3L27.7 193.4V78.2L128 20.3Z" />
      <path d="M128 50C84.9 50 50 84.9 50 128C50 171.1 84.9 206 128 206C171.1 206 206 171.1 206 128C206 84.9 171.1 50 128 50ZM128 66C162.2 66 190 93.8 190 128C190 162.2 162.2 190 128 190C93.8 190 66 162.2 66 128C66 93.8 93.8 66 128 66Z" />
      <path d="M128 88C105.9 88 88 105.9 88 128C88 150.1 105.9 168 128 168C150.1 168 168 150.1 168 128C168 105.9 150.1 88 128 88ZM128 100C143.5 100 156 112.5 156 128C156 143.5 143.5 156 128 156C112.5 156 100 143.5 100 128C100 112.5 112.5 100 128 100Z" />
      <rect x="123" y="15" width="10" height="40" rx="5" />
      <rect x="123" y="201" width="10" height="40" rx="5" />
      <rect x="23" y="113" width="40" height="10" rx="5" />
      <rect x="193" y="113" width="40" height="10" rx="5" />
      <rect x="45" y="55" width="40" height="10" rx="5" transform="rotate(45 45 55)" />
      <rect x="175" y="185" width="40" height="10" rx="5" transform="rotate(45 175 185)" />
      <rect x="185" y="55" width="40" height="10" rx="5" transform="rotate(-45 185 55)" />
    </svg>
  );
}

// 2. Official Docker Logo (#2496ed)
export function DockerLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#2496ed" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.983 11.078h1.884V9.222h-1.884v1.856zm-2.456 0h1.885V9.222h-1.885v1.856zm-2.456 0h1.885V9.222H9.071v1.856zm-2.457 0h1.885V9.222H6.614v1.856zm4.913-2.434h1.885V6.788h-1.885v1.856zm-2.456 0h1.885V6.788H9.071v1.856zm-2.457 0h1.885V6.788H6.614v1.856zm4.913-2.434h1.885V4.354h-1.885v1.856zm3.323 7.302c-.084 0-.482.008-.857.065-.407.063-1.077.262-1.46.702-.303.35-.411.758-.411.758s-.361-.26-.849-.407c-.453-.137-1.087-.197-1.802-.197-2.671 0-4.639 1.488-5.32 2.378-.456.595-.694 1.341-.694 2.115 0 2.222 1.777 4.029 3.966 4.029 3.526 0 7.828-.962 10.354-4.526.471-.664.718-1.472.718-2.296 0-.356-.051-.715-.157-1.053a2.76 2.76 0 00-.518-.946c-.274-.326-.642-.572-1.07-.624z" />
    </svg>
  );
}

// 3. Official PostgreSQL Logo (#336791)
export function PostgresLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#336791" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.5h-2v-2h2v2zm.5-4h-3v-6.5h3V14.5zM15 9h-1V7.5h1V9z" />
      <circle cx="12" cy="8" r="1.5" fill="#336791" />
    </svg>
  );
}

// 4. Official Redis Logo (#dc382d)
export function RedisLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#dc382d" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6l9-4 9 4-9 4-9-4zm0 6l9 4 9-4-9-4-9 4zm0 6l9 4 9-4-9-4-9 4z" />
    </svg>
  );
}

// 5. Official MongoDB Logo (#13aa52)
export function MongoLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#13aa52" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2s-6 5.29-6 11.5C6 17.5 8.69 21 12 22c3.31-1 6-4.5 6-8.5C18 7.29 12 2 12 2zm0 18.5c-2.2 0-4-2.8-4-6.5S11 6 12 4c1 2 4 6.3 4 10s-1.8 6.5-4 6.5z" />
    </svg>
  );
}

// 6. Official Ubuntu Logo (#e95420)
export function UbuntuLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#e95420" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#e95420" strokeWidth="2.5" />
      <circle cx="12" cy="5.5" r="2.2" />
      <circle cx="6.3" cy="15.2" r="2.2" />
      <circle cx="17.7" cy="15.2" r="2.2" />
    </svg>
  );
}

// 7. Virtual Machine Server Host Logo (#38bdf8)
export function VmLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="6" rx="2" fill="#38bdf8" fillOpacity="0.25" />
      <rect x="3" y="14" width="18" height="6" rx="2" fill="#38bdf8" fillOpacity="0.25" />
      <circle cx="7" cy="7" r="1.2" fill="#38bdf8" />
      <circle cx="7" cy="17" r="1.2" fill="#38bdf8" />
      <path d="M14 7h3M14 17h3" strokeLinecap="round" />
    </svg>
  );
}

// 8. Official Nginx Logo (#009639)
export function NginxLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#009639" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm5 13.5l-4-6.5v6.5h-2V9h2l4 6.5V9h2v6.5z" />
    </svg>
  );
}

// 9. Official Apache Kafka Logo (#00b4d8)
export function KafkaLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#00b4d8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 7.5l2.5 3M16 7.5l-2.5 3M8 16.5l2.5-3M16 16.5l-2.5-3" stroke="#00b4d8" strokeWidth="1.5" />
    </svg>
  );
}

// 10. Official Node.js Logo (#5fa04e)
export function NodejsLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#5fa04e" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3.5 6.9v9.8L12 21.6l8.5-4.9V6.9L12 2zm0 3.2l5.5 3.2v6.4L12 18l-5.5-3.2V8.4L12 5.2z" />
    </svg>
  );
}

// 11. Official AWS Cloud Logo (#ff9900)
export function AwsLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#ff9900" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
    </svg>
  );
}

// 12. Python Blue & Gold Logo
export function PythonLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#3776ab" d="M11.87 2c-4.48 0-4.2.19-4.2 2.68v1.75h4.28v.57H5.97C3.5 7 3 8.36 3 11.75c0 3.39.43 4.75 2.97 4.75h1.7v-2.39c0-2.73 2.34-3.11 4.2-3.11h4.28V7.32c0-2.49-.66-5.32-4.28-5.32z" />
      <path fill="#ffd43b" d="M12.13 22c4.48 0 4.2-.19 4.2-2.68v-1.75h-4.28v-.57h5.98C20.5 17 21 15.64 21 12.25c0-3.39-.43-4.75-2.97-4.75h-1.7v2.39c0 2.73-2.34 3.11-4.2 3.11H7.85v3.68c0 2.49.66 5.32 4.28 5.32z" />
    </svg>
  );
}
