/* assets/app.js */

const App = {
    voiceEnabled: false,
    baseSpeed: 1000,
    voices: [],
    
    // --- 1. CENTRALIZED LAYOUT INJECTION ---
    // Call this function at the bottom of every lesson file
    // title: The name of the specific lesson (e.g., "SUM vs SUMX")
    // rootPath: Path to get back to root (usually "../../" for lessons, "./" for index)
    initLayout: function(title, rootPath = "../../") {
      
      // A. INJECT HEADER
      const headerHTML = `
        <div class="brand-area">
          <span class="brand-icon">∑</span> 
          <span class="brand-text">${title}</span>
        </div>
        <nav class="nav-group">
          <a href="${rootPath}DAX/index.html" class="nav-link nav-dax">
            <span>📊</span> DAX Menu
          </a>
          <a href="${rootPath}index.html" class="nav-link nav-main">
            <span>🏠</span> Main Home
          </a>
        </nav>
      `;
      const headerEl = document.querySelector('header');
      if(headerEl) headerEl.innerHTML = headerHTML;
  
      // B. INJECT FOOTER
      const footerHTML = `
        <div class="footer-links">
          <strong>Visual Data Guide</strong> by 
          <a href="https://www.linkedin.com/company/109928041" target="_blank">Creator 12 Academy</a>
          <span class="divider">|</span> 
          Created by <a href="https://www.linkedin.com/in/iamnkannan/" target="_blank">Kannan N</a>
        </div>
      `;
      const footerEl = document.querySelector('footer');
      if(footerEl) footerEl.innerHTML = footerHTML;
  
      // C. INJECT CONTROLS (Voice/Speed)
      // Only injects if the page has a container with id="controls-mount"
      const controlsContainer = document.getElementById('controls-mount');
      if(controlsContainer) {
        controlsContainer.innerHTML = `
          <div class="setting-group">
            <span class="setting-label">Voice</span>
            <div class="toggle-group" id="voiceToggle">
              <div class="toggle-opt selected" onclick="App.toggleVoice(false)" id="voiceOff">🔇 Off</div>
              <div class="toggle-opt" onclick="App.toggleVoice(true)" id="voiceOn">🔊 On</div>
            </div>
          </div>
  
          <div class="setting-group">
            <span class="setting-label">Speed</span>
            <div class="toggle-group" id="speedGroup">
              <div class="speed-opt toggle-opt" onclick="App.setSpeed('slow')" id="btnSlow">Slow</div>
              <div class="speed-opt toggle-opt" onclick="App.setSpeed('medium')" id="btnMed">Med</div>
              <div class="speed-opt toggle-opt selected" onclick="App.setSpeed('fast')" id="btnFast">Fast</div>
            </div>
          </div>
        `;
      }
  
      // D. INIT VOICE SYSTEM
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
      }
    },
  
    // --- 2. VOICE & ANIMATION LOGIC ---
  
    loadVoices: function() {
      App.voices = window.speechSynthesis.getVoices();
    },
  
    toggleVoice: function(status) {
      if(status && App.voices.length === 0) {
        App.loadVoices(); // Try loading again
        if(App.voices.length === 0) {
          App.showToast("Error: No voices found in this browser.");
          return;
        }
      }
  
      App.voiceEnabled = status;
      
      // Update UI Classes
      const onBtn = document.getElementById('voiceOn');
      const offBtn = document.getElementById('voiceOff');
      const speedGroup = document.getElementById('speedGroup');
  
      if(onBtn && offBtn) {
        onBtn.classList.toggle('selected', status);
        offBtn.classList.toggle('selected', !status);
      }
      
      // Disable Speed controls if Voice is ON (Voice dictates speed)
      if(speedGroup) {
        if(status) speedGroup.classList.add('disabled-area');
        else speedGroup.classList.remove('disabled-area');
      }
  
      if (!status) window.speechSynthesis.cancel();
    },
  
    setSpeed: function(level) {
      // UI Updates
      document.querySelectorAll('.speed-opt').forEach(b => b.classList.remove('selected'));
      
      if(level === 'slow') { 
        App.baseSpeed = 2500; 
        const btn = document.getElementById('btnSlow'); 
        if(btn) btn.classList.add('selected');
      } else if (level === 'medium') { 
        App.baseSpeed = 1500; 
        const btn = document.getElementById('btnMed');
        if(btn) btn.classList.add('selected');
      } else { 
        App.baseSpeed = 800; // Fast
        const btn = document.getElementById('btnFast');
        if(btn) btn.classList.add('selected');
      }
    },
  
    // The Main "Speak and Wait" Function
    speak: function(text, calcBoxId = 'calcBox', isError = false) {
      // 1. Update the visual text box
      const calcBox = document.getElementById(calcBoxId);
      if(calcBox) {
        calcBox.textContent = text;
        calcBox.style.color = isError ? "#ef4444" : "var(--text-dim)";
        calcBox.style.borderColor = isError ? "#ef4444" : "var(--border)";
        if(!isError) calcBox.style.color = "var(--text-dim)";
      }
  
      return new Promise(resolve => {
        const bar = document.getElementById('progressFill');
        
        // SCENARIO A: Voice OFF (Use Timer)
        if (!App.voiceEnabled) {
          if(bar) {
            bar.style.transition = 'none'; 
            bar.style.width = '0%'; 
            void bar.offsetWidth; // Force Reflow
            bar.style.transition = `width ${App.baseSpeed}ms linear`; 
            bar.style.width = '100%';
          }
          
          setTimeout(() => {
            if(bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
            resolve();
          }, App.baseSpeed);
          return;
        }
  
        // SCENARIO B: Voice ON (Wait for Audio)
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        
        // Attempt to find a high-quality female voice
        const preferred = App.voices.find(v => 
          v.name.includes("Zira") || 
          v.name.includes("Google US English") || 
          v.name.includes("Samantha") || 
          v.name.toLowerCase().includes("female")
        );
        
        // Fallback to any English voice
        const fallback = App.voices.find(v => v.lang.startsWith('en'));
  
        if (preferred) utterance.voice = preferred;
        else if (fallback) utterance.voice = fallback;
        
        // Events to resolve the promise
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve(); // Safety net
  
        window.speechSynthesis.speak(utterance);
      });
    },
  
    // Helper: Show Error Toast
    showToast: function(msg) {
      let t = document.getElementById('toast');
      if(!t) {
        t = document.createElement('div');
        t.id = 'toast';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.className = 'show';
      setTimeout(() => t.className = t.className.replace("show", ""), 4000);
    },
  
    // Helper: Just update text without speaking (for small updates)
    updateText: function(html, id='calcBox') {
      const box = document.getElementById(id);
      if(box) box.innerHTML = html;
    }
  };