(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,73375,e=>{"use strict";let t=(0,e.i(75254).default)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);e.s(["ChevronLeft",0,t],73375)},71930,85073,e=>{"use strict";let t=(0,e.i(75254).default)("Bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);e.s(["Bookmark",0,t],71930),e.s(["getCoverDataUrl",0,function(e){let t,r,l,s,a,o=encodeURIComponent((r=(t={preteen:{primary:"#06B6D4",secondary:"#0EA5E9",dark:"#0369A1",accent:"#FBBF24"},teen:{primary:"#A855F7",secondary:"#EC4899",dark:"#7C3AED",accent:"#FBBF24"},adult:{primary:"#EAB308",secondary:"#F97316",dark:"#D97706",accent:"#8B5CF6"}})[e.category]||t.preteen,l=e.title.toLowerCase(),s=e.title.split(" ").slice(0,3).join("\n"),a="📖",l.includes("forest")||l.includes("quest")||l.includes("enchanted")?a="🌲":l.includes("ocean")||l.includes("sea")||l.includes("mystery")?a="🌊":l.includes("sky")||l.includes("star")||l.includes("celestial")?a="⭐":l.includes("dragon")||l.includes("magic")?a="🐉":l.includes("robot")||l.includes("gear")||l.includes("code")?a="⚙️":l.includes("love")||l.includes("heart")||l.includes("romance")?a="💖":l.includes("dance")||l.includes("music")||l.includes("rhythm")?a="🎵":l.includes("shadow")||l.includes("silence")||l.includes("darkness")?a="🌙":l.includes("adventure")||l.includes("journey")||l.includes("travel")?a="🗺️":(l.includes("fire")||l.includes("wild")||l.includes("rebel"))&&(a="🔥"),`
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${r.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${r.secondary};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${r.dark};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${r.primary};stop-opacity:0" />
        </linearGradient>
        <radialGradient id="grad3" cx="50%" cy="30%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
        <pattern id="decorPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="white" opacity="0.15" />
        </pattern>
      </defs>

      <!-- Background gradient -->
      <rect width="300" height="400" fill="url(#grad1)" />

      <!-- Overlay pattern -->
      <rect width="300" height="400" fill="url(#decorPattern)" />

      <!-- Subtle gradient overlay -->
      <rect width="300" height="400" fill="url(#grad2)" />

      <!-- Radial highlight -->
      <ellipse cx="150" cy="100" rx="120" ry="80" fill="url(#grad3)" />

      <!-- Large Theme Icon/Shape -->
      <g opacity="0.25" transform="translate(150, 120)">
        <text x="0" y="0" font-size="120" text-anchor="middle" dominant-baseline="middle">${a}</text>
      </g>

      <!-- Decorative geometric shapes -->
      <circle cx="30" cy="40" r="25" fill="none" stroke="white" stroke-width="1.5" opacity="0.3" />
      <circle cx="270" cy="360" r="20" fill="none" stroke="white" stroke-width="1.5" opacity="0.3" />
      <rect x="50" y="320" width="30" height="30" fill="none" stroke="white" stroke-width="1.5" opacity="0.3" transform="rotate(45 65 335)" />

      <!-- Title container with text -->
      <text x="150" y="200" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${s.split("\n").map((e,t)=>`<tspan x="150" dy="${32*(0!==t)}">${e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}</tspan>`).join("")}
      </text>

      <!-- Accent line -->
      <line x1="50" y1="240" x2="250" y2="240" stroke="white" stroke-width="2" opacity="0.5" />

      <!-- Category badge at bottom -->
      <rect x="80" y="310" width="140" height="50" rx="25" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="2" opacity="0.6" />
      <text x="150" y="340" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">
        ${e.category.charAt(0).toUpperCase()}${e.category.slice(1)}
      </text>

      <!-- Decorative elements -->
      <circle cx="25" cy="25" r="4" fill="white" opacity="0.6" />
      <circle cx="275" cy="25" r="4" fill="white" opacity="0.6" />
      <circle cx="25" cy="375" r="4" fill="white" opacity="0.6" />
      <circle cx="275" cy="375" r="4" fill="white" opacity="0.6" />

      <!-- Bottom edge highlight -->
      <line x1="0" y1="395" x2="300" y2="395" stroke="white" stroke-width="1" opacity="0.3" />
    </svg>
  `));return`data:image/svg+xml,${o}`}],85073)},90932,e=>{"use strict";var t=e.i(43476),r=e.i(71645),l=e.i(22016),s=e.i(73375),a=e.i(10980),o=e.i(71930);let i=(0,e.i(75254).default)("BookmarkCheck",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}]]);function n({content:e,currentPage:r,pages:l}){return(0,t.jsxs)("div",{className:"flex flex-col h-full",children:[(0,t.jsx)("div",{className:"w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden",children:(0,t.jsx)("div",{className:"h-full bg-blue-500 transition-all duration-300 ease-out progress-bar",style:{width:`${(r+1)/l.length*100}%`}})}),(0,t.jsx)("div",{className:"flex-grow space-y-4 min-h-[400px]",children:(e=>{let r=e.split("\n"),l=[],s=[],a=()=>{if(0===s.length)return;let e=s.join("\n");if(e.startsWith("# "))l.push((0,t.jsx)("h2",{className:"text-2xl font-bebas-neue font-bold mt-6 mb-4 text-current font-serif",children:e.replace("# ","")},l.length));else if(e.startsWith("## "))l.push((0,t.jsx)("h3",{className:"text-xl font-bebas-neue font-bold mt-5 mb-3 text-current font-serif",children:e.replace("## ","")},l.length));else if(e.startsWith("### "))l.push((0,t.jsx)("h4",{className:"text-lg font-barlow font-semibold mt-4 mb-2 text-current font-serif",children:e.replace("### ","")},l.length));else if(e.startsWith("> "))l.push((0,t.jsx)("blockquote",{className:"border-l-4 border-gray-400 pl-3 py-2 my-3 italic text-current bg-yellow-50 rounded-r",children:e.split("\n").map((e,r)=>(0,t.jsx)("div",{className:"text-sm",children:e.replace("> ","")},r))},l.length));else if(e.startsWith("- ")||e.startsWith("* ")){let r=e.split("\n").filter(e=>e.trim().startsWith("- ")||e.trim().startsWith("* "));l.push((0,t.jsx)("ul",{className:"list-disc list-inside my-3 space-y-1 text-current",children:r.map((e,r)=>(0,t.jsx)("li",{className:"ml-2 text-sm",children:e.replace(/^[-*]\s/,"")},r))},l.length))}else if(e.trim().length>0){let r=e.replace(/\*\*(.+?)\*\*/g,'<strong class="font-barlow font-bold">$1</strong>').replace(/\*(.+?)\*/g,'<em class="italic">$1</em>').replace(/__(.+?)__/g,'<strong class="font-barlow font-bold">$1</strong>').replace(/_(.+?)_/g,'<em class="italic">$1</em>').replace(/`(.+?)`/g,'<code class="bg-gray-200 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs">$1</code>');l.push((0,t.jsx)("p",{className:"text-current leading-relaxed mb-3 text-sm font-serif",dangerouslySetInnerHTML:{__html:r}},l.length))}s=[]};for(let e=0;e<r.length;e++){let t=r[e];""===t.trim()?a():s.push(t)}return a(),l})(l[r]||"")})]})}var c=e.i(85073);function d({currentBook:e}){let[s,o]=(0,r.useState)([]),[i,n]=(0,r.useState)(!0);(0,r.useEffect)(()=>{(async()=>{try{let e=await fetch("/api/books/list");if(e.ok){let t=await e.json();o(t)}}catch(e){console.error("Error fetching books:",e)}finally{n(!1)}})()},[]);let h=s.filter(t=>t.category===e.category&&t.id!==e.id).slice(0,4);return i||0===h.length?null:(0,t.jsx)("div",{className:"mt-16 pt-12 border-t-4 border-gray-700",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-8",children:[(0,t.jsx)(a.BookOpen,{className:"w-8 h-8 text-blue-400"}),(0,t.jsx)("h2",{className:"text-3xl font-bold text-white",children:"You Might Also Like"})]}),(0,t.jsxs)("p",{className:"text-gray-300 mb-8",children:["Since you enjoyed this ",e.category," book, check out these recommendations:"]}),(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:h.map(e=>(0,t.jsx)(l.default,{href:`/books/${e.id}`,children:(0,t.jsxs)("div",{className:"group cursor-pointer relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300",children:[(0,t.jsx)("img",{src:(0,c.getCoverDataUrl)(e),alt:e.title,className:"w-full h-full object-cover"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300"}),(0,t.jsxs)("div",{className:"absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300",children:[(0,t.jsx)("h3",{className:"text-white font-bold text-sm line-clamp-2",children:e.title}),(0,t.jsx)("p",{className:"text-blue-300 text-xs mt-2 font-semibold",children:"Read Now →"})]})]})},e.id))})]})})}e.s(["default",0,function({bookId:e,initialContent:a=""}){let[h,m]=(0,r.useState)(null),[g,x]=(0,r.useState)(a),[u,f]=(0,r.useState)(!a),[p,b]=(0,r.useState)(null),[y,v]=(0,r.useState)(1),[w,k]=(0,r.useState)([]),j=(0,r.useRef)(null),[N,C]=(0,r.useState)(null),[B,E]=(0,r.useState)(!1),[S,$]=(0,r.useState)(null);(0,r.useEffect)(()=>{e&&(async()=>{try{f(!0);let t=await fetch("/api/books/list");if(!t.ok)throw Error("Failed to fetch books");let r=(await t.json()).find(t=>t.id===parseInt(e));if(!r){b("Book not found"),f(!1);return}m(r),a&&!g&&x(a),b(null)}catch(e){b(e instanceof Error?e.message:"An error occurred")}finally{f(!1)}})()},[e]),(0,r.useEffect)(()=>{if(g&&e){let t=(e=>{if(!e||0===e.trim().length)return["No content available."];let t=e.split(/\n\s*\n/).map(e=>e.trim()).filter(e=>e.length>0),r=[],l=[],s=0;for(let e of t){let t=e.split(/\s+/).length;s+t>500&&l.length>0&&(r.push(l.join("\n\n")),l=[],s=0),l.push(e),s+=t}return l.length>0&&r.push(l.join("\n\n")),r.length>0?r:[e.trim()]})(g);k(t);let r=localStorage.getItem(`bookmark_book_${e}`);if(r){let e=parseInt(r);if(e>0&&e<=t.length){C(e),v(e);return}}v(1)}},[g,e]);let A=(0,r.useCallback)(e=>{B||($(e),v(t=>{let r="next"===e?t+1:t-1;return r<1||r>w.length?t:r}))},[w.length,B]);return((0,r.useEffect)(()=>{if(0===w.length)return;E(!0),j.current?.scrollTo({top:0,behavior:"instant"});let e=setTimeout(()=>{E(!1),$(null)},600);return()=>clearTimeout(e)},[y,w.length]),(0,r.useEffect)(()=>{let e=e=>{("ArrowRight"===e.key||"ArrowLeft"===e.key)&&(e.preventDefault(),A("ArrowRight"===e.key?"next":"prev"))};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[A]),u)?(0,t.jsx)("main",{className:"min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",children:(0,t.jsx)("div",{className:"flex items-center justify-center min-h-screen",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-gray-300",children:"Loading book..."})]})})}):p||!h?(0,t.jsx)("main",{className:"min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4",children:(0,t.jsxs)("div",{className:"max-w-4xl mx-auto",children:[(0,t.jsxs)(l.default,{href:"/books",className:"inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors",children:[(0,t.jsx)(s.ChevronLeft,{className:"w-5 h-5"}),"Back to Books"]}),(0,t.jsx)("div",{className:"bg-red-900/30 border border-red-500 rounded-lg p-6 text-red-300",children:(0,t.jsxs)("p",{children:["⚠️ ",p||"Book not found"]})})]})}):(0,t.jsxs)("main",{className:"min-h-screen text-[var(--text)]",children:[(0,t.jsx)("div",{className:"px-4 py-8",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto",children:[(0,t.jsxs)(l.default,{href:"/books",className:"inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors font-semibold",children:[(0,t.jsx)(s.ChevronLeft,{className:"w-5 h-5"}),"Back to Library"]}),(0,t.jsx)("div",{className:"relative mb-12",style:{perspective:"2000px"},children:(0,t.jsxs)("div",{className:"bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-700 h-[75vh]",style:{transformStyle:"preserve-3d",transform:B?"next"===S?"rotateY(100deg) rotateX(8deg) scale(0.95)":"rotateY(-100deg) rotateX(8deg) scale(0.95)":"rotateY(0deg) rotateX(0deg) scale(1)",transition:"all 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",boxShadow:B?"0 0 80px rgba(59, 130, 246, 1), 0 20px 60px rgba(0, 0, 0, 0.8)":"0 10px 40px rgba(0, 0, 0, 0.3)"},children:[(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-0 h-full",children:[(0,t.jsxs)("div",{className:"relative bg-gradient-to-br from-amber-50 to-yellow-50 p-12 shadow-inner border-r-2 border-gray-400 overflow-hidden",children:[(0,t.jsx)("div",{className:"absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20100%20100%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%224%22/%3E%3C/filter%3E%3Crect%20width=%22100%22%20height=%22100%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')]"}),(0,t.jsx)("div",{className:"absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-200 transform -skew-y-12 rounded-full opacity-30"}),(0,t.jsxs)("div",{className:"relative z-10 w-full h-full flex flex-col",children:[(0,t.jsx)("div",{className:"mb-8 flex justify-center flex-shrink-0",children:(0,t.jsx)("div",{className:"w-32 h-48 rounded-lg overflow-hidden shadow-xl border-2 border-gray-300",children:(0,t.jsx)("img",{src:(0,c.getCoverDataUrl)(h),alt:h.title,className:"w-full h-full object-cover"})})}),(0,t.jsxs)("div",{className:"flex-1 flex flex-col justify-center items-center text-center",children:[(0,t.jsxs)("p",{className:"text-sm font-semibold text-amber-900 mb-4 tracking-widest uppercase",children:[h.category.charAt(0).toUpperCase()+h.category.slice(1)," Edition"]}),(0,t.jsx)("div",{className:"w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-6"}),(0,t.jsx)("p",{className:"text-gray-600 text-sm italic mb-8",children:"A complete story"})]}),(0,t.jsx)("div",{className:"text-center pt-8 border-t border-gray-400 flex-shrink-0",children:(0,t.jsx)("p",{className:"text-xs text-gray-500 font-serif tracking-widest uppercase",children:"Cover"})})]})]}),(0,t.jsxs)("div",{className:"relative bg-gradient-to-br from-amber-50 to-yellow-50 p-12 shadow-inner overflow-hidden flex flex-col",style:{perspective:"1200px"},children:[(0,t.jsx)("div",{className:"absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20100%20100%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%224%22/%3E%3C/filter%3E%3Crect%20width=%22100%22%20height=%22100%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')]"}),(0,t.jsx)("div",{className:"absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-200 transform skew-y-12 rounded-full opacity-30"}),(0,t.jsxs)("div",{className:"relative z-10 w-full h-full flex flex-col text-[color:var(--book-text,#1a202c)]",style:{transformStyle:"preserve-3d"},children:[(0,t.jsxs)("div",{className:"pb-6 border-b-2 border-gray-300 flex-shrink-0 flex justify-between items-start",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900 font-serif leading-tight mb-2",children:h.title}),(0,t.jsx)("div",{className:"h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500"})]}),(0,t.jsx)("button",{onClick:()=>{e&&(N===y?(localStorage.removeItem(`bookmark_book_${e}`),C(null)):(localStorage.setItem(`bookmark_book_${e}`,y.toString()),C(y)))},className:`p-2 rounded-full transition-all duration-300 ${N===y?"bg-blue-100 text-blue-600":"bg-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50"}`,title:N===y?"Remove bookmark":"Bookmark this page",children:N===y?(0,t.jsx)(i,{className:"w-6 h-6"}):(0,t.jsx)(o.Bookmark,{className:"w-6 h-6"})})]}),(0,t.jsx)("div",{ref:j,className:"flex-1 overflow-y-auto pr-4 custom-scrollbar my-2 relative",children:(0,t.jsx)("div",{style:{opacity:+!B,transition:"opacity 0.35s ease-out"},className:"text-current font-serif text-base leading-relaxed space-y-4 pb-8 h-full text-[color:var(--book-text,#1a202c)]",children:w.length>0?(0,t.jsx)(n,{content:g,currentPage:y-1,pages:w}):(0,t.jsx)("p",{className:"text-gray-500 italic",children:"No content available for this book."})})}),(0,t.jsx)("div",{className:"text-center pt-4 border-t border-gray-400 flex-shrink-0",children:(0,t.jsxs)("p",{className:"text-xs text-gray-500 font-serif uppercase tracking-widest",children:["Page ",y," of ",w.length]})})]})]})]}),(0,t.jsx)("div",{className:"h-2 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 shadow-lg"})]})}),(0,t.jsxs)("div",{className:"flex justify-center gap-4 mt-8",children:[(0,t.jsxs)("button",{onClick:()=>A("prev"),className:"px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg",disabled:1===y||B,children:[(0,t.jsx)("span",{children:"📖"}),"← FLIP BACK"]}),(0,t.jsx)(l.default,{href:"/books",className:"px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl",children:"Back to Library"}),(0,t.jsxs)("button",{onClick:()=>A("next"),className:"px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg",disabled:y===w.length||B,children:["FLIP NEXT",(0,t.jsx)("span",{children:"📖"})]})]}),(0,t.jsx)(d,{currentBook:h})]})}),(0,t.jsx)("style",{children:`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }

        @keyframes bookFlip {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          50% {
            transform: rotateY(90deg) rotateX(5deg) scale(1.05);
          }
          100% {
            transform: rotateY(0deg) rotateX(0deg);
          }
        }

        @keyframes pageFlipForward {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          45% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          55% {
            transform: rotateY(-90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes pageFlipBackward {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          45% {
            transform: rotateY(-90deg);
            opacity: 0;
          }
          55% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }
      `})]})}],90932)}]);